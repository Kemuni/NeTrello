import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-100 mb-4 font-['Courier_New'] border-2 border-amber-200/30 inline-block px-8 py-4 rounded-lg backdrop-blur-sm">
            Трелло по-русски
          </h1>
        </div>

        {/* Основной контент */}
        <div className="relative">
          {/* Фоновый ковёр */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="w-full h-full bg-[url('/carpet-pattern.png')] bg-repeat opacity-20"></div>
          </div>

          {/* Кнопка авторизации */}
          <div className="flex justify-center mb-8">
            <button className="bg-amber-100/10 hover:bg-amber-100/20 text-amber-100 font-semibold py-3 px-6 rounded-lg border border-amber-200/30 backdrop-blur-sm transition-all duration-300 flex items-center gap-2">
              <span>Авторизоваться через Гитлаб</span>
              <span className="text-orange-400">♥</span>
            </button>
          </div>

          {/* Карточки */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:border-amber-200/30 transition-all duration-300">
                <h3 className="text-amber-100 text-xl mb-4 font-['Courier_New']">Доска {item}</h3>
                <p className="text-gray-400">Здесь могут быть ваши задачи...</p>
              </div>
            ))}
          </div>
        </div>

        {/* Персонаж */}
        <div className="fixed bottom-4 left-4 opacity-80 hover:opacity-100 transition-opacity duration-300">
          <div className="w-24 h-24 bg-gray-800 rounded-full border-2 border-amber-200/30 flex items-center justify-center">
            <span className="text-5xl">🤔</span>
          </div>
        </div>
      </div>
    </div>
  )
} 