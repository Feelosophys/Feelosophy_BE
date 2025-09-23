// src/utils/geminiUtils.js
const {
    GoogleGenerativeAI
} = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
});

/**
 * Moderate content using Gemini AI
 * @param {string} content - The content to moderate
 * @returns {Promise<{isSafe: boolean, reason?: string}>}
 */
async function moderateContent(content) {
    try {
        const prompt = `
You are a content moderator for a mental health forum. Your task is to determine if the following comment is appropriate for a mental health community.

Guidelines:
- Allow: Supportive comments, questions about mental health, sharing experiences, seeking help
- Block: Hate speech, harassment, self-harm encouragement, discriminatory content, spam, inappropriate language, misinformation that could harm mental health

Comment to evaluate: "${content}"

Respond with ONLY a JSON object in this exact format:
{"isSafe": true/false, "reason": "brief explanation if unsafe"}

Be strict but fair. Focus on protecting vulnerable users in a mental health context.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON response
        const moderationResult = JSON.parse(text.trim());

        return {
            isSafe: moderationResult.isSafe,
            reason: moderationResult.reason || null
        };
    } catch (error) {
        console.error('Gemini API error:', error);
        // Fallback: allow content if API fails (to avoid blocking legitimate content)
        return {
            isSafe: true,
            reason: 'API error - content allowed as fallback'
        };
    }
}

module.exports = {
    moderateContent
};