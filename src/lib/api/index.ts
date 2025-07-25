import { type Axios, type AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

import { AxiosConfig } from "../../config/axios";
import { env } from "../../config/env";

import { Auth } from "./auth";
import { Profile } from "./profile";
import { Adk } from "./adk";

class ApiSdk {
  private readonly _authAxios: Axios;
  private readonly _platformAxios: Axios;
  private readonly _apiAxios: Axios;

  // API modules
  auth: Auth;
  profile: Profile;
  adk: Adk;
  constructor() {
    // Create axios instances with different base URLs
    this._authAxios = this.createAxiosInstance(env.NEXT_PUBLIC_AUTH_API_URL);
    this._platformAxios = this.createAxiosInstance(env.NEXT_PUBLIC_PLATFORM_API_URL);
    this._apiAxios = this.createAxiosInstance(env.NEXT_PUBLIC_API_URL);

    // Initialize API modules
    this.auth = new Auth(this._authAxios, this._platformAxios);
    this.profile = new Profile(this._platformAxios);
    this.adk = new Adk(this._apiAxios);
  }

  private createAxiosInstance(baseURL: string): Axios {
    const config = new AxiosConfig({
      baseURL,
      prefix: "/",
      onRequest: this.handleRequest.bind(this),
      onResponse: this.handleResponse.bind(this),
      onError: this.handleError.bind(this),
    });

    return config.instance;
  }

  private handleRequest(config: AxiosRequestConfig): AxiosRequestConfig {
    // Get access token from cookies or localStorage
    let accessToken = Cookies.get("access_token");

    // For localhost development, fallback to localStorage if cookies don't work
    if (!accessToken && typeof window !== "undefined") {
      accessToken = localStorage.getItem("access_token") || undefined;
    }

    // Set Authorization header if we have a token
    if (accessToken && accessToken.length > 0) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Also try setting cookies manually for cross-domain issues
    const refreshToken =
      Cookies.get("refresh_token") || localStorage.getItem("refresh_token");

    if (accessToken && refreshToken) {
      // Set as cookie string for cross-domain issues
      config.headers = config.headers || {};
      config.headers.Cookie =
        `access_token=${accessToken}; refresh_token=${refreshToken}`;
    }

    return config;
  }

  private handleResponse(response: any): void {
    // Handle successful responses
    console.log("API Response:", response.status, response.config.url);
  }

  private handleError(error: any): void {
    // Handle API errors
    console.error("API Error:", error.response?.status, error.config?.url, error.message);

    // Handle token expiration
    if (error.response?.status === 401) {
      this.handleTokenExpiration();
    }
  }

  private handleTokenExpiration(): void {
    // Clear tokens
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");

    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }

    // Redirect to login or trigger auth refresh
    // You can customize this based on your app's routing
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  // Utility methods to access axios instances directly if needed
  getAuthAxios(): Axios {
    return this._authAxios;
  }

  getPlatformAxios(): Axios {
    return this._platformAxios;
  }

  getApiAxios(): Axios {
    return this._apiAxios;
  }

  // Token management utilities
  setTokens(accessToken: string, refreshToken: string): void {
    Cookies.set("access_token", accessToken, {
      expires: 7, // 7 days
      secure: env.NODE_ENV === "production",
      sameSite: "lax"
    });
    Cookies.set("refresh_token", refreshToken, {
      expires: 30, // 30 days
      secure: env.NODE_ENV === "production",
      sameSite: "lax"
    });

    // Also store in localStorage as fallback
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
    }
  }

  clearTokens(): void {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");

    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }

  getAccessToken(): string | undefined {
    return Cookies.get("access_token") ||
      (typeof window !== "undefined" ? localStorage.getItem("access_token") || undefined : undefined);
  }
}

// Create and export a singleton instance
const api = new ApiSdk();
export default api;

// Export types and classes for direct usage
export { Auth } from "./auth";
export { Profile } from "./profile";
export type { LoginCredentials, RegisterData, AuthResponse } from "./auth";
export type { UserProfile, UpdateProfileData } from "./profile";
