import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy } from 'lucide-react';

const ITEMS = [
  { name: 'Diamond Sword', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/b/b9/Diamond_Sword_%28MCD%29.png/revision/latest?cb=20200407193216' },
  { name: 'Hammer of Gravity', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/4/4c/Hammer_of_Gravity_%28MCD%29.png/revision/latest?cb=20200602004544' },
  { name: 'Firebrand', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/e/ee/Firebrand_%28MCD%29.png/revision/latest?cb=20200531223340' },
  { name: 'Soul Knife', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/c/ce/Soul_Knife_%28MCD%29.png/revision/latest?cb=20200407194209' },
  { name: 'Heartstealer', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/d/d1/Heartstealer_%28MCD%29.png/revision/latest?cb=20200530203737' },
  { name: 'Fighters Bindings', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/3/36/Fighter%27s_Bindings_%28MCD%29.png/revision/latest?cb=20200601131407' },
  { name: 'Stormlander', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/21/Stormlander_%28MCD%29.png/revision/latest?cb=20200602032431' },
  { name: 'Grave Bane', url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/c/c6/Grave_Bane_%28MCD%29.png/revision/latest?cb=20200530213556' },
];

interface Card {
  id: number;
  name: string;
  url: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const initGame = useCallback(() => {
    const shuffledCards = [...ITEMS, ...ITEMS]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        ...item,
        id: index,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsWon(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(m => m + 1);
      const [firstId, secondId] = flippedCards;
      const firstCard = cards[firstId];
      const secondCard = cards[secondId];

      if (firstCard.name === secondCard.name) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isMatched: true } 
              : card
          ));
          setMatches(m => m + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isFlipped: false } 
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matches === ITEMS.length) {
      setIsWon(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [matches]);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

    setCards(prev => prev.map(card => 
      card.id === id ? { ...card, isFlipped: true } : card
    ));
    setFlippedCards(prev => [...prev, id]);
  };

  return (
    <div className="game-container">
      <h1 className="title">Dungeons Match</h1>

      <div className="stats">
        <div className="stat-item">
          <span className="stat-label">Moves</span>
          <span className="stat-value">{moves}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Matches</span>
          <span className="stat-value">{matches} / {ITEMS.length}</span>
        </div>
      </div>

      <div className="grid">
        {cards.map(card => (
          <div 
            key={card.id} 
            className={`card ${card.isFlipped || card.isMatched ? 'is-flipped' : ''} ${card.isMatched ? 'is-matched' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-inner">
              <div className="card-back"></div>
              <div className="card-front">
                <img src={card.url} alt={card.name} className="card-image" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn-reset" onClick={initGame}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <RotateCcw size={20} />
          Reset Game
        </div>
      </button>

      <AnimatePresence>
        {isWon && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="win-overlay"
          >
            <Trophy size={100} color="#4ade80" />
            <h2 className="win-title">YOU WIN!</h2>
            <div className="win-stats">
              <p>Awesome Job!</p>
              <p>You finished in <strong>{moves}</strong> moves.</p>
            </div>
            <button className="btn-reset" onClick={initGame}>Play Again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
