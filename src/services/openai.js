import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import { getConfig } from '../config.js';
import {
  CLASSIFICATION_JSON_SCHEMA,
  validateClassification,
} from '../lib/classification.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const systemPrompt = fs.readFileSync(
  path.join(__dirname, '../../ai-prompt.md'),
  'utf8'
);

let openai;

function ensureOpenAI() {
  if (!openai) {
    openai = new OpenAI({ apiKey: getConfig().openai.apiKey });
  }
  return openai;
}

/**
 * @typedef {'INVALID_INPUT' | 'API_ERROR' | 'PARSE_ERROR' | 'VALIDATION_ERROR'} ClassificationErrorCode
 */

/**
 * @typedef {Object} ClassificationSuccess
 * @property {true} ok
 * @property {import('../lib/classification.js').ClassificationResult} data
 */

/**
 * @typedef {Object} ClassificationFailure
 * @property {false} ok
 * @property {{ code: ClassificationErrorCode, message: string }} error
 */

/** @typedef {ClassificationSuccess | ClassificationFailure} ClassificationResponse */

function failure(code, message) {
  return { ok: false, error: { code, message } };
}

function parseJsonContent(content) {
  const trimmed = content.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error('Response did not contain JSON');
    }
    return JSON.parse(match[0]);
  }
}

async function requestClassification(text) {
  const config = getConfig();
  const response = await ensureOpenAI().chat.completions.create({
    model: config.openai.model,
    temperature: 0.2,
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'life_classification',
        strict: true,
        schema: CLASSIFICATION_JSON_SCHEMA,
      },
    },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI returned an empty response');
  }

  return content;
}

/**
 * Classify free-text input using ai-prompt.md.
 * Never throws — returns a success/failure result object.
 *
 * @param {string} text
 * @returns {Promise<ClassificationResponse>}
 */
export async function classifyText(text) {
  if (typeof text !== 'string' || text.trim().length === 0) {
    return failure('INVALID_INPUT', 'Input must be a non-empty string');
  }

  const input = text.trim();

  let rawContent;
  try {
    rawContent = await requestClassification(input);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'OpenAI request failed';
    console.error('OpenAI classification error:', error);
    return failure('API_ERROR', message);
  }

  let parsed;
  try {
    parsed = parseJsonContent(rawContent);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to parse JSON response';
    console.error('OpenAI JSON parse error:', { rawContent, error });
    return failure('PARSE_ERROR', message);
  }

  try {
    const data = validateClassification(parsed);
    return { ok: true, data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Invalid classification shape';
    console.error('Classification validation error:', { parsed, error });
    return failure('VALIDATION_ERROR', message);
  }
}

/**
 * @param {string} text
 * @returns {Promise<import('../lib/classification.js').ClassificationResult>}
 */
export async function classifyMessage(text) {
  const result = await classifyText(text);

  if (!result.ok) {
    throw new Error(`Classification failed (${result.error.code}): ${result.error.message}`);
  }

  return result.data;
}
