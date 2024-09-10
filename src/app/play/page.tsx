"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Timer, RotateCcw, RefreshCw, Trophy } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation';

type Player = 'player1' | 'player2';
type Position = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface Piece {
  player: Player;
  position: Position;
}

interface GameState {
  pieces: Piece[];
  currentPlayer: Player;
  winner: Player | null;
  player1Moves: number;
  player2Moves: number;
  player1Name: string;
  player2Name: string;
  player1Color: string;
  player2Color: string;
}

const initialPieces: Piece[] = [
  { player: 'player1', position: 0 },
  { player: 'player1', position: 1 },
  { player: 'player1', position: 2 },
  { player: 'player2', position: 6 },
  { player: 'player2', position: 7 },
  { player: 'player2', position: 8 },
];

const adjacentPositions: Record<Position, Position[]> = {
  0: [1, 3, 4],
  1: [0, 2, 4],
  2: [1, 4, 5],
  3: [0, 4, 6],
  4: [0, 1, 2, 3, 5, 6, 7, 8],
  5: [2, 4, 8],
  6: [3, 4, 7],
  7: [4, 6, 8],
  8: [4, 5, 7],
};

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontals
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // verticals
];

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const player1Name = searchParams.get('player1Name') || 'Player 1';
  const player2Name = searchParams.get('player2Name') || 'Player 2';
  const player1Color = searchParams.get('player1Color') || 'red';
  const player2Color = searchParams.get('player2Color') || 'blue';

  const [gameStates, setGameStates] = useState<GameState[]>([{
    pieces: initialPieces,
    currentPlayer: 'player1',
    winner: null,
    player1Moves: 0,
    player2Moves: 0,
    player1Name,
    player2Name,
    player1Color,
    player2Color
  }]);
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [timer, setTimer] = useState(0);

  const currentState = gameStates[currentStateIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!currentState.winner) {
        setTimer(prevTimer => prevTimer + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentState.winner]);

  const handlePieceClick = (piece: Piece) => {
    if (!currentState.winner && piece.player === currentState.currentPlayer) {
      setSelectedPiece(piece);
    }
  };

  const handlePositionClick = (position: Position) => {
    if (currentState.winner || !selectedPiece || !isValidMove(selectedPiece, position)) return;

    const newPieces = currentState.pieces.map(p =>
      p === selectedPiece ? { ...p, position } : p
    );
    
    const newPlayer = currentState.currentPlayer === 'player1' ? 'player2' : 'player1';
    const newWinner = checkWinner(newPieces);

    const newState: GameState = {
      pieces: newPieces,
      currentPlayer: newPlayer,
      winner: newWinner,
      player1Moves: currentState.player1Moves + (currentState.currentPlayer === 'player1' ? 1 : 0),
      player2Moves: currentState.player2Moves + (currentState.currentPlayer === 'player2' ? 1 : 0),
      player1Name: currentState.player1Name,
      player2Name: currentState.player2Name,
      player1Color: currentState.player1Color,
      player2Color: currentState.player2Color
    };

    setGameStates(prevStates => [...prevStates.slice(0, currentStateIndex + 1), newState]);
    setCurrentStateIndex(prevIndex => prevIndex + 1);
    setSelectedPiece(null);
  };

  const isValidMove = (piece: Piece, newPosition: Position) => {
    return (
      adjacentPositions[piece.position].includes(newPosition) &&
      !currentState.pieces.some(p => p.position === newPosition)
    );
  };

  const checkWinner = (pieces: Piece[]): Player | null => {
    for (const line of winningLines) {
      const [a, b, c] = line;
      const piecesOnLine = pieces.filter(p => line.includes(p.position));
      if (
        piecesOnLine.length === 3 &&
        piecesOnLine.every(p => p.player === piecesOnLine[0].player) &&
        !line.every(pos => initialPieces.some(p => p.player === piecesOnLine[0].player && p.position === pos))
      ) {
        return piecesOnLine[0].player;
      }
    }
    return null;
  };

  const resetGame = () => {
    router.push('/');
    // setGameStates([{
    //   pieces: initialPieces,
    //   currentPlayer: 'player1',
    //   winner: null,
    //   player1Moves: 0,
    //   player2Moves: 0,
    //   player1Name,
    //   player2Name,
    //   player1Color,
    //   player2Color
    // }]);
    // setCurrentStateIndex(0);
    // setSelectedPiece(null);
    // setTimer(0);
  };

  const undoMove = () => {
    if (currentStateIndex > 0) {
      setCurrentStateIndex(prevIndex => prevIndex - 1);
      setSelectedPiece(null);
    }
  };

  const redoMove = () => {
    if (currentStateIndex < gameStates.length - 1) {
      setCurrentStateIndex(prevIndex => prevIndex + 1);
      setSelectedPiece(null);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (currentState.winner) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center">
              <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
              {currentState.winner === 'player1' ? currentState.player1Name : currentState.player2Name}!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-2">Movimentos: {currentState.winner === 'player1' ? currentState.player1Moves : currentState.player2Moves}</p>
            <p className="mb-4">Tempo de jogo: {formatTime(timer)}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={resetGame}>
              <RefreshCw className="w-4 h-4 mr-2" /> Novo jogo
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center mb-4">
            Jogador atual: {currentState.currentPlayer === 'player1' ? currentState.player1Name : currentState.player2Name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-80 h-80 mx-auto border-2 border-gray-800">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(position => (
              <div
                key={position}
                className="absolute w-6 h-6 bg-gray-300 rounded-full cursor-pointer transform -translate-x-3 -translate-y-3"
                style={{
                  left: `${(position % 3) * 50}%`,
                  top: `${Math.floor(position / 3) * 50}%`,
                }}
                onClick={() => handlePositionClick(position as Position)}
              >
                {currentState.pieces.map((piece, index) =>
                  piece.position === position ? (
                    <div
                      key={index}
                      className={`w-full h-full rounded-full ${
                        selectedPiece === piece ? 'ring-2 ring-yellow-400' : ''
                      } ${
                        currentState.currentPlayer !== piece.player ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      style={{
                        backgroundColor: piece.player === 'player1' ? player1Color : player2Color
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePieceClick(piece);
                      }}
                    />
                  ) : null
                )}
              </div>
            ))}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1="0%" y1="0%" x2="100%" y2="100%" stroke="black" />
              <line x1="100%" y1="0%" x2="0%" y2="100%" stroke="black" />
              <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="black" />
              <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="black" />
            </svg>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <Timer className="w-5 h-5" />
            <span>{formatTime(timer)}</span>
          </div>
          <div className="flex space-x-2">
            <Button onClick={undoMove} disabled={currentStateIndex === 0}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button onClick={resetGame} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" /> Reiniciar
          </Button>
            <Button onClick={redoMove} disabled={currentStateIndex === gameStates.length - 1}>
             <RotateCcw className="w-4 h-4 transform rotate-180" />
            </Button>
          </div>
          
        </CardFooter>
      </Card>
    </div>
  );
}