/**
 * Shared JSON parsing utilities.
 *
 * Extracted from CustomMessages.tsx so that every agent-specific parser
 * can reuse the same robust JSON handling.
 */

/**
 * Sanitize a JSON string that may contain literal newlines, tabs, or other
 * control characters inside string values (common when backends don't properly
 * escape output). This replaces unescaped control characters inside JSON
 * string values with their escape sequences.
 */
export const sanitizeJsonString = (raw: string): string => {
  let result = '';
  let inString = false;
  let escaped = false;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];

    if (escaped) {
      result += ch;
      escaped = false;
      continue;
    }

    if (ch === '\\' && inString) {
      result += ch;
      escaped = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      result += ch;
      continue;
    }

    if (inString) {
      // Replace literal control characters with their escape sequences
      if (ch === '\n') { result += '\\n'; continue; }
      if (ch === '\r') { result += '\\r'; continue; }
      if (ch === '\t') { result += '\\t'; continue; }
    }

    result += ch;
  }

  return result;
};

/**
 * Attempt to JSON.parse with fallback sanitization for malformed JSON.
 */
export const robustJsonParse = (text: string): any | null => {
  // 1. Try direct parse
  try {
    return JSON.parse(text);
  } catch {
    // fall through
  }

  // 2. Try after sanitizing control characters
  try {
    return JSON.parse(sanitizeJsonString(text));
  } catch {
    // fall through
  }

  return null;
};

/**
 * Extract the outermost JSON object/array from a raw string that may
 * contain surrounding markdown, prose, or code fences.
 *
 * Returns the parsed value or `null`.
 */
export const extractJson = (text: string): any | null => {
  if (!text) return null;

  let jsonStr = text.trim();

  // Strip markdown code fences (```json ... ```)
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  }

  // Try direct parse
  const direct = robustJsonParse(jsonStr);
  if (direct && typeof direct === 'object') return direct;

  // Try extracting the first { … } block
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = text.substring(firstBrace, lastBrace + 1);
    const extracted = robustJsonParse(candidate);
    if (extracted && typeof extracted === 'object') return extracted;
  }

  return null;
};
