import type { Axios } from "axios";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export class Auth {
  constructor(
    private readonly authAxios: Axios,
    private readonly platformAxios: Axios
  ) {}

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.authAxios.post<AuthResponse>("/login", credentials);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.authAxios.post<AuthResponse>("/register", data);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.authAxios.post("/logout");
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await this.authAxios.post<AuthResponse>("/refresh");
    return response.data;
  }

  async me(): Promise<AuthResponse["user"]> {
    const response = await this.platformAxios.get<AuthResponse["user"]>("/me");
    return response.data;
  }
} 