
'use client';

import * as React from 'react';
import { Header } from '@/components/dashboard/header';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { ArrowDown, ArrowUp, ChevronDown, Clock, Flame, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { SimballGame } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DxBallGame } from '@/components/simball/dx-ball-game';

const gamesToBePlayed: SimballGame[] = [
    {
        type: 'BUY',
        crypto: 'BTC',
        quantity: '0.5 Quantity',
        brokerage: '₹50.00',
        time: '3 days ago',
    },
    {
        type: 'SELL',
        crypto: 'ETH',
        quantity: '5 Quantity',
        brokerage: '₹80.00',
        time: '2 days ago',
    },
    {
        type: 'BUY',
        crypto: 'SOL',
        quantity: '10 Quantity',
        brokerage: '₹40.00',
        time: '1 day ago',
    },
];

const gamesPlayed: SimballGame[] = [
    {
        type: 'BUY',
        crypto: 'DOGE',
        quantity: '1000 Quantity',
        brokerage: '₹25.00',
        time: '8 hours ago',
    },
    {
        type: 'SELL',
        crypto: 'SHIB',
        quantity: '500000 Quantity',
        brokerage: '₹35.00',
        time: '2 hours ago',
    },
];

const GameCard = React.memo(({ game, isPlayed, onClick }: { game: SimballGame, isPlayed?: boolean, onClick?: () => void }) => {
    const isBuy = game.type === 'BUY';

    return (
        <Card 
            className={cn(
                "overflow-hidden rounded-2xl shadow-lg",
                isPlayed
                    ? "bg-[#e5e5e5] text-[#333333]" 
                    : "text-white " + (isBuy 
                        ? "bg-gradient-to-br from-green-400 to-emerald-600" 
                        : "bg-gradient-to-br from-red-400 to-rose-600"),
                !isPlayed && "cursor-pointer hover:scale-105 transition-transform duration-200"
            )}
            onClick={onClick}
        >
            <CardContent className="p-6">
                <div className={cn(
                    "flex items-center gap-2 text-sm",
                    isPlayed ? "text-inherit/70" : "text-white/90"
                )}>
                    {isBuy ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    <span>{game.type}</span>
                </div>
                <h3 className="text-4xl font-bold mt-2">{game.crypto}</h3>
                <p className={cn("mt-1", isPlayed ? "text-inherit/60" : "text-white/80")}>{game.quantity}</p>

                <div className={cn(
                    "mt-6 space-y-2 text-sm",
                    isPlayed ? "text-inherit/70" : "text-white/90"
                )}>
                    <p>Brokerage to be earned back: <span className={cn("font-bold", !isPlayed && "text-white")}>{game.brokerage}</span></p>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{game.time}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});
GameCard.displayName = 'GameCard';


export default function SimballPage() {
    const [isLeaderboardOpen, setIsLeaderboardOpen] = React.useState(false);
    const [activeGame, setActiveGame] = React.useState<SimballGame | null>(null);


    const leaderboardData = [
        { rank: 1, name: 'Suraj', cashback: 59000, initial: 'S' },
        { rank: 2, name: 'Anjali', cashback: 52000, initial: 'A' },
        { rank: 3, name: 'Rohit', cashback: 48000, initial: 'R' },
        { rank: 4, name: 'Priya', cashback: 45000, initial: 'P' },
        { rank: 5, name: 'Vikram', cashback: 41000, initial: 'V' },
    ];

    const handlePlayGame = (game: SimballGame) => {
        setActiveGame(game);
    };

    const handleCloseGame = () => {
        setActiveGame(null);
    };


    return (
        <>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 space-y-8 pb-24">
                <div className="max-w-4xl mx-auto w-full space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-primary">Cashback Ball</h1>
                    </div>

                    <Collapsible open={isLeaderboardOpen} onOpenChange={setIsLeaderboardOpen}>
                        <Card className="rounded-2xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white shadow-xl overflow-hidden">
                            <CollapsibleTrigger className="w-full text-left p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Trophy className="w-4 h-4" />
                                            <span>Leading this month:</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <h2 className="text-3xl font-bold">Suraj</h2>
                                            <Flame className="w-6 h-6 text-yellow-300" />
                                        </div>
                                        <p className="text-sm">with ₹59,000</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Avatar>
                                            <AvatarFallback className="bg-white/30 text-white font-bold">S</AvatarFallback>
                                        </Avatar>
                                        <ChevronDown className={cn("w-5 h-5 transition-transform", isLeaderboardOpen && "rotate-180")} />
                                    </div>
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className="bg-white/10 p-4">
                                    <h3 className="font-bold mb-3 text-lg">Leaderboard</h3>
                                    <div className="space-y-2">
                                        {leaderboardData.map(player => (
                                            <div key={player.rank} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold w-6 text-center">{player.rank}</span>
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="bg-white/30 text-white font-bold text-sm">{player.initial}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-semibold">{player.name}</span>
                                                </div>
                                                <span className="font-bold">₹{player.cashback.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Card>
                    </Collapsible>


                    <div>
                        <h2 className="text-xl font-bold mb-4">Games to be played</h2>
                        <div className="space-y-4">
                            {gamesToBePlayed.map((game, index) => (
                                <GameCard key={index} game={game} onClick={() => handlePlayGame(game)} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-4">Games played</h2>
                        <div className="space-y-4">
                            {gamesPlayed.map((game, index) => (
                                <GameCard key={index} game={game} isPlayed />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <BottomNav />
        </div>
        {activeGame && (
            <DxBallGame 
                brokerage={parseInt(activeGame.brokerage.replace('₹', ''))}
                onClose={handleCloseGame}
            />
        )}
        </>
    )
}
