import GameCard from './GameCard';

export default function GameList({ games, title }) {
  return (
    <section className="py-8">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          {title}
        </h2>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <div key={game.id}>
            <GameCard game={game} />
          </div>
        ))}
      </div>
      
      {games.length === 0 && (
        <div className="text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">没有找到游戏</p>
        </div>
      )}
    </section>
  );
} 