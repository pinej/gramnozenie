import React from 'react';
import { useState } from 'react';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';

const MultiplicationGame = () => {
  const [currentScreen, setCurrentScreen] = useState('screen1');
  const [name, setName] = useState('');
  const [gameMode, setGameMode] = useState('multiplication');
  const [difficulty, setDifficulty] = useState('30');
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [mistakes, setMistakes] = useState([]);
  
  // Przechowywanie aktualnego pytania i odpowiedzi
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  
  // Screen templates
  const renderScreen1 = () => (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-gray-50 rounded-lg shadow-lg p-6">
      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="text-3xl font-bold text-blue-600 mb-8">Nauka Mnożenia</h1>
        
        <div className="mb-6 w-full">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Podaj swoje imię</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Twoje imię (opcjonalnie)"
          />
        </div>
        
        <button 
          className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => setCurrentScreen('screen2')}
        >
          DALEJ
        </button>
      </div>
    </div>
  );
  
  const renderScreen2 = () => (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-gray-50 rounded-lg shadow-lg p-6">
      <div className="flex justify-start mb-6">
        <button 
          className="p-2 rounded-full hover:bg-gray-200 flex items-center"
          onClick={() => setCurrentScreen('screen1')}
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 mr-1" />
          <span className="text-sm">Powrót</span>
        </button>
      </div>
      
      <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">Ustawienia Gry</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-700 mb-2">Tryb gry</h2>
        <div className="grid grid-cols-2 gap-3">
          <button 
            className={`p-4 rounded-md border-2 flex justify-center items-center 
              ${gameMode === 'multiplication' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:bg-gray-100'}`}
            onClick={() => setGameMode('multiplication')}
          >
            <span className="font-medium">Tylko mnożenie</span>
          </button>
          <button 
            className={`p-4 rounded-md border-2 flex justify-center items-center 
              ${gameMode === 'both' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:bg-gray-100'}`}
            onClick={() => setGameMode('both')}
          >
            <span className="font-medium">Mnożenie i dzielenie</span>
          </button>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-700 mb-2">Trudność</h2>
        <div className="grid grid-cols-3 gap-3">
          <button 
            className={`p-3 rounded-md border-2 flex justify-center items-center 
              ${difficulty === '30' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:bg-gray-100'}`}
            onClick={() => setDifficulty('30')}
          >
            <span className="font-medium">do 30</span>
          </button>
          <button 
            className={`p-3 rounded-md border-2 flex justify-center items-center 
              ${difficulty === '72' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:bg-gray-100'}`}
            onClick={() => setDifficulty('72')}
          >
            <span className="font-medium">do 72</span>
          </button>
          <button 
            className={`p-3 rounded-md border-2 flex justify-center items-center 
              ${difficulty === '100' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:bg-gray-100'}`}
            onClick={() => setDifficulty('100')}
          >
            <span className="font-medium">do 100</span>
          </button>
        </div>
      </div>
      
      <button 
        className="w-full px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
        onClick={() => {
          setScore(0);
          setCurrentQuestion(1);
          setMistakes([]);
          setShowFeedback(false);
          setSelectedAnswer(null);
          setQuestion(generateQuestion(gameMode, difficulty));
          setCurrentScreen('screen3');
        }}
      >
        <Play className="w-5 h-5 mr-2" />
        START
      </button>
    </div>
  );
  
  const renderScreen3 = () => {
    // Generuj nowe pytanie tylko jeśli nie ma aktualnego
    if (!question) {
      const newQuestion = generateQuestion(gameMode, difficulty);
      setQuestion(newQuestion);
      return null; // Renderuj po ustawieniu pytania
    }
    
    const handleAnswerClick = (answer) => {
      // Jeśli feedback jest już pokazywany, ignoruj kliknięcia
      if (showFeedback) return;
      
      const isCorrect = answer === question.correctAnswer;
      setSelectedAnswer(answer);
      setIsAnswerCorrect(isCorrect);
      setShowFeedback(true);
      
      if (isCorrect) {
        setScore(score + 1);
      } else {
        setMistakes([...mistakes, {
          question: question.text,
          userAnswer: answer,
          correctAnswer: question.correctAnswer
        }]);
      }
      
      // Przejdź do następnego pytania po 1.5s
      setTimeout(() => {
        if (currentQuestion < 10) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setShowFeedback(false);
          setQuestion(generateQuestion(gameMode, difficulty));
        } else {
          setCurrentScreen('screen4');
        }
      }, 1500);
    };
    
    return (
      <div className="flex flex-col h-full w-full max-w-md mx-auto bg-gray-50 rounded-lg shadow-lg p-6">
        <div className="flex justify-start mb-4">
          <button 
            className="p-2 rounded-full hover:bg-gray-200 flex items-center"
            onClick={() => setCurrentScreen('screen2')}
            disabled={showFeedback}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 mr-1" />
            <span className="text-sm">Powrót</span>
          </button>
        </div>
        
        <div className="flex justify-between mb-4">
          <div className="bg-blue-100 px-4 py-2 rounded-md">
            <span className="font-medium text-blue-800">Punkty: {score}</span>
          </div>
          <div className="bg-gray-100 px-4 py-2 rounded-md">
            <span className="font-medium text-gray-800">Pytanie: {currentQuestion}/10</span>
          </div>
        </div>
        
        <div className="flex flex-col flex-grow items-center justify-center bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {question.text}
          </div>
          
          {showFeedback && (
            <div className={`mb-6 py-2 px-4 rounded-md font-bold text-center w-full ${
              isAnswerCorrect ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {isAnswerCorrect ? 'Dobrze!' : 'Zła odpowiedź'}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 w-full">
            {question.answers.map((answer, index) => {
              // Określ styl przycisku
              let buttonStyle = "bg-blue-50 border-blue-200 hover:bg-blue-100";
              
              if (showFeedback) {
                if (answer === question.correctAnswer) {
                  buttonStyle = "bg-green-100 border-green-500 text-green-800";
                } else if (answer === selectedAnswer && answer !== question.correctAnswer) {
                  buttonStyle = "bg-red-100 border-red-500 text-red-800";
                } else {
                  buttonStyle = "bg-blue-50 border-blue-200 opacity-60";
                }
              }
              
              return (
                <button 
                  key={index}
                  className={`p-4 text-xl font-medium border-2 rounded-md transition-colors ${buttonStyle}`}
                  onClick={() => handleAnswerClick(answer)}
                  disabled={showFeedback}
                >
                  {answer}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  const renderScreen4 = () => (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-gray-50 rounded-lg shadow-lg p-6">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">Koniec gry!</h1>
        <p className="text-xl font-medium text-gray-800">
          {name ? `${name}, Twój wynik to:` : 'Twój wynik to:'}
        </p>
        <p className="text-4xl font-bold text-green-600 my-2">{score}/10</p>
      </div>
      
      {mistakes.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-700 mb-2">Zapamiętaj:</h2>
          <div className="bg-white rounded-lg shadow-sm p-4 max-h-48 overflow-y-auto">
            <ul className="space-y-2">
              {mistakes.map((mistake, index) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="mr-1">*</span>
                  <span className="font-medium">{mistake.question.replace(' = ?', '')}</span> = {mistake.correctAnswer} 
                  <span className="text-red-500">  (Twoja odpowiedź: {mistake.userAnswer})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 mt-auto">
        <button 
          className="px-4 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
          onClick={() => {
            setScore(0);
            setCurrentQuestion(1);
            setMistakes([]);
            setSelectedAnswer(null);
            setShowFeedback(false);
            setQuestion(generateQuestion(gameMode, difficulty));
            setCurrentScreen('screen3');
          }}
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Nowa gra
        </button>
        <button 
          className="px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
          onClick={() => setCurrentScreen('screen2')}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Powrót
        </button>
      </div>
    </div>
  );
  
  // Helper function to generate a question
  const generateQuestion = (mode, difficulty) => {
    let maxProduct;
    if (difficulty === '30') maxProduct = 30;
    else if (difficulty === '72') maxProduct = 72;
    else if (difficulty === '100') maxProduct = 100;
    
    // Generate pair of numbers for multiplication
    let num1, num2, product;
    do {
      num1 = Math.floor(Math.random() * 9) + 2; // Numbers from 2 to 10
      num2 = Math.floor(Math.random() * 9) + 2; // Numbers from 2 to 10
      product = num1 * num2;
    } while (product > maxProduct);
    
    let text = '';
    let correctAnswer = 0;
    
    if (mode === 'both' && Math.random() > 0.5) {
      // Division
      text = `${product} ÷ ${num2} = ?`;
      correctAnswer = product / num2; // Wynik dzielenia
    } else {
      // Multiplication
      text = `${num1} × ${num2} = ?`;
      correctAnswer = product;
    }
    
    // Generate 3 wrong answers
    let answers = [correctAnswer];
    while (answers.length < 4) {
      const wrongAnswer = Math.max(1, correctAnswer + Math.floor(Math.random() * 10) - 5);
      if (!answers.includes(wrongAnswer)) {
        answers.push(wrongAnswer);
      }
    }
    
    // Shuffle answers
    answers = answers.sort(() => Math.random() - 0.5);
    
    return { text, correctAnswer, answers };
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {currentScreen === 'screen1' && renderScreen1()}
      {currentScreen === 'screen2' && renderScreen2()}
      {currentScreen === 'screen3' && renderScreen3()}
      {currentScreen === 'screen4' && renderScreen4()}
    </div>
  );
};

export default MultiplicationGame;
