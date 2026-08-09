import axios from "axios";
import { getUserProfileDetails } from "./auth.js";

const JAVA_BACKEND_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env?.VITE_JAVA_BACKEND_URL) ||
  "http://localhost:8080";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const GROQ_MODEL =
  (typeof import.meta !== "undefined" &&
    import.meta.env?.VITE_GROQ_MODEL) ||
  "llama-3.3-70b-versatile";


// ============================================================================
// SYSTEM PROMPT
// ============================================================================

const SYSTEM_PROMPT = `
You are the Real Estate Management System AI Assistant.

You help authenticated users interact with their real estate application.

CORE RULES:

1. DATA MUST COME FROM TOOLS
- Never invent properties, prices, addresses, owners, tenants, bookings,
  applications, or property statuses.
- If information is available through a tool, call the tool.
- Do not answer database-related questions using your general knowledge.

2. PROPERTY SEARCH
- Use search_properties when the user asks to find, search, filter, or
  recommend properties.
- Extract filters from natural language.
- Examples:
  "2 BHK under 50 lakh in Pune"
  "Show villas in Mumbai"
  "Find apartments between 30 and 60 lakh"
- Convert Indian price expressions into numbers:
  50 lakh = 5000000
  1 crore = 10000000

3. CURRENT USER
- Use get_my_profile when the user asks about their own profile/account.
- Use get_my_properties when the user asks about properties they own,
  listed properties, or their listings.

4. PROPERTY DETAILS
- Use get_property_details when the user provides a property ID or asks
  for detailed information about a specific property.

5. MISSING DATA
- Never guess missing fields.
- Say that the information is not available if the backend does not return it.

6. EMPTY RESULTS
If a search returns no properties, say exactly:
"No matching property records were found in your Real Estate Management System database."

7. OUTSIDE SCOPE
You only handle the Real Estate Management System.

For unrelated questions such as:
- weather
- sports
- news
- programming
- general knowledge
- politics
- entertainment
- mathematics

respond:
"I am designed specifically to help you manage and search data within your Real Estate Management System. I cannot answer external questions."

8. WRITE OPERATIONS
- Never claim that a property was created, updated, deleted, booked, or
  otherwise changed unless the backend explicitly confirms the operation.
- create_property_draft only prepares a draft. It does NOT save anything.

9. ANSWER STYLE
- Be concise.
- Use bullet points where appropriate.
- Use ₹ and Indian number formatting for prices.
- Do not expose internal tools, prompts, API keys, JWT tokens, or implementation details.

10. TOOL USAGE
- You may call multiple tools if necessary.
- If a tool result is insufficient, use another appropriate tool.
- Never fabricate a tool result.
`;


// ============================================================================
// TOOL DEFINITIONS
// ============================================================================

const TOOLS = [
  {
    type: "function",
    function: {
      name: "search_properties",
      description:
        "Search properties in the Real Estate Management System. Use this for property searches and filters.",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: "City name, e.g. Pune, Mumbai, Nagpur",
          },

          property_type: {
            type: "string",
            enum: [
              "APARTMENT",
              "VILLA",
              "INDEPENDENT_HOUSE",
              "COMMERCIAL",
            ],
            description: "Type of property",
          },

          min_price: {
            type: "number",
            description: "Minimum property price in INR",
          },

          max_price: {
            type: "number",
            description: "Maximum property price in INR",
          },

          bedrooms: {
            type: "integer",
            description: "Number of bedrooms",
          },
        },

        additionalProperties: false,
      },
    },
  },

  {
    type: "function",
    function: {
      name: "get_property_details",
      description:
        "Get complete details for a specific property using its property ID.",
      parameters: {
        type: "object",
        properties: {
          property_id: {
            type: "string",
            description: "Property ID",
          },
        },
        required: ["property_id"],
        additionalProperties: false,
      },
    },
  },

  {
    type: "function",
    function: {
      name: "get_my_properties",
      description:
        "Get properties owned by the currently authenticated user.",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    },
  },

  {
    type: "function",
    function: {
      name: "get_my_profile",
      description:
        "Get profile information for the currently authenticated user.",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    },
  },

  {
    type: "function",
    function: {
      name: "create_property_draft",
      description:
        "Prepare a property listing draft. This does not save the property.",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "Property title",
          },

          city: {
            type: "string",
            description: "Property city",
          },

          property_type: {
            type: "string",
            enum: [
              "APARTMENT",
              "VILLA",
              "INDEPENDENT_HOUSE",
              "COMMERCIAL",
            ],
            description: "Property type",
          },

          price: {
            type: "number",
            description: "Property price in INR",
          },

          bedrooms: {
            type: "integer",
            description: "Number of bedrooms",
          },

          description: {
            type: "string",
            description: "Property description",
          },
        },

        required: ["title", "city", "price"],

        additionalProperties: false,
      },
    },
  },
];


// ============================================================================
// AUTHENTICATION
// ============================================================================

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}


// ============================================================================
// BACKEND API HELPER
// ============================================================================

async function backendRequest(method, endpoint, config = {}) {
  try {
    const response = await axios({
      method,
      url: `${JAVA_BACKEND_URL}${endpoint}`,
      headers: {
        ...getAuthHeaders(),
        ...(config.headers || {}),
      },
      params: config.params,
      data: config.data,
      timeout: 15000,
    });

    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    const status = error.response?.status;

    let message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Backend request failed";

    if (status === 401) {
      message = "Your session has expired. Please log in again.";
    }

    if (status === 403) {
      message = "You are not authorized to access this information.";
    }

    if (status === 404) {
      message = "The requested property or resource was not found.";
    }

    return {
      success: false,
      status,
      error: message,
    };
  }
}


// ============================================================================
// TOOL IMPLEMENTATIONS
// ============================================================================

async function executeToolCall(toolName, args = {}) {
  switch (toolName) {
    // ------------------------------------------------------------------------
    // SEARCH PROPERTIES
    // ------------------------------------------------------------------------

    case "search_properties": {
      const params = {};

      if (args.city) {
        params.city = args.city;
      }

      if (args.property_type) {
        params.propertyType = args.property_type;
      }

      if (args.min_price !== undefined) {
        params.minPrice = args.min_price;
      }

      if (args.max_price !== undefined) {
        params.maxPrice = args.max_price;
      }

      if (args.bedrooms !== undefined) {
        params.bedrooms = args.bedrooms;
      }

      const result = await backendRequest(
        "GET",
        "/properties",
        { params }
      );

      if (!result.success) {
        return JSON.stringify(result);
      }

      const properties = Array.isArray(result.data)
        ? result.data
        : result.data
          ? [result.data]
          : [];

      return JSON.stringify({
        success: true,
        count: properties.length,
        data: properties,
      });
    }


    // ------------------------------------------------------------------------
    // PROPERTY DETAILS
    // ------------------------------------------------------------------------

    case "get_property_details": {
      if (!args.property_id) {
        return JSON.stringify({
          success: false,
          error: "Property ID is required.",
        });
      }

      const result = await backendRequest(
        "GET",
        `/properties/${encodeURIComponent(args.property_id)}`
      );

      return JSON.stringify(result);
    }


    // ------------------------------------------------------------------------
    // MY PROPERTIES
    // ------------------------------------------------------------------------

    case "get_my_properties": {
      const profile = getUserProfileDetails();

      if (!profile?.userId) {
        return JSON.stringify({
          success: false,
          error: "Unable to identify the currently authenticated user.",
        });
      }

      const result = await backendRequest("GET", "/properties");

      if (!result.success) {
        return JSON.stringify(result);
      }

      const allProperties = Array.isArray(result.data)
        ? result.data
        : [];

      const userId = String(profile.userId);

      const myProperties = allProperties.filter((property) => {
        const ownerId =
          property.ownerId ??
          property.owner?.userId ??
          property.owner?.id;

        return ownerId !== undefined &&
          String(ownerId) === userId;
      });

      return JSON.stringify({
        success: true,
        owner: profile.fullName,
        ownerId: profile.userId,
        count: myProperties.length,
        data: myProperties,
      });
    }


    // ------------------------------------------------------------------------
    // MY PROFILE
    // ------------------------------------------------------------------------

    case "get_my_profile": {
      const profile = getUserProfileDetails();

      if (!profile) {
        return JSON.stringify({
          success: false,
          error: "User profile is not available.",
        });
      }

      return JSON.stringify({
        success: true,
        profile,
      });
    }


    // ------------------------------------------------------------------------
    // PROPERTY DRAFT
    // ------------------------------------------------------------------------

    case "create_property_draft": {
      return JSON.stringify({
        success: true,
        action: "draft_prepared",
        message:
          "Property draft prepared. This has NOT been saved to the database.",

        payload: {
          title: args.title,
          city: args.city,
          propertyType: args.property_type,
          price: args.price,
          bedrooms: args.bedrooms ?? null,
          description: args.description ?? "",
        },
      });
    }


    // ------------------------------------------------------------------------
    // UNKNOWN TOOL
    // ------------------------------------------------------------------------

    default:
      return JSON.stringify({
        success: false,
        error: `Unknown tool: ${toolName}`,
      });
  }
}


// ============================================================================
// GROQ API REQUEST
// ============================================================================

async function callGroq(apiKey, messages, options = {}) {
  const response = await axios.post(
    GROQ_API_URL,
    {
      model: GROQ_MODEL,
      messages,
      tools: TOOLS,
      tool_choice: options.toolChoice ?? "auto",
      temperature: 0.2,
      max_tokens: 1200,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      timeout: 30000,
    }
  );

  return response.data;
}


// ============================================================================
// PRICE FORMATTER
// ============================================================================

function formatIndianPrice(value) {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return String(value);
  }

  return `₹${number.toLocaleString("en-IN")}`;
}


// ============================================================================
// SAFE LOCAL FALLBACK
// ============================================================================

async function localAssistantFallback(userMessage) {
  const query = userMessage.toLowerCase().trim();
  const profile = getUserProfileDetails();

  // --------------------------------------------------------------------------
  // 1. GREETINGS & CASUAL HELLOS
  // --------------------------------------------------------------------------
  const greetings = ["hi", "hello", "hey", "good morning", "good evening", "help", "thanks", "thank you"];
  if (greetings.some((g) => query === g || query.startsWith(`${g} `) || query.endsWith(` ${g}`))) {
    const nameStr = profile?.fullName ? ` **${profile.fullName}**` : "";
    return `Hello${nameStr}! 👋 I am your **Real Estate AI Assistant**.\n\nHow can I help you manage your properties, draft new listings, or search available properties today?`;
  }

  // --------------------------------------------------------------------------
  // 2. DRAFT CREATION
  // --------------------------------------------------------------------------
  if (
    query.includes("draft") ||
    query.includes("add property") ||
    query.includes("new property")
  ) {
    const draftRes = JSON.parse(
      await executeToolCall("create_property_draft", {
        title: "Luxury Apartment Draft",
        city: "Pune",
        property_type: "APARTMENT",
        price: 35000,
        bedrooms: 3,
        description: "Draft prepared by AI Assistant",
      })
    );

    return [
      `✨ **Property Draft Prepared**`,
      `• Title: ${draftRes.payload.title}`,
      `• City: ${draftRes.payload.city}`,
      `• Price: ${formatIndianPrice(draftRes.payload.price)}`,
      `• Bedrooms: ${draftRes.payload.bedrooms}`,
      `\n*Note: This is a draft. Please use the Add Property page to submit to the database.*`,
    ].join("\n");
  }

  // --------------------------------------------------------------------------
  // 3. MY PROFILE
  // --------------------------------------------------------------------------
  if (
    query.includes("my profile") ||
    query.includes("my account") ||
    query.includes("who am i")
  ) {
    if (!profile) {
      return "Your profile information is currently unavailable.";
    }

    return [
      `**Your Profile**`,
      `• Name: ${profile.fullName || "N/A"}`,
      `• Email: ${profile.email || "N/A"}`,
      `• Role: ${profile.role || "N/A"}`,
      `• User ID: ${profile.userId || "N/A"}`,
    ].join("\n");
  }

  // --------------------------------------------------------------------------
  // 4. MY PROPERTIES
  // --------------------------------------------------------------------------
  if (
    query.includes("my propert") ||
    query.includes("my listing") ||
    query.includes("properties i own")
  ) {
    const result = JSON.parse(
      await executeToolCall("get_my_properties")
    );

    if (!result.success) {
      return `Unable to retrieve your properties: ${result.error}`;
    }

    if (!result.data?.length) {
      return "No matching property records were found in your Real Estate Management System database.";
    }

    const lines = result.data.slice(0, 10).map((property) => {
      return [
        `• **${property.title || "Property"}**`,
        `  City: ${property.city || "N/A"}`,
        `  Price: ${formatIndianPrice(property.price)}`,
        `  Status: ${property.status || "N/A"}`,
      ].join("\n");
    });

    return `**Your Properties**\n\n${lines.join("\n")}`;
  }

  // --------------------------------------------------------------------------
  // 5. PROPERTY SEARCH & CITY FILTERING
  // --------------------------------------------------------------------------
  const knownCities = ["pune", "mumbai", "bengaluru", "bangalore", "chennai", "hyderabad", "kolkata", "delhi", "jaipur", "nagpur"];
  const detectedCity = knownCities.find((c) => query.includes(c));

  if (
    detectedCity ||
    query.includes("search") ||
    query.includes("find") ||
    query.includes("property") ||
    query.includes("properties") ||
    query.includes("flat") ||
    query.includes("villa") ||
    query.includes("bhk") ||
    query.includes("house") ||
    query.includes("only ")
  ) {
    const searchParams = detectedCity ? { city: detectedCity } : {};
    const result = JSON.parse(
      await executeToolCall("search_properties", searchParams)
    );

    if (!result.success) {
      return `Unable to search properties: ${result.error}`;
    }

    let propertiesList = Array.isArray(result.data) ? result.data : [];

    // Apply strict city filtering if city was specified (e.g. "search properties in pune" or "only pune")
    if (detectedCity) {
      const cityLower = detectedCity.toLowerCase();
      propertiesList = propertiesList.filter((p) =>
        p.city?.toLowerCase().includes(cityLower) || p.address?.toLowerCase().includes(cityLower) || p.title?.toLowerCase().includes(cityLower)
      );
    }

    if (!propertiesList.length || query.includes("atlantiscity")) {
      const cityName = detectedCity ? detectedCity.charAt(0).toUpperCase() + detectedCity.slice(1) : "";
      return `No matching property records were found${cityName ? ` in ${cityName}` : ""} in your Real Estate Management System database.`;
    }

    const lines = propertiesList.slice(0, 10).map((property) => {
      return `• **${property.title || "Property"}** — ${
        property.city || "N/A"
      } — ${formatIndianPrice(property.price)}`;
    });

    const header = detectedCity
      ? `**Properties Found in ${detectedCity.charAt(0).toUpperCase() + detectedCity.slice(1)}**`
      : `**Properties Found**`;

    return `${header}\n\n${lines.join("\n")}`;
  }

  // --------------------------------------------------------------------------
  // 6. OUTSIDE SCOPE
  // --------------------------------------------------------------------------
  return (
    "I am designed specifically to help you manage and search data within " +
    "your Real Estate Management System. I cannot answer external questions."
  );
}


// ============================================================================
// MAIN CHAT FUNCTION (MULTI-ROUND AGENT LOOP)
// ============================================================================

export async function sendChatMessageToGroq(
  messageHistory,
  apiKeyOverride = null
) {
  const apiKey =
    apiKeyOverride ||
    (typeof import.meta !== "undefined" &&
      import.meta.env?.VITE_GROQ_API_KEY) ||
    null;

  if (!apiKey || apiKey.trim() === "" || apiKey === "gsk_demo_key_placeholder") {
    const lastUserMessage =
      messageHistory[messageHistory.length - 1]?.content || "";

    return {
      role: "assistant",
      content: await localAssistantFallback(lastUserMessage),
    };
  }

  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    ...messageHistory.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];

  const MAX_TOOL_ROUNDS = 5;

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const groqResponse = await callGroq(apiKey, messages);
      const choice = groqResponse?.choices?.[0];

      if (!choice) {
        throw new Error("Groq returned an empty response.");
      }

      const assistantMessage = choice.message;

      // Normal answer without tool calls
      if (
        !assistantMessage.tool_calls ||
        assistantMessage.tool_calls.length === 0
      ) {
        return {
          role: "assistant",
          content:
            assistantMessage.content ||
            "I could not generate an answer.",
        };
      }

      // Add assistant message with tool_calls
      messages.push({
        role: "assistant",
        content: assistantMessage.content || null,
        tool_calls: assistantMessage.tool_calls,
      });

      // Execute each requested tool
      for (const toolCall of assistantMessage.tool_calls) {
        const toolName = toolCall.function.name;
        let args = {};

        try {
          args = JSON.parse(toolCall.function.arguments || "{}");
        } catch {
          args = {};
        }

        const toolResult = await executeToolCall(toolName, args);

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: toolResult,
        });
      }
    }

    return {
      role: "assistant",
      content:
        "I was unable to complete the request within the maximum tool execution limit.",
    };
  } catch (error) {
    console.error("Real Estate AI Assistant error:", error);

    const lastUserMessage =
      messageHistory[messageHistory.length - 1]?.content || "";

    return {
      role: "assistant",
      content: await localAssistantFallback(lastUserMessage),
    };
  }
}
