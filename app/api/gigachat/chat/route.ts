import { NextResponse } from 'next/server';
import path from 'path';

// Установка сертификатов НУЦ Минцифры
process.env.NODE_EXTRA_CA_CERTS = path.resolve(process.cwd(), 'certs', 'minsvyaz.crt');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function POST(request: Request) {
  try {
    const { token, messages, model = 'GigaChat', profanity_check = true } = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Токен доступа не предоставлен' }, { status: 400 });
    }
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Сообщения отсутствуют или имеют неверный формат' }, { status: 400 });
    }
    
    console.log('Отправка запроса в GigaChat API:', { 
      model, 
      messagesCount: messages.length,
      messageRoles: messages.map(m => m.role)
    });
    
    // Формируем тело запроса
    const requestBody = {
      model,
      messages,
      temperature: 0.7,
      top_p: 0.5,
      n: 1,
      stream: false,
      max_tokens: 1024,
      profanity_check
    };
    
    // Для отладки выводим JSON запроса
    console.log('Полный JSON запроса:', JSON.stringify(requestBody, null, 2));
    
    // Отправляем запрос в GigaChat API
    const response = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ошибка API GigaChat:', response.status, errorText);
      return NextResponse.json({ 
        error: `Ошибка API GigaChat: ${response.status}`,
        details: errorText
      }, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    return NextResponse.json({ 
      error: `Внутренняя ошибка сервера: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}` 
    }, { status: 500 });
  }
} 