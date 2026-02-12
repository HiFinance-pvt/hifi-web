import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChatConversation,
  ResponseData,
  FunctionCall,
  AdkMessage,
} from "@/types/chat";
import { TaxMitraMessage } from "./TaxMitraMessage";
import { isTaxMitraResponse, TaxMitraResponse } from "@/types/tax-mitra";

interface CustomSessionMessageProps {
  conversation: ChatConversation;
  isLast?: boolean;
  onSendMessage?: (message: string) => void;
}

// Function Call Badge Component
const FunctionCallBadge = ({
  functionCall,
}: {
  functionCall: FunctionCall;
}) => {
  const [copied, setCopied] = useState(false);

  const copyFunctionCall = async () => {
    const functionData = {
      name: functionCall.name,
      description: functionCall.description,
      parameters: functionCall.parameters,
      result: functionCall.result,
    };

    try {
      await navigator.clipboard.writeText(
        JSON.stringify(functionData, null, 2)
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy function call data:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-xs text-blue-300 mb-2 mr-2 group hover:bg-blue-600/30 transition-all duration-200"
    >
      <div className="flex items-center gap-2">
        <svg
          className="w-3 h-3 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
        <span className="font-medium">{functionCall.name}</span>
        <span className="text-blue-400">•</span>
        <span className="text-xs opacity-80">{functionCall.description}</span>
      </div>

      {/* Copy Button */}
      <button
        onClick={copyFunctionCall}
        className="ml-2 p-1 rounded hover:bg-blue-500/20 transition-colors opacity-0 group-hover:opacity-100"
        title="Copy function call details"
      >
        {copied ? (
          <svg
            className="w-3 h-3 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        )}
      </button>
    </motion.div>
  );
};

// Enhanced JSON Dialog Component
const JsonDialog = ({
  isOpen,
  onClose,
  jsonData,
  title = "JSON Response",
}: {
  isOpen: boolean;
  onClose: () => void;
  jsonData: Record<string, any>;
  title?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy JSON:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl max-h-[80vh] mx-4 bg-gray-800 rounded-2xl border border-gray-600 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={copyJson}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors rounded-lg text-sm"
            >
              {copied ? (
                <>
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-auto max-h-[60vh]">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap bg-gray-900 p-4 rounded-lg border border-gray-700 overflow-auto">
            {JSON.stringify(jsonData, null, 2)}
          </pre>
        </div>
      </motion.div>
    </div>
  );
};

export const CustomSessionMessage: React.FC<CustomSessionMessageProps> = ({
  conversation,
  isLast = false,
  onSendMessage,
}) => {
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const copyResponse = async () => {
    try {
      const { text } = getResponseData();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy response:", err);
    }
  };

  // Parse response data to extract text, function calls, and JSON
  const getResponseData = () => {
    // Check if we have ADK message data with function calls
    if (conversation.adkMessage) {
      const adkMsg = conversation.adkMessage;
      const functionCalls: FunctionCall[] = [];

      // Create function call from ADK data
      if (adkMsg.function_called_name || adkMsg.function_call) {
        functionCalls.push({
          id: adkMsg.function_call?.id || `adk-${Date.now()}`,
          name:
            adkMsg.function_called_name ||
            adkMsg.function_call?.name ||
            "unknown_function",
          description: `${
            adkMsg.function_called_name || adkMsg.function_call?.name
          } tool execution`,
          parameters: adkMsg.function_call?.args || {},
          result: adkMsg.function_response_content,
        });
      }

      return {
        text:
          typeof conversation.response === "string"
            ? conversation.response
            : adkMsg.text || "",
        functionCalls,
        jsonData: adkMsg.function_response_content,
      };
    }

    // Fallback to regular response parsing
    if (typeof conversation.response === "string") {
      return {
        text: conversation.response,
        functionCalls: [],
        jsonData: null,
      };
    }

    if (conversation.response && typeof conversation.response === "object") {
      const responseData = conversation.response as ResponseData;
      return {
        text: responseData.text || "",
        functionCalls: responseData.functionCalls || [],
        jsonData: responseData.jsonData,
      };
    }

    return {
      text: "",
      functionCalls: [],
      jsonData: null,
    };
  };

  const { text, functionCalls, jsonData } = getResponseData();

  // Helper to try parsing TaxMitra response from text
  // Helper to try parsing TaxMitra response from text
  const tryParseTaxMitraResponse = (
    textString: string
  ): Record<string, any> | null => {
    console.log("Parsing text for TaxMitra:", textString.substring(0, 50) + "...");
    try {
      // 1. Try finding JSON object block
      const jsonMatch = textString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         try {
            const parsed = JSON.parse(jsonMatch[0]);
            console.log("Parsed from regex:", parsed);
            if (isTaxMitraResponse(parsed)) return parsed;
         } catch (e) { console.log("Regex match failed parse", e); }
      }

      // 2. Fallback to simple brace search
      const firstBrace = textString.indexOf("{");
      const lastBrace = textString.lastIndexOf("}");

      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const potentialJson = textString.substring(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(potentialJson);
        console.log("Parsed from substring:", parsed);
        if (isTaxMitraResponse(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Parse error:", e);
    }
    return null;
  };

  const extractedTaxMitraData = jsonData && isTaxMitraResponse(jsonData)
    ? jsonData
    : tryParseTaxMitraResponse(text);

  const isTaxMitra = !!extractedTaxMitraData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`space-y-6 ${isLast ? "mb-6" : "mb-8"}`}
    >
      {/* User Question */}
      <div className="flex justify-end">
        <div className="max-w-3xl">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <div className="bg-[#04A66A] text-white p-4 rounded-2xl rounded-br-md shadow-lg">
                <p className="text-sm leading-relaxed">
                  {conversation.question}
                </p>
              </div>
              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-500">
                  {formatTime(conversation.createdAt)}
                </span>
              </div>
            </div>
            {/* User Avatar */}
            <div className="w-8 h-8 bg-[#04A66A] rounded-full flex items-center justify-center text-white text-sm font-medium">
              U
            </div>
          </div>
        </div>
      </div>

      {/* AI Response */}
      <div className="flex justify-start">
        <div className="max-w-3xl">
          <div className="flex items-start space-x-3">
            {/* AI Avatar */}
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div className="flex-1">
              {/* Function Call Badges */}
              {functionCalls.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 flex flex-wrap"
                >
                  {functionCalls.map((functionCall: FunctionCall) => (
                    <FunctionCallBadge
                      key={functionCall.id}
                      functionCall={functionCall}
                    />
                  ))}
                </motion.div>
              )}

              <div
                className={`backdrop-blur-sm text-gray-100 p-4 rounded-2xl rounded-tl-md shadow-lg ${
                  functionCalls.length > 0
                    ? "bg-gray-800/95 border border-blue-500/20"
                    : "bg-gray-800/90 border border-gray-700/50"
                }`}
              >
                {/* Render Tax Mitra Component if matching response found */}
                {isTaxMitra && extractedTaxMitraData ? (
                  <TaxMitraMessage
                    response={extractedTaxMitraData as TaxMitraResponse}
                    onAnswerSubmit={(answers) => {
                      if (onSendMessage) {
                        const formatted = Object.entries(answers)
                          .map(([key, value]) => `${key} ${value}`)
                          .join("\n");
                        onSendMessage(formatted);
                      }
                    }}
                  />
                ) : (
                  <>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {text}
                    </p>

                    {/* Enhanced JSON Data Box */}
                    {jsonData && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 p-3 bg-gray-700/30 rounded-lg border border-gray-600/50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs text-gray-400 font-medium">
                              Function response data available
                            </span>
                            <span className="text-xs text-gray-500">
                              ({Object.keys(jsonData).length} keys)
                            </span>
                          </div>
                          <button
                            onClick={() => setJsonDialogOpen(true)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-lg text-xs text-gray-300 hover:text-white transition-all duration-200 hover:scale-105"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            View JSON
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
              <div className="flex justify-start mt-1">
                <span className="text-xs text-gray-500">
                  {formatTime(conversation.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Actions Row */}
      <div className="flex justify-start ml-11">
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyResponse}
            className="flex items-center gap-1 p-1.5 text-gray-500 hover:text-[#04A66A] hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title="Copy response"
          >
            {copied ? (
              <svg
                className="w-4 h-4 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 text-gray-500 hover:text-[#04A66A] hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title="Regenerate response"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-gray-700/50 rounded-lg transition-all duration-200"
            title="Delete conversation"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* JSON Dialog */}
      {jsonData && (
        <JsonDialog
          isOpen={jsonDialogOpen}
          onClose={() => setJsonDialogOpen(false)}
          jsonData={jsonData}
          title="API Response Data"
        />
      )}
    </motion.div>
  );
};
