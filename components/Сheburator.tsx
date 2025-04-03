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
    // Загружаем сообщения из localStorage при инициализации
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

  // Сохраняем сообщения в localStorage при их изменении
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Обработка анимации открытия/закрытия
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

  // Получаем токен доступа
  const getAccessToken = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/gigachat/token');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Ошибка получения токена: ${errorData.error || response.status}`);
      }

      const data = await response.json();
      console.log('Получен токен доступа:', data);

      setAccessToken(data.access_token);

      const expiresAt = new Date(data.expires_at);
      console.log('Токен действителен до:', expiresAt);

    } catch (error) {
      console.error('Ошибка при получении токена:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessageToGigaChat = async (userMessage: string) => {
    try {
      setIsLoading(true);

      console.log('Отправляем сообщение в API:', {
        message: userMessage,
        timestamp: new Date().toISOString(),
        token: accessToken ? 'Токен присутствует' : 'Токен отсутствует'
      });

      const messageHistory = messages.map(msg => {
        // Конвертируем timestamp в unix timestamp (секунды)
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

      // Формируем финальный массив сообщений + системным промпт
      const finalMessages = [
        {
          role: 'system',
          content: 'Тебя зовут Чебуратор и никак иначе. При вопросах от твоем имени, отвечай что ты Чебуратор. Ты создан для помощи пользователям сервиса по организации рабочего процесса. В этом сервисе можно создавать карточки с дедлайнами и информацией о задаче.\n'
        },
        ...messageHistory
      ];

      console.log('Отправляем историю сообщений:', finalMessages);

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
      console.log('Ответ от GigaChat API:', data);

      const assistantMessage = data.choices[0]?.message;
      const assistantResponse = assistantMessage?.content || 'Извините, я не смог сгенерировать ответ';

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const created_at = Math.floor(Date.now() / 1000); // Unix timestamp в секундах

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
    <div style={{position: 'relative', minHeight: '100vh'}}>
      {isDialogOpened && (
        <div
          style={{
            position: 'fixed',
            left: '10px',
            bottom: '20px',
            width: '36.5vh',
            height: '90vh',
            borderRadius: '10px',
            backgroundColor: 'rgba(126, 126, 126, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            zIndex: 1000,
            opacity: isAnimating ? 0 : 1,
            transform: isAnimating ? 'translateY(20px)' : 'translateY(0)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
        >
          <div
            style={{
              position: 'relative',
              padding: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h1 style={{ fontSize: '5vh', margin: 0 }}>Чебуратор</h1>
            <img
              src="/chepukh.png"
              alt="close-icon"
              style={{ width: '60px', height: '60px', cursor: 'pointer' }}
              onClick={handleToggleDialog}
            />
          </div>

          {/* Окно сообщений */}
          <div
            style={{
              flex: 1,
              padding: '10px',
              overflowY: 'auto',
              backgroundColor: 'rgba(30, 30, 30, 0.7)',
              boxSizing: 'border-box',
            }}
          >
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

          <div
            style={{
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Введите сообщение..."
              disabled={isLoading}
              style={{
                color: 'white',
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '16px',
                outline: 'none',
              }}
            />
            <button
              style={{
                marginLeft: '10px',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: 'white',
                fontSize: '16px',
                cursor: 'pointer',
              }}
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
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            width: '150px',
            height: '150px',
            cursor: 'pointer',
            zIndex: 999,
            opacity: isAnimating ? 0 : 1,
            transform: isAnimating ? 'scale(0.8)' : 'scale(1)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
          onClick={handleToggleDialog}
        />
      )}
    </div>
  );
}
