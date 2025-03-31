import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { FaMicrophone, FaStop, FaRobot, FaUser, FaCog } from 'react-icons/fa';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || '');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const recognition = useRef(null);
  const utteranceRef = useRef(null);
  const [recordingIndicator, setRecordingIndicator] = useState(false);
  const [speakingIndicator, setSpeakingIndicator] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!apiKey) {
      setShowApiKeyModal(true);
    }
  }, [apiKey]);

  useEffect(() => {
    // Initialize speech recognition
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';

      recognition.current.onstart = () => {
        setIsListening(true);
        setRecordingIndicator(true);
      };

      recognition.current.onend = () => {
        setIsListening(false);
        setRecordingIndicator(false);
        if (isListening) {
          recognition.current.start();
        }
      };

      recognition.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
        }
        setTranscript(prev => prev + currentTranscript);
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setRecordingIndicator(false);
      };
    }

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []); // Remove isListening from dependencies

  const toggleListening = () => {
    if (!recognition.current) {
      console.error('Speech recognition not supported');
      return;
    }

    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
      setRecordingIndicator(false);
      if (transcript.trim()) {
        handleSubmit(transcript.trim());
        setTranscript('');
      }
    } else {
      setTranscript('');
      try {
        recognition.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
        setRecordingIndicator(false);
      }
    }
  };

  const handleSubmit = async (text) => {
    if (!text.trim() || !apiKey) return;

    const newMessage = { text, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:9999/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ question: text })
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          setShowApiKeyModal(true);
          setMessages(prev => [...prev, { 
            text: `${data.message}\n\nHelp: ${data.help}`, 
            sender: 'ai',
            isError: true
          }]);
          return;
        }
        if (response.status === 429) {
          setMessages(prev => [...prev, { 
            text: `${data.message}\n\nHelp: ${data.help}`, 
            sender: 'ai',
            isError: true
          }]);
          return;
        }
        const errorMessage = data.message || data.error || 'An unexpected error occurred';
        const helpText = data.help ? `\n\nHelp: ${data.help}` : '';
        setMessages(prev => [...prev, { 
          text: `${errorMessage}${helpText}`, 
          sender: 'ai',
          isError: true
        }]);
        return;
      }

      const aiMessage = { text: data.answer, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
      speak(data.answer);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.message || 'Sorry, there was an error processing your request.';
      setMessages(prev => [...prev, { 
        text: errorMessage, 
        sender: 'ai',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleApiKeySubmit = (e) => {
    e.preventDefault();
    const newApiKey = e.target.apiKey.value;
    localStorage.setItem('apiKey', newApiKey);
    setApiKey(newApiKey);
    setShowApiKeyModal(false);
  };

  const handleApiKeyUpdate = (e) => {
    e.preventDefault();
    const newApiKey = e.target.apiKey.value;
    localStorage.setItem('apiKey', newApiKey);
    setApiKey(newApiKey);
    setShowSettings(false);
  };

  return (
    <div className="app">
      {showApiKeyModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <FaRobot className="modal-icon" />
              <h2>Welcome to AI Interview Assistant</h2>
            </div>
            <div className="modal-content">
              <p>To get started, you'll need to provide your OpenAI API key. This key is required to access the AI's capabilities.</p>
              <p className="note">Note: Your API key is stored securely in your browser and never sent to our servers.</p>
              <form onSubmit={handleApiKeySubmit}>
                <input
                  type="password"
                  name="apiKey"
                  placeholder="Enter your OpenAI API key"
                  required
                />
                <button type="submit">Start Using AI Assistant</button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="sidebar">
        <div className="sidebar-header">
          <FaRobot className="logo" />
          <h1>AI Interview Assistant</h1>
        </div>
        <div className="sidebar-content">
          <button 
            className="settings-button"
            onClick={() => setShowSettings(true)}
          >
            <FaCog /> Settings
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <FaCog className="modal-icon" />
              <h2>Settings</h2>
            </div>
            <div className="modal-content">
              <form onSubmit={handleApiKeyUpdate}>
                <label>OpenAI API Key</label>
                <input
                  type="password"
                  name="apiKey"
                  placeholder="Enter your OpenAI API key"
                  defaultValue={apiKey}
                  required
                />
                <div className="button-group">
                  <button type="submit">Save Changes</button>
                  <button type="button" onClick={() => setShowSettings(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender} ${message.isError ? 'error' : ''}`}>
              <div className="message-icon">
                {message.sender === 'ai' ? <FaRobot /> : <FaUser />}
              </div>
              <div className="message-content">
                <div className="message-sender">{message.sender === 'ai' ? 'AI Assistant' : 'You'}</div>
                <div className="message-text">{message.text}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message ai">
              <div className="message-icon">
                <FaRobot />
              </div>
              <div className="message-content">
                <div className="message-sender">AI Assistant</div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <div className="transcript-container">
            {transcript && (
              <div className="transcript">
                <FaMicrophone className="recording-icon" />
                {transcript}
              </div>
            )}
            {isSpeaking && (
              <div className="transcript speaking">
                <FaRobot className="speaking-icon" />
                AI is speaking...
              </div>
            )}
          </div>
          <div className="input-group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(input)}
              placeholder="Type your message..."
              disabled={isListening || isSpeaking}
            />
            <button
              className={`voice-button ${isListening ? 'recording' : ''}`}
              onClick={toggleListening}
              disabled={isSpeaking}
            >
              {isListening ? <FaStop /> : <FaMicrophone />}
            </button>
            <button
              className="send-button"
              onClick={() => handleSubmit(input)}
              disabled={!input.trim() || isListening || isSpeaking}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 