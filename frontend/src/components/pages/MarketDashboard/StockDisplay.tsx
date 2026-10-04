import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { CircularProgress, Typography } from "@mui/material";
import { fetchAllStocks } from "../../../api/StockClient";
import type { StockBasicDTO } from "../../../types/StockDTOs";
import { useNavigate } from "react-router-dom";

const RETRY_INTERVAL = 5000;

const theme = {
    bg: "#0f1f22",
    card: "#1a3034",
    ink: "#e8f4f1",
    mute: "#93b0b3",
    ban: "#ffcf33",
    ban2: "#e9b400",
    leaf: "#4cc989",
    red: "#ef7070",
    line: "#2b4549",
    ph: "#142629"
};

const StockDisplay: React.FC = () => {
    const [stocks, setStocks] = useState<StockBasicDTO[] | undefined>();
    const [connecting, setConnecting] = useState(true);
    const navigate = useNavigate();
    // Track whether we are still mounted so we don't setState after unmount
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;

        const attempt = () => {
            fetchAllStocks()
                .then((data) => {
                    if (!mountedRef.current) return;
                    setStocks(data);
                    setConnecting(false);
                })
                .catch(() => {
                    if (!mountedRef.current) return;
                    setConnecting(true);
                });
        };

        attempt(); // fire immediately
        const id = setInterval(attempt, RETRY_INTERVAL);

        return () => {
            mountedRef.current = false;
            clearInterval(id);
        };
    }, []); // run only once on mount — no dependency loop

    if (connecting || !stocks) {
        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 3 }}>
                <CircularProgress size={18} sx={{ color: theme.ban }} />
                <Typography sx={{ color: theme.mute, fontSize: "0.85rem", fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
                    Loading bananas…
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%", flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
            {/* News Ticker */}
        <Box sx={{ overflow: "hidden", whiteSpace: "nowrap", bgcolor: theme.line, color: theme.ink, py: 1, px: 2, borderRadius: "10px", mb: 1 }}>
            <Typography sx={{ display: "inline-block", fontFamily: "'Nunito', sans-serif", fontSize: "0.85rem", animation: "scroll 15s linear infinite" }}>
                📣 JUNGLE RUMORS: CocoCoin CEO seen burying bananas; stock plummets! • Shortage of peels causes Peel Bonds to surge! • Gorilla Gus says he will break knees if not paid •
            </Typography>
            <style>
                {`@keyframes scroll { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }`}
            </style>
        </Box>

        {/* Jungle Index */}
        {stocks.length > 0 && (() => {
            const totalIndex = stocks.reduce((acc, s) => acc + s.price, 0);
            const prevIndex = totalIndex * 0.98; // dummy logic for trend
            const isBull = totalIndex >= prevIndex;
            return (
                <Box sx={{ bgcolor: isBull ? `${theme.leaf}22` : `${theme.red}22`, border: `2px solid ${isBull ? theme.leaf : theme.red}`, borderRadius: "16px", p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, color: isBull ? theme.leaf : theme.red, fontFamily: "'Baloo 2', sans-serif" }}>🌴 JUNGLE INDEX (JSE)</Typography>
                        <Typography sx={{ color: theme.mute, fontFamily: "'Nunito', sans-serif" }}>Overall market health indicator</Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                        <Typography sx={{ fontSize: "2.5rem", fontWeight: 800, color: isBull ? theme.leaf : theme.red, fontFamily: "'Baloo 2', sans-serif", lineHeight: 1 }}>{totalIndex.toFixed(2)}</Typography>
                    </Box>
                </Box>
            )
        })()}

        {/* Header row */}
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr 1fr",
                px: 2,
                py: 1,
                mb: 0.5,
            }}
        >
            {["Ticker", "Company", "Price"].map((h) => (
                <Typography
                    key={h}
                    sx={{
                        fontSize: "0.8rem",
                        fontWeight: 800,
                        color: theme.mute,
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        fontFamily: "'Baloo 2', sans-serif"
                    }}
                >
                    {h}
                </Typography>
            ))}
        </Box>

        {/* Stock rows */}
        {stocks.map((stock, i) => {
            const isTrending = i % 3 !== 1;
            return (
                <Box
                    key={stock.ticker}
                    id={`stock-row-${stock.ticker}`}
                    onClick={() => navigate(`/stocks/${stock.ticker}`)}
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 2fr 1fr",
                        alignItems: "center",
                        px: 2,
                        py: 1.5,
                        bgcolor: theme.card,
                        borderRadius: "14px",
                        cursor: "pointer",
                        border: `1px solid ${theme.line}`,
                        borderLeft: `5px solid ${isTrending ? theme.leaf : theme.red}`,
                        transition: "all 0.15s ease",
                        "&:hover": {
                            bgcolor: theme.ph,
                            borderColor: theme.ban2,
                            transform: "translateY(-2px)",
                            boxShadow: `0 4px 10px rgba(0,0,0,0.2)`
                        },
                    }}
                >
                    {/* Ticker */}
                    <Typography
                        sx={{
                            fontFamily: "'Baloo 2', sans-serif",
                            fontWeight: 800,
                            fontSize: "1.1rem",
                            color: theme.ink,
                            letterSpacing: "0.5px",
                        }}
                    >
                        {stock.ticker}
                    </Typography>

                    {/* Company name */}
                    <Typography
                        sx={{
                            fontSize: "0.95rem",
                            color: theme.mute,
                            fontWeight: 700,
                            fontFamily: "'Nunito', sans-serif",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            pr: 1,
                        }}
                    >
                        {stock.companyName}
                    </Typography>

                    {/* Price */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Typography
                            sx={{
                                fontFamily: "'Baloo 2', sans-serif",
                                fontWeight: 800,
                                fontSize: "1.1rem",
                                color: isTrending ? theme.leaf : theme.red,
                            }}
                        >
                            🍌{stock.price.toFixed(2)}
                        </Typography>
                    </Box>
                </Box>
            );
        })}

        {stocks.length === 0 && (
            <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography sx={{ color: theme.mute, fontSize: "0.9rem", fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>
                    No bananas in the market yet.
                </Typography>
            </Box>
        )}
    </Box>
    );
};

export default StockDisplay;