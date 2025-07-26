import { string, z } from 'zod';

// Define schemas for common nested objects

const ContentPartSchema = z.object({
    functionCall: z.object({
        args: z.record(z.string(), z.any()).optional(),
        id: z.string().optional(),
        name: z.string(),
        text: z.string().nullable().optional(),
    }).nullable().optional(),
    text: z.string().nullable().optional(),
    fileData: z.any().nullable().optional(),
    executableCode: z.any().nullable().optional(),
    functionResponse: z.object({
        id: z.string(),
        name: z.string().optional(),
        response: z.object({
            result: z.object({
                content: z.array(z.object({
                    text: z.string(),
                    type: z.string(),
                })).optional(),
                isError: z.boolean(),
            }).nullable().optional(),
        }).optional(),
    }).nullable().optional(),
    videoMetadata: z.any().nullable().optional(),
    thought: z.any().nullable().optional(),
    codeExecutionResult: z.any().nullable().optional(),
    inlineData: z.any().nullable().optional(),
    thoughtSignature: z.any().nullable().optional(),
});

export type ContentPart = z.infer<typeof ContentPartSchema>;

const ContentSchema = z.object({
    role: z.string(),
    parts: z.array(ContentPartSchema),
});

export type Content = z.infer<typeof ContentSchema>;

const FunctionCallSchema = z.object({
    args: z.record(z.string(), z.any()).optional(), // args can be an empty object or contain key-value pairs
    id: z.string().optional(),
    name: z.string(),
    text: z.string().nullable().optional(),
    fileData: z.any().nullable().optional(),
    functionResponse: z.any().nullable().optional(),
    executableCode: z.any().nullable().optional(),
    videoMetadata: z.any().nullable().optional(),
    thought: z.any().nullable().optional(),
    codeExecutionResult: z.any().nullable().optional(),
    inlineData: z.any().nullable().optional(),
    thoughtSignature: z.any().nullable().optional(),
});

export type FunctionCall = z.infer<typeof FunctionCallSchema>;

const FunctionResponseResultContentSchema = z.object({
    text: z.string(),
    type: z.string(),
});

export type FunctionResponseResultContent = z.infer<typeof FunctionResponseResultContentSchema>;

const FunctionResponseResultSchema = z.object({
    content: z.array(FunctionResponseResultContentSchema).optional(),
    isError: z.boolean(),
});

export type FunctionResponseResult = z.infer<typeof FunctionResponseResultSchema>;

const FunctionResponseSchema = z.object({
    id: z.string(),
    scheduling: z.any().nullable().optional(),
    response: z.object({
        result: FunctionResponseResultSchema,
    }).optional(),
    willContinue: z.any().nullable().optional(),
    name: z.string().optional(),
    result: z.any().nullable().optional(), // From older examples
});

export type FunctionResponse = z.infer<typeof FunctionResponseSchema>;

const ActionsSchema = z.object({
    transferToAgent: z.string().nullable().optional(),
    skipSummarization: z.any().nullable().optional(),
    stateDelta: z.record(z.string(), z.any()).optional(),
    escalate: z.any().nullable().optional(),
    requestedAuthConfigs: z.record(z.string(), z.any()).optional(),
    artifactDelta: z.record(z.string(), z.any()).optional(),
});

export type Actions = z.infer<typeof ActionsSchema>;

const UsageMetadataSchema = z.object({
    candidates_token_count: z.number().optional(),
    candidates_tokens_details: z.array(z.object({
        modality: z.string(),
        token_count: z.number(),
    })).optional(),
    prompt_token_count: z.number().optional(),
    prompt_tokens_details: z.array(z.object({
        modality: z.string(),
        token_count: z.number(),
    })).optional(),
    thoughts_token_count: z.number().optional(),
    total_token_count: z.number().optional(),
    traffic_type: z.string().optional(),
});

export type UsageMetadata = z.infer<typeof UsageMetadataSchema>;

// Create Session Response
export const CreateSessionResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        userId: z.string(),
        events: z.array(z.any()).optional().nullable(),
        state: z.record(z.string(), z.any()).optional().nullable(),
        appName: z.string(),
        id: z.string(),
        lastUpdateTime: z.number(),
    }),
});

export type CreateSessionResponse = z.infer<typeof CreateSessionResponseSchema>;

// Enhanced Event Schema with better function handling
export const EventSchema = z.object({
    id: z.string(),
    groundingMetadata: z.any().nullable(),
    branch: z.any().nullable(),
    author: z.string(),
    invocationId: z.string(),
    errorCode: z.any().nullable(),
    interrupted: z.any().nullable(),
    partial: z.any().nullable(),
    turnComplete: z.any().nullable(),
    customMetadata: z.any().nullable(),
    timestamp: z.number(),
    content: ContentSchema.optional(),
    errorMessage: z.any().nullable().optional(),
    usageMetadata: UsageMetadataSchema.optional().nullable(),
    actions: ActionsSchema.optional(),
    longRunningToolIds: z.any().nullable().optional(),
});

export type Event = z.infer<typeof EventSchema>;

// New schema for processed messages
export const ProcessedMessageSchema = z.object({
    id: z.string(),
    author: z.string(),
    timestamp: z.number(),
    type: z.enum(['user', 'assistant', 'function_call', 'function_response', 'thought']),
    text: z.string().optional(),
    functionName: z.string().optional(),
    functionArgs: z.record(z.string(), z.any()).optional(),
    functionResponse: z.any().optional(),
    isError: z.boolean().optional(),
    isPartial: z.boolean().optional(),
});

export type ProcessedMessage = z.infer<typeof ProcessedMessageSchema>;

// Get Session Response
export const GetSessionResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        lastUpdateTime: z.number(),
        id: z.string(),
        events: z.array(EventSchema),
        state: z.record(z.string(), z.any()),
        userId: z.string(),
        appName: z.string(),
    }),
});

export type GetSessionResponse = z.infer<typeof GetSessionResponseSchema>;

export const DeleteSessionResponseSchema = z.object({
    message: z.string(),
});

export type DeleteSessionResponse = z.infer<typeof DeleteSessionResponseSchema>;

export const SendSpecificContentPartsSchema = z.object({
    function_call: z.object({
        id: z.string().nullable().optional(),
        name: z.string().nullable().optional(),
        args: z.object().nullable().optional()
    }).nullable().optional()
})

export const SendSpecificContentSchema = z.object({
    parts: z.array(z.union([ContentPartSchema, SendSpecificContentPartsSchema])),
    role: z.string().optional(),
});

export type SendSpecificContent = z.infer<typeof SendSpecificContentSchema>;

// Send Message Response (This corresponds to the individual messages within the "events" array or top-level responses)
export const SendMessageResponseSchema = z.object({
    content: z.union([ContentSchema, SendSpecificContentSchema]).optional(),
    usage_metadata: UsageMetadataSchema.optional(),
    invocation_id: z.string().optional(),
    author: z.string(),
    actions: ActionsSchema.optional(),
    state_delta: z.record(z.string(), z.any()).optional(),
    artifact_delta: z.record(z.string(), z.any()).optional(),
    requested_auth_configs: z.record(z.string(), z.any()).optional(),
    long_running_tool_ids: z.array(z.any()).optional(),
    id: z.string(),
    timestamp: z.number(),
    errorMessage: z.any().nullable().optional(),
    transfer_to_agent: z.string().optional(), // Specifically seen in send message
});

export type SendMessageResponse = z.infer<typeof SendMessageResponseSchema>;


// Define the schema for a single session object within the 'sessions' array
const SessionSchema = z.object({
    state: z.record(z.string(), z.any()), // Assuming state can be any object
    events: z.array(z.any()), // Assuming events can be an empty array or contain any data, adjust if event structure is known
    id: z.string(),
    userId: z.string(),
    lastUpdateTime: z.number(), // Unix timestamp, typically a number
    appName: z.string(),
});

export type Session = z.infer<typeof SessionSchema>;

// Define the schema for the 'data' object
const ListSessionsDataSchema = z.object({
    sessions: z.array(SessionSchema), // An array of SessionSchema objects
});

export type ListSessionsData = z.infer<typeof ListSessionsDataSchema>;

// Define the schema for the entire list-sessions response
export const ListSessionsResponseSchema = z.object({
    message: z.string(), // "successfully fetched sessions"
    data: ListSessionsDataSchema, // The data object containing the sessions array
});

export type ListSessionsResponse = z.infer<typeof ListSessionsResponseSchema>;

// Combined schema for any of the top-level responses if they can be received interchangeably
export const ApiResponseSchema = z.union([
    CreateSessionResponseSchema,
    GetSessionResponseSchema,
    SendMessageResponseSchema,
    ListSessionsResponseSchema,
]);

export type ApiResponse = z.infer<typeof ApiResponseSchema>;

