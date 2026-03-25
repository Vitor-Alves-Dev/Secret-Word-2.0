// CSS
import './App.css';
// React
import {useCallback, useEffect, useState} from 'react';
//Components
import StartScreen from './components/StartScreen';
import GameOver from './components/GameOver';
import Game from './components/Game';

// dados
import { wordsList } from './data/words';


const stages = [
  {id: 1, name:'start'},
  {id: 2, name:'game'},
  {id: 3, name:'end'}
]
const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);
  
  const [guessedLetters, setGuessedLetters] = useState([])
  //letras erradas
  const [wrongLetters, setWrongLetters] = useState([])
  //tentativas do usuario
  const [guesses, setGuesses] = useState(guessesQty)
  //pontuação
  const [score, setScore] = useState(50)



  const pickWordAndCategory = useCallback(() => {
    //pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    
    //pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    

    return {word, category}
  }, [words])
  // iniciando o jogo
  const startGame = useCallback(() => {

    clearLetterStates();
   
    //pick word and pick category
    const {word, category} = pickWordAndCategory();
    //criar um array de letras
    let wordLetters = word.toLowerCase().split('')
   
   

    //setando states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name)
    
  }, [pickWordAndCategory])
   // processo depois do input

   const verifyLetter = (letter) => {
    const normalizedLetter = letter.toString().toLowerCase();
   // validar se a letra ja foi ultilizada
   if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
    return;
   }
   //puxar a letra certa ou remover a letra
   if(letters.includes(normalizedLetter)) {
    setGuessedLetters((actualGuessedLetters) => [
      ... actualGuessedLetters,
      normalizedLetter,
    ])
   } else {
    setWrongLetters((actualWrongLetters) => [
      ... actualWrongLetters,
      normalizedLetter,
    ])

    setGuesses((actualGuesses) => actualGuesses - 1)
   }
  };
  const clearLetterStates = () => {
    
    setGuessedLetters([])
    setWrongLetters([])
  }
   // para condição de derrota
  useEffect(() => {
    //resete ao state
    

    if(guesses <= 0){
      clearLetterStates();
      setGameStage(stages[2].name)
    }
  }, [guesses])
  // para condição de vitoria
  useEffect(() => {
  const uniqueLetters = [... new Set(letters)]

  // Condição de vitória
  if(guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name){
  // add score
    setScore((actualScore) => actualScore += 100)

    //começar novo jogo
    startGame();
  }

  }, [guessedLetters, letters, startGame, gameStage]) 

   
   // restartar o jogo
   const retry = () => {
    setScore(0)
    setGuesses(guessesQty)
    setGameStage(stages[0].name)
   }
  
   
  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame}/> }
      {gameStage === 'game' && <Game verifyLetter={verifyLetter} pickedWord={pickedWord} pickedCategory={pickedCategory} letters={letters} guessedLetters={guessedLetters} wrongLetters={wrongLetters} guesses={guesses} score={score}/>}
      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
      
    </div>
  );
}

export default App;
