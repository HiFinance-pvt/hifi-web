import axios, {
  AxiosRequestConfig,
  type Axios,
  type AxiosError,
  type AxiosResponse,
  type CreateAxiosDefaults,
} from "axios";



type Headers = CreateAxiosDefaults["headers"];
const baseHeaders: Headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "ngrok-skip-browser-warning": "true",
};

interface AxiosConfigProps {
  headers?: Headers;
  baseURL?: string;
  prefix?: `/${string}`;
  allowMultipleInterceptors?: boolean;
  onRequest?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  onResponse?: (response: AxiosResponse) => void;
  onError?: (error: AxiosError) => void;
}

export class AxiosConfig {
  private readonly axiosInstance: Axios;
  private requestInterceptor: number | null = null;
  private responseInterceptor: number | null = null;
  private readonly allowMultipleInterceptors: boolean = false;

  private createInstance(
    baseURL: string,
    { headers, prefix }: Pick<AxiosConfigProps, "headers" | "prefix">
  ) {
    return axios.create({
      baseURL: baseURL + prefix,
      headers: {
        ...baseHeaders,
        ...headers,
      },
      withCredentials: true,
      timeout: 10000,
    });
  }

  private useRequestInterceptor({
    onRequest,
  }: Pick<AxiosConfigProps, "onRequest">) {
    if (!this.allowMultipleInterceptors && this.requestInterceptor !== null) {
      this.axiosInstance.interceptors.request.eject(this.requestInterceptor);
    }

    this.requestInterceptor = this.axiosInstance.interceptors.request.use(
      (config) => {
        if (onRequest) {
          onRequest(config);
        }

        return config;
      }
    );
  }

  private useResponseInterceptor({
    onResponse,
    onError,
  }: Pick<AxiosConfigProps, "onResponse" | "onError">) {
    if (!this.allowMultipleInterceptors && this.responseInterceptor !== null) {
      this.axiosInstance.interceptors.response.eject(this.responseInterceptor);
    }

    this.responseInterceptor = this.axiosInstance.interceptors.response.use(
      (response) => {
        if (onResponse) {
          onResponse(response);
        }
        return response;
      },
      (error: AxiosError) => {
        if (onError) {
          onError(error);
        }
        return Promise.reject(error.toJSON());
      }
    );
  }

  constructor({
    allowMultipleInterceptors = false,
    headers = {},
    baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
    prefix = "/",
    onRequest,
    onResponse,
    onError,
  }: AxiosConfigProps = {}) {
    this.allowMultipleInterceptors = allowMultipleInterceptors;
    this.axiosInstance = this.createInstance(baseURL, { headers, prefix });
    if (onRequest) {
      this.useRequestInterceptor({ onRequest });
    }
    if (onResponse || onError) {
      this.useResponseInterceptor({ onResponse, onError });
    }
  }

  get instance() {
    return this.axiosInstance;
  }

  clearAllInterceptors() {
    this.axiosInstance.interceptors.request.clear();
    this.requestInterceptor = null;

    this.axiosInstance.interceptors.response.clear();
    this.responseInterceptor = null;
  }
}
