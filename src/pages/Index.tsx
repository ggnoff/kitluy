import { useState, useRef } from "react";
import { Check, RotateCcw, Edit, UserPlus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface Player {
  id: number;
  name: string;
  image: string;
  hasPaid: boolean;
}

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 1,
      name: "Sarah",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=200&h=200&fit=crop&crop=face",
      hasPaid: false,
    },
    {
      id: 2,
      name: "Alex",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop&crop=face",
      hasPaid: false,
    },
    {
      id: 3,
      name: "Jamie",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=200&h=200&fit=crop&crop=face",
      hasPaid: false,
    },
    {
      id: 4,
      name: "Taylor",
      image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=200&h=200&fit=crop&crop=face",
      hasPaid: false,
    },
  ]);

  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio with cash register sound
  useState(() => {
    const audio = new Audio();
    // Using a free cash register sound effect URL
    audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYcBj2X2+u/dSMFl47a8KWOQQ0PVqzn77BdGAg+ltn0unEiBC13yO/eizEIGGS57OihUgwKU6jh8bllHgg2jdXzzn0vBSF+zPLZgjMIFWq+8OScTgwNU6jn8bJtGwk4k9n0vnkgBSl+1OuqXhYJTa7j7bVzIgU6hdbxtnUiBC57x/LPgCgGGF++8N2PQgwKUarm7bduIAU7g9nzuHAfBC55ye/cgCsGHWK66d2PRgwOUKvj7LVwIAY6hdfsv3QgBSx2xe3cgSkGHGS96t6GSgwPTKzh8LJrHAc8iNXwtnMjBj+Sx+nRfSkGl42u58J2JQZR0O7m0XsrBiF+zfHZgDQIF2m98N6OPwoKUp/h7bVwIQc8gsHwu3cgBTCF1OvHfCkHJXjJ7N+PQgsLUKjg7bVyIQY7hdnyu3QjBSt1xe7dijEIF2y+8+OZUQ4SUqjg7LBqGgU9i9fyw3kpBSR7z+zaizUIGGG76eOaUQ4SUqjj7bBvGwY+jNbyu3YkBSJ7xe3djDUIGWS+8OOZUw4SUqfg7LJsGQU9ltryu3cnBC59yO7ZizAJF2W9sOOZUg4LUark7bRvGwY7itbzunUnBil5zuvXjDIHGWS84d6OPhUSTKfa7bRwHwc9iNnyunIlBSR4ze3djDIIGmG76d6OPRILUKjh7rNuGgY9itrzunQlBSR6yO3aizEJGWC8gPBcHO=";
    audio.preload = "auto";
    audioRef.current = audio;
  });

  const togglePaymentStatus = (playerId: number) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    setPlayers(prevPlayers =>
      prevPlayers.map(p =>
        p.id === playerId
          ? { ...p, hasPaid: !p.hasPaid }
          : p
      )
    );

    // Play cash register sound when marking as paid
    if (!player.hasPaid && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
    
    toast({
      title: player.hasPaid ? "Payment Removed" : "Payment Confirmed",
      description: `${player.name} ${player.hasPaid ? "is now unpaid" : "has paid"}!`,
    });
  };

  const resetAllPayments = () => {
    setPlayers(prevPlayers =>
      prevPlayers.map(player => ({ ...player, hasPaid: false }))
    );
    toast({
      title: "New Round Started",
      description: "All payments have been reset!",
    });
  };

  const handleImageUpload = (playerId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setPlayers(prevPlayers =>
        prevPlayers.map(player =>
          player.id === playerId
            ? { ...player, image: imageUrl }
            : player
        )
      );
      toast({
        title: "Profile Updated",
        description: "Profile picture has been updated!",
      });
    };
    reader.readAsDataURL(file);
  };

  const openFileDialog = (playerId: number) => {
    fileInputRefs.current[playerId]?.click();
  };

  const addNewUser = () => {
    const newId = Math.max(...players.map(p => p.id)) + 1;
    const newPlayer: Player = {
      id: newId,
      name: `Player ${newId}`,
      image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=200&h=200&fit=crop&crop=face",
      hasPaid: false,
    };
    
    setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
    toast({
      title: "Player Added",
      description: `${newPlayer.name} has been added to the tracker!`,
    });
  };

  const removePlayer = (playerId: number) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    setPlayers(prevPlayers => prevPlayers.filter(p => p.id !== playerId));
    toast({
      title: "Player Removed",
      description: `${player.name} has been removed from the tracker!`,
    });
  };

  const paidCount = players.filter(player => player.hasPaid).length;
  const totalPlayers = players.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Payment Tracker
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-white rounded-lg px-6 py-3 shadow-md">
              <span className="text-2xl font-semibold text-gray-700">
                {paidCount} / {totalPlayers} Paid
              </span>
            </div>
            <Button
              onClick={resetAllPayments}
              variant="outline"
              className="bg-white hover:bg-gray-50 border-gray-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              New Round
            </Button>
            <Button
              onClick={addNewUser}
              variant="outline"
              className="bg-green-500 hover:bg-green-600 text-white border-green-500"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Player
            </Button>
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {players.map((player) => (
            <Card
              key={player.id}
              className={`transition-all duration-300 transform hover:scale-105 ${
                player.hasPaid
                  ? "ring-2 ring-green-400 bg-green-50"
                  : "bg-white hover:shadow-lg"
              }`}
            >
              <CardContent className="p-6">
                <div className="text-center">
                  {/* Remove Player Button */}
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={() => removePlayer(player.id)}
                      className="bg-red-500 hover:bg-red-600 rounded-full p-1 text-white shadow-md transition-colors"
                      title="Remove player"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Profile Picture */}
                  <div className="relative mb-4">
                    <img
                      src={player.image}
                      alt={player.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => openFileDialog(player.id)}
                    />
                    <button
                      onClick={() => openFileDialog(player.id)}
                      className="absolute -bottom-1 -right-1 bg-blue-500 hover:bg-blue-600 rounded-full p-1 text-white shadow-md transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    {player.hasPaid && (
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <input
                      ref={(el) => fileInputRefs.current[player.id] = el}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(player.id, e)}
                    />
                  </div>

                  {/* Player Name */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {player.name}
                  </h3>

                  {/* Payment Button */}
                  <Button
                    onClick={() => togglePaymentStatus(player.id)}
                    className={`w-full transition-all duration-300 ${
                      player.hasPaid
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {player.hasPaid ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Paid
                      </>
                    ) : (
                      "Not Paid"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Indicator */}
        {paidCount === totalPlayers && totalPlayers > 0 && (
          <div className="mt-8 text-center">
            <div className="bg-green-500 text-white rounded-lg px-8 py-4 inline-block shadow-lg animate-pulse">
              <h2 className="text-xl font-bold">🎉 Everyone has paid! 🎉</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
