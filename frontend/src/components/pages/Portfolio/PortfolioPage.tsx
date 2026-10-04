import { Box, Typography } from "@mui/material";
import Page from "../../layout/Page";
import { usePlayer } from "../../../context/PlayerContext";

const theme = { bg: "#0f1f22", card: "#1a3034", ink: "#e8f4f1", mute: "#93b0b3", ban: "#ffcf33", ban2: "#e9b400", leaf: "#4cc989", red: "#ef7070", line: "#2b4549", ph: "#142629" };

const PortfolioPage: React.FC = () => {
    const { state } = usePlayer();

    const portfolioItems = Object.entries(state.portfolio);
    const hasItems = portfolioItems.length > 0;

    return (
        <Page>
            <Box sx={{ width: "100%", height: "100%", overflowY: "auto", p: 4, bgcolor: theme.bg, color: theme.ink, fontFamily: "'Nunito', sans-serif" }}>
                <Typography sx={{ fontFamily: "'Baloo 2', sans-serif", fontSize: "2.5rem", color: theme.ban, fontWeight: 800, mb: 1 }}>
                    💼 Your Portfolio Backpack
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mt: 3 }}>
                    {!hasItems && (
                        <Box sx={{ bgcolor: theme.card, p: 4, borderRadius: "14px", border: `2px solid ${theme.line}`, textAlign: "center" }}>
                            <Typography sx={{ color: theme.mute, fontSize: "1.2rem" }}>Your backpack is empty. Buy some stocks in the Market!</Typography>
                        </Box>
                    )}
                    
                    {portfolioItems.map(([ticker, data]) => (
                        <Box key={ticker} sx={{ bgcolor: theme.card, p: 3, borderRadius: "14px", border: `2px solid ${theme.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, fontFamily: "'Baloo 2', sans-serif" }}>{ticker}</Typography>
                                <Typography sx={{ color: theme.mute }}>{data.shares.toFixed(2)} Shares</Typography>
                            </Box>
                            <Box sx={{ textAlign: "right" }}>
                                <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, color: theme.ink }}>Paid 🍌{data.averagePrice.toFixed(2)} avg</Typography>
                                <Typography sx={{ color: theme.mute }}>Total Value: 🍌{(data.shares * data.averagePrice).toFixed(2)}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Page>
    );
};

export default PortfolioPage;
