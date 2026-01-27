// Configuration file for API keys and settings
// For GitHub Pages deployment, API key can be set via URL parameter or prompt

export const CONFIG = {
    // Groq API Configuration - will be set dynamically
    GROQ_API_KEY: null,
    GROQ_API_URL: "https://api.groq.com/openai/v1/chat/completions",
    GROQ_MODEL: "mixtral-8x7b-32768",
    
    // Default settings
    DEFAULT_TEMPERATURE: 0.7,
    DEFAULT_MAX_TOKENS: 2000,
    
    // Quiz settings
    DEFAULT_QUIZ_QUESTIONS: 5,
    MAX_QUIZ_QUESTIONS: 20
};

// Initialize API key from URL parameter or prompt user
export function initializeApiKey() {
    // Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const apiKeyFromUrl = urlParams.get('api_key');
    
    if (apiKeyFromUrl) {
        CONFIG.GROQ_API_KEY = apiKeyFromUrl;
        console.log('✅ API key loaded from URL parameter');
        return true;
    }
    
    // Check localStorage
    const savedApiKey = localStorage.getItem('groq_api_key');
    if (savedApiKey) {
        CONFIG.GROQ_API_KEY = savedApiKey;
        console.log('✅ API key loaded from localStorage');
        return true;
    }
    
    // Prompt user for API key
    const apiKey = prompt('Enter your Groq API key (get it from https://console.groq.com/):');
    if (apiKey && apiKey.trim()) {
        CONFIG.GROQ_API_KEY = apiKey.trim();
        localStorage.setItem('groq_api_key', apiKey.trim());
        console.log('✅ API key saved');
        return true;
    }
    
    console.warn('⚠️ No API key provided. Using mock data.');
    return false;
}

// Validate configuration
export function validateConfig() {
    if (!CONFIG.GROQ_API_KEY || CONFIG.GROQ_API_KEY === "your-groq-api-key-here") {
        return false;
    }
    return true;
}

// Clear saved API key
export function clearApiKey() {
    CONFIG.GROQ_API_KEY = null;
    localStorage.removeItem('groq_api_key');
    console.log('🗑️ API key cleared');
}