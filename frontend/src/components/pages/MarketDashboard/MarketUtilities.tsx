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
                p: 3, borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}>
                <CircularProgress size={18} sx={{ color: '#6366f1' }} />
                <Typography sx={{ color: "rgba(148,163,184,0.6)", fontSize: "0.85rem" }}>
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
            gap: 0.5,
            p: 3,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography sx={{ fontSize: "1.6rem", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.5px" }}>
                    {dateFormatter.format(marketState.date)}
                </Typography>
                <Chip
                    label={marketState.isRunning ? "LIVE" : "PAUSED"}
                    size="small"
                    sx={{
                        bgcolor: marketState.isRunning ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                        color: marketState.isRunning ? "#4ade80" : "#f87171",
                        border: `1px solid ${marketState.isRunning ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                        fontWeight: 700,
                        fontSize: "0.65rem",
                        letterSpacing: "1px",
                    }}
                />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ color: "rgba(148,163,184,0.8)", fontSize: "0.85rem" }}>
                    {timeFormatter.format(marketState.date)}
                </Typography>
                <Typography sx={{ color: "rgba(148,163,184,0.5)", fontSize: "0.85rem" }}>·</Typography>
                <Typography sx={{ color: "rgba(148,163,184,0.8)", fontSize: "0.85rem" }}>
                    Interval: {marketState.currentIntervalMs / 1000}s
                </Typography>
                <Typography sx={{ color: "rgba(148,163,184,0.5)", fontSize: "0.85rem" }}>·</Typography>
                <Typography sx={{ color: "rgba(148,163,184,0.8)", fontSize: "0.85rem", textTransform: "capitalize" }}>
                    {marketState.trajectory?.toLowerCase()}
                </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                <IconButton
                    onClick={() => updateMarketInterval(false)}
                    size="small"
                    sx={{ color: "rgba(148,163,184,0.7)", "&:hover": { color: "#f1f5f9", bgcolor: "rgba(255,255,255,0.05)" } }}
                >
                    <FastForwardIcon sx={{ transform: 'scaleX(-1)', fontSize: "1.1rem" }} />
                </IconButton>
                <IconButton
                    onClick={updateMarketStatus}
                    size="small"
                    sx={{
                        color: marketState.isRunning ? "#4ade80" : "#f87171",
                        bgcolor: marketState.isRunning ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        border: `1px solid ${marketState.isRunning ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                        borderRadius: "8px",
                        mx: 0.5,
                        "&:hover": { bgcolor: marketState.isRunning ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)" }
                    }}
                >
                    {marketState.isRunning ? <PauseIcon sx={{ fontSize: "1.1rem" }} /> : <PlayArrowIcon sx={{ fontSize: "1.1rem" }} />}
                </IconButton>
                <IconButton
                    onClick={() => updateMarketInterval(true)}
                    size="small"
                    sx={{ color: "rgba(148,163,184,0.7)", "&:hover": { color: "#f1f5f9", bgcolor: "rgba(255,255,255,0.05)" } }}
                >
                    <FastForwardIcon sx={{ fontSize: "1.1rem" }} />
                </IconButton>
            </Box>
        </Box>
    );
};

export default MarketUtilities;