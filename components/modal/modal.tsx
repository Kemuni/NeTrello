import React, { useState } from "react";
import Select from "react-select";

export default function Modal() {
  const [modal, setModal] = useState(false);
  const [inputValue, setInputValue] = useState('')


  const toggleModal = () => {
    setModal(!modal);
  };

  // const optionsFirstSelection = [
  //   { value: 'individual', label: 'Индивидуально' },
  //   { value: 'workspace', label: 'Имя Фамилия: рабочее пространство' },
  // ];
  //
  // const optionsSecondSelection = [
  //   { value: 'private', label: 'Приватно'},
  //   { value: 'workspace', label: 'Рабочее пространство'},
  //   { value: 'public', label: 'Публично'},
  // ]

  const isButtonDisabled = inputValue.length <= 3

  if (modal) {
    document.body.classList.add('overflow-y-hidden');
  } else {
    document.body.classList.remove('overflow-y-hidden');
  }

  return (
    <>
      {/* Кнопка открытия модального окна */}
      <div
        className="relative rounded-[15px] overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.1)] w-full h-[150px] flex items-center justify-center bg-[rgba(255,255,255,0.2)] cursor-pointer"
        onClick={toggleModal}
      >
        <span className="text-white text-[24px]">+</span>
      </div>

      {/* Модальное окно */}
      {modal && (
        <div className="fixed inset-0">
          {/* Оверлей */}
          <div
            className="fixed inset-0 bg-[rgba(49,49,49,0.8)]"
            onClick={toggleModal}
          ></div>

          {/* Контент модального окна */}
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#f1f1f1] p-[14px_28px] rounded-sm max-w-[420px] min-w-[420px]">
            <div>
              <h1 className="text-center m-[5px] mb-5 text-2xl monomakh-regular">Создать доску</h1>
              <div
                className="w-1/2 mx-auto bg-cover h-[10vh]"
                style={{backgroundImage: "url('desk_image.png')"}}
              ></div>
            </div>

            {/* Блок с выбором фона */}
            {/*<div className="flex flex-col gap-[20px] mt-4">*/}
            {/*  <h5 className="monomakh-regular">Фон</h5>*/}
            {/*  <div className="flex justify-between gap-4">*/}
            {/*    <div*/}
            {/*      className="flex-1 h-[7vh] bg-cover bg-center"*/}
            {/*      style={{backgroundImage: "url('board1.jpg')"}}*/}
            {/*    ></div>*/}
            {/*    <div*/}
            {/*      className="flex-1 h-[7vh] bg-cover bg-center"*/}
            {/*      style={{backgroundImage: "url('board2.jpg')"}}*/}
            {/*    ></div>*/}
            {/*    <div*/}
            {/*      className="flex-1 h-[7vh] bg-cover bg-center"*/}
            {/*      style={{backgroundImage: "url('board3.jpg')"}}*/}
            {/*    ></div>*/}
            {/*  </div>*/}
            {/*  <div className="flex justify-between gap-4 mt-4">*/}
            {/*    <div*/}
            {/*      className="flex-1 h-[5vh] bg-gradient-to-tr from-blue-400 to-blue-700"*/}
            {/*    ></div>*/}
            {/*    <div*/}
            {/*      className="flex-1 h-[5vh] bg-gradient-to-r from-green-400 to-green-800"*/}
            {/*    ></div>*/}
            {/*    <div*/}
            {/*      className="flex-1 h-[5vh] bg-gradient-to-r from-yellow-400 to-yellow-800"*/}
            {/*    ></div>*/}
            {/*    <div*/}
            {/*      className="flex-1 h-[5vh] bg-gradient-to-br from-violet-300 to-violet-800"*/}
            {/*    ></div>*/}
            {/*  </div>*/}
            {/*</div>*/}
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
            {/*<div className="flex flex-col mt-16 gap-2">*/}
            {/*  <h5 className="monomakh-regular">Рабочее пространство</h5>*/}
            {/*  <Select*/}
            {/*    options={optionsFirstSelection}*/}
            {/*    placeholder=""*/}
            {/*    isSearchable // Разрешить поиск*/}
            {/*    className="w-full border border-gray-800 rounded-md"*/}
            {/*  />*/}
            {/*</div>*/}
            {/*<div className="flex flex-col mt-8 gap-2">*/}
            {/*  <h5 className="monomakh-regular">Видимость</h5>*/}
            {/*  <Select*/}
            {/*    options={optionsSecondSelection}*/}
            {/*    placeholder=""*/}
            {/*    isSearchable*/}
            {/*    defaultValue={optionsSecondSelection[1]}*/}
            {/*    className="w-full border border-gray-800 rounded-md"*/}
            {/*  />*/}
            {/*</div>*/}
            <div className="flex flex-col mt-8 gap-2 monomakh-regular">
              <button
                className={`w-full p-3 border border-gray-800 rounded-s ${
                  isButtonDisabled
                    ? 'disabled:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed'
                    : 'hover:bg-blue-200'
                }`}
                onClick={() => alert(`Создана доска: ${inputValue}`)}
                disabled={isButtonDisabled}
              >Создать</button>
            </div>
            {/* Кнопка закрытия */}
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