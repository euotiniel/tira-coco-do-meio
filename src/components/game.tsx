"use client"
import React, { useState, useEffect, Suspense } from 'react';
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

export default function  Game() {
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
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={undoMove}>
            <RotateCcw className="w-4 h-4 mr-2" /> Undo
          </Button>
          <Button onClick={redoMove}>
            <RefreshCw className="w-4 h-4 mr-2" /> Redo
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

