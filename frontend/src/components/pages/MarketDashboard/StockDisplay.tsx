import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { CircularProgress, Typography } from "@mui/material";
import { fetchAllStocks } from "../../../api/StockClient";
import type { StockBasicDTO } from "../../../types/StockDTOs";
import { useNavigate } from "react-router-dom";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const RETRY_INTERVAL = 5000;

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
                <CircularProgress size={18} sx={{ color: "#6366f1" }} />
                <Typography sx={{ color: "rgba(148,163,184,0.6)", fontSize: "0.85rem" }}>
                    Loading stocks…
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%", flex: 1, overflowY: "auto", p: 2 }}>
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
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "rgba(148,163,184,0.6)",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
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
                            mb: 0.5,
                            borderRadius: "10px",
                            cursor: "pointer",
                            border: "1px solid transparent",
                            transition: "all 0.15s ease",
                            "&:hover": {
                                bgcolor: "rgba(99,102,241,0.07)",
                                border: "1px solid rgba(99,102,241,0.2)",
                                transform: "translateY(-1px)",
                            },
                        }}
                    >
                        {/* Ticker */}
                        <Typography
                            sx={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontWeight: 700,
                                fontSize: "0.9rem",
                                color: "#818cf8",
                                letterSpacing: "0.5px",
                            }}
                        >
                            {stock.ticker}
                        </Typography>

                        {/* Company name */}
                        <Typography
                            sx={{
                                fontSize: "0.85rem",
                                color: "#cbd5e1",
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
                            {isTrending ? (
                                <TrendingUpIcon sx={{ fontSize: "0.85rem", color: "#4ade80" }} />
                            ) : (
                                <TrendingDownIcon sx={{ fontSize: "0.85rem", color: "#f87171" }} />
                            )}
                            <Typography
                                sx={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    color: isTrending ? "#4ade80" : "#f87171",
                                }}
                            >
                                ${stock.price.toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>
                );
            })}

            {stocks.length === 0 && (
                <Box sx={{ p: 4, textAlign: "center" }}>
                    <Typography sx={{ color: "rgba(148,163,184,0.5)", fontSize: "0.9rem" }}>
                        No stocks in the market yet.
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default StockDisplay;