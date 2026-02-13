/**
 * Dedicated parser for Trader Agent responses.
 *
 * Handles markdown-wrapped JSON, malformed control characters, and
 * validates the parsed object against the TraderAgentResponse schema
 * via the `isTraderAgentResponse` type guard.
 */

import { extractJson } from './json-utils';
import {
  TraderAgentResponse,
  isTraderAgentResponse,
} from '@/types/trader-agent';

/**
 * Attempt to parse a raw text string (potentially wrapped in markdown
 * code fences or mixed with prose) into a `TraderAgentResponse`.
 *
 * @param text  Raw string from the LLM / backend.
 * @returns     A validated `TraderAgentResponse` or `null` if parsing fails.
 */
export const parseTraderAgentResponse = (
  text: string,
): TraderAgentResponse | null => {
  if (!text) return null;

  const parsed = extractJson(text);

  if (parsed && isTraderAgentResponse(parsed)) {
    return parsed as TraderAgentResponse;
  }

  // Debug: log when text looks like it might be a Trader Agent response
  // but failed validation.
  if (
    text.includes('"status"') &&
    text.includes('"message"') &&
    !text.includes('"action"')
  ) {
    console.warn(
      '[TraderAgent] Text looks like TraderAgent JSON but failed to parse:',
      text.substring(0, 200),
    );
  }

  return null;
};
