import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Event,
  Content,
  ProcessedMessage,
} from "../lib/validations/adk.schema";
import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import api from "@/lib/api";
import { parseStringToJson } from "@/utils";

// React Query hooks
export function useListSessionsQuery(
  sortBy: string = "lastUpdateTime",
  order: string = "desc",
  limit: number = 100,
  offset: number = 0
) {
  return useQuery({
    queryKey: ["adk", "sessions", sortBy, order, limit, offset],
    queryFn: () => api.adk.listSessions(sortBy, order, limit, offset),
  });
}

export function useCreateSessionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.adk.createSession(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adk", "sessions"] });
    },
  });
}

export function useDeleteSessionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => api.adk.deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adk", "sessions"] });
    },
  });
}

export function useGetSessionQuery(sessionId: string | undefined) {
  return useQuery({
    queryKey: ["adk", "session", sessionId],
    queryFn: () =>
      sessionId
        ? api.adk.getSession(sessionId)
        : Promise.reject("No sessionId"),
    enabled: !!sessionId,
  });
}

export function useSendMessageMutation(sessionId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (message: string) => {
      if (!sessionId) throw new Error("No sessionId");
      return api.adk.sendMessage(sessionId, message);
    },
    onSuccess: (data) => {
      if (sessionId) {
        // After sendMessage completes, fetch the updated session
        queryClient.invalidateQueries({
          queryKey: ["adk", "session-messages", sessionId],
        });
      }
    },
    onError: (error) => {
      console.error("Send message error:", error);
    },
  });
}

// Utility function to process content parts
export function processContentParts(
  parts: any[],
  eventId: string,
  author: string,
  timestamp: number
): ProcessedMessage[] {
  const messages: ProcessedMessage[] = [];

  if (!Array.isArray(parts)) {
    console.warn("Parts is not an array:", parts);
    return messages;
  }

  parts.forEach((part, partIndex) => {
    if (!part || typeof part !== "object") {
      console.warn("Invalid part at index", partIndex, part);
      return;
    }

    const messageId = `${eventId}-part-${partIndex}`;

    // Handle function calls
    if (part.functionCall && typeof part.functionCall === "object") {
      messages.push({
        id: messageId,
        author,
        timestamp,
        type: "function_call",
        functionName: part.functionCall.name || "Unknown Function",
        functionArgs: part.functionCall.args || {},
        text:
          part.functionCall.text ||
          `Calling function: ${part.functionCall.name || "Unknown"}`,
      });
    }

    // Handle function responses
    if (part.functionResponse && typeof part.functionResponse === "object") {
      const response = part.functionResponse;
      const result = response.response?.result;

      // Handle different result types
      let responseText = "Function response received";
      let isError = false;

      if (typeof result === "string") {
        // Result is a string
        responseText = result;
        isError = false;
      } else if (result && typeof result === "object") {
        // Result is an object
        const resultContent = result.content;
        responseText = resultContent
          ? resultContent.map((c: any) => c.text).join(" ")
          : "Function executed successfully";
        isError = result.isError || false;
      } else if (result === null || result === undefined) {
        // Result is null or undefined
        responseText = "Function response received";
        isError = false;
      }

      messages.push({
        id: messageId,
        author,
        timestamp,
        type: "function_response",
        functionName: response.name || "Unknown Function",
        functionResponse: result,
        text: responseText,
        isError: isError,
      });
    }

    // Handle regular text
    if (part.text && typeof part.text === "string") {
      messages.push({
        id: messageId,
        author,
        timestamp,
        type: author === "user" ? "user" : "assistant",
        text: part.text,
      });
    }

    // Handle thoughts
    if (part.thought) {
      messages.push({
        id: messageId,
        author,
        timestamp,
        type: "thought",
        text:
          typeof part.thought === "string"
            ? part.thought
            : JSON.stringify(part.thought),
      });
    }
  });

  return messages;
}

// Enhanced hook: fetch session data and extract all message types
export function useSessionMessagesQuery(sessionId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["adk", "session-messages", sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error("No sessionId");
      const sessionData = await api.adk.getSession(sessionId);
      const events: Event[] = sessionData.data.events || [];
      const allMessages: ProcessedMessage[] = [];

      events.forEach((event) => {
        if (event.content && event.content.parts) {
          try {
            const processedMessages = processContentParts(
              event.content.parts,
              event.id,
              event.author,
              event.timestamp
            );
            allMessages.push(...processedMessages);
          } catch (partError) {
            console.warn("Error processing event parts:", partError, event);
            // Continue processing other events even if one fails
          }
        }
      });

      // Sort messages by timestamp
      allMessages.sort((a, b) => a.timestamp - b.timestamp);

      return allMessages;
    },
    enabled: !!sessionId,
    refetchInterval: false, // No automatic refetching
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    refetchOnReconnect: false, // Don't refetch on network reconnect
    staleTime: Infinity, // Data never goes stale automatically
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  // Manual refetch function – returns Promise so callers can await before clearing streaming state
  const refetchMessages = useCallback(() => {
    if (!sessionId) return Promise.resolve(undefined);
    queryClient.invalidateQueries({
      queryKey: ["adk", "session-messages", sessionId],
    });
    return query.refetch();
  }, [sessionId, queryClient, query.refetch]);

  return {
    messages: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: refetchMessages,
  };
}

/**
 * Extracts displayable text from a stream chunk. Handles:
 * - NDJSON lines: {"text": "..."}, {"delta": "..."}, {"content": "..."}
 * - OpenAI-style: {"choices":[{"delta":{"content":"..."}}]}
 * - SSE-style lines: data: {...}
 * - Plain text: passed through as-is
 */
function extractTextFromStreamChunk(
  chunk: string,
  bufferRef: { current: string }
): string {
  const buffer = bufferRef.current + chunk;
  const lines = buffer.split("\n");
  // Last element may be incomplete; keep it in buffer
  bufferRef.current = lines.pop() ?? "";
  let extracted = "";
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // SSE prefix
    const dataLine = trimmed.startsWith("data: ") ? trimmed.slice(6) : trimmed;
    if (dataLine === "[DONE]" || dataLine === "") continue;
    const textFromLine = parseJsonText(dataLine);
    if (textFromLine !== null) {
      extracted += textFromLine;
    } else if (!dataLine.startsWith("{") && !dataLine.startsWith("[")) {
      // Plain text line (not JSON) – show as-is so streaming is visible
      extracted += line + "\n";
    }
    // Skip adding raw JSON when we couldn't extract text (avoids showing then hiding it)
  }
  // If we have buffered content that is a complete JSON object, try to extract text (single JSON chunk)
  if (bufferRef.current.trim()) {
    try {
      const parsed = JSON.parse(bufferRef.current.trim());
      const textFromLine = getTextFromParsed(parsed);
      if (typeof textFromLine === "string") {
        extracted += textFromLine;
        bufferRef.current = "";
      }
    } catch {
      // Incomplete or invalid JSON; keep in buffer
    }
  }
  return extracted;
}

function getTextFromParsed(parsed: unknown): string | null {
  if (!parsed || typeof parsed !== "object") return null;
  const obj = parsed as Record<string, unknown>;
  if (typeof obj.text === "string") return obj.text;
  if (typeof obj.delta === "string") return obj.delta;
  if (typeof obj.content === "string") return obj.content;
  if (typeof obj.message === "string") return obj.message;
  // Nested content array, e.g. content: [{ text: "..." }]
  const contentArr = obj.content;
  if (Array.isArray(contentArr) && contentArr.length > 0) {
    const first = contentArr[0];
    if (first && typeof first === "object" && "text" in first && typeof (first as { text: string }).text === "string") {
      return (first as { text: string }).text;
    }
  }
  const content =
    (obj.choices as Array<{ delta?: { content?: string }; message?: { content?: string } }>)?.[0]?.delta
      ?.content ??
    (obj.choices as Array<{ message?: { content?: string } }>)?.[0]?.message?.content;
  return typeof content === "string" ? content : null;
}

function parseJsonText(dataLine: string): string | null {
  try {
    const parsed = JSON.parse(dataLine);
    return getTextFromParsed(parsed);
  } catch {
    return null;
  }
}

// New hook for streaming messages
export function useStreamingMessage(sessionId: string | undefined) {
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingError, setStreamingError] = useState<Error | null>(null);
  const streamBufferRef = useRef({ current: "" });

  const startStreaming = async (message: string, onComplete?: () => void) => {
    if (!sessionId) {
      setStreamingError(new Error("No session ID"));
      return;
    }

    setStreamingText("");
    setIsStreaming(true);
    setStreamingError(null);
    streamBufferRef.current = { current: "" };

    try {
      for await (const chunk of api.adk.sendMessageStream(sessionId, message)) {
        const textPart = extractTextFromStreamChunk(chunk, streamBufferRef.current);
        if (textPart) {
          setStreamingText((prev) => prev + textPart);
        } else if (chunk.trim()) {
          // Only show chunk as plain text if it doesn't look like JSON (avoid flashing raw JSON)
          const trimmed = chunk.trim();
          if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
            setStreamingText((prev) => prev + chunk);
          }
        }
      }
      // Streaming completed successfully
      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      console.error("Streaming error:", err);
      setStreamingError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsStreaming(false);
    }
  };

  const stopStreaming = () => {
    setIsStreaming(false);
    setStreamingText("");
    setStreamingError(null);
  };

  return {
    streamingText,
    isStreaming,
    streamingError,
    startStreaming,
    stopStreaming,
  };
}
