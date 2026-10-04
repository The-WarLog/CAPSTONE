import { Box, Chip, CircularProgress, Divider, Typography } from "@mui/material";
import Page from "../../layout/Page";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { StockFullDTO } from "../../../types/StockDTOs";
import { fetchFullStockByTicker } from "../../../api/StockClient";
import AdvancedStockChart from "../../shared/AdvancedStockChart";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

// Banana Life Theme Colors
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

const chipStyle = {
    bgcolor: theme.ph,
    color: theme.ban,
    border: `1px solid ${theme.line}`,
    fontSize: "0.8rem",
    fontWeight: 700,
    fontFamily: "'Nunito', sans-serif",
    borderRadius: "12px",
    padding: "4px 2px",
};

const StatCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <Box
        sx={{
            flex: "1 1 140px",
            bgcolor: theme.card,
            border: `1px solid ${theme.line}`,
            borderRadius: "14px",
            p: 2,
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 4px 12px ${theme.ph}`,
                borderColor: theme.ban2,
            }
        }}
    >
        <Typography sx={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.75rem", color: theme.mute, fontWeight: 700, mb: 0.5 }}>
            {label.toUpperCase()}
        </Typography>
        <Typography sx={{ fontFamily: "'Baloo 2', sans-serif", fontSize: "1.2rem", fontWeight: 600, color: theme.ink, lineHeight: 1.1 }}>
            {value}
        </Typography>
    </Box>
);

const StockDashboard: React.FC = () => {
    const { ticker } = useParams<{ ticker: string }>();
    const [stock, setStock] = useState<StockFullDTO | undefined>();
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!ticker) return;
        fetchFullStockByTicker(ticker)
            .then(setStock)
            .catch(() => setError("Could not load stock data."));
    }, [ticker]);

    return (
        <Page>
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    bgcolor: theme.bg,
                    color: theme.ink,
                    overflowY: "auto",
                    fontFamily: "'Nunito', sans-serif",
                }}
            >
                {/* Back button */}
                <Box
                    onClick={() => navigate("/")}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 3,
                        pb: 0,
                        cursor: "pointer",
                        color: theme.mute,
                        width: "fit-content",
                        "&:hover": { color: theme.ban },
                        transition: "color 0.15s",
                    }}
                >
                    <ArrowBackIcon sx={{ fontSize: "1.1rem" }} />
                    <Typography sx={{ fontFamily: "'Nunito', sans-serif", fontSize: "0.95rem", fontWeight: 700 }}>Market Dashboard</Typography>
                </Box>

                {error && (
                    <Box sx={{ p: 4, color: theme.red }}>
                        <Typography sx={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>{error}</Typography>
                    </Box>
                )}

                {!stock && !error && (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
                        <CircularProgress sx={{ color: theme.ban }} />
                    </Box>
                )}

                {stock && (
                    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3, maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
                        {/* Header */}
                        <Box sx={{ bgcolor: theme.card, p: 3, borderRadius: "20px", border: `2px solid ${theme.line}` }}>
                            <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, mb: 1, flexWrap: "wrap" }}>
                                <Typography
                                    id={`stock-ticker-${stock.ticker}`}
                                    sx={{
                                        fontFamily: "'Baloo 2', sans-serif",
                                        fontWeight: 800,
                                        fontSize: "2.8rem",
                                        color: theme.ban,
                                        lineHeight: 1,
                                    }}
                                >
                                    {stock.ticker}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: "'Baloo 2', sans-serif",
                                        fontWeight: 800,
                                        fontSize: "2rem",
                                        color: theme.leaf,
                                        lineHeight: 1,
                                        textShadow: `0 2px 10px ${theme.leaf}33`,
                                    }}
                                >
                                    🍌{stock.price.toFixed(2)}
                                </Typography>
                            </Box>
                            <Typography sx={{ color: theme.mute, fontFamily: "'Nunito', sans-serif", fontSize: "1.1rem", fontWeight: 600, mb: 2 }}>
                                {stock.companyName}
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                                <Chip label={stock.sector} size="small" sx={chipStyle} />
                                <Chip label={`${stock.marketCap} Cap`} size="small" sx={chipStyle} />
                                <Chip label={`Risk: ${stock.volatility}`} size="small" sx={chipStyle} />
                                <Chip label={`Rating: ${stock.investorRating}`} size="small" sx={chipStyle} />
                            </Box>
                        </Box>

                        {/* Stat cards */}
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                            <StatCard label="Sector" value={stock.sector} />
                            <StatCard label="Market Cap" value={stock.marketCap} />
                            <StatCard label="Volatility" value={stock.volatility} />
                            <StatCard label="Investor Rating" value={stock.investorRating} />
                            <StatCard label="Price Records" value={`${stock.priceRecords.length}`} />
                            <StatCard label="News Events" value={`${stock.newsReleases.length}`} />
                        </Box>

                        {/* Price chart */}
                        <Box
                            sx={{
                                bgcolor: theme.card,
                                border: `2px solid ${theme.line}`,
                                borderRadius: "20px",
                                p: 3,
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                <Typography sx={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "'Baloo 2', sans-serif", color: theme.ink }}>
                                    📈 PRICE HISTORY
                                </Typography>
                            </Box>
                            <Box sx={{ height: 400 }}>
                                <AdvancedStockChart ticker={stock.ticker} priceRecords={stock.priceRecords} />
                            </Box>
                        </Box>

                        {/* News releases */}
                        {stock.newsReleases.length > 0 && (
                            <Box
                                sx={{
                                    bgcolor: theme.card,
                                    border: `2px solid ${theme.line}`,
                                    borderRadius: "20px",
                                    p: 3,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                                    <Typography sx={{ fontSize: "1.4rem", fontWeight: 800, fontFamily: "'Baloo 2', sans-serif", color: theme.ink }}>
                                        📰 NEWS & EVENTS
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    {stock.newsReleases.slice().reverse().map((news, i) => (
                                        <Box key={i} sx={{ 
                                            padding: "16px", 
                                            borderLeft: `5px solid ${theme.ban2}`, 
                                            bgcolor: theme.ph, 
                                            borderRadius: "8px 16px 16px 8px" 
                                        }}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                                                <Box>
                                                    <Chip
                                                        label={news.eventType}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: theme.line,
                                                            color: theme.ink,
                                                            fontWeight: 800,
                                                            fontSize: "0.7rem",
                                                            mb: 1,
                                                            height: "22px"
                                                        }}
                                                    />
                                                    <Typography sx={{ fontFamily: "'Nunito', sans-serif", fontSize: "1rem", color: theme.ink, fontWeight: 600, lineHeight: 1.4 }}>
                                                        {news.template}
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    sx={{
                                                        fontFamily: "'Nunito', sans-serif",
                                                        fontSize: "0.8rem",
                                                        color: theme.mute,
                                                        fontWeight: 700,
                                                        whiteSpace: "nowrap",
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {new Intl.DateTimeFormat("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        timeZone: "UTC",
                                                    }).format(new Date(news.dateReleased))}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </Page>
    );
};

export default StockDashboard;