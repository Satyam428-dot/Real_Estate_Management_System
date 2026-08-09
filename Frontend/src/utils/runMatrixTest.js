import { sendChatMessageToGroq } from "./groqChatService.js";

// Mock localStorage for Node test runner environment
if (typeof localStorage === "undefined" || !localStorage) {
  global.localStorage = {
    getItem: (key) => {
      if (key === "token") return "mock_jwt_token_for_testing";
      if (key === "loggedInUser") return JSON.stringify({
        userId: 1,
        firstName: "Atharva",
        lastName: "Dadhe",
        email: "atharva.dadhe@example.com",
        userRole: "OWNER"
      });
      return null;
    },
    setItem: () => {},
    removeItem: () => {}
  };
}

// Mock import.meta for Node environment if missing
if (typeof import.meta === "undefined") {
  global.import = { meta: { env: {} } };
}

const TEST_MATRIX = [
  {
    id: "TC-01",
    name: "Owner Properties Query",
    input: "Show my listed properties",
    expectedKeywords: ["properties", "Atharva", "AVAILABLE", "listings"],
    rejectKeywords: ["Hallucinated", "World Cup"]
  },
  {
    id: "TC-02",
    name: "System Property Search",
    input: "Find 2BHK properties in Mumbai",
    expectedKeywords: ["Search Results", "Mumbai", "₹", "properties", "No matching property records"],
    rejectKeywords: ["Weather"]
  },
  {
    id: "TC-03",
    name: "Profile Inquiry",
    input: "What is my profile name and email?",
    expectedKeywords: ["Atharva", "atharva.dadhe@example.com", "OWNER"],
    rejectKeywords: ["Unknown"]
  },
  {
    id: "TC-04",
    name: "Property Draft Creation",
    input: "Draft a new 3BHK rental flat in Pune for 35000",
    expectedKeywords: ["Property Draft Prepared", "3BHK", "Pune", "₹35,000"],
    rejectKeywords: ["Created directly in database"]
  },
  {
    id: "TC-05",
    name: "Out-of-Scope Query Filtering",
    input: "What is the weather forecast today?",
    expectedKeywords: ["strictly designed", "Real Estate Management System"],
    rejectKeywords: ["Sunny", "Rainy", "Forecast"]
  },
  {
    id: "TC-06",
    name: "Non-Existent City Grounding",
    input: "Search properties in AtlantisCity99",
    expectedKeywords: ["No matching property records", "Unable to search properties", "database"],
    rejectKeywords: ["Villa in Atlantis"]
  }
];

async function runMatrixEvaluation() {
  console.log("=================================================");
  console.log("🤖 RUNNING GROQ CHATBOT MATRIX TEST EVALUATION");
  console.log("=================================================\n");

  let passedCount = 0;

  for (const testCase of TEST_MATRIX) {
    console.log(`[Running ${testCase.id}] ${testCase.name}`);
    console.log(`Input Query: "${testCase.input}"`);

    try {
      const result = await sendChatMessageToGroq([{ role: "user", content: testCase.input }]);
      const responseText = result.content || "";

      // Check expected keywords
      const passExpected = testCase.expectedKeywords.some(kw => 
        responseText.toLowerCase().includes(kw.toLowerCase())
      );

      // Check rejected keywords (must NOT be present)
      const failRejected = testCase.rejectKeywords.some(kw => 
        responseText.toLowerCase().includes(kw.toLowerCase())
      );

      const passed = passExpected && !failRejected;

      if (passed) {
        passedCount++;
        console.log(`STATUS: ✅ PASSED`);
      } else {
        console.log(`STATUS: ❌ FAILED`);
      }

      console.log(`Response Snippet:\n"${responseText.substring(0, 150)}..."\n`);
    } catch (err) {
      console.log(`STATUS: ❌ ERROR: ${err.message}\n`);
    }
  }

  const successRate = ((passedCount / TEST_MATRIX.length) * 100).toFixed(1);
  console.log("=================================================");
  console.log(`EVALUATION COMPLETE: ${passedCount}/${TEST_MATRIX.length} PASSED (${successRate}%)`);
  console.log("=================================================");

  return { passedCount, total: TEST_MATRIX.length, successRate };
}

runMatrixEvaluation();
