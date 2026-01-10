import React, { useState } from 'react';
import { Bot, User, Code, CheckCircle, AlertCircle, Brain, ChevronDown, ChevronRight, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ProcessedMessage } from '@/lib/validations/adk.schema';
import { MessageFiles } from 'reachat';

// Custom User Message Component
export const CustomMessageQuestion: React.FC<{ question: string; files?: any[] }> = ({ question, files }) => (
    <div className="flex justify-end mb-4">
        <div className="flex items-start space-x-3 max-w-2xl">
            <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                </div>
            </div>
            <div className="bg-emerald-600 text-white rounded-2xl px-4 py-3 shadow-lg">
                <p className="text-sm leading-relaxed">{question}</p>
                {files && files.length > 0 && (
                    <MessageFiles files={files}>
                        <CustomMessageFile />
                    </MessageFiles>
                )}
            </div>
        </div>
    </div>
);

// Custom Assistant Message Component
export const CustomMessageResponse: React.FC<{ response: string }> = ({ response }) => (
    <div className="flex justify-start mb-4">
        <div className="flex items-start space-x-3 max-w-2xl">
            <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                </div>
            </div>
            <div className="bg-gray-700 text-white rounded-2xl px-4 py-3 shadow-lg border border-gray-600">
                <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            // Custom styling for markdown elements
                            h1: ({ children }) => <h1 className="text-xl font-bold mb-2 text-white">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-lg font-bold mb-2 text-white">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-base font-bold mb-2 text-white">{children}</h3>,
                            p: ({ children }) => <p className="mb-2 text-gray-200">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-2 text-gray-200">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-2 text-gray-200">{children}</ol>,
                            li: ({ children }) => <li className="mb-1">{children}</li>,
                            code: ({ children, className }) => {
                                const isInline = !className;
                                if (isInline) {
                                    return <code className="bg-gray-800 px-1 py-0.5 rounded text-sm text-green-300">{children}</code>;
                                }
                                return (
                                    <pre className="bg-gray-800 p-3 rounded-lg overflow-x-auto mb-2">
                                        <code className="text-sm text-green-300">{children}</code>
                                    </pre>
                                );
                            },
                            pre: ({ children }) => <div className="mb-2">{children}</div>,
                            blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-300 mb-2">
                                    {children}
                                </blockquote>
                            ),
                            a: ({ children, href }) => (
                                <a href={href} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">
                                    {children}
                                </a>
                            ),
                            strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                            em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
                            table: ({ children }) => (
                                <div className="overflow-x-auto mb-2">
                                    <table className="min-w-full border border-gray-600">{children}</table>
                                </div>
                            ),
                            th: ({ children }) => (
                                <th className="border border-gray-600 px-3 py-2 bg-gray-800 text-white font-bold">
                                    {children}
                                </th>
                            ),
                            td: ({ children }) => (
                                <td className="border border-gray-600 px-3 py-2 text-gray-200">
                                    {children}
                                </td>
                            ),
                        }}
                    >
                        {response}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    </div>
);

// Custom Function Call Component
export const CustomFunctionCall: React.FC<{ message: ProcessedMessage }> = ({ message }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="flex justify-start mb-4">
            <div className="flex items-start space-x-3 max-w-2xl">
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <Code className="w-4 h-4 text-white" />
                    </div>
                </div>
                <div className="bg-purple-900/20 text-white rounded-2xl px-4 py-3 shadow-lg border border-purple-600/30 flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Code className="w-4 h-4 text-purple-400" />
                            <span className="font-medium text-purple-300">Function Call</span>
                        </div>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="mt-2">
                        <div className="text-sm font-medium text-purple-200">
                            {message.functionName || 'Unknown Function'}
                        </div>

                        {isExpanded && message.functionArgs && Object.keys(message.functionArgs).length > 0 && (
                            <div className="mt-2 p-3 bg-purple-900/30 rounded-lg border border-purple-600/20">
                                <div className="text-xs text-purple-400 mb-1">Arguments:</div>
                                <pre className="text-xs text-purple-200 whitespace-pre-wrap break-words">
                                    {JSON.stringify(message.functionArgs, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Custom Function Response Component
export const CustomFunctionResponse: React.FC<{ message: ProcessedMessage }> = ({ message }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isError = message.isError || false;

    return (
        <div className="flex justify-start mb-4">
            <div className="flex items-start space-x-3 max-w-2xl">
                <div className="flex-shrink-0">
                    <div className={`w-8 h-8 ${isError ? 'bg-red-600' : 'bg-green-600'} rounded-full flex items-center justify-center`}>
                        {isError ? (
                            <AlertCircle className="w-4 h-4 text-white" />
                        ) : (
                            <CheckCircle className="w-4 h-4 text-white" />
                        )}
                    </div>
                </div>
                <div className={`${isError ? 'bg-red-900/20 border-red-600/30' : 'bg-green-900/20 border-green-600/30'} text-white rounded-2xl px-4 py-3 shadow-lg border flex-1`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {isError ? (
                                <AlertCircle className="w-4 h-4 text-red-400" />
                            ) : (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                            )}
                            <span className={`font-medium ${isError ? 'text-red-300' : 'text-green-300'}`}>
                                Function Response
                            </span>
                        </div>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={`${isError ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'} transition-colors`}
                        >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="mt-2">
                        <div className={`text-sm font-medium ${isError ? 'text-red-200' : 'text-green-200'}`}>
                            {message.functionName || 'Unknown Function'}
                        </div>

                        {isError && (
                            <div className={`text-sm ${isError ? 'text-red-300' : 'text-green-300'}`}>
                                Error occurred during execution
                            </div>
                        )}

                        {isExpanded && message.functionResponse && (
                            <div className={`mt-2 p-3 ${isError ? 'bg-red-900/30 border-red-600/20' : 'bg-green-900/30 border-green-600/20'} rounded-lg border`}>
                                <div className={`text-xs ${isError ? 'text-red-400' : 'text-green-400'} mb-1`}>Response:</div>
                                <pre className={`text-xs ${isError ? 'text-red-200' : 'text-green-200'} whitespace-pre-wrap break-words`}>
                                    {JSON.stringify(message.functionResponse, null, 2)}
                                </pre>
                                {message.text && (
                                    <div className={`mt-2 pt-2 border-t ${isError ? 'border-red-600/20' : 'border-green-600/20'}`}>
                                        <div className={`text-xs ${isError ? 'text-red-400' : 'text-green-400'} mb-1`}>Content:</div>
                                        <div className={`text-xs ${isError ? 'text-red-200' : 'text-green-200'}`}>
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    p: ({ children }) => <p className="mb-1">{children}</p>,
                                                    code: ({ children }) => <code className={`${isError ? 'bg-red-900/50' : 'bg-green-900/50'} px-1 py-0.5 rounded`}>{children}</code>,
                                                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                                                    em: ({ children }) => <em className="italic">{children}</em>,
                                                }}
                                            >
                                                {message.text}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Custom Thought Process Component
export const CustomThoughtProcess: React.FC<{ message: ProcessedMessage }> = ({ message }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="flex justify-start mb-4">
            <div className="flex items-start space-x-3 max-w-2xl">
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                    </div>
                </div>
                <div className="bg-yellow-900/20 text-white rounded-2xl px-4 py-3 shadow-lg border border-yellow-600/30 flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Brain className="w-4 h-4 text-yellow-400" />
                            <span className="font-medium text-yellow-300">AI Thinking</span>
                        </div>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>

                    {isExpanded && message.text && (
                        <div className="mt-2 p-3 bg-yellow-900/30 rounded-lg border border-yellow-600/20">
                            <div className="text-xs text-yellow-400 mb-1">Thought Process:</div>
                            <div className="text-sm text-yellow-200">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        p: ({ children }) => <p className="mb-1">{children}</p>,
                                        code: ({ children }) => <code className="bg-yellow-900/50 px-1 py-0.5 rounded text-xs">{children}</code>,
                                        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                                        em: ({ children }) => <em className="italic">{children}</em>,
                                    }}
                                >
                                    {message.text}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Custom File Component
export const CustomMessageFile: React.FC<{ name?: string; type?: string }> = ({ name, type }) => (
    <div className="inline-flex items-center px-2 py-1 bg-gray-700 rounded-lg text-xs text-gray-300 border border-gray-600">
        <span className="mr-1">📎</span>
        {name || type || 'File'}
    </div>
);

// Custom Source Component
export const CustomMessageSource: React.FC<{ title?: string; url?: string; image?: string }> = ({
    title,
    url,
    image
}) => {
    const handleClick = () => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    return (
        <div
            className="inline-flex items-center px-3 py-2 bg-blue-900/30 rounded-lg text-xs text-blue-300 border border-blue-500/50 cursor-pointer hover:bg-blue-900/50 transition-colors"
            onClick={handleClick}
        >
            {image && (
                <img
                    src={image}
                    alt={title || 'Source'}
                    className="w-4 h-4 rounded mr-2"
                />
            )}
            <span>{title || url || 'Source'}</span>
        </div>
    );
};

// Main Message Renderer Component
export const MessageRenderer: React.FC<{ message: ProcessedMessage }> = ({ message }) => {
    switch (message.type) {
        case 'user':
            return <CustomMessageQuestion question={message.text || ''} />;
        case 'assistant':
            return <CustomMessageResponse response={message.text || ''} />;
        case 'function_call':
            return (
                <CustomFunctionCall
                    message={message}
                />
            );
        case 'function_response':
            return (
                <CustomFunctionResponse
                    message={message}
                />
            );
        case 'thought':
            return (
                <CustomThoughtProcess
                    message={message}
                />
            );
        default:
            return <CustomMessageResponse response={message.text || ''} />;
    }
};

// Loading indicator for streaming
export const StreamingIndicator: React.FC = () => (
    <div className="flex justify-start mb-4">
        <div className="flex items-start space-x-3 max-w-2xl">
            <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                </div>
            </div>
            <div className="bg-gray-700 text-white rounded-2xl px-4 py-3 shadow-lg border border-gray-600">
                <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-400 animate-spin" />
                    <span className="text-sm text-gray-300">AI is thinking...</span>
                </div>
            </div>
        </div>
    </div>
);

// Session Refetching Indicator
export const SessionRefetchingIndicator: React.FC = () => (
    <div className="flex justify-start mb-4">
        <div className="flex items-start space-x-3 max-w-2xl">
            <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                </div>
            </div>
            <div className="bg-gray-700 text-white rounded-2xl px-4 py-3 shadow-lg border border-gray-600">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                    <span className="text-sm text-gray-300">Updating conversation...</span>
                </div>
            </div>
        </div>
    </div>
);

// Message Skeleton Component
export const MessageSkeleton: React.FC = () => (
    <div className="flex justify-start mb-4">
        <div className="flex items-start space-x-3 max-w-2xl">
            <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
            </div>
            <div className="bg-gray-700 rounded-2xl px-4 py-3 shadow-lg border border-gray-600 flex-1">
                <div className="space-y-2">
                    <div className="h-4 bg-gray-600 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-600 rounded animate-pulse w-1/2"></div>
                    <div className="h-4 bg-gray-600 rounded animate-pulse w-5/6"></div>
                </div>
            </div>
        </div>
    </div>
);

// Process Group Component - Groups function calls and responses
export const ProcessGroup: React.FC<{
    messages: ProcessedMessage[];
}> = ({ messages }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Filter function calls and responses
    const processMessages = messages.filter(msg =>
        msg.type === 'function_call' || msg.type === 'function_response'
    );

    if (processMessages.length === 0) return null;

    // Count different types
    const functionCalls = processMessages.filter(msg => msg.type === 'function_call');
    const functionResponses = processMessages.filter(msg => msg.type === 'function_response');
    const errors = functionResponses.filter(msg => msg.isError);

    // Check if process is complete (has equal number of calls and responses)
    const isComplete = functionCalls.length > 0 && functionCalls.length === functionResponses.length;

    return (
        <div className="flex justify-start mb-4">
            <div className="flex items-start space-x-3 max-w-2xl">
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                        <Code className="w-4 h-4 text-white" />
                    </div>
                </div>
                <div className="bg-indigo-900/20 text-white rounded-2xl px-4 py-3 shadow-lg border border-indigo-600/30 flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Code className="w-4 h-4 text-indigo-400" />
                            <span className="font-medium text-indigo-300">Process</span>
                            <div className="flex items-center space-x-2 text-xs text-indigo-400">
                                <span>{functionCalls.length} calls</span>
                                <span>•</span>
                                <span>{functionResponses.length} responses</span>
                                {errors.length > 0 && (
                                    <>
                                        <span>•</span>
                                        <span className="text-red-400">{errors.length} errors</span>
                                    </>
                                )}
                                {isComplete && (
                                    <>
                                        <span>•</span>
                                        <span className="text-green-400">Complete</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>

                    {isExpanded && (
                        <div className="mt-3 space-y-3">
                            {processMessages.map((msg, index) => (
                                <div key={`${msg.id}-${index}`} className="border-l-2 border-indigo-600/30 pl-3">
                                    {msg.type === 'function_call' && (
                                        <CustomFunctionCall message={msg} />
                                    )}
                                    {msg.type === 'function_response' && (
                                        <CustomFunctionResponse message={msg} />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Function to group consecutive function calls and responses
export const groupProcessMessages = (messages: ProcessedMessage[]): (ProcessedMessage | ProcessedMessage[])[] => {
    const result: (ProcessedMessage | ProcessedMessage[])[] = [];
    let currentGroup: ProcessedMessage[] = [];

    for (const message of messages) {
        if (message.type === 'function_call' || message.type === 'function_response') {
            currentGroup.push(message);
        } else {
            // If we have a group, add it to result
            if (currentGroup.length > 0) {
                result.push(currentGroup);
                currentGroup = [];
            }
            // Add the non-process message
            result.push(message);
        }
    }

    // Don't forget the last group
    if (currentGroup.length > 0) {
        result.push(currentGroup);
    }

    return result;
};

// Grouped Message Renderer - Handles both individual messages and process groups
export const GroupedMessageRenderer: React.FC<{
    messages: ProcessedMessage[];
}> = ({ messages }) => {
    const groupedMessages = groupProcessMessages(messages);

    return (
        <>
            {groupedMessages.map((item, index) => {
                if (Array.isArray(item)) {
                    // This is a process group
                    return (
                        <ProcessGroup
                            key={`process-${index}`}
                            messages={item}
                        />
                    );
                } else {
                    // This is an individual message
                    return <MessageRenderer key={`message-${item.id}-${index}`} message={item} />;
                }
            })}
        </>
    );
}; 