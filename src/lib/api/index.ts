import axios, { type Axios, type AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

import { AxiosConfig } from "../../config/axios";

import { Adk } from "./adk";
import { env } from "@/lib/env";
import { getCurrentUser } from "@/lib/firebase/firebase";
import { Kite } from "./kite.";


class ApiSdk {

  private readonly _apiAxios: Axios;

  // API modules

  adk: Adk;
  kite: Kite
  constructor() {
    // Create axios instances with different base URLs

    this._apiAxios = this.createAxios(env.NEXT_PUBLIC_API_URL);


    this.adk = new Adk(this._apiAxios);
    this.kite = new Kite(this._apiAxios);
  }

  private createAxios(baseURL: string): Axios {
    const ax = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      adapter: 'fetch',
      fetchOptions: { cache: 'no-store' },
    });

    // 👉 Attach interceptors here
    ax.interceptors.request.use(async (config) => {
      const user = getCurrentUser();
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    ax.interceptors.response.use(
      (res) => {
        this.handleResponse(res);
        return res;
      },
      (err) => {
        this.handleError(err);
        return Promise.reject(err);
      }
    );

    return ax;
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

