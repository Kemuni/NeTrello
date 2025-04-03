"use client";

import React, { useState } from 'react';

// Тип для страницы
type Page = {
  id: string;
  title: string;
};


const PageComponent: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="bg-[rgba(124,124,124,0.5)] w-[30%] h-full rounded-2xl border-4 border-gray-300 flex flex-col items-center pt-5 flex-shrink-0">
      <h2 className="text-5xl text-white">{title}</h2>
      {/* Здесь могут быть карточки, но пока их нет */}
      <Card/>
    </div>
  );
};

const Card: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full relative">
      <img src="/packet.png" alt="packett" className="w-[60%]" />
      <div className="monomakh-regular absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[40%] w-[50%] max-w-[400px] text-center bg-gray-300 rounded-lg shadow-md">
        <p className="my-2">Название</p>
        <p>Дедлайн выполнения</p>
      </div>
    </div>
  );
};

// Компонент для добавления новой страницы
const AddPage: React.FC<{ onCancel: () => void; onAdd: (title: string) => void }> = ({ onCancel, onAdd }) => {
  const [inputValue, setInputValue] = useState(''); 
  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue); 
      setInputValue(''); 
    }
  };

  return (
    <div className="bg-[rgba(124,124,124,0.5)] w-[30%] h-[100%] rounded-2xl border-4 border-gray-300 flex flex-col items-center justify-between pt-5 flex-shrink-0">
      <div className="flex flex-col items-center">
        <h2 className="text-4xl text-white">Новая страница</h2>
        <div className="flex flex-col mt-4">
          <input
            type="text"
            placeholder="Введите название"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} 
            className="w-full py-2 px-5 border border-white rounded-xl focus:outline-none focus:ring-1 focus:ring-white text-white bg-[rgba(124,124,124,0.5)]"
          />
        </div>
      </div>
      <div className="flex flex-row text-white place-content-around w-full pb-5 text-xl">
        {/* Кнопка "Добавить" */}
        <button
          className="w-[120px] py-1.5 border border-white rounded-md bg-gray-400 justify-center"
          onClick={handleAdd} 
        >
          Добавить
        </button>
        {/* Кнопка "Отмена" */}
        <button
          className="w-[120px] py-1.5 border border-white rounded-md bg-gray-400 justify-center"
          onClick={onCancel} 
        >
          Отмена
        </button>
      </div>
    </div>
  );
};

const NewPage: React.FC = () => {
  const [showAddPage, setShowAddPage] = useState(false); 
  const [pages, setPages] = useState<Page[]>([]); 

  // добавление новой страницы
  const handleAddPage = (title: string) => {
    const newPage: Page = {
      id: Date.now().toString(), 
      title, 
    };
    setPages([...pages, newPage]); 
    setShowAddPage(false); 
  };

  return (
    <div className="monomakh-regular relative bg-cover bg-[url('/background-manage.jpg')] h-screen flex justify-center items-center">
      <button className="absolute top-[10px] left-[10px] w-20 h-20 bg-red-500 text-white border-none rounded-full cursor-pointer">
        <img src="/arrow-left.png" alt="arrow-left" className="w-full h-[80%]" />
      </button>

      {/* Контейнер для страниц с горизонтальным скроллом */}
      <div className="flex w-[80%] h-[80%] gap-4 overflow-x-auto">
        {/* Статическая страница "Открытые" */}
        <PageComponent title="Открытые" />

        {/* Отображение созданных страниц */}
        {pages.map((page) => (
          <PageComponent key={page.id} title={page.title} />
        ))}

        {/* Статическая страница "Закрытые" */}
        <PageComponent title="Закрытые" />

        {/* Отображение AddPage или кнопки "Добавить страницу" */}
        {showAddPage ? (
          <AddPage
            onCancel={() => setShowAddPage(false)} 
            onAdd={handleAddPage} 
          />
        ) : (
          <div
            className="bg-[rgba(124,124,124,0.5)] w-[30%] h-[15%] rounded-2xl border-4 border-gray-300 flex flex-col items-center pt-5 cursor-pointer flex-shrink-0"
            onClick={() => setShowAddPage(true)} 
          >
            <h2 className="text-4xl text-white">Добавить страницу</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPage;