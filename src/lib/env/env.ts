import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		API_KEY: z.string().min(1),
		AUTH_DOMAIN: z.string().min(1),
		PROJECT_ID: z.string().min(1),
		STORAGE_BUCKET: z.string().min(1),
		MESSAGING_SENDER_ID: z.string().min(1),
		APP_ID: z.string().min(1),
	},
	client: {
	},
	// If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
	runtimeEnv: {
		API_KEY: process.env.API_KEY,
		AUTH_DOMAIN: process.env.AUTH_DOMAIN,
		PROJECT_ID: process.env.PROJECT_ID,
		STORAGE_BUCKET: process.env.STORAGE_BUCKET,
		MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
		APP_ID: process.env.APP_ID,
	},
});
