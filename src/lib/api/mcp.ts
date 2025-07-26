import axios from "axios";
import { env } from "../env";

interface ICheckMcpSession {
  message: string;
  valid: boolean;
}

export async function checkMCPSession(
  sessionId: string
): Promise<ICheckMcpSession> {
  try {
    const { data } = await axios.get(
      `${env.NEXT_PUBLIC_FI_MCP_SERVER_URL}/check-session`,
      {
        params: {
          sessionId: sessionId,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error checking MCP session:", error);
    throw error;
  }
}
