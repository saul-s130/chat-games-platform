import React from 'react';

const GamesPage = () => {
  const games = [
    { name: 'Coup', description: 'Bluff and eliminate other players', status: 'Coming Soon' },
    { name: 'Blackjack', description: 'Classic card game', status: 'Coming Soon' },
    { name: 'Cheat', description: 'Trick your opponents', status: 'Coming Soon' },
    { name: 'Poker', description: 'High-stakes card game', status: 'Coming Soon' },
  ];

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-4xl font-bold mb-8">Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.map((game) => (
          <div key={game.name} className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">{game.name}</h2>
            <p className="text-gray-300 mb-4">{game.description}</p>
            <span className="bg-yellow-600 text-white px-3 py-1 rounded text-sm">
              {game.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;