'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Settings, Key, Trash2, X } from 'lucide-react';

// Import Google GenAI SDK
// npm install @google/generative-ai
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatProps {
  placeholder?: string;
  className?: string;
  onApiKeyChange?: (apiKey: string) => void;
  isFloating?: boolean;
}

const AIChat: React.FC<AIChatProps> = ({ 
  placeholder = 'Nhập tin nhắn của bạn...',
  className = '',
  onApiKeyChange,
  isFloating = false
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const envApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [apiKey, setApiKey] = useState(envApiKey);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(!envApiKey);
  const [tempApiKey, setTempApiKey] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);

  // Initialize Google AI với SDK
  const getGoogleAI = () => {
    if (!apiKey) return null;
    return new GoogleGenerativeAI(apiKey);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!showSettings && editableRef.current && (isFloating ? isChatOpen : true)) {
      const timer = setTimeout(() => {
        focusEditable();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showSettings, isChatOpen, isFloating]);

  // Sử dụng SDK với gemini-2.5-flash
  const callGeminiAPI = async (prompt: string): Promise<string> => {
    const genAI = getGoogleAI();
    if (!genAI) {
      throw new Error('API Key chưa được cấu hình');
    }

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash"
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      if (error instanceof Error && error.message.includes('API_KEY')) {
        throw new Error('API key không hợp lệ hoặc đã hết quota. Vui lòng kiểm tra lại.');
      }
      
      throw new Error(`Lỗi: ${error instanceof Error ? error.message : 'Có lỗi xảy ra khi gọi API'}`);
    }
  };

  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;
    
    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: trimmedInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await callGeminiAPI(trimmedInput);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Lỗi: ${error instanceof Error ? error.message : 'Có lỗi xảy ra khi gọi API'}`,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditableInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = (e.target as HTMLDivElement).textContent || '';
    setInputValue(content);
  };

  const handleEditableKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
    
    // Cho phép xuống dòng với Shift+Enter
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      if (range) {
        const br = document.createElement('br');
        range.deleteContents();
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  };

  const handleEditablePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Trigger input event
    const event = new Event('input', { bubbles: true });
    editableRef.current?.dispatchEvent(event);
  };

  const focusEditable = () => {
    if (editableRef.current) {
      editableRef.current.focus();
      
      // Move cursor to end
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(editableRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  const handleSaveApiKey = () => {
    setApiKey(tempApiKey);
    setShowSettings(false);
    onApiKeyChange?.(tempApiKey);
    
    if (tempApiKey && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: 'Xin chào! Tôi là AI Assistant được hỗ trợ bởi Gemini. Tôi có thể giúp gì cho bạn hôm nay?',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
    
    // Focus vào editable sau khi lưu API key
    setTimeout(focusEditable, 100);
  };

  const clearChat = () => {
    setMessages([]);
    setInputValue('');
    if (editableRef.current) {
      editableRef.current.textContent = '';
    }
    focusEditable();
  };

  // Floating chat bubble
  if (isFloating && !isChatOpen) {
    return (
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full w-16 h-16 shadow-2xl hover:shadow-gray-500/25 transition-all duration-300 transform hover:scale-110 flex items-center justify-center z-50 border-2 border-gray-700"
        aria-label="Open AI Chat"
      >
        <Bot className="w-8 h-8 text-emerald-400" />
      </button>
    );
  }

  // Settings panel
  if (showSettings) {
    return (
      <div className={`flex flex-col h-[500px] max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-gray-700 ${className} ${isFloating ? 'fixed bottom-6 right-6 z-40' : ''}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-400/30">
              <Settings className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Cấu hình API</h2>
          </div>
          <div className="flex items-center space-x-2">
            {apiKey && (
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-300 hover:text-white px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium border border-gray-600"
              >
                ← Quay lại chat
              </button>
            )}
            {isFloating && (
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-400/30">
                <Key className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                API Key Required
              </h3>
              <p className="text-gray-900 text-sm leading-relaxed">
                {envApiKey ? 
                  'API key từ environment đã được phát hiện nhưng có vấn đề. Vui lòng nhập API key khác:' 
                  : 'Để sử dụng AI Chat, bạn cần cung cấp API key của Google Gemini'
                }
              </p>
            </div>

            {!envApiKey && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                <p className="text-xs text-gray-900 leading-relaxed">
                  <strong className="text-gray-900">Gợi ý:</strong> Bạn có thể đặt API key trong file .env.local:
                  <br />
                  <code className="bg-black text-gray-900 px-2 py-1 rounded text-xs mt-1 inline-block border border-gray-700">
                    NEXT_PUBLIC_GEMINI_API_KEY=your_key
                  </code>
                  <br />
                  <strong className="text-gray-900 mt-2 block">Cài đặt SDK:</strong>
                  <code className="bg-black text-gray-900 px-2 py-1 rounded text-xs mt-1 inline-block border border-gray-700">
                    npm install @google/generative-ai
                  </code>
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="Nhập API key của bạn..."
                  className="w-full px-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all bg-white text-gray-900 placeholder-gray-400"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              <button
                onClick={handleSaveApiKey}
                disabled={!tempApiKey.trim()}
                className="w-full bg-gradient-to-r from-gray-800 to-gray-800 hover:from-emerald-400 hover:to-emerald-400 disabled:from-gray-100 disabled:to-gray-100 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:cursor-not-allowed transform active:scale-95"
              >
                Lưu và Bắt đầu
              </button>
            </div>

            <div className="text-xs text-gray-900 text-center">
              <p>
                Lấy API key miễn phí tại{' '}
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-500 font-medium hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main chat interface
  return (
    <div className={`flex flex-col h-[500px] max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-gray-700 ${className} ${isFloating ? 'fixed bottom-6 right-6 z-40' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-400/30">
            <Bot className="w-5 h-5 text-emerald-400" />
          </div>
          <h1 className="text-lg font-bold text-white">AI Assistant</h1>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={clearChat}
            className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200 flex items-center space-x-1 border border-gray-600"
            title="Xóa cuộc trò chuyện"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline text-white">Xóa</span>
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors border border-gray-600"
            title="Cài đặt"
          >
            <Settings className="w-4 h-4 text-white" />
          </button>
          {isFloating && (
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-white"
              title="Đóng chat"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-400/30">
              <Bot className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="text-gray-300 font-medium">Chưa có tin nhắn nào</p>
            <p className="text-gray-500 text-sm mt-1">Hãy bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end space-x-2 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'ai' && (
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mb-1 border border-emerald-400/30">
                  <Bot className="w-4 h-4 text-emerald-400" />
                </div>
              )}
              
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-lg ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-gray-800 to-gray-800 text-white rounded-br-sm border border-gray-700'
                    : 'bg-gray-100 text-gray-800 border border-gray-200 rounded-bl-sm'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString('vi-VN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>

              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mb-1 border border-gray-600">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex items-end space-x-2">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-400/30">
              <Bot className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-lg border border-gray-200">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area với Input bình thường */}
      <div className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={placeholder}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all bg-white text-gray-900"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-gray-800 to-gray-800 hover:from-emerald-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 text-white p-3 rounded-xl transition-all duration-200 disabled:cursor-not-allowed transform active:scale-95 shadow-lg hover:shadow-emerald-500/25 flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;