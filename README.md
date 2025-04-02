# AI Interview Voice Assistant

Meet your AI candidate! This is a voice-enabled AI that acts as a software developer candidate with 5 years of experience in full-stack development. You can interview it just like you would interview a real candidate, asking technical questions, discussing projects, and evaluating their responses. The AI responds naturally through voice, making the interview experience feel authentic.

## 🌟 Key Features

- **Realistic Candidate Voice**: Natural voice responses that sound like a real software developer
- **Detailed Background**: 5 years of experience in full-stack development, ready to discuss projects and technical challenges
- **Natural Interaction**: Speak naturally and get voice responses
- **Easy to Use**: Simple interface with voice and text options
- **Secure**: Your API key is stored locally and never shared

## 🎯 How It Works

### Core Technology Flow
1. **Your Questions** → Speak your interview questions using Web Speech API
2. **AI Candidate Processing** → Questions are processed by OpenAI's GPT model
3. **Candidate Response** → The AI responds as a software developer candidate
4. **Voice Response** → The candidate's response is spoken back to you

### Key Components
- **Frontend**: Handles voice interaction and interview interface
- **Backend**: Processes questions and manages AI responses
- **AI Model**: Powers the candidate's knowledge and responses
- **Speech API**: Manages voice-to-text and text-to-voice conversion

## 📊 Real-World Testing Results

### Voice Interaction Experience
1. **Browser Compatibility**
   - Chrome works best for voice recognition
   - Safari needs some tweaks for optimal performance
   - Firefox has some limitations with continuous speech

2. **Voice Recognition Quality**
   - Works great in quiet environments
   - Handles technical terms surprisingly well
   - Sometimes needs clarification for complex questions

3. **Response Quality**
   - Technical questions get detailed, code-focused answers
   - System design questions include real-world examples
   - Behavioral questions show consistent personality

### System Performance
- Response time is usually under 2 seconds
- Voice recognition works well in quiet environments
- The AI maintains context throughout the interview
- System runs smoothly on most modern browsers

## 🛠️ Technical Implementation

### Design Choices
1. **System Architecture**
   - Split frontend and backend for easier maintenance
   - Used Docker to make setup simple for everyone
   - Kept API keys local for better security

2. **Tech Stack**
   - React for the clean, responsive interface
   - Node.js/Express for reliable backend
   - OpenAI GPT for smart candidate responses
   - Web Speech API for voice features

3. **Security First**
   - API keys stay on your device only
   - All data is encrypted in transit
   - No data stored on our servers
   - Built-in rate limiting

### Feature Implementation
1. **Voice System**
   - Handles continuous speech smoothly
   - Manages pauses naturally
   - Shows real-time transcription
   - Recovers from errors gracefully

2. **AI Candidate**
   - Maintains interview context
   - Uses interview-specific prompts
   - Handles errors professionally
   - Manages API limits

3. **User Interface**
   - Clear recording status
   - Easy-to-read responses
   - Works well on all devices
   - Accessible design

## 🚀 Quick Start Guide

### Prerequisites
- A modern web browser (Chrome recommended)
- OpenAI API key ([Get one here](https://platform.openai.com/account/api-keys))
- Docker installed on your computer

### Simple Setup Steps

1. **Clone the Repository**
```bash
git clone https://github.com/vaibhav-chaudhari6696/AI-Interview-Voice-Assistant.git
cd AI-Interview-Voice-Assistant.git
```

2. **Set Up Environment**
```bash
# Copy the example environment file
cp .env.example .env
```

3. **Start the Application**
```bash
# Start the application using Docker
docker-compose up --build
```

4. **Access the Application**
- Open your browser and go to: http://localhost:3000
- Enter your OpenAI API key when prompted
- Click "Start Speaking" to begin your interview

## 💡 How to Use

1. **Starting a Session**
   - Click the "Start Speaking" button
   - Allow microphone access when prompted
   - Begin speaking your interview questions

2. **During the Interview**
   - Speak naturally as you would in a real interview
   - The AI will respond both in voice and text
   - You can pause and resume speaking as needed

3. **Ending a Session**
   - Click "Stop Speaking" when you're done
   - Review the conversation history
   - Start a new session anytime

## 🔒 Security & Privacy

- Your OpenAI API key is stored locally in your browser
- No data is stored on our servers
- All communication is encrypted
- Voice data is processed locally

## 🛠️ Technical Details

### Frontend
- React.js for the user interface
- Web Speech API for voice interaction
- Tailwind CSS for styling
- Local storage for API key management

### Backend
- Node.js/Express server
- OpenAI API integration
- Error handling and rate limiting
- Secure API key handling

### AI Integration
- Powered by OpenAI's GPT model
- Customized for interview scenarios
- Context-aware responses
- Professional tone maintenance