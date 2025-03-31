require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
// Use PORT from environment or default to 9999 to match Render.io's default
const port = process.env.PORT || 9999;

// Middleware
app.use(cors());
app.use(express.json());

// Get the absolute path to the frontend build directory
const frontendBuildPath = path.join(__dirname, '../../frontend/build');

// Serve static files from the frontend build directory
app.use(express.static(frontendBuildPath));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', port: port });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { question } = req.body;
    const apiKey = req.headers.authorization?.split(' ')[1];

    if (!apiKey) {
      return res.status(401).json({ error: 'OpenAI API key is required' });
    }

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Initialize OpenAI with the API key from the request
    const openai = new OpenAI({
      apiKey: apiKey
    });

    // Test the API key with a simple request
    try {
      await openai.models.list();
    } catch (error) {
      console.error('API Key validation failed:', error);
      return res.status(401).json({ error: 'Invalid OpenAI API key' });
    }

    // Make the chat completion request
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a software developer candidate with 5 years of experience in full-stack development. 
          You have expertise in:
          - Frontend: React, Angular, Vue.js
          - Backend: Node.js, Python, Java
          - Databases: MongoDB, PostgreSQL, MySQL
          - Cloud: AWS, Azure, GCP
          - DevOps: Docker, Kubernetes, CI/CD
          - Other: Git, Agile, Microservices
          
          Respond to interview questions as if you are this candidate. Be professional but conversational. 
          Share specific examples from your experience. Keep responses concise but detailed enough to demonstrate expertise.
          If asked about something you don't know, be honest about it and explain what you would do to learn it.`
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    res.json({ answer: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    
    // Handle specific OpenAI API errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          res.status(401).json({ error: 'Invalid OpenAI API key' });
          break;
        case 429:
          res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
          break;
        case 404:
          res.status(404).json({ error: 'Model not found' });
          break;
        default:
          res.status(400).json({ error: 'Error processing your request' });
      }
    } else if (error.request) {
      res.status(503).json({ error: 'Service unavailable. Please try again later.' });
    } else {
      res.status(500).json({ 
        error: 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
});

// Handle all other routes by serving the frontend app
app.get('*', (req, res) => {
  try {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  } catch (error) {
    console.error('Error serving frontend:', error);
    res.status(500).json({ error: 'Error serving frontend application' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'An unexpected error occurred',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

let server;

const startServer = () => {
  server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Frontend build path: ${frontendBuildPath}`);
  });

  // Handle server errors
  server.on('error', (error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
};

// Handle process termination
const gracefulShutdown = () => {
  console.log('Received shutdown signal. Starting graceful shutdown...');
  
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

// Handle different termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start the server
startServer(); 