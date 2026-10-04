import { Box, Typography, Button } from "@mui/material";
import Page from "../../layout/Page";
import { usePlayer } from "../../../context/PlayerContext";

const theme = { bg: "#0f1f22", card: "#1a3034", ink: "#e8f4f1", mute: "#93b0b3", ban: "#ffcf33", ban2: "#e9b400", leaf: "#4cc989", red: "#ef7070", line: "#2b4549", ph: "#142629" };

const NPCS = [
    { id: "bank", n: "Bank Baboon", e: "🏦", rate: 0.08, max: 600, d: "The bank. 8% interest and strict about due dates." },
    { id: "gus", n: "Gorilla Gus", e: "🦍", rate: 0.35, max: 1000, d: "Loan shark. Fast cash at 35% interest." },
];

const LoansPage: React.FC = () => {
    const { state, takeLoan, repayLoan } = usePlayer();

    const handleBorrow = (c: typeof NPCS[0], amount: number) => {
        takeLoan(c.id, amount, c.rate, 0);
    };

    return (
        <Page>
            <Box sx={{ width: "100%", height: "100%", overflowY: "auto", p: 4, bgcolor: theme.bg, color: theme.ink, fontFamily: "'Nunito', sans-serif" }}>
                <Typography sx={{ fontFamily: "'Baloo 2', sans-serif", fontSize: "2.5rem", color: theme.ban, fontWeight: 800, mb: 1 }}>
                    🤝 Contacts (Borrowing)
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                    <Box>
                        <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, mb: 2 }}>Borrow Money</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {NPCS.map((c, i) => (
                                <Box key={i} sx={{ bgcolor: theme.card, p: 3, borderRadius: "14px", border: `2px solid ${theme.line}` }}>
                                    <Typography sx={{ fontSize: "1.3rem", fontWeight: 700 }}>{c.e} {c.n}</Typography>
                                    <Typography sx={{ color: theme.mute, mb: 2 }}>{c.d}</Typography>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button onClick={() => handleBorrow(c, c.max / 3)} sx={{ bgcolor: theme.line, color: theme.ink, flex: 1 }}>Borrow 🍌{(c.max / 3).toFixed(0)}</Button>
                                        <Button onClick={() => handleBorrow(c, c.max)} sx={{ bgcolor: theme.line, color: theme.ink, flex: 1 }}>Borrow 🍌{c.max}</Button>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    <Box>
                        <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, mb: 2 }}>Your Debts</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {state.loans.length === 0 && <Typography sx={{ color: theme.mute }}>No debts! Good monkey.</Typography>}
                            {state.loans.map((l, i) => {
                                const c = NPCS.find(n => n.id === l.who);
                                return (
                                    <Box key={i} sx={{ bgcolor: theme.card, p: 3, borderRadius: "14px", border: `2px solid ${theme.red}` }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box>
                                                <Typography sx={{ fontSize: "1.2rem", fontWeight: 700 }}>{c?.e} {c?.n}</Typography>
                                                <Typography sx={{ color: theme.red }}>Owe: 🍌{l.amount.toFixed(2)} at {(l.rate * 100).toFixed(0)}%</Typography>
                                            </Box>
                                            <Button onClick={() => repayLoan(l.who, l.amount)} sx={{ bgcolor: theme.ban, color: "#2b2200", fontWeight: 700 }}>Repay</Button>
                                        </Box>
                                    </Box>
                                )
                            })}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Page>
    );
};

export default LoansPage;
