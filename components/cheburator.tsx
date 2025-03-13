import React, { useState } from 'react';

const Cheburator = () => {
  const [isDialogOpened, setIsDialogOpened] = useState(false);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Панель чата */}
      {isDialogOpened && (
        <div
          style={{
            position: 'fixed',
            right: '10px',
            bottom: '20px',
            width: '36.5vh',
            height: '90vh',
            borderRadius: '10px',
            backgroundColor: 'rgba(126, 126, 126, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            zIndex: 1000,
          }}
        >
          {/* Заголовок и кнопка закрытия */}
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
              onClick={() => setIsDialogOpened(false)}
            />
          </div>

          {/* Окно сообщений */}
          <div
            style={{
              flex: 1,
              padding: '10px',
              overflowY: 'auto',
              backgroundColor: 'rgba(30, 30, 30, 0.7)',
              borderRadius: '10px',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                width: '60%',
                backgroundColor: 'white',
                padding: '10px',
                borderRadius: '10px',
                fontSize: '18px',
                marginBottom: '10px',
              }}
            >
              Здрасте, я че надо?
            </div>
          </div>

          {/* Поле ввода */}
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
              placeholder="Введите сообщение..."
              style={{
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
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Иконка для открытия чата */}
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
          }}
          onClick={() => setIsDialogOpened(true)}
        />
      )}
    </div>
  );
};

export default Cheburator;
