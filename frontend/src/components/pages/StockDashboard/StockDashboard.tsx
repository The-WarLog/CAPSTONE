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

const chipStyle = {
    bgcolor: "rgba(99,102,241,0.1)",
    color: "#a5b4fc",
    border: "1px solid rgba(99,102,241,0.2)",
    fontSize: "0.75rem",
    fontWeight: 600,
};

const StatCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <Box
        sx={{
            flex: "1 1 140px",
            bgcolor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "12px",
            p: 2,
        }}
    >
        <Typography sx={{ fontSize: "0.7rem", color: "rgba(148,163,184,0.6)", letterSpacing: "1px", mb: 0.5 }}>
            {label.toUpperCase()}
        </Typography>
        <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: "#e2e8f0" }}>{value}</Typography>
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
                    bgcolor: "#0f172a",
                    color: "#f1f5f9",
                    overflowY: "auto",
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
                        color: "rgba(148,163,184,0.7)",
                        width: "fit-content",
                        "&:hover": { color: "#f1f5f9" },
                        transition: "color 0.15s",
                    }}
                >
                    <ArrowBackIcon sx={{ fontSize: "1rem" }} />
                    <Typography sx={{ fontSize: "0.85rem" }}>Market Dashboard</Typography>
                </Box>

                {error && (
                    <Box sx={{ p: 4, color: "#f87171" }}>
                        <Typography>{error}</Typography>
                    </Box>
                )}

                {!stock && !error && (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
                        <CircularProgress sx={{ color: "#6366f1" }} />
                    </Box>
                )}

                {stock && (
                    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
                        {/* Header */}
                        <Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
                                <Typography
                                    id={`stock-ticker-${stock.ticker}`}
                                    sx={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontWeight: 800,
                                        fontSize: "2rem",
                                        color: "#818cf8",
                                        letterSpacing: "1px",
                                    }}
                                >
                                    {stock.ticker}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontFamily: "'JetBrains Mono', monospace",
                                        fontWeight: 700,
                                        fontSize: "1.5rem",
                                        color: "#4ade80",
                                    }}
                                >
                                    ${stock.price.toFixed(2)}
                                </Typography>
                            </Box>
                            <Typography sx={{ color: "#94a3b8", fontSize: "1rem", mb: 1.5 }}>
                                {stock.companyName}
                            </Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                <Chip label={stock.sector} size="small" sx={chipStyle} />
                                <Chip label={`${stock.marketCap} Cap`} size="small" sx={chipStyle} />
                                <Chip label={`${stock.volatility} Volatility`} size="small" sx={chipStyle} />
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
                                bgcolor: "rgba(255,255,255,0.02)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: "16px",
                                p: 3,
                            }}
                        >
                            <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "rgba(148,163,184,0.6)", letterSpacing: "1px", mb: 2 }}>
                                PRICE HISTORY
                            </Typography>
                            <Box sx={{ height: 360 }}>
                                <AdvancedStockChart ticker={stock.ticker} priceRecords={stock.priceRecords} />
                            </Box>
                        </Box>

                        {/* News releases */}
                        {stock.newsReleases.length > 0 && (
                            <Box
                                sx={{
                                    bgcolor: "rgba(255,255,255,0.02)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    borderRadius: "16px",
                                    p: 3,
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                    <NewspaperIcon sx={{ color: "rgba(148,163,184,0.6)", fontSize: "1rem" }} />
                                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "rgba(148,163,184,0.6)", letterSpacing: "1px" }}>
                                        NEWS & EVENTS
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                    {stock.newsReleases.slice().reverse().map((news, i) => (
                                        <Box key={i}>
                                            {i > 0 && <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", mb: 1 }} />}
                                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                                                <Box>
                                                    <Chip
                                                        label={news.eventType}
                                                        size="small"
                                                        sx={{
                                                            ...chipStyle,
                                                            mb: 0.5,
                                                            fontSize: "0.65rem",
                                                        }}
                                                    />
                                                    <Typography sx={{ fontSize: "0.85rem", color: "#cbd5e1", lineHeight: 1.5 }}>
                                                        {news.template}
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    sx={{
                                                        fontSize: "0.72rem",
                                                        color: "rgba(148,163,184,0.5)",
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