import { NextResponse } from 'next/server';
import path from 'path';

// Установка сертификатов НУЦ Минцифры
process.env.NODE_EXTRA_CA_CERTS = path.resolve(process.cwd(), 'certs', 'ru.cer');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function GET() {
  try {
    const requestId = generateUUID();
    
    const response = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'RqUID': requestId,
        'Authorization': 'Basic NGY3MGZkMDgtMjZhMS00NTUwLWFmNTYtNTgzMDVhZTJhYmQ2OjM3MDc0MWJhLTYyNTctNGIzNS1hMTFlLTdjOWUxM2Y2YTY1MA==' 
      },
      body: 'scope=GIGACHAT_API_PERS'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ошибка получения токена: ${response.status}, ${errorText}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Ошибка при получении токена:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
} 