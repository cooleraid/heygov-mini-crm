const Anthropic = require('@anthropic-ai/sdk');
const { ANTHROPIC_API_KEY } = require('../config/env');

const createMessages = async (payload) => {
    const anthropic = new Anthropic({
        apiKey: ANTHROPIC_API_KEY,
    });
    const params = {
        max_tokens: 1024,
        messages: payload.messages,
        system: payload.system,
        model: 'claude-3-opus-20240229',
    };
    const result = await anthropic.messages.create(params);
    return result?.content[0]?.text || '';
};
module.exports = { createMessages }