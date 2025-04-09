"use client";

import React, { useState, useEffect } from 'react';

interface Message {
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
  created_at?: number;
  attachments?: any[];
}

export default function Cheburator() {
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [message, setMessage] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('chatMessages');
      if (savedMessages) {
        return JSON.parse(savedMessages);
      }
    }
    return [{
      content: 'Привет! Чем я могу вам помочь?',
      role: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const handleToggleDialog = () => {
    if (isDialogOpened) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsDialogOpened(false);
        setIsAnimating(false);
      }, 300);
    } else {
      setIsAnimating(true);
      setTimeout(() => {
        setIsDialogOpened(true);
        setTimeout(() => {
          setIsAnimating(false);
        }, 50);
      }, 200);
    }
  };

  const getAccessToken = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/gigachat/token');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Ошибка получения токена: ${errorData.error || response.status}`);
      }
      const data = await response.json();
      setAccessToken(data.access_token);
    } catch (error) {
      console.error('Ошибка при получении токена:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessageToGigaChat = async (userMessage: string) => {
    try {
      setIsLoading(true);
      const messageHistory = messages.map(msg => {
        const created_at = Math.floor(new Date(
          msg.created_at || Date.now()
        ).getTime() / 1000);
        return {
          role: msg.role,
          content: msg.content,
          created_at,
          attachments: []
        };
      });

      const current_timestamp = Math.floor(Date.now() / 1000);
      messageHistory.push({
        role: 'user',
        content: userMessage,
        created_at: current_timestamp,
        attachments: []
      });

      const finalMessages = [
        {
          role: 'system',
          content: 'Тебя зовут Чебуратор и никак иначе. При вопросах от твоем имени, отвечай что ты Чебуратор. Ты создан для помощи пользователям сервиса по организации рабочего процесса. В этом сервисе можно создавать карточки с дедлайнами и информацией о задаче.\n'
        },
        ...messageHistory
      ];

      const response = await fetch('/api/gigachat/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: accessToken,
          messages: finalMessages,
          model: 'GigaChat',
          profanity_check: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Ошибка при отправке сообщения: ${errorData.error || response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0]?.message;
      const assistantResponse = assistantMessage?.content || 'Извините, я не смог сгенерировать ответ';

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const created_at = Math.floor(Date.now() / 1000);

      setMessages(prev => [...prev, {
        content: assistantResponse,
        role: 'assistant',
        timestamp,
        created_at,
        attachments: []
      }]);

    } catch (error) {
      console.error('Ошибка при общении с GigaChat API:', error);
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const created_at = Math.floor(Date.now() / 1000);

      setMessages(prev => [...prev, {
        content: `Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
        role: 'assistant',
        timestamp,
        created_at,
        attachments: []
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAccessToken();
    const tokenRefreshInterval = setInterval(() => {
      getAccessToken();
    }, 25 * 60 * 1000);
    return () => clearInterval(tokenRefreshInterval);
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    if (!accessToken) {
      console.warn('Токен доступа отсутствует. Повторное получение...');
      await getAccessToken();
      if (!accessToken) {
        setMessages(prev => [...prev, {
          content: 'Ошибка: не удалось получить токен доступа',
          role: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        return;
      }
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = {
      content: message,
      role: 'user' as const,
      timestamp,
      created_at: Math.floor(Date.now() / 1000),
      attachments: []
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    await sendMessageToGigaChat(message);
  };

  return (
    <div className="relative min-h-screen">
      {isDialogOpened && (
        <div
          className={`fixed left-2.5 bottom-5 w-[36.5vh] h-[90vh] rounded-lg bg-gray-500/70 flex flex-col box-border z-[1000] ${
            isAnimating ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'
          } transition-all duration-300 ease-in-out`}
        >
          <div className="relative p-2.5 flex justify-between items-center">
            <div className="flex flex-row">
              <h1 className="text-[5vh] m-0">Чебуратор</h1>
              <img
                src="/chepukh.png"
                alt="cheburashka-icon"
                className="w-[60px] h-[60px]"
              />
            </div>
            <button
              className="absolute top-[10px] right-[10px] px-[5px] py-[7px]"
              onClick={handleToggleDialog}
            >
              <img src="/addition.png" alt="icon" className="w-8 h-8 rotate-45"/>
            </button>
          </div>

          <div className="flex-1 p-2.5 overflow-y-auto bg-gray-800/70 box-border">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[85%] mt-2 ${
                  msg.role === 'user'
                    ? 'bg-blue-100 dark:bg-blue-900 ml-auto'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                <p className="text-md text-white">{msg.content}</p>
                <span className="text-sm text-gray-400 block mt-1">{msg.timestamp}</span>
              </div>
            ))}
          </div>

          <div className="p-2.5 flex items-center border-t border-white/20">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Введите сообщение..."
              disabled={isLoading}
              className="text-white flex-1 p-2.5 rounded-lg border-none text-base outline-none"
            />
            <button
              className="ml-2.5 p-2.5 rounded-lg bg-white text-base cursor-pointer"
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {!isDialogOpened && (
        <img
          src="/chepukh.png"
          alt="open-icon"
          className={`fixed bottom-5 left-5 w-[150px] h-[150px] cursor-pointer z-[999] ${
            isAnimating ? 'opacity-0 scale-80' : 'opacity-100 scale-100'
          } transition-all duration-300 ease-in-out`}
          onClick={handleToggleDialog}
        />
      )}
    </div>
  );
}