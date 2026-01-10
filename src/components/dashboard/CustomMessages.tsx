import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ProcessedMessage } from '@/lib/validations/adk.schema';
import { MessageFiles } from 'reachat';
import { DebtStrategyDisplay, DebtStrategyData } from './DebtStrategyDisplay';

// Minimal SVG Icons
const UserIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
);

const BotIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <circle cx="9" cy="11" r="1.5" />
        <circle cx="15" cy="11" r="1.5" />
        <path d="M9 15h6" />
    </svg>
);

const CodeIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M8 6l-4 6 4 6M16 6l4 6-4 6" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M5 13l4 4L19 7" />
    </svg>
);

const AlertIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 9v4m0 4h.01M12 3l9 16H3L12 3z" />
    </svg>
);

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M19 9l-7 7-7-7" />
    </svg>
);

const ThinkingIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 3c-4.4 0-8 3.6-8 8 0 2.8 1.5 5.3 3.8 6.7V19c0 1.1.9 2 2 2h4.4c1.1 0 2-.9 2-2v-1.3c2.3-1.4 3.8-3.9 3.8-6.7 0-4.4-3.6-8-8-8z" />
        <path d="M12 7v2m0 4h.01" />
    </svg>
);

// Helper function to detect and parse debt strategy JSON from response
const parseDebtStrategyData = (text: string): DebtStrategyData | null => {
    if (!text) return null;

    // Try to find JSON in the response (it might be wrapped in markdown code blocks)
    let jsonStr = text.trim();

    // Check if it's wrapped in code blocks
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1].trim();
    }

    try {
        const parsed = JSON.parse(jsonStr);

        // Validate that it has the debt strategy structure
        if (
            parsed.total_debt &&
            parsed.target_duration_months &&
            parsed.intensity &&
            parsed.monthly_payment_goal &&
            parsed.strategy_summary &&
            Array.isArray(parsed.recommended_actions) &&
            parsed.estimated_interest_saved &&
            parsed.debt_free_by
        ) {
            return parsed as DebtStrategyData;
        }
    } catch {
        // Not valid JSON, return null
    }

    return null;
};

// Custom User Message Component
export const CustomMessageQuestion: React.FC<{ question: string; files?: any[] }> = ({ question, files }) => (
    <div className="flex justify-end mb-4">
        <div className="flex items-start gap-3 max-w-2xl">
            <div className="flex-shrink-0 order-2">
                <div className="w-8 h-8 bg-[var(--brand-primary)] rounded-xl flex items-center justify-center text-white">
                    <UserIcon />
                </div>
            </div>
            <div className="bg-[var(--brand-primary)] text-white rounded-2xl rounded-tr-md px-4 py-3 order-1">
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
export const CustomMessageResponse: React.FC<{ response: string }> = ({ response }) => {
    // Check if the response contains debt strategy JSON data
    const debtStrategyData = useMemo(() => parseDebtStrategyData(response), [response]);

    // If it's a debt strategy response, render the special component
    if (debtStrategyData) {
        return (
            <div className="flex justify-start mb-4">
                <div className="flex items-start gap-3 w-full">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-[var(--surface-hover)] rounded-xl flex items-center justify-center text-[var(--brand-primary)]">
                            <BotIcon />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <DebtStrategyDisplay data={debtStrategyData} />
                    </div>
                </div>
            </div>
        );
    }

    // Default markdown rendering
    return (
        <div className="flex justify-start mb-4">
            <div className="flex items-start gap-3 max-w-2xl">
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-[var(--surface-hover)] rounded-xl flex items-center justify-center text-[var(--brand-primary)]">
                        <BotIcon />
                    </div>
                </div>
                <div className="bg-[var(--surface)] text-[var(--foreground)] rounded-2xl rounded-tl-md px-4 py-3 border border-[var(--surface-border)]">
                    <div className="prose prose-sm max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({ children }) => <h1 className="text-lg font-semibold mb-2 text-[var(--foreground)]">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-base font-semibold mb-2 text-[var(--foreground)]">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-sm font-semibold mb-2 text-[var(--foreground)]">{children}</h3>,
                                p: ({ children }) => <p className="mb-2 text-[var(--foreground-secondary)] leading-relaxed">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc list-inside mb-2 text-[var(--foreground-secondary)]">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 text-[var(--foreground-secondary)]">{children}</ol>,
                                li: ({ children }) => <li className="mb-1">{children}</li>,
                                code: ({ children, className }) => {
                                    const isInline = !className;
                                    if (isInline) {
                                        return <code className="bg-[var(--brand-primary-muted)] px-1.5 py-0.5 rounded text-sm text-[var(--brand-primary)] font-mono">{children}</code>;
                                    }
                                    return (
                                        <pre className="bg-[var(--background)] p-3 rounded-xl overflow-x-auto mb-2 border border-[var(--surface-border)]">
                                            <code className="text-sm text-[var(--brand-primary)] font-mono">{children}</code>
                                        </pre>
                                    );
                                },
                                pre: ({ children }) => <div className="mb-2">{children}</div>,
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-2 border-[var(--brand-primary)] pl-4 text-[var(--foreground-muted)] mb-2">
                                        {children}
                                    </blockquote>
                                ),
                                a: ({ children, href }) => (
                                    <a href={href} className="text-[var(--brand-primary)] hover:underline" target="_blank" rel="noopener noreferrer">
                                        {children}
                                    </a>
                                ),
                                strong: ({ children }) => <strong className="font-semibold text-[var(--foreground)]">{children}</strong>,
                                em: ({ children }) => <em className="italic text-[var(--foreground-muted)]">{children}</em>,
                                table: ({ children }) => (
                                    <div className="overflow-x-auto mb-2">
                                        <table className="min-w-full border border-[var(--surface-border)] rounded-lg">{children}</table>
                                    </div>
                                ),
                                th: ({ children }) => (
                                    <th className="border border-[var(--surface-border)] px-3 py-2 bg-[var(--surface-hover)] text-[var(--foreground)] font-medium text-left">
                                        {children}
                                    </th>
                                ),
                                td: ({ children }) => (
                                    <td className="border border-[var(--surface-border)] px-3 py-2 text-[var(--foreground-secondary)]">
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
};

// Custom Function Call Component
export const CustomFunctionCall: React.FC<{ message: ProcessedMessage }> = ({ message }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="flex justify-start mb-3">
            <div className="flex items-start gap-3 max-w-2xl">
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-[var(--info-bg)] rounded-xl flex items-center justify-center text-[var(--info)]">
                        <CodeIcon />
                    </div>
                </div>
                <div className="bg-[var(--info-bg)] text-[var(--foreground)] rounded-2xl rounded-tl-md px-4 py-3 border border-[var(--info)]/20 flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[var(--info)]">
                                {message.functionName || 'Function Call'}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-[var(--info)] hover:opacity-80 transition-opacity"
                        >
                            <ChevronIcon isOpen={isExpanded} />
                        </button>
                    </div>

                    {isExpanded && message.functionArgs && Object.keys(message.functionArgs).length > 0 && (
                        <div className="mt-3 p-3 bg-[var(--background)] rounded-xl border border-[var(--surface-border)]">
                            <div className="text-xs text-[var(--foreground-subtle)] mb-2">Arguments:</div>
                            <pre className="text-xs text-[var(--foreground-secondary)] whitespace-pre-wrap break-words font-mono">
                                {JSON.stringify(message.functionArgs, null, 2)}
                            </pre>
                        </div>
                    )}
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
        <div className="flex justify-start mb-3">
            <div className="flex items-start gap-3 max-w-2xl">
                <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isError ? 'bg-[var(--error-bg)] text-[var(--error)]' : 'bg-[var(--success-bg)] text-[var(--success)]'}`}>
                        {isError ? <AlertIcon /> : <CheckIcon />}
                    </div>
                </div>
                <div className={`rounded-2xl rounded-tl-md px-4 py-3 border flex-1 ${isError ? 'bg-[var(--error-bg)] border-[var(--error)]/20' : 'bg-[var(--success-bg)] border-[var(--success)]/20'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${isError ? 'text-[var(--error)]' : 'text-[var(--success)]'}`}>
                                {message.functionName || 'Response'}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={`${isError ? 'text-[var(--error)]' : 'text-[var(--success)]'} hover:opacity-80 transition-opacity`}
                        >
                            <ChevronIcon isOpen={isExpanded} />
                        </button>
                    </div>

                    {isExpanded && message.functionResponse && (
                        <div className="mt-3 p-3 bg-[var(--background)] rounded-xl border border-[var(--surface-border)]">
                            <div className="text-xs text-[var(--foreground-subtle)] mb-2">Response:</div>
                            <pre className="text-xs text-[var(--foreground-secondary)] whitespace-pre-wrap break-words font-mono">
                                {JSON.stringify(message.functionResponse, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Custom Thought Process Component
export const CustomThoughtProcess: React.FC<{ message: ProcessedMessage }> = ({ message }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="flex justify-start mb-3">
            <div className="flex items-start gap-3 max-w-2xl">
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-[var(--warning-bg)] rounded-xl flex items-center justify-center text-[var(--warning)]">
                        <ThinkingIcon />
                    </div>
                </div>
                <div className="bg-[var(--warning-bg)] rounded-2xl rounded-tl-md px-4 py-3 border border-[var(--warning)]/20 flex-1">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[var(--warning)]">Thinking</span>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-[var(--warning)] hover:opacity-80 transition-opacity"
                        >
                            <ChevronIcon isOpen={isExpanded} />
                        </button>
                    </div>

                    {isExpanded && message.text && (
                        <div className="mt-3 p-3 bg-[var(--background)] rounded-xl border border-[var(--surface-border)]">
                            <div className="text-sm text-[var(--foreground-secondary)]">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
    <div className="inline-flex items-center px-2.5 py-1.5 bg-[var(--surface)] rounded-lg text-xs text-[var(--foreground-muted)] border border-[var(--surface-border)] mt-2">
        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a4 4 0 00-5.656-5.656L5.757 10.758a6 6 0 108.486 8.486L20.5 13" />
        </svg>
        {name || type || 'File'}
    </div>
);

// Custom Source Component
export const CustomMessageSource: React.FC<{ title?: string; url?: string; image?: string }> = ({ title, url, image }) => (
    <div
        className="inline-flex items-center px-3 py-2 bg-[var(--info-bg)] rounded-xl text-xs text-[var(--info)] border border-[var(--info)]/20 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => url && window.open(url, '_blank')}
    >
        {image && <img src={image} alt={title || 'Source'} className="w-4 h-4 rounded mr-2" />}
        <span>{title || url || 'Source'}</span>
    </div>
);

// Main Message Renderer
export const MessageRenderer: React.FC<{ message: ProcessedMessage }> = ({ message }) => {
    switch (message.type) {
        case 'user':
            return <CustomMessageQuestion question={message.text || ''} />;
        case 'assistant':
            return <CustomMessageResponse response={message.text || ''} />;
        case 'function_call':
            return <CustomFunctionCall message={message} />;
        case 'function_response':
            return <CustomFunctionResponse message={message} />;
        case 'thought':
            return <CustomThoughtProcess message={message} />;
        default:
            return <CustomMessageResponse response={message.text || ''} />;
    }
};

// Streaming Indicator
export const StreamingIndicator: React.FC = () => (
    <div className="flex justify-start mb-4">
        <div className="flex items-start gap-3 max-w-2xl">
            <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-[var(--surface-hover)] rounded-xl flex items-center justify-center text-[var(--brand-primary)]">
                    <BotIcon />
                </div>
            </div>
            <div className="bg-[var(--surface)] rounded-2xl rounded-tl-md px-4 py-3 border border-[var(--surface-border)]">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-[var(--brand-primary)] rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm text-[var(--foreground-muted)]">Thinking...</span>
                </div>
            </div>
        </div>
    </div>
);

// Session Refetching Indicator
export const SessionRefetchingIndicator: React.FC = () => (
    <div className="flex justify-start mb-4">
        <div className="flex items-start gap-3 max-w-2xl">
            <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-[var(--surface-hover)] rounded-xl flex items-center justify-center text-[var(--brand-primary)]">
                    <BotIcon />
                </div>
            </div>
            <div className="bg-[var(--surface)] rounded-2xl rounded-tl-md px-4 py-3 border border-[var(--surface-border)]">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[var(--surface-border)] border-t-[var(--brand-primary)] rounded-full animate-spin" />
                    <span className="text-sm text-[var(--foreground-muted)]">Updating...</span>
                </div>
            </div>
        </div>
    </div>
);

// Message Skeleton
export const MessageSkeleton: React.FC = () => (
    <div className="flex justify-start mb-4">
        <div className="flex items-start gap-3 max-w-2xl">
            <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-[var(--surface)] rounded-xl animate-pulse" />
            </div>
            <div className="bg-[var(--surface)] rounded-2xl rounded-tl-md px-4 py-3 border border-[var(--surface-border)] flex-1">
                <div className="space-y-2">
                    <div className="h-4 bg-[var(--surface-hover)] rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-[var(--surface-hover)] rounded animate-pulse w-1/2" />
                </div>
            </div>
        </div>
    </div>
);

// Process Group Component
export const ProcessGroup: React.FC<{ messages: ProcessedMessage[] }> = ({ messages }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const processMessages = messages.filter(msg =>
        msg.type === 'function_call' || msg.type === 'function_response'
    );

    if (processMessages.length === 0) return null;

    const functionCalls = processMessages.filter(msg => msg.type === 'function_call');
    const functionResponses = processMessages.filter(msg => msg.type === 'function_response');
    const isComplete = functionCalls.length > 0 && functionCalls.length === functionResponses.length;

    return (
        <div className="flex justify-start mb-4">
            <div className="flex items-start gap-3 max-w-2xl">
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-[var(--info-bg)] rounded-xl flex items-center justify-center text-[var(--info)]">
                        <CodeIcon />
                    </div>
                </div>
                <div className="bg-[var(--surface)] rounded-2xl rounded-tl-md px-4 py-3 border border-[var(--surface-border)] flex-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-[var(--foreground)]">Process</span>
                            <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                                <span>{functionCalls.length} calls</span>
                                <span>·</span>
                                <span>{functionResponses.length} responses</span>
                                {isComplete && (
                                    <>
                                        <span>·</span>
                                        <span className="text-[var(--success)]">Done</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                        >
                            <ChevronIcon isOpen={isExpanded} />
                        </button>
                    </div>

                    {isExpanded && (
                        <div className="mt-3 space-y-2 pl-3 border-l-2 border-[var(--surface-border)]">
                            {processMessages.map((msg, index) => (
                                <div key={`${msg.id}-${index}`}>
                                    {msg.type === 'function_call' && <CustomFunctionCall message={msg} />}
                                    {msg.type === 'function_response' && <CustomFunctionResponse message={msg} />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Group consecutive function calls and responses
export const groupProcessMessages = (messages: ProcessedMessage[]): (ProcessedMessage | ProcessedMessage[])[] => {
    const result: (ProcessedMessage | ProcessedMessage[])[] = [];
    let currentGroup: ProcessedMessage[] = [];

    for (const message of messages) {
        if (message.type === 'function_call' || message.type === 'function_response') {
            currentGroup.push(message);
        } else {
            if (currentGroup.length > 0) {
                result.push(currentGroup);
                currentGroup = [];
            }
            result.push(message);
        }
    }

    if (currentGroup.length > 0) {
        result.push(currentGroup);
    }

    return result;
};

// Grouped Message Renderer
export const GroupedMessageRenderer: React.FC<{ messages: ProcessedMessage[] }> = ({ messages }) => {
    const groupedMessages = groupProcessMessages(messages);

    return (
        <>
            {groupedMessages.map((item, index) => {
                if (Array.isArray(item)) {
                    return <ProcessGroup key={`process-${index}`} messages={item} />;
                }
                return <MessageRenderer key={`message-${item.id}-${index}`} message={item} />;
            })}
        </>
    );
};
