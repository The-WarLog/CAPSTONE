import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Loan {
    who: string;
    amount: number;
    rate: number;
    dueDate: number; // market tick timestamp or simple tick count
}

export interface PlayerState {
    bananas: number;
    traderIQ: number;
    happiness: number;
    portfolio: Record<string, { shares: number, averagePrice: number }>;
    loans: Loan[];
    jobSlots: number;
}

interface PlayerContextType {
    state: PlayerState;
    earnBananas: (amount: number) => void;
    spendBananas: (amount: number) => boolean;
    buyStock: (ticker: string, shares: number, price: number) => boolean;
    sellStock: (ticker: string, shares: number, price: number) => boolean;
    takeLoan: (who: string, amount: number, rate: number, dueDate: number) => void;
    repayLoan: (who: string, amount: number) => boolean;
    updateMood: (happinessDelta: number, iqDelta: number) => void;
    useJobSlot: () => boolean;
    refreshJobSlots: () => void;
}

const defaultState: PlayerState = {
    bananas: 500,
    traderIQ: 20,
    happiness: 70,
    portfolio: {},
    loans: [],
    jobSlots: 3,
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<PlayerState>(() => {
        const saved = localStorage.getItem('player_state');
        return saved ? JSON.parse(saved) : defaultState;
    });

    useEffect(() => {
        localStorage.setItem('player_state', JSON.stringify(state));
    }, [state]);

    const earnBananas = (amount: number) => {
        setState(prev => ({ ...prev, bananas: prev.bananas + amount }));
    };

    const spendBananas = (amount: number) => {
        if (state.bananas >= amount) {
            setState(prev => ({ ...prev, bananas: prev.bananas - amount }));
            return true;
        }
        return false;
    };

    const buyStock = (ticker: string, shares: number, price: number) => {
        const cost = shares * price * 1.01; // 1% fee
        if (state.bananas < cost) return false;

        setState(prev => {
            const current = prev.portfolio[ticker] || { shares: 0, averagePrice: 0 };
            const totalShares = current.shares + shares;
            const totalCost = (current.shares * current.averagePrice) + (shares * price);
            
            return {
                ...prev,
                bananas: prev.bananas - cost,
                portfolio: {
                    ...prev.portfolio,
                    [ticker]: {
                        shares: totalShares,
                        averagePrice: totalCost / totalShares
                    }
                }
            };
        });
        return true;
    };

    const sellStock = (ticker: string, shares: number, price: number) => {
        const current = state.portfolio[ticker];
        if (!current || current.shares < shares) return false;

        const revenue = shares * price * 0.99; // 1% fee

        setState(prev => {
            const newPortfolio = { ...prev.portfolio };
            newPortfolio[ticker].shares -= shares;
            if (newPortfolio[ticker].shares <= 0) {
                delete newPortfolio[ticker];
            }

            return {
                ...prev,
                bananas: prev.bananas + revenue,
                portfolio: newPortfolio
            };
        });
        return true;
    };

    const takeLoan = (who: string, amount: number, rate: number, dueDate: number) => {
        setState(prev => ({
            ...prev,
            bananas: prev.bananas + amount,
            loans: [...prev.loans, { who, amount, rate, dueDate }]
        }));
    };

    const repayLoan = (who: string, amount: number) => {
        if (state.bananas < amount) return false;
        
        setState(prev => {
            const newLoans = [...prev.loans];
            const loanIndex = newLoans.findIndex(l => l.who === who);
            if (loanIndex >= 0) {
                newLoans[loanIndex].amount -= amount;
                if (newLoans[loanIndex].amount <= 0) {
                    newLoans.splice(loanIndex, 1);
                }
            }
            return {
                ...prev,
                bananas: prev.bananas - amount,
                loans: newLoans
            };
        });
        return true;
    };

    const updateMood = (hDelta: number, iqDelta: number) => {
        setState(prev => ({
            ...prev,
            happiness: Math.max(0, Math.min(100, prev.happiness + hDelta)),
            traderIQ: Math.max(0, Math.min(100, prev.traderIQ + iqDelta)),
        }));
    };

    const useJobSlot = () => {
        if (state.jobSlots > 0) {
            setState(prev => ({ ...prev, jobSlots: prev.jobSlots - 1 }));
            return true;
        }
        return false;
    };

    const refreshJobSlots = () => {
        setState(prev => ({ ...prev, jobSlots: 3 }));
    };

    return (
        <PlayerContext.Provider value={{
            state, earnBananas, spendBananas, buyStock, sellStock, takeLoan, repayLoan, updateMood, useJobSlot, refreshJobSlots
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) throw new Error("usePlayer must be used within PlayerProvider");
    return context;
};
