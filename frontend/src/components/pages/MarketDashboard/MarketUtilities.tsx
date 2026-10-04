import Box from "@mui/material/Box";
import { useEffect, useRef, useState } from "react";
import { mapDTO, type MarketState, type MarketStateDTO } from "../../../types/MarketDTOs";
import { fetchMarketState, fetchPauseMarket, fetchResumeMarket, fetchUpdateInterval } from "../../../api/MarketClient";
import { Chip, CircularProgress, IconButton, Typography } from "@mui/material";
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FastForwardIcon from '@mui/icons-material/FastForward';

const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
});

const DEFAULT_INTERVAL = 10_000;

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

const MarketUtilities: React.FC = () => {
    const [marketState, setMarketState] = useState<MarketState | undefined>();
    const [connecting, setConnecting] = useState(true);
    const mountedRef = useRef(true);
    // Keep a ref to the current interval so we can reschedule when interval changes
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const pollMarket = () => {
        fetchMarketState()
            .then((res: MarketStateDTO) => {
                if (!mountedRef.current) return;
                setMarketState(mapDTO(res));
                setConnecting(false);
            })
            .catch(() => {
                if (!mountedRef.current) return;
                setConnecting(true);
            });
    };

    // Reschedule whenever the market interval changes
    useEffect(() => {
        mountedRef.current = true;
        const intervalMs = marketState?.currentIntervalMs ?? DEFAULT_INTERVAL;

        pollMarket(); // immediate poll on mount or interval change

        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(pollMarket, intervalMs);

        return () => {
            mountedRef.current = false;
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [marketState?.currentIntervalMs]); // only reschedule when the interval setting changes

    const updateMarketStatus = async () => {
        if (marketState == null) return;
        if (marketState.isRunning) {
            fetchPauseMarket().then((res: MarketStateDTO) => setMarketState(mapDTO(res)));
        } else {
            fetchResumeMarket().then((res: MarketStateDTO) => setMarketState(mapDTO(res)));
        }
    };

    const updateMarketInterval = async (doIncrease: boolean) => {
        if (marketState == null) return;
        const newMs = doIncrease
            ? marketState.currentIntervalMs + 500
            : marketState.currentIntervalMs - 500;
        fetchUpdateInterval(newMs).then((res: MarketStateDTO) => setMarketState(mapDTO(res)));
    };

    if (connecting || marketState == null) {
        return (
            <Box sx={{
                display: "flex", alignItems: "center", gap: 2,
                p: 3, borderBottom: `1px solid ${theme.line}`,
            }}>
                <CircularProgress size={18} sx={{ color: theme.ban }} />
                <Typography sx={{ color: theme.mute, fontSize: "0.85rem", fontFamily: "'Nunito', sans-serif" }}>
                    Connecting to market service…
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            p: 3,
            borderBottom: `2px solid ${theme.line}`,
        }}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                <Typography sx={{ fontSize: "1.6rem", fontWeight: 800, color: theme.ink, letterSpacing: "-0.5px", fontFamily: "'Baloo 2', sans-serif" }}>
                    {dateFormatter.format(marketState.date)}
                </Typography>
                <Chip
                    label={marketState.isRunning ? "LIVE" : "PAUSED"}
                    size="small"
                    sx={{
                        bgcolor: marketState.isRunning ? `${theme.leaf}22` : `${theme.red}22`,
                        color: marketState.isRunning ? theme.leaf : theme.red,
                        border: `2px solid ${marketState.isRunning ? theme.leaf : theme.red}`,
                        fontWeight: 800,
                        fontSize: "0.7rem",
                        fontFamily: "'Nunito', sans-serif",
                        height: "24px"
                    }}
                />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Typography sx={{ color: theme.mute, fontSize: "0.95rem", fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}>
                    {timeFormatter.format(marketState.date)}
                </Typography>
                <Typography sx={{ color: theme.line, fontSize: "0.95rem" }}>·</Typography>
                <Typography sx={{ color: theme.mute, fontSize: "0.95rem", fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}>
                    Interval: {marketState.currentIntervalMs / 1000}s
                </Typography>
                <Typography sx={{ color: theme.line, fontSize: "0.95rem" }}>·</Typography>
                <Typography sx={{ color: theme.mute, fontSize: "0.95rem", fontFamily: "'Nunito', sans-serif", textTransform: "capitalize", fontWeight: 600 }}>
                    {marketState.trajectory?.toLowerCase()}
                </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                    onClick={() => updateMarketInterval(false)}
                    size="small"
                    sx={{ 
                        color: theme.ink,
                        bgcolor: theme.card,
                        border: `2px solid ${theme.line}`,
                        "&:hover": { bgcolor: theme.ph, borderColor: theme.ban } 
                    }}
                >
                    <FastForwardIcon sx={{ transform: 'scaleX(-1)', fontSize: "1.2rem" }} />
                </IconButton>
                <IconButton
                    onClick={updateMarketStatus}
                    size="small"
                    sx={{
                        color: theme.ink,
                        bgcolor: marketState.isRunning ? theme.ban : theme.card,
                        border: `2px solid ${marketState.isRunning ? theme.ban2 : theme.line}`,
                        borderRadius: "12px",
                        mx: 0.5,
                        px: 2,
                        "&:hover": { bgcolor: marketState.isRunning ? theme.ban2 : theme.ph }
                    }}
                >
                    {marketState.isRunning ? <PauseIcon sx={{ fontSize: "1.4rem", color: "#2b2200" }} /> : <PlayArrowIcon sx={{ fontSize: "1.4rem" }} />}
                </IconButton>
                <IconButton
                    onClick={() => updateMarketInterval(true)}
                    size="small"
                    sx={{ 
                        color: theme.ink,
                        bgcolor: theme.card,
                        border: `2px solid ${theme.line}`,
                        "&:hover": { bgcolor: theme.ph, borderColor: theme.ban } 
                    }}
                >
                    <FastForwardIcon sx={{ fontSize: "1.2rem" }} />
                </IconButton>
            </Box>
        </Box>
    );
};

export default MarketUtilities;