export class GeminiAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  }

  async generateContent(prompt) {
    if (!this.apiKey) {
      throw new Error('Gemini API key is required');
    }

    const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  async summarizeAnnouncement(text) {
    const prompt = `Summarize the following class announcement into 2-3 concise bullet points. Ignore greetings and sign-offs. Output ONLY the bullet points, starting each with a hyphen.

Announcement:
${text}`;
    const result = await this.generateContent(prompt);
    // Parse bullet points
    return result.split('\n')
      .map(line => line.replace(/^-\s*/, '').trim())
      .filter(line => line.length > 0);
  }
}

// Global instance getter
let _geminiApiInstance = null;

export const initGeminiAPI = (apiKey) => {
  _geminiApiInstance = new GeminiAPI(apiKey);
  return _geminiApiInstance;
};

export const getGeminiAPI = () => {
  if (!_geminiApiInstance) {
    const apiKey = localStorage.getItem('aiApiKey');
    if (apiKey) {
      return initGeminiAPI(apiKey);
    }
    throw new Error("Gemini API not initialized. Please configure settings.");
  }
  return _geminiApiInstance;
};
