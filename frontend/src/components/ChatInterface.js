import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { startChatSession, sendChatMessage, createCV } from '../services/api';
import CVSuccessModal from '../components/CvSuccessModal';

// Componenta pentru bula de mesaj
const ChatBubble = ({ message, isUser }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`flex items-start max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-blue-100 ml-2' : 'bg-gray-100 mr-2'
      }`}>
        {isUser ? <User size={20} className="text-blue-600" /> : <Bot size={20} className="text-gray-600" />}
      </div>
      <div className={`p-3 rounded-lg ${
        isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
      }`}>
        {message}
      </div>
    </div>
  </div>
);

// Componenta pentru indicatorul de scriere
const TypingIndicator = () => (
  <div className="flex items-center space-x-2 p-3 max-w-[100px] bg-gray-100 rounded-lg mb-4">
    <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
    <span className="text-sm text-gray-600">Typing...</span>
  </div>
);

// Componenta principală de chat
const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const messagesEndRef = useRef(null);
  const user = useSelector((state) => state.auth.user);
  const [isCreatingCV, setIsCreatingCV] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Inițializare sesiune de chat
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const sessionResponse = await startChatSession(user.token);
        setSessionId(sessionResponse.sessionId);
        
        setMessages([
          { 
            text: "Bună! Sunt asistentul tău virtual pentru crearea CV-ului. Pentru a începe, te rog să-mi spui numele tău complet.", 
            isUser: false 
          }
        ]);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setMessages([{ 
          text: "Ne pare rău, a apărut o eroare la inițializarea chatului. Vă rugăm să încercați din nou.", 
          isUser: false 
        }]);
      }
    };

    if (user?.token) {
      initializeChat();
    }
  }, [user?.token]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !sessionId) return;

    // Adaugă mesajul utilizatorului
    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await sendChatMessage(user.token, sessionId, userMessage);
      
      setIsTyping(false);

      if (response.type === "complete_cv_data") {
        console.log("CV Data completed:", JSON.stringify(response.data));
        
        try {
          // Activăm loading-ul
          setIsCreatingCV(true);
          
          // Adăugăm mesajul de procesare
          setMessages(prev => [...prev, { 
            text: "Perfect! Acum procesez datele și creez CV-ul tău...", 
            isUser: false 
          }]);
          
          // Creem CV-ul cu datele colectate
          const cvResponse = await createCV(user.token, response.data);
          
          // Adăugăm mesajul de succes
          setMessages(prev => [...prev, { 
            text: "Am finalizat crearea CV-ului tău! Poți să-l vezi în profilul tău.", 
            isUser: false 
          }]);
          
          // Dezactivăm loading-ul și arătăm modalul de succes
          setIsCreatingCV(false);
          setShowSuccessModal(true);
        } catch (error) {
          console.error('Error creating CV:', error);
          setIsCreatingCV(false);
          setMessages(prev => [...prev, { 
            text: "A apărut o eroare la crearea CV-ului. Te rog să încerci din nou.", 
            isUser: false 
          }]);
        }
      }
       else {
        // Adăugăm răspunsul botului
        setMessages(prev => [...prev, { 
          text: response.message, 
          isUser: false 
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        text: "Ne pare rău, a apărut o eroare. Vă rugăm să încercați din nou.", 
        isUser: false 
      }]);
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto bg-white rounded-lg shadow-lg relative">
      <div className="p-4 border-b flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <Bot size={24} className="text-blue-600" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">Asistent Generare CV</h2>
          <p className="text-sm text-gray-500">
            {sessionId ? 'Activ' : 'Se conectează...'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatBubble
            key={index}
            message={message.text}
            isUser={message.isUser}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Scrie un mesaj..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!sessionId}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!inputMessage.trim() || !sessionId}
          >
            <Send size={20} />
          </button>
        </div>
      </form>

      {isCreatingCV && (
  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      <p className="text-gray-700 font-medium">Se creează CV-ul tău...</p>
    </div>
  </div>
    )}
      {/* Modal de succes */}
      <CVSuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
      />
    </div>
  );
};

export default ChatInterface;