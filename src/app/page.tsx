"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Footer from "@/components/footer";

interface Player {
  name: string;
  color: 'red' | 'blue' | 'green' | 'yellow';
}

const colorClasses: { [key in Player['color']]: string } = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
};

export default function Page() {  
  const [player1, setPlayer1] = useState<Player>({ name: '', color: 'red' });
  const [player2, setPlayer2] = useState<Player>({ name: '', color: 'blue' });
  const router = useRouter();

  const handleStartGame = () => {
    if (player1.name && player2.name && player1.color !== player2.color) {
      const queryParams = new URLSearchParams({
        player1Name: player1.name,
        player1Color: player1.color,
        player2Name: player2.name,
        player2Color: player2.color,
      }).toString();
      router.push(`/game?${queryParams}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-10 min-h-screen bg-gray-100">
      <Card className="w-96 mb-10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Tira 💩 do meio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[player1, player2].map((player, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`player${index + 1}Name`}>Jogador {index + 1}</Label>
              <Input
                id={`player${index + 1}Name`}
                value={player.name}
                onChange={(e) => index === 0 
                  ? setPlayer1({ ...player1, name: e.target.value })
                  : setPlayer2({ ...player2, name: e.target.value })
                }
                placeholder={`Nome do jogador ${index + 1}`}
              />
              <RadioGroup
                value={player.color}
                onValueChange={(value: 'red' | 'blue' | 'green' | 'yellow') => 
                  index === 0
                    ? setPlayer1({ ...player1, color: value })
                    : setPlayer2({ ...player2, color: value })
                }
                className="flex space-x-2"
              >
                {['red', 'blue', 'green', 'yellow'].map((color) => (
                  <div key={color} className="flex items-center space-x-1">
                    <RadioGroupItem value={color} id={`${index}-${color}`} />
                    <Label 
                      htmlFor={`${index}-${color}`} 
                      className={`w-4 h-4 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`} 
                    />
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleStartGame} 
            className="w-full"
            disabled={!player1.name || !player2.name || player1.color === player2.color}
          >
            Começar o jogo 
          </Button>
        </CardFooter>
      </Card>
      <Footer />
    </div>
  );
}
