import { Axios } from "axios";
import { getCurrentUser } from "@/lib/firebase/firebase";

export class Kite {
  constructor(private readonly axios: Axios) {}

  async redirect(request_token: string) {
    const { data } = await this.axios.get("/kite/redirect", {
      params: {
        request_token: request_token
      },
      headers: {
        "Authorization": `Bearer ${await getCurrentUser()?.getIdToken()}`
            }
    });
    return data
  }
}
