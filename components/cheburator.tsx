import React, { useState } from 'react';

const Cheburator = () => {
  const [isDialogOpened, setIsDialogOpened] = useState(false);

  return (
    <div className="relative min-h-screen">
      {isDialogOpened && (
        <div
          className="fixed right-[10px] bottom-[20px] w-[36.5vh] h-[90vh] rounded-[10px] bg-[rgba(126,126,126,0.7)] flex flex-col box-border z-[1000]">
          <div className="relative p-[10px] flex justify-between items-center">
            <h1 className="text-[5vh] m-0">Чебуратор</h1>
            <img
              src="/chepukh.png"
              alt="close-icon"
              className="w-[60px] h-[60px] cursor-pointer"
              onClick={() => setIsDialogOpened(false)}
            />
          </div>

          <div className="flex-1 p-[10px] overflow-y-auto bg-[rgba(30,30,30,0.7)] rounded-[10px] box-border">
            <div className="w-[60%] bg-white p-[10px] rounded-[10px] text-[18px] mb-[10px]">
              Здрасте, я че надо?
            </div>
          </div>

          <div className="p-[10px] flex items-center border-t border-[rgba(255,255,255,0.2)]">
            <input
              type="text"
              placeholder="Введите сообщение..."
              className="flex-1 p-[10px] rounded-[10px] border-none text-[16px] outline-none"
            />
            <button className="ml-[10px] p-[10px] rounded-[10px] bg-white text-[16px] cursor-pointer">
              ➤
            </button>
          </div>
        </div>
      )}

      {!isDialogOpened && (
        <img
          src="/chepukh.png"
          alt="open-icon"
          className="fixed bottom-[20px] left-[20px] w-[150px] h-[150px] cursor-pointer z-[999] hover:scale-105 transition-transform"
          onClick={() => setIsDialogOpened(true)}
        />
      )}
    </div>
  );
};

export default Cheburator;
