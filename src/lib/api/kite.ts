import { Axios } from "axios";
import { getCurrentUser } from "@/lib/firebase/firebase";

export interface KiteConnectResponse {
  message: string;
  data: {
    url: string;
  };
}

export class Kite {
  constructor(private readonly axios: Axios) {}

  async connect(): Promise<KiteConnectResponse> {
    const { data } = await this.axios.get<KiteConnectResponse>("/kite/connect", {
      headers: {
        "Authorization": `Bearer ${await getCurrentUser()?.getIdToken()}`
      }
    });
    return data
  }
  
  async redirect(request_token: string) {
    const { data } = await this.axios.post("/kite/redirect", { request_token }, {
      headers: {
        "Authorization": `Bearer ${await getCurrentUser()?.getIdToken()}`
      }
    });
    return data;
  }

  async getIntegrationStatus() {
    const { data } = await this.axios.get("/kite/status", {
      headers: {
        "Authorization": `Bearer ${await getCurrentUser()?.getIdToken()}`
      }
    });
    return data;
  }

  async disconnect() {
    const { data } = await this.axios.post("/kite/disconnect", {}, {
      headers: {
        "Authorization": `Bearer ${await getCurrentUser()?.getIdToken()}`
      }
    });
    return data;
  }
}
