import type { Axios } from "axios";
import {
  CreateSessionResponse,
  CreateSessionResponseSchema,
  DeleteSessionResponse,
  DeleteSessionResponseSchema,
  GetSessionResponse,
  GetSessionResponseSchema,
  ListSessionsResponse,
  ListSessionsResponseSchema,
  SendMessageResponse,
  SendMessageResponseSchema,
} from "../validations/adk.schema";
import { env } from "../env";
import { getCurrentUser } from "../firebase/firebase";

export class Adk {
  constructor(private readonly axios: Axios) {}

  // Small helper to normalize responses that may be arrays into the expected object shape
  // Some endpoints sometimes return an array (e.g. sessions array) instead of { message, data: { sessions: [...] } }
  // Normalize common cases so Zod parsing succeeds.
  private normalizeResponseForParsing(
    responseData: any,
    endpointHint?: string
  ) {
    if (Array.isArray(responseData)) {
      // If the response is an array, assume it's a sessions array and wrap accordingly
      return { message: "success", data: { sessions: responseData } };
    }

    // If responseData is an object with a top-level 'data' that is an array, leave it as-is (schemas may expect that)
    // Otherwise return as-is
    return responseData;
  }

  async getSession(sessionId: string): Promise<GetSessionResponse> {
    try {
      const response = await this.axios.get(
        `/adk/get-session?session_id=${sessionId}`
      );
      return GetSessionResponseSchema.parse(response.data);
    } catch (e) {
      throw e;
    }
  }

  async sendMessage(
    sessionId: string,
    message: string
  ): Promise<SendMessageResponse> {
    const response = await this.axios.post(
      `/adk/send-message?session_id=${sessionId}`,
      { message }
    );
    return SendMessageResponseSchema.parse(response.data);
  }

  /**
   * Streams messages from the backend using fetch and yields each chunk as it arrives.
   */
  async *sendMessageStream(
    sessionId: string,
    message: string
  ): AsyncGenerator<string, void, unknown> {
    const user = await getCurrentUser();
    const response = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/adk/send-message?session_id=${sessionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user?.getIdToken()}`,
          // Add auth headers here if needed
        },
        body: JSON.stringify({ message }),
      }
    );

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let { value, done } = await reader.read();
    while (!done) {
      yield decoder.decode(value, { stream: true });
      ({ value, done } = await reader.read());
    }
  }

  async listSessions(): Promise<ListSessionsResponse> {
    const response = await this.axios.get<typeof ListSessionsResponseSchema>(
      `/adk/list-sessions`
    );
    const normalized = this.normalizeResponseForParsing(
      response.data,
      "listSessions"
    );
    return ListSessionsResponseSchema.parse(normalized);
  }

  async createSession(): Promise<CreateSessionResponse> {
    try {
      const response = await this.axios.post(`/adk/create-session`);
      const normalized = this.normalizeResponseForParsing(
        response.data,
        "createSession"
      );
      return CreateSessionResponseSchema.parse(normalized);
    } catch (e) {
      throw e;
    }
  }

  async deleteSession(sessionId: string): Promise<DeleteSessionResponse> {
    try {
      const response = await this.axios.delete(
        `/adk/delete-session?session_id=${sessionId}`
      );
      return DeleteSessionResponseSchema.parse(response.data);
    } catch (e) {
      throw e;
    }
  }
}
