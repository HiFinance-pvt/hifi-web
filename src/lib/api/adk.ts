import type { Axios } from "axios";
import { CreateSessionResponse, CreateSessionResponseSchema, DeleteSessionResponse, DeleteSessionResponseSchema, GetSessionResponse, GetSessionResponseSchema, ListSessionsResponse, ListSessionsResponseSchema, SendMessageResponse, SendMessageResponseSchema } from "../validations/adk.schema";
import { env } from "../env";
import { getCurrentUser } from "../firebase/firebase";

export class Adk {
    constructor(private readonly axios: Axios) { }

    async getSession(sessionId: string): Promise<GetSessionResponse> {
        try {
            const response = await this.axios.get(`/adk/get-session?session_id=${sessionId}`);
            return GetSessionResponseSchema.parse(response.data);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async sendMessage(sessionId: string, message: string): Promise<SendMessageResponse> {
        const response = await this.axios.post(`/adk/send-message?session_id=${sessionId}`, { message });
        return SendMessageResponseSchema.parse(response.data);
    }

    /**
     * Streams messages from the backend using fetch and yields each chunk as it arrives.
     */
    async *sendMessageStream(sessionId: string, message: string): AsyncGenerator<string, void, unknown> {
        const user = await getCurrentUser();
        const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/adk/send-message?session_id=${sessionId}&message=${message}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await user?.getIdToken()}`,
                // Add auth headers here if needed
            },

        });

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
        const response = await this.axios.get<typeof ListSessionsResponseSchema>(`/adk/list-sessions`);
        return ListSessionsResponseSchema.parse(response.data);
    }

    async createSession(): Promise<CreateSessionResponse> {
        try {
            const response = await this.axios.post(`/adk/create-session`);
            return CreateSessionResponseSchema.parse(response.data);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    async deleteSession(sessionId: string): Promise<DeleteSessionResponse> {
        try {
            const response = await this.axios.delete(`/adk/delete-session?session_id=${sessionId}`);
            return DeleteSessionResponseSchema.parse(response.data);
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
} 