const VALID_TYPES = ['expense', 'mood', 'journal', 'learning'];

export const CLASSIFICATION_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['type', 'title', 'content', 'tags', 'amount'],
  properties: {
    type: {
      type: 'string',
      enum: VALID_TYPES,
    },
    title: {
      type: 'string',
      minLength: 1,
      maxLength: 10,
    },
    content: {
      type: 'string',
      minLength: 1,
    },
    tags: {
      type: 'array',
      items: { type: 'string', minLength: 1 },
      minItems: 1,
    },
    amount: {
      type: ['number', 'null'],
    },
  },
};

/**
 * @typedef {Object} ClassificationResult
 * @property {'expense' | 'mood' | 'journal' | 'learning'} type
 * @property {string} title
 * @property {string} content
 * @property {string[]} tags
 * @property {number | null} amount
 */

/**
 * @param {unknown} data
 * @returns {ClassificationResult}
 */
export function validateClassification(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Classification must be an object');
  }

  const { type, title, content, tags, amount } = data;

  if (!VALID_TYPES.includes(type)) {
    throw new Error(`Invalid type: ${type}`);
  }

  if (typeof title !== 'string' || title.length === 0 || title.length > 10) {
    throw new Error('Title must be a string between 1 and 10 characters');
  }

  if (typeof content !== 'string' || content.length === 0) {
    throw new Error('Content must be a non-empty string');
  }

  if (!Array.isArray(tags) || tags.length === 0 || tags.some((tag) => typeof tag !== 'string' || tag.length === 0)) {
    throw new Error('Tags must be a non-empty array of strings');
  }

  if (type === 'expense') {
    if (typeof amount !== 'number' || Number.isNaN(amount)) {
      throw new Error('Expense entries must include a numeric amount');
    }
  } else if (amount !== null && amount !== undefined) {
    throw new Error('Amount is only allowed for expense entries');
  }

  return {
    type,
    title,
    content,
    tags,
    amount: type === 'expense' ? amount : null,
  };
}
