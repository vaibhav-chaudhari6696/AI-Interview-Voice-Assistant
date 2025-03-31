require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 9999;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { question } = req.body;
    const apiKey = req.headers.authorization?.split(' ')[1];

    if (!apiKey) {
      return res.status(401).json({ error: 'API key is required' });
    }

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Initialize OpenAI with the key from the request
    const openai = new OpenAI({
      apiKey: apiKey
    });

    // Test the API key with a simple request
    try {
      await openai.models.list();
    } catch (error) {
      if (error.response?.status === 401) {
        return res.status(401).json({ 
          error: 'Invalid API key',
          message: 'The provided API key is incorrect or invalid. Please check your API key and try again.',
          help: 'You can find your API key at https://platform.openai.com/account/api-keys'
        });
      }
      if (error.response?.status === 429) {
        return res.status(429).json({ 
          error: 'Rate limit exceeded',
          message: 'You have reached the rate limit for your API key. Please wait a few minutes before trying again.',
          help: 'Consider upgrading your plan or waiting before making more requests.'
        });
      }
      throw error;
    }

    // Get response from OpenAI with a system prompt that makes it respond as the candidate
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI representing a software engineer candidate with the following background:

Professional Background:
- AWS Certified Software Engineer with expertise in AI/ML, multi-agent systems, and database optimization
- Currently working at an AI startup as a Software Engineer
- Previously worked at a tech company
- B.Tech in Information Technology from an engineering college with good academic performance

Key Skills:
- Python, C++, Linux, SQL, Django, PostgreSQL
- LangChain, AWS, REST APIs, NLP, DSA, Git
- Docker, LangGraph, Serverless, Shell Scripting, FastAPI

Personal Background:
- Born and brought up in a tier 3 city
- Secured admission to a top engineering college
- Got placed directly from college
- Food enthusiast
- Love playing cricket and ground games
- Music lover

Recent Achievements:
- Developed Multi-Agent Systems using Python, FastAPI, LangGraph, and OpenAI
- Built Lead Scoring Agent with NLP and Vector Databases
- Created Case Study Writer with human-in-the-loop approach
- Developed VideoSense Agent for video content retrieval
- Built AI-powered assistant for call center agents
- Optimized database architecture improving query performance by 60%
- Published researcher in IET and IEEE
- Recognized as top-performing contributor at an International Conference
- AWS Certified Developer - Associate

IMPORTANT INSTRUCTIONS:
1. Respond as if you are the candidate described above. Never use phrases like "I can assist you with interview preparation" or "I can help you with".
2. Use specific details from the provided background in your responses.
3. Keep responses concise and focused on your actual experiences.
4. If asked about something not in your background, say "I don't have experience with that specific area" rather than making up generic responses.
5. Always maintain a professional yet personal tone.
6. Never use placeholder text or generic descriptions.
7. If asked about personal interests, mention your actual interests: cricket, ground games, music, and food.
8. When discussing technical skills, focus on the specific technologies listed in your background.
9. For achievements, always reference the actual projects and accomplishments listed above.
10. Never mention specific company names, college names, or city names. Use generic terms like "AI startup", "tech company", "engineering college", "tier 3 city".`
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error('Error:', error);
    
    // Handle specific OpenAI API errors
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid API key',
        message: 'The provided API key is incorrect or invalid. Please check your API key and try again.',
        help: 'You can find your API key at https://platform.openai.com/account/api-keys'
      });
    }
    if (error.response?.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded',
        message: 'You have reached the rate limit for your API key. Please wait a few minutes before trying again.',
        help: 'Consider upgrading your plan or waiting before making more requests.'
      });
    }
    if (error.response?.status === 404) {
      return res.status(404).json({ 
        error: 'Model not found',
        message: 'The specified model is not available. Please check your configuration.',
        help: 'Make sure you have access to the model or try using a different model.'
      });
    }
    if (error.response?.status === 400) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'The request was invalid. Please check your input and try again.',
        help: 'Review the API documentation for valid request formats.'
      });
    }

    // Handle network errors
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'Service unavailable',
        message: 'The OpenAI service is temporarily unavailable. Please try again later.',
        help: 'Check your internet connection or try again in a few minutes.'
      });
    }

    // Handle other errors
    res.status(500).json({ 
      error: 'Unexpected error',
      message: 'An unexpected error occurred. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'An unexpected error occurred. Please try again later.',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 