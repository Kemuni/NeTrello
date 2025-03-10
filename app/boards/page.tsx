'use client'

import React from 'react';

export default function Boards() {
  const cards = [
    { id: 1, title: "Доска 1", image: "/board1.jpg" },
    { id: 2, title: "Доска 2", image: "/board2.jpg" },
    { id: 3, title: "Доска 3", image: "/board3.jpg" },
    { id: 4, title: "Доска 4", image: "/board1.jpg" },
    { id: 5, title: "Доска 5", image: "/board2.jpg" },
    { id: 6, title: "Доска 6", image: "/board3.jpg" },
    { id: 7, title: "Доска 7", image: "/board1.jpg" },
    { id: 8, title: "Доска 8", image: "/board2.jpg" },
  ];

  return (
    <div
      className="monomakh-regular"
      style={{
        minHeight: '100vh',
        backgroundImage: "url('/image3.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          width: '80%',
          marginTop: '100px',
          maxWidth: '900px',
          
          backgroundColor: 'rgba(124, 124, 124, 0.6)',
          borderRadius: '25px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
          rowGap: '30px',
          padding: '20px'
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            style={{
              position: 'relative',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              width: '100%',
              height: '150px'
            }}
          >
            <img
              src={card.image}
              alt={card.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '4px'
              }}
            >
              {card.title}
            </div>
          </div>
        ))}

        {/* Карточка-кнопка для добавления новых карточек */}
        <div
          style={{
            position: 'relative',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            width: '100%',
            height: '150px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Прозрачный фон
            cursor: 'pointer'
          }}
          onClick={() => alert('Добавить новую карточку')}
        >
          <span style={{ color: 'white', fontSize: '24px' }}>+</span>
        </div>
      </div>
    </div>
  );
}