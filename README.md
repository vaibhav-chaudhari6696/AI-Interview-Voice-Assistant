# Voice Interview AI 🤖

An innovative AI-powered voice interview simulator where the AI acts as a candidate you can interview. Ask questions verbally, and receive thoughtful responses from our AI candidate with extensive software development experience.

## 🌟 Features

- **Real-time Voice Interaction**: Seamless voice-based communication using Web Speech API
- **AI Candidate Persona**: Interact with an AI that embodies a software developer with 5 years of experience
- **Natural Conversations**: Fluid dialogue with context-aware responses
- **Voice-to-Text & Text-to-Voice**: Real-time transcription and voice synthesis
- **Professional Responses**: Technical and behavioral question handling
- **Cross-browser Support**: Works across modern web browsers

## 🛠️ Tech Stack

- **Frontend**:
  - React.js
  - Web Speech API
  - React Icons
  - CSS for modern UI

- **Backend**:
  - Node.js/Express
  - OpenAI API integration
  - WebSocket for real-time communication

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- OpenAI API Key
- Modern web browser with speech recognition support

### Running with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd voice-interview-ai
   ```

2. **Environment Setup**
   ```bash
   # Create a .env file in the root directory
   touch .env
   ```
   Add your OpenAI API key when prompted in the UI

3. **Start the Application**
   ```bash
   docker-compose up --build
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
voice-interview-ai/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── App.js          # Main application component
│   │   ├── App.css         # Styles
│   │   └── components/     # React components
│   └── package.json
├── backend/                 # Node.js backend
│   ├── src/
│   │   └── index.js        # Express server & OpenAI integration
│   └── package.json
├── docker/                  # Docker configuration
│   ├── frontend/
│   │   └── Dockerfile      # Frontend Docker configuration
│   └── backend/
│       └── Dockerfile      # Backend Docker configuration
├── .dockerignore           # Docker ignore rules
├── .env.example            # Example environment variables
├── .gitignore              # Git ignore rules
├── docker-compose.yml      # Docker compose configuration
└── README.md              # Project documentation
```

## 🔧 Development Setup

### Frontend (Port 3000)
```bash
cd frontend
npm install
npm start
```

### Backend (Port 9999)
```bash
cd backend
npm install
npm start
```

## 🐳 Docker Configuration

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
RUN npm install react-icons
COPY frontend/ .
EXPOSE 3000
CMD ["npm", "start"]
```

### Backend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
EXPOSE 9999
CMD ["npm", "start"]
```

### Docker Compose
- Manages both frontend and backend services
- Sets up networking between containers
- Mounts volumes for development
- Handles environment variables
- Implements container restart policies

## 🎯 Usage Guide

1. **Starting an Interview**
   - Click the microphone icon to start voice recording
   - Ask your interview question clearly
   - Click again to stop recording

2. **AI Candidate Response**
   - The AI processes your question
   - Responds with relevant technical or behavioral answers
   - Responses are both displayed and spoken

3. **Interview Flow**
   - Ask follow-up questions naturally
   - The AI maintains context of the conversation
   - End the session by closing the browser

## 💡 Key Components

### Frontend Components
- **Voice Recognition**: Handles speech-to-text conversion
- **Chat Interface**: Displays conversation history
- **Audio Output**: Manages text-to-speech synthesis
- **Error Handling**: Manages API and voice recognition errors

### Backend Services
- **Express Server**: Handles HTTP requests
- **OpenAI Integration**: Processes questions and generates responses
- **Error Management**: Comprehensive error handling for API calls

## 🔒 Security

- API keys are handled securely through frontend input
- No sensitive data is stored in the codebase
- Environment variables for configuration
- Secure communication between frontend and backend

## 🐛 Troubleshooting

1. **Voice Recognition Issues**
   - Ensure browser permissions are granted
   - Check microphone connectivity
   - Use Chrome or Edge for best compatibility

2. **Docker Issues**
   - Ensure ports 3000 and 9999 are available
   - Check Docker logs for detailed errors
   - Verify Docker and Docker Compose installation

3. **API Issues**
   - Verify OpenAI API key validity
   - Check network connectivity
   - Review backend logs for error details


## 📝 Code Documentation

### Frontend Code Structure

```javascript
// App.js - Main Application Component
- State management for voice recognition
- WebSocket connection handling
- UI rendering and event handling
- Error management and display

// Components/
- Chat interface components
- Voice control components
- Error display components
- Loading state components
```

### Backend Code Structure

```javascript
// index.js - Main Server File
- Express server configuration
- OpenAI API integration
- Request/Response handling
- Error management
- Environment variable handling
```

### Key Functions

```javascript
// Voice Recognition
startListening() - Initiates voice recording
stopListening() - Ends recording and processes input
handleTranscript() - Processes voice input

// AI Integration
processQuestion() - Sends question to OpenAI
handleResponse() - Processes AI response
synthesizeSpeech() - Converts text to speech

// Error Handling
handleAPIError() - Manages API-related errors
handleVoiceError() - Handles voice recognition issues
```
