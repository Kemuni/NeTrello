import React, { useState } from "react";

export default function Modal() {
  const [modal, setModal] = useState(false);
  const [inputValue, setInputValue] = useState('')
  const [selectedPrivacy, setSelectedPrivacy] = useState('public');
  const [initWithReadme, setInitWithReadme] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleCreate = () => {
    const data = {
      boardName: inputValue,
      privacy: selectedPrivacy,
      initRepoWithREADME: initWithReadme
    };

    console.log("Создана доска:", data);
    toggleModal();
  };

  const isButtonDisabled = inputValue.length < 3

  if (modal) {
    document.body.classList.add('overflow-y-hidden');
  } else {
    document.body.classList.remove('overflow-y-hidden');
  }

  return (
    <>
      <div
        className="relative rounded-[15px] overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.1)] w-full h-[150px] flex items-center justify-center bg-[rgba(255,255,255,0.2)] cursor-pointer"
        onClick={toggleModal}
      >
        <span className="text-white text-[24px]">+</span>
      </div>

      {modal && (
        <div className="fixed inset-0">
          <div
            className="fixed inset-0 bg-[rgba(49,49,49,0.8)]"
            onClick={toggleModal}
          ></div>

          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#f1f1f1] p-[14px_28px] rounded-sm max-w-[420px] min-w-[420px]">
            <div>
              <h1 className="text-center m-[5px] mb-5 text-2xl monomakh-regular">Создать доску</h1>
              <div
                className="w-1/2 mx-auto bg-cover h-[10vh]"
                style={{backgroundImage: "url('desk_image.png')"}}
              ></div>
            </div>
            <div className="flex flex-col mt-4 gap-2">
              <h5 className="monomakh-regular">Название доски</h5>
              <input
                type="text"
                placeholder=""
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full p-2 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <div className="flex flex-col gap-4 py-4">
              <p>Уровень видимости:</p>
              <label
                className="flex items-center space-x-2 cursor-pointer border border-gray-300 rounded-md p-3 hover:border-blue-500">
                <input
                  type="radio"
                  name="privacy"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  value="public"
                  checked={selectedPrivacy === 'public'}
                  onChange={() => setSelectedPrivacy('public')}
                />
                <span className="text-gray-900">Публичный</span>
              </label>

              <label
                className="flex items-center space-x-2 cursor-pointer border border-gray-300 rounded-md p-3 hover:border-blue-500">
                <input
                  type="radio"
                  name="privacy"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  value="private"
                  checked={selectedPrivacy === 'private'}
                  onChange={() => setSelectedPrivacy('private')}
                />
                <span className="text-gray-900">Приватный</span>
              </label>
            </div>
            <div className="flex flex-row gap-4 py-4">
              <input
                type="checkbox"
                checked={initWithReadme}
                onChange={(e) => setInitWithReadme(e.target.checked)}
              />
              <span className="text-gray-900">Инициализировать репозиторий с README файлом</span>
            </div>
            <div className="flex flex-col mt-8 gap-2 monomakh-regular">
              <button
                className={`w-full p-3 border border-gray-800 rounded-s ${
                  isButtonDisabled
                    ? 'disabled:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed'
                    : 'hover:bg-blue-200'
                }`}
                onClick={handleCreate}
                disabled={isButtonDisabled}
              >Создать
              </button>
            </div>
            <button
              className="absolute top-[10px] right-[10px] px-[5px] py-[7px]"
              onClick={toggleModal}
            >
              <img src="/addition.png" alt="icon" style={{width: '16px', height: '16px'}} className="rotate-45"/>
            </button>
          </div>
        </div>
      )}
    </>
  );
}