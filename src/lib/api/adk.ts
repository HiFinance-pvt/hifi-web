import type { Axios } from "axios";
import { CreateSessionResponse, CreateSessionResponseSchema, GetSessionResponse, GetSessionResponseSchema, ListSessionsResponse, ListSessionsResponseSchema, SendMessageResponse, SendMessageResponseSchema } from "../validations/adk.schema";

export class Adk {
    constructor(private readonly axios: Axios) { }

    async getSession(sessionId: string): Promise<GetSessionResponse> {
        const response = await this.axios.get<typeof GetSessionResponseSchema>(`/adk?session_id=${sessionId}`);
        return GetSessionResponseSchema.parse(response);
    }

    async sendMessage(sessionId: string, message: string): Promise<SendMessageResponse> {
        const response = await this.axios.post<typeof SendMessageResponseSchema>(`/adk/${sessionId}/send-message`, { message });
        return SendMessageResponseSchema.parse(response);
    }

    async listSessions(): Promise<ListSessionsResponse> {
        const response = await this.axios.get<typeof ListSessionsResponseSchema>(`/adk/list-sessions}`);
        return ListSessionsResponseSchema.parse(response);
    }

    async createSession(): Promise<CreateSessionResponse> {
        const response = await this.axios.post<typeof CreateSessionResponseSchema>(`/adk/create-session`);
        return CreateSessionResponseSchema.parse(response);
    }
} 