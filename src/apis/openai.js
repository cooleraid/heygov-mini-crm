const OpenAI = require('openai');
const { OPENAI_API_KEY } = require('../config/env');
const HttpException = require('../exceptions/http.exception');

const createChatCompletion = async (payload) => {
    const openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
    });
    const result = await openai.chat.completions
        .create({
            model: 'gpt-3.5-turbo',
            user: String(payload.client_id),
            messages: payload.messages,
            functions: payload.functions,
            function_call: payload.function_call,
            max_tokens: 500,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        })
        .catch(e => {
            console.log(e);
            throw new HttpException(400, 'An error was encountered');
        });
    return result?.choices[0]?.message || '';
};
module.exports = { createChatCompletion }