import axios from 'axios';

class AIDescriptionService {
  constructor() {
    this.groqApiKey = process.env.GROQ_API_KEY;
    this.geminiApiKey = process.env.GEMINI_API_KEY;
  }

  async generateDescription(title, url) {
    try {
      // Try Groq first (faster)
      if (this.groqApiKey) {
        return await this.generateWithGroq(title, url);
      }
      
      // Fallback to Gemini
      if (this.geminiApiKey) {
        return await this.generateWithGemini(title, url);
      }
      
      return this.generateFallbackDescription(title, url);
    } catch (error) {
      console.error('AI Description generation failed:', error);
      return this.generateFallbackDescription(title, url);
    }
  }

  async generateWithGroq(title, url) {
    const prompt = `Generate a concise, engaging description (max 150 characters) for this website:
Title: ${title}
URL: ${url}

Focus on what makes this resource valuable for developers and designers. Be specific and compelling.`;

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'mixtral-8x7b-32768',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${this.groqApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content.trim();
  }

  async generateWithGemini(title, url) {
    const prompt = `Generate a concise, engaging description (max 150 characters) for this website:
Title: ${title}
URL: ${url}

Focus on what makes this resource valuable for developers and designers. Be specific and compelling.`;

    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    });

    return response.data.candidates[0].content.parts[0].text.trim();
  }

  generateFallbackDescription(title, url) {
    const domain = new URL(url).hostname.replace('www.', '');
    const descriptions = [
      `Discover amazing resources and tools at ${title}`,
      `Professional ${title} platform for developers and designers`,
      `Explore ${title} - your go-to resource for creative solutions`,
      `${title} offers cutting-edge tools and inspiration`,
      `Unlock the potential of ${title} for your next project`
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }
}

export default new AIDescriptionService();