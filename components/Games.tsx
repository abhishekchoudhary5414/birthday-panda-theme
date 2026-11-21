'use client';

import styles from './Games.module.css';


import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, RotateCcw, Trophy, Timer, Sparkles, CheckCircle2, XCircle, Heart, ArrowLeft, ArrowRight, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

type GameType = 'memory' | 'catch' | 'quiz' | 'find';

// ----------------------------------------------------------------------
// GAME 1: PANDA MEMORY MATCH
// ----------------------------------------------------------------------
interface MemoryCard {
  id: number;
  pairId: number;
  icon: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const memoryCardTypes = [
  { pairId: 1, icon: '🐼', name: 'Party Panda' },
  { pairId: 2, icon: '🎋', name: 'Fresh Bamboo' },
  { pairId: 3, icon: '🎂', name: 'Birthday Cake' },
  { pairId: 4, icon: '🎈', name: 'Party Balloon' },
  { pairId: 5, icon: '🥑', name: 'Avocado Snack' },
  { pairId: 6, icon: '🍼', name: 'Baby Bottle' },
  { pairId: 7, icon: '🌟', name: 'Golden Star' },
  { pairId: 8, icon: '🌿', name: 'Bamboo Leaves' },
];

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const initGame = () => {
    const deck: MemoryCard[] = [];
    let idCounter = 1;
    [...memoryCardTypes, ...memoryCardTypes].forEach((item) => {
      deck.push({
        id: idCounter++,
        pairId: item.pairId,
        icon: item.icon,
        name: item.name,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsWon(false);
    setTimerSeconds(0);
    setIsActive(true);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && !isWon) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isWon]);

  const handleCardClick = (index: number) => {
    if (!isActive || isWon) return;
    if (cards[index].isMatched || cards[index].isFlipped) return;
    if (flippedCards.length >= 2) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      if (newCards[firstIdx].pairId === newCards[secondIdx].pairId) {
        // Matched!
        setTimeout(() => {
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          setCards([...newCards]);
          setFlippedCards([]);
          const newMatches = matches + 1;
          setMatches(newMatches);

          if (newMatches === memoryCardTypes.length) {
            setIsWon(true);
            confetti({
              particleCount: 70,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#789B63', '#D9B66F', '#FFB8B8'],
            });
          }
        }, 400);
      } else {
        // Not matched
        setTimeout(() => {
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  return (
    <div className={styles['game-subview']}>
      <div className={styles['game-toolbar']}>
        <div className={styles['stat-pill']}>
          <Timer size={16} />
          <span>{timerSeconds}s</span>
        </div>
        <div className={styles['stat-pill']}>
          <span>Moves: {moves}</span>
        </div>
        <div className={styles['stat-pill']}>
          <span>Matched: {matches}/{memoryCardTypes.length}</span>
        </div>
        <button type="button" onClick={initGame} className={styles['btn-restart']}>
          <RotateCcw size={16} />
          <span>Restart</span>
        </button>
      </div>

      {isWon && (
        <div className={styles['game-victory-banner']}>
          <Trophy size={28} color="var(--accent-gold)" />
          <div>
            <h4>Spectacular Panda Matching!</h4>
            <p>You matched all 8 pairs in {moves} moves and {timerSeconds} seconds!</p>
          </div>
        </div>
      )}

      <div className={styles['memory-grid']}>
        {cards.map((card, idx) => (
          <button
            key={card.id}
            type="button"
            className={`${styles['memory-card'] || 'memory-card'} ${styles['flipped'] || 'flipped'} ${styles['matched'] || 'matched'}`}
            onClick={() => handleCardClick(idx)}
            disabled={card.isMatched || card.isFlipped}
            aria-label={card.isFlipped ? card.name : 'Hidden Card'}
          >
            <div className={`${styles['card-face'] || 'card-face'} ${styles['card-back'] || 'card-back'}`}>
              <span className={styles['card-back-icon']}>🎋</span>
            </div>
            <div className={`${styles['card-face'] || 'card-face'} ${styles['card-front'] || 'card-front'}`}>
              <span className={styles['card-emoji']}>{card.icon}</span>
              <span className={styles['card-label']}>{card.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// GAME 2: BAMBOO CATCH
// ----------------------------------------------------------------------
interface FallingItem {
  id: number;
  x: number; // percentage 0-90
  y: number; // percentage 0-100
  type: 'green' | 'gold' | 'rock';
  speed: number;
}

const BambooCatchGame: React.FC = () => {
  const [basketX, setBasketX] = useState<number>(50); // percentage 10-90
  const [items, setItems] = useState<FallingItem[]>([]);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const nextId = useRef<number>(1);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setItems([]);
    setBasketX(50);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setBasketX((prev) => Math.max(10, prev - 8));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setBasketX((prev) => Math.min(90, prev + 8));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver]);

  // Game Loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    // Spawn timer
    const spawnTimer = setInterval(() => {
      const rand = Math.random();
      let type: 'green' | 'gold' | 'rock' = 'green';
      if (rand > 0.8) type = 'gold';
      else if (rand > 0.55) type = 'rock';

      setItems((prev) => [
        ...prev,
        {
          id: nextId.current++,
          x: 10 + Math.random() * 80,
          y: 0,
          type,
          speed: 1.4 + Math.random() * 0.8,
        },
      ]);
    }, 900);

    // Movement & Collision timer
    const tickTimer = setInterval(() => {
      setItems((prevItems) => {
        const nextItems: FallingItem[] = [];

        prevItems.forEach((item) => {
          const newY = item.y + item.speed * 2.2;

          // Check if caught by panda basket near bottom (Y ~ 85-92%)
          if (newY >= 82 && newY <= 94) {
            const distance = Math.abs(item.x - basketX);
            if (distance < 14) {
              // Caught!
              if (item.type === 'green') {
                setScore((s) => s + 10);
              } else if (item.type === 'gold') {
                setScore((s) => s + 25);
              } else if (item.type === 'rock') {
                setLives((l) => {
                  const newL = l - 1;
                  if (newL <= 0) {
                    setIsGameOver(true);
                  }
                  return Math.max(0, newL);
                });
              }
              return; // item removed
            }
          }

          // If reached floor
          if (newY > 98) {
            return; // item falls away
          }

          nextItems.push({ ...item, y: newY });
        });

        return nextItems;
      });
    }, 50);

    return () => {
      clearInterval(spawnTimer);
      clearInterval(tickTimer);
    };
  }, [isPlaying, isGameOver, basketX]);

  return (
    <div className={styles['game-subview']}>
      <div className={styles['game-toolbar']}>
        <div className={styles['stat-pill']}>
          <Trophy size={16} color="var(--accent-gold)" />
          <span>Score: {score}</span>
        </div>
        <div className={`${styles['stat-pill'] || 'stat-pill'} ${styles['lives-pill'] || 'lives-pill'}`}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart
              key={i}
              size={16}
              fill={i < lives ? '#FF6B6B' : 'transparent'}
              color={i < lives ? '#FF6B6B' : 'var(--text-muted)'}
            />
          ))}
        </div>
        <button type="button" onClick={startGame} className={styles['btn-restart']}>
          <RotateCcw size={16} />
          <span>{isPlaying ? 'Restart' : 'Start Game'}</span>
        </button>
      </div>

      <div
        className={styles['catch-stage']}
        ref={gameAreaRef}
        onTouchMove={(e) => {
          if (!gameAreaRef.current) return;
          const rect = gameAreaRef.current.getBoundingClientRect();
          const touchX = e.touches[0].clientX - rect.left;
          const pct = Math.max(10, Math.min(90, (touchX / rect.width) * 100));
          setBasketX(pct);
        }}
        onMouseMove={(e) => {
          if (!isPlaying || isGameOver || !gameAreaRef.current) return;
          const rect = gameAreaRef.current.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const pct = Math.max(10, Math.min(90, (mouseX / rect.width) * 100));
          setBasketX(pct);
        }}
      >
        {!isPlaying && !isGameOver && (
          <div className={styles['catch-overlay']}>
            <span className={styles['catch-big-emoji']}>🎋</span>
            <h3>Bamboo Catch Adventure</h3>
            <p>Catch fresh green shoots (+10) and golden bamboo (+25). Avoid spiky rocks!</p>
            <button type="button" onClick={startGame} className={`btn-primary ${styles['mt-2'] || 'mt-2'}`}>
              <Play size={18} fill="#FFFFFF" />
              <span>Play Now</span>
            </button>
          </div>
        )}

        {isGameOver && (
          <div className={styles['catch-overlay']}>
            <Trophy size={36} color="var(--accent-gold)" />
            <h3>Game Over!</h3>
            <p>You gathered <strong>{score}</strong> bamboo points for Ditvi&apos;s feast!</p>
            <button type="button" onClick={startGame} className={`btn-primary ${styles['mt-2'] || 'mt-2'}`}>
              <span>Play Again</span>
            </button>
          </div>
        )}

        {/* Falling items */}
        {items.map((it) => (
          <div
            key={it.id}
            className={`${styles['falling-catch-item'] || 'falling-catch-item'} ${it.type}`}
            style={{ left: `${it.x}%`, top: `${it.y}%` }}
          >
            {it.type === 'green' && '🎋'}
            {it.type === 'gold' && '🌟'}
            {it.type === 'rock' && '🪨'}
          </div>
        ))}

        {/* Panda Basket */}
        <div className={styles['catch-panda-basket']} style={{ left: `${basketX}%` }}>
          <div className={styles['panda-head-basket']}>
            <span className={styles['basket-ears']}>🐼</span>
            <div className={styles['basket-tray']}>🧺</div>
          </div>
        </div>
      </div>

      {/* Mobile controls */}
      <div className={styles['catch-mobile-buttons']}>
        <button
          type="button"
          className={styles['btn-move']}
          onClick={() => setBasketX((prev) => Math.max(10, prev - 12))}
        >
          <ArrowLeft size={22} />
        </button>
        <span className={styles['control-hint']}>Use Arrows, Drag, or Tap Buttons to Move</span>
        <button
          type="button"
          className={styles['btn-move']}
          onClick={() => setBasketX((prev) => Math.min(90, prev + 12))}
        >
          <ArrowRight size={22} />
        </button>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// GAME 3: PANDA BIRTHDAY QUIZ
// ----------------------------------------------------------------------
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'How many cute teeth does our birthday star Ditvi currently have?',
    options: ['None yet', '2 bottom teeth', '4 cute teeth (2 top, 2 bottom)', '8 teeth'],
    correctIndex: 2,
    explanation: 'Ditvi proudly shows off her 4 little front teeth whenever she giggles!',
  },
  {
    id: 2,
    question: 'What is a newborn giant panda cub’s weight comparable to?',
    options: ['A stick of butter (approx. 100g)', 'A watermelon', 'A small puppy', 'A teddy bear'],
    correctIndex: 0,
    explanation: 'At birth, baby pandas weigh only about 100 grams, similar to a stick of butter!',
  },
  {
    id: 3,
    question: 'What is Ditvi’s all-time favorite afternoon treat?',
    options: ['Spicy noodles', 'Mashed avocado & sweet potato', 'Raw broccoli', 'Chocolate cake'],
    correctIndex: 1,
    explanation: 'Ditvi could eat sweet potato and avocado mash for breakfast, lunch, and dinner!',
  },
  {
    id: 4,
    question: 'How many hours a day do adult pandas spend eating bamboo?',
    options: ['2 hours', '5 hours', '12 to 16 hours', '24 hours straight'],
    correctIndex: 2,
    explanation: 'Pandas munch on bamboo for up to 12–16 hours every single day!',
  },
  {
    id: 5,
    question: 'What color are newborn pandas when they first arrive?',
    options: ['Black and white', 'Bright pink and hairless', 'Golden yellow', 'Greenish grey'],
    correctIndex: 1,
    explanation: 'Baby pandas are born pink and almost hairless, developing their black patches around week 2!',
  },
];

const PandaQuizGame: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(quizQuestions);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{
    question: string;
    selectedOption: string;
    correctOption: string;
    isCorrect: boolean;
  }[]>([]);

  useEffect(() => {
    fetch('/api/quiz')
      .then((res) => res.json())
      .then((data) => {
        if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
          setQuestions(data.questions);
        }
      })
      .catch((err) => console.error('Failed to load dynamic quiz questions:', err));
  }, []);

  const q = questions[currentIdx] || questions[0] || quizQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (selectedAnswer !== null || !q) return;
    setSelectedAnswer(idx);
    const isCorrect = idx === q.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
    }
    setUserAnswers((prev) => [
      ...prev,
      {
        question: q.question,
        selectedOption: q.options[idx] || '',
        correctOption: q.options[q.correctIndex] || '',
        isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((c) => c + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#789B63', '#D9B66F', '#FFB8B8'],
      });
    }
  };

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || isSubmittingScore) return;

    try {
      setIsSubmittingScore(true);
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: playerName.trim(),
          score,
          totalQuestions: questions.length,
          answers: userAnswers,
        }),
      });

      if (res.ok) {
        setScoreSubmitted(true);
      }
    } catch (err) {
      console.error('Failed to submit score to database:', err);
    } finally {
      setIsSubmittingScore(false);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setScoreSubmitted(false);
    setPlayerName('');
    setUserAnswers([]);
  };

  return (
    <div className={styles['game-subview']}>
      {showResult ? (
        <div className={`${styles['quiz-result-card'] || 'quiz-result-card'} card-bamboo`}>
          <Trophy size={48} color="var(--accent-gold)" />
          <h3 className={styles['result-title']}>Quiz Completed!</h3>
          <p className={styles['result-score']}>
            You scored <strong>{score}</strong> out of {questions.length}!
          </p>
          <p className={styles['result-comment']}>
            {score === questions.length
              ? '🌟 Perfect score! You are a certified Panda Master and Ditvi’s best friend!'
              : score >= Math.ceil(questions.length / 2)
              ? '🎋 Great job! You know your pandas and baby Ditvi super well!'
              : '💚 Sweet effort! Ditvi thanks you for playing her birthday quiz!'}
          </p>

          {/* Store Quiz Score to Database */}
          {!scoreSubmitted ? (
            <form onSubmit={handleSubmitScore} style={{ margin: '14px auto 0', maxWidth: '320px', width: '100%' }}>
              <p style={{ fontSize: '0.84rem', fontWeight: 600, color: '#294B35', marginBottom: '6px' }}>
                Save your score to the birthday leaderboard:
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Your Name (e.g. Auntie Neha)"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #dce8d2',
                    fontSize: '0.88rem',
                    outline: 'none',
                    background: '#ffffff',
                  }}
                />
                <button
                  type="submit"
                  disabled={isSubmittingScore}
                  className="btn-primary"
                  style={{ padding: '8px 14px', whiteSpace: 'nowrap', fontSize: '0.85rem' }}
                >
                  {isSubmittingScore ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          ) : (
            <div style={{ marginTop: '12px', padding: '8px 14px', background: '#eaf5e6', color: '#1e5a26', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 700 }}>
              ✓ Saved to the database leaderboard!
            </div>
          )}

          <button type="button" onClick={handleRestart} className={`btn-primary ${styles['mt-3'] || 'mt-3'}`}>
            <RotateCcw size={18} />
            <span>Try Again</span>
          </button>
        </div>
      ) : q ? (
        <div className={`${styles['quiz-card'] || 'quiz-card'} card-bamboo`}>
          <div className={styles['quiz-top-info']}>
            <span className={styles['quiz-step-badge']}>
              Question {currentIdx + 1} of {questions.length}
            </span>
            <span className={styles['quiz-score-badge']}>Score: {score}</span>
          </div>

          <h3 className={styles['quiz-question-text']}>{q.question}</h3>

          <div className={styles['quiz-options-list']}>
            {q.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === q.correctIndex;
              let optionClass = '';

              if (selectedAnswer !== null) {
                if (isCorrect) optionClass = 'correct';
                else if (isSelected) optionClass = 'wrong';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  className={`${styles['quiz-option-btn'] || 'quiz-option-btn'} ${optionClass}`}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedAnswer !== null}
                >
                  <span className={styles['opt-letter']}>{['A', 'B', 'C', 'D'][idx]}</span>
                  <span className={styles['opt-text']}>{opt}</span>
                  {selectedAnswer !== null && isCorrect && (
                    <CheckCircle2 size={18} color="#2E7D32" />
                  )}
                  {selectedAnswer !== null && isSelected && !isCorrect && (
                    <XCircle size={18} color="#C62828" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div className={styles['quiz-explanation-box']}>
              <p>
                <strong>{selectedAnswer === q.correctIndex ? '🎉 Spot on!' : '💡 Fun Fact:'}</strong>{' '}
                {q.explanation}
              </p>
              <button type="button" onClick={handleNext} className={`btn-primary ${styles['mt-2'] || 'mt-2'}`}>
                <span>{currentIdx < questions.length - 1 ? 'Next Question' : 'See Results'}</span>
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

// ----------------------------------------------------------------------
// GAME 4: FIND THE HIDDEN PANDA
// ----------------------------------------------------------------------
interface HiddenPandaSpot {
  id: number;
  x: number; // percentage
  y: number; // percentage
  hint: string;
  found: boolean;
}

const initialPandas: HiddenPandaSpot[] = [
  { id: 1, x: 18, y: 35, hint: 'Peeking through high bamboo branches on the left', found: false },
  { id: 2, x: 78, y: 28, hint: 'Hiding behind the fluffy white cloud near top right', found: false },
  { id: 3, x: 48, y: 72, hint: 'Munching snacks quietly in the center grass patch', found: false },
  { id: 4, x: 86, y: 80, hint: 'Curled up behind the mossy stone on the right', found: false },
  { id: 5, x: 30, y: 88, hint: 'Napping gently beside the pond flower', found: false },
];

const FindPandaGame: React.FC = () => {
  const [pandas, setPandas] = useState<HiddenPandaSpot[]>(initialPandas);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  const handleSpotClick = (id: number) => {
    const updated = pandas.map((p) => (p.id === id ? { ...p, found: true } : p));
    setPandas(updated);

    const foundCount = updated.filter((p) => p.found).length;
    if (foundCount === pandas.length) {
      setIsVictory(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#789B63', '#D9B66F', '#FFB8B8'],
      });
    }
  };

  const handleRestart = () => {
    setPandas(initialPandas.map((p) => ({ ...p, found: false })));
    setIsVictory(false);
    setShowHint(false);
  };

  const foundCount = pandas.filter((p) => p.found).length;

  return (
    <div className={styles['game-subview']}>
      <div className={styles['game-toolbar']}>
        <div className={styles['stat-pill']}>
          <span>Found: {foundCount} / {pandas.length} Pandas</span>
        </div>
        <button
          type="button"
          onClick={() => setShowHint(!showHint)}
          className={styles['btn-restart']}
        >
          <span>{showHint ? 'Hide Hints' : 'Need a Hint?'}</span>
        </button>
        <button type="button" onClick={handleRestart} className={styles['btn-restart']}>
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
      </div>

      {isVictory && (
        <div className={styles['game-victory-banner']}>
          <Trophy size={28} color="var(--accent-gold)" />
          <div>
            <h4>Eagle Eyes! All 5 Pandas Found!</h4>
            <p>You explored the bamboo grove and discovered every single hidden baby panda!</p>
          </div>
        </div>
      )}

      {showHint && (
        <div className={styles['hint-box']}>
          <Sparkles size={16} color="var(--accent-gold)" />
          <span>
            Look closely around the high bamboo leaves, behind the fluffy cloud, and near the bottom rocks!
          </span>
        </div>
      )}

      {/* Illustrated Forest Spotting Canvas */}
      <div className={styles['spotting-forest']}>
        {/* Background Landscape Elements */}
        <div className={styles['forest-sky']} />
        <div className={`${styles['forest-cloud'] || 'forest-cloud'} ${styles['c-left'] || 'c-left'}`} />
        <div className={`${styles['forest-cloud'] || 'forest-cloud'} ${styles['c-right'] || 'c-right'}`} />
        <div className={`${styles['forest-hill'] || 'forest-hill'} ${styles['hill-back'] || 'hill-back'}`} />
        <div className={`${styles['forest-hill'] || 'forest-hill'} ${styles['hill-front'] || 'hill-front'}`} />
        <div className={`${styles['forest-bamboo-grove'] || 'forest-bamboo-grove'} ${styles['b-left'] || 'b-left'}`} />
        <div className={`${styles['forest-bamboo-grove'] || 'forest-bamboo-grove'} ${styles['b-right'] || 'b-right'}`} />
        <div className={`${styles['forest-stone'] || 'forest-stone'} ${styles['stone-1'] || 'stone-1'}`} />
        <div className={`${styles['forest-stone'] || 'forest-stone'} ${styles['stone-2'] || 'stone-2'}`} />

        {/* Hidden Pandas */}
        {pandas.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`${styles['hidden-panda-target'] || 'hidden-panda-target'} ${styles['found'] || 'found'}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            onClick={() => handleSpotClick(p.id)}
            aria-label={`Hidden Panda ${p.id}`}
          >
            <span className={styles['panda-sprite']}>🐼</span>
            {p.found && <span className={styles['found-heart']}>❤️ Found!</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// MAIN GAMES SECTION WRAPPER
// ----------------------------------------------------------------------
export const Games: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>('memory');

  return (
    <section id="games" className={`section-wrapper ${styles['games-section'] || 'games-section'}`}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <div className="section-badge">
            <Gamepad2 size={16} />
            <span>Interactive Fun</span>
          </div>
          <h2 className="section-title">Panda Birthday Playground</h2>
          <p className="section-subtitle">
            Play 4 delightful interactive games designed for guests of all ages! Test your memory, catch sweet bamboo treats, or find the sneaky hidden pandas.
          </p>
        </div>

        {/* Game Navigation Selector Tabs */}
        <div className={styles['games-nav-tabs']}>
          <button
            type="button"
            className={`${styles['game-nav-tab'] || 'game-nav-tab'} ${styles['memory'] || 'memory'} ${styles['active'] || 'active'}`}
            onClick={() => setActiveGame('memory')}
          >
            <span className={styles['tab-icon']}>🎴</span>
            <div className={styles['tab-meta']}>
              <span className={styles['tab-title']}>Panda Memory Match</span>
              <span className={styles['tab-subtitle']}>Pair identical cards</span>
            </div>
          </button>

          <button
            type="button"
            className={`${styles['game-nav-tab'] || 'game-nav-tab'} ${styles['catch'] || 'catch'} ${styles['active'] || 'active'}`}
            onClick={() => setActiveGame('catch')}
          >
            <span className={styles['tab-icon']}>🎋</span>
            <div className={styles['tab-meta']}>
              <span className={styles['tab-title']}>Bamboo Catch</span>
              <span className={styles['tab-subtitle']}>Arcade mini game</span>
            </div>
          </button>

          <button
            type="button"
            className={`${styles['game-nav-tab'] || 'game-nav-tab'} ${styles['quiz'] || 'quiz'} ${styles['active'] || 'active'}`}
            onClick={() => setActiveGame('quiz')}
          >
            <span className={styles['tab-icon']}>❓</span>
            <div className={styles['tab-meta']}>
              <span className={styles['tab-title']}>Panda Birthday Quiz</span>
              <span className={styles['tab-subtitle']}>Fun trivia test</span>
            </div>
          </button>

          <button
            type="button"
            className={`${styles['game-nav-tab'] || 'game-nav-tab'} ${styles['find'] || 'find'} ${styles['active'] || 'active'}`}
            onClick={() => setActiveGame('find')}
          >
            <span className={styles['tab-icon']}>🔍</span>
            <div className={styles['tab-meta']}>
              <span className={styles['tab-title']}>Find the Panda</span>
              <span className={styles['tab-subtitle']}>Forest spot puzzle</span>
            </div>
          </button>
        </div>

        {/* Active Game Stage Card */}
        <div className={`${styles['game-stage-wrapper'] || 'game-stage-wrapper'} card-bamboo`}>
          {activeGame === 'memory' && <MemoryGame />}
          {activeGame === 'catch' && <BambooCatchGame />}
          {activeGame === 'quiz' && <PandaQuizGame />}
          {activeGame === 'find' && <FindPandaGame />}
        </div>
      </div>
    </section>
  );
};
