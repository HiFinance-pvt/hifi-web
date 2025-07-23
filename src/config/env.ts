// Environment configuration for the application
export const env = {
  // API URLs
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  NEXT_PUBLIC_AUTH_API_URL: process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:3001/auth",
  NEXT_PUBLIC_PLATFORM_API_URL: process.env.NEXT_PUBLIC_PLATFORM_API_URL || "http://localhost:3001/api",
  
  // App Configuration
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  
  // Other environment variables
  NODE_ENV: process.env.NODE_ENV || "development",
} as const;

export type Env = typeof env; 