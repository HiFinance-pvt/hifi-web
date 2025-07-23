import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	client: {
		NEXT_PUBLIC_API_KEY: z.string().min(1),
		NEXT_PUBLIC_AUTH_DOMAIN: z.string().min(1),
		NEXT_PUBLIC_PROJECT_ID: z.string().min(1),
		NEXT_PUBLIC_STORAGE_BUCKET: z.string().min(1),
		NEXT_PUBLIC_MESSAGING_SENDER_ID: z.string().min(1),
		NEXT_PUBLIC_APP_ID: z.string().min(1),
	},
	// If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
	runtimeEnv: {
		NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
		NEXT_PUBLIC_AUTH_DOMAIN: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
		NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
		NEXT_PUBLIC_STORAGE_BUCKET: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
		NEXT_PUBLIC_MESSAGING_SENDER_ID:
			process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
		NEXT_PUBLIC_APP_ID: process.env.NEXT_PUBLIC_APP_ID,
	},
});
