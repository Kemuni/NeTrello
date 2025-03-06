import Image from 'next/image'
import Link from 'next/link'

export default function Boards() {
  const boards = [
    { id: 1, title: "Доска 1", image: "/board1.jpg" },
    { id: 2, title: "Доска 2", image: "/board2.jpg" },
    { id: 3, title: "Доска 3", image: "/board3.jpg" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-100 mb-4 font-['Courier_New'] border-2 border-amber-200/30 inline-block px-8 py-4 rounded-lg backdrop-blur-sm">
            Управление досками
          </h1>
        </div>

        {/* Основной контент */}
        <div className="relative">
          {/* Фоновый ковёр */}
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="w-full h-full bg-center bg-repeat"
              style={{
                backgroundImage: "url('/carpet-pattern.png')",
                backgroundSize: '400px',
                opacity: '0.4'
              }}
            ></div>
          </div>

          {/* Сетка досок */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {boards.map((board) => (
              <div 
                key={board.id}
                className="relative group cursor-pointer w-full"
              >
                <div className="aspect-square relative overflow-hidden rounded-lg border-2 border-amber-200/30">
                  <div className="relative w-[200px] h-[200px]">
                    <Image
                      src={board.image}
                      alt={board.title}
                      width={200}
                      height={200}
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-amber-100 text-lg font-['Courier_New']">{board.title}</h3>
                  </div>
                </div>
              </div>
            ))}

            {/* Кнопка добавления новой доски */}
            <div className="aspect-square relative w-full">
              <button className="w-full h-full flex items-center justify-center rounded-lg border-2 border-dashed border-amber-200/30 bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-300">
                <span className="text-6xl text-amber-200/70">+</span>
              </button>
            </div>
          </div>
        </div>

        {/* Персонаж */}
        <div className="fixed bottom-4 left-4 opacity-80 hover:opacity-100 transition-opacity duration-300">
          <div className="w-24 h-24 bg-gray-800 rounded-full border-2 border-amber-200/30 flex items-center justify-center">
            <span className="text-5xl">🤔</span>
          </div>
        </div>

        {/* Кнопка возврата на главную страницу */}
        <div className="absolute top-4 left-4">
          <Link 
            href="/" 
            className="text-amber-100 hover:text-amber-200 transition-colors duration-300"
          >
            ← На главную
          </Link>
        </div>
      </div>
    </div>
  )
} 