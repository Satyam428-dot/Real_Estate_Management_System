import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  X,
  RotateCcw,
  Sparkles,
  Bot,
  User as UserIcon,
  Building,
  CheckCircle,
  PlusCircle,
  HelpCircle,
} from "lucide-react";
import { sendChatMessageToGroq } from "../../utils/groqChatService";
import { getUserProfileDetails } from "../../utils/auth";
import "../css/Chatbot.css";

export default function Chatbot({ mode = "floating", title = "Real Estate AI Assistant" }) {
  const [isOpen, setIsOpen] = useState(mode === "embedded");
  const [userProfile, setUserProfile] = useState({ fullName: "Property Owner" });

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello! 👋 I am your **Real Estate AI Assistant** powered by Groq.\n\nHow can I help you manage your properties, draft new listings, or inspect your account today?`,
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const details = getUserProfileDetails();
    if (details && details.fullName) {
      setUserProfile(details);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (textToSend = null) => {
    const queryText = (textToSend || inputMessage).trim();
    if (!queryText || isLoading) return;

    const newMessages = [...messages, { role: "user", content: queryText }];
    setMessages(newMessages);
    if (!textToSend) setInputMessage("");
    setIsLoading(true);

    try {
      // Pass message history excluding welcome greeting for cleaner prompt evaluation
      const historyForApi = newMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const botReply = await sendChatMessageToGroq(historyForApi);
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an issue connecting to the AI system. Please check your backend and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: `Chat history cleared. How else can I assist you, **${userProfile.fullName}**?`,
      },
    ]);
  };

  const quickActionChips = [
    { label: "My Properties", text: "Show my properties" },
    { label: "Draft Listing", text: "Draft a new 3BHK rental apartment in Mumbai for 45000" },
    { label: "My Profile", text: "Get my profile details" },
    { label: "Search Rentals", text: "Search properties in Pune" },
  ];

  const renderChatBody = () => (
    <>
      {/* Header */}
      <div className="chatbot-header">
        <div className="chatbot-header-info">
          <div className="chatbot-avatar">
            <Sparkles size={20} className="text-amber-300" />
          </div>
          <div>
            <h4 className="chatbot-header-title">{title}</h4>
            <div className="chatbot-header-status">
              <span className="chatbot-status-pulse"></span>
              Groq LLM • Online
            </div>
          </div>
        </div>
        <div className="chatbot-header-actions">
          <button
            title="Clear Chat"
            className="chatbot-header-btn"
            onClick={handleClearChat}
          >
            <RotateCcw size={16} />
          </button>
          {mode === "floating" && (
            <button
              title="Close Chat"
              className="chatbot-header-btn"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="chatbot-messages-body">
        {messages.map((msg, index) => (
          <div key={index} className={`chatbot-message-row ${msg.role}`}>
            <div className="chatbot-msg-avatar">
              {msg.role === "assistant" ? <Bot size={16} /> : <UserIcon size={16} />}
            </div>
            <div className="chatbot-bubble">
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chatbot-message-row assistant">
            <div className="chatbot-msg-avatar">
              <Bot size={16} />
            </div>
            <div className="chatbot-typing-bubble">
              <span className="chatbot-dot"></span>
              <span className="chatbot-dot"></span>
              <span className="chatbot-dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Suggestion Chips */}
      <div className="chatbot-chips-container">
        {quickActionChips.map((chip, idx) => (
          <button
            key={idx}
            className="chatbot-chip-btn"
            onClick={() => handleSendMessage(chip.text)}
            disabled={isLoading}
          >
            <PlusCircle size={12} />
            {chip.label}
          </button>
        ))}
      </div>

      {/* Footer Input Bar */}
      <div className="chatbot-footer">
        <input
          type="text"
          className="chatbot-input"
          placeholder="Ask AI Assistant (e.g. show my properties)..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={isLoading}
        />
        <button
          className="chatbot-send-btn"
          onClick={() => handleSendMessage()}
          disabled={isLoading || !inputMessage.trim()}
        >
          <Send size={18} />
        </button>
      </div>
    </>
  );

  if (mode === "embedded") {
    return <div className="chatbot-embedded-container">{renderChatBody()}</div>;
  }

  return (
    <div className="chatbot-floating-wrapper">
      {!isOpen && (
        <button className="chatbot-trigger-btn" onClick={() => setIsOpen(true)}>
          <Bot size={28} />
          <span className="chatbot-badge-dot"></span>
        </button>
      )}

      {isOpen && <div className="chatbot-modal-window">{renderChatBody()}</div>}
    </div>
  );
}
