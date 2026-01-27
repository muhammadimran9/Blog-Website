// Firebase Quiz Service - Client-side only (No server required)
// Works directly with GitHub Pages + Firebase + Groq AI

import { CONFIG, validateConfig, initializeApiKey } from './config.js';

// Initialize API key when module loads
initializeApiKey();

// Generate quiz questions using Groq AI (client-side)
export async function generateQuizWithGroq(domain, difficulty, numQuestions = 5) {
    try {
        // Check if API key is configured
        if (!validateConfig()) {
            console.log('Using mock questions - API key not configured');
            return getMockQuestions(domain, difficulty).slice(0, numQuestions);
        }

        const prompt = `Generate ${numQuestions} multiple choice quiz questions about "${domain}" at "${difficulty}" difficulty level.
        
Format as JSON array:
[
  {
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Why this is correct"
  }
]

Only output valid JSON, no additional text.`;

        console.log('Groq API Request:', {
            model: CONFIG.GROQ_MODEL,
            domain,
            difficulty,
            apiKeyPresent: !!CONFIG.GROQ_API_KEY
        });

        const response = await fetch(CONFIG.GROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${CONFIG.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: CONFIG.GROQ_MODEL,
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: CONFIG.DEFAULT_TEMPERATURE,
                max_tokens: CONFIG.DEFAULT_MAX_TOKENS
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Groq API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        
        if (!content) {
            throw new Error('No response from Groq API');
        }

        // Parse JSON from response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            console.error('Could not parse JSON from content:', content);
            throw new Error('Could not parse quiz questions from response');
        }

        const questions = JSON.parse(jsonMatch[0]);
        console.log('✅ Successfully generated questions:', questions.length);
        return questions;
    } catch (error) {
        console.error('Groq AI error:', error);
        console.log('🔄 Falling back to mock questions');
        return getMockQuestions(domain, difficulty).slice(0, numQuestions);
    }
}

// Mock questions for fallback (no server needed)
export function getMockQuestions(domain, difficulty) {
    const mockBank = {
        'HTML5': {
            'Beginner': [
                { question: 'What does HTML5 stand for?', options: ['Hyper Text Markup Language 5', 'High Tech Modern Language', 'Home Tool Markup Language', 'None'], correctAnswer: 0, explanation: 'HTML5 is the fifth version of Hyper Text Markup Language.' },
                { question: 'Which tag is used for the largest heading?', options: ['<h6>', '<h1>', '<header>', '<head>'], correctAnswer: 1, explanation: 'The <h1> tag represents the largest heading in HTML.' },
                { question: 'What is the correct HTML5 doctype?', options: ['<!DOCTYPE html>', '<!DOCTYPE HTML5>', '<doctype html>', '<html>'], correctAnswer: 0, explanation: 'HTML5 uses the simple <!DOCTYPE html> declaration.' }
            ],
            'Easy': [
                { question: 'Which HTML5 element is used for navigation?', options: ['<nav>', '<navigation>', '<menu>', '<links>'], correctAnswer: 0, explanation: 'The <nav> element represents navigation links.' },
                { question: 'What is the purpose of <article> element?', options: ['For styling', 'For independent content', 'For images', 'For forms'], correctAnswer: 1, explanation: 'The <article> element represents independent, self-contained content.' }
            ]
        },
        'JavaScript': {
            'Beginner': [
                { question: 'What is JavaScript?', options: ['A programming language', 'A markup language', 'A database', 'An operating system'], correctAnswer: 0, explanation: 'JavaScript is a programming language used for web development.' },
                { question: 'How do you declare a variable in JavaScript?', options: ['var x', 'variable x', 'v x', 'declare x'], correctAnswer: 0, explanation: 'Variables in JavaScript are declared using var, let, or const keywords.' }
            ]
        },
        'CSS': {
            'Beginner': [
                { question: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'], correctAnswer: 0, explanation: 'CSS stands for Cascading Style Sheets.' },
                { question: 'Which property is used to change text color?', options: ['color', 'text-color', 'font-color', 'text-style'], correctAnswer: 0, explanation: 'The color property is used to set the text color.' }
            ]
        }
    };

    const domainQuestions = mockBank[domain] || mockBank['HTML5'];
    const difficultyQuestions = domainQuestions[difficulty] || domainQuestions['Beginner'];
    
    return difficultyQuestions || mockBank['HTML5']['Beginner'];
}