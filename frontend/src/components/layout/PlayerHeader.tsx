import { Box, Typography, LinearProgress } from "@mui/material";
import { usePlayer } from "../../context/PlayerContext";

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

const PlayerHeader: React.FC = () => {
    const { state } = usePlayer();

    return (
        <Box
            sx={{
                width: "100%",
                bgcolor: theme.card,
                borderBottom: `2px solid ${theme.line}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 4,
                py: 2,
                gap: 4
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Box>
                    <Typography sx={{ fontSize: "0.75rem", color: theme.mute, fontWeight: 700, fontFamily: "'Nunito', sans-serif" }}>CASH BALANCE</Typography>
                    <Typography sx={{ fontSize: "1.8rem", color: theme.ban, fontWeight: 800, fontFamily: "'Baloo 2', sans-serif", lineHeight: 1 }}>
                        🍌{state.bananas.toFixed(2)}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 4, flex: 1, maxWidth: "500px" }}>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography sx={{ fontSize: "0.8rem", color: theme.mute, fontWeight: 700, fontFamily: "'Nunito', sans-serif" }}>Happiness</Typography>
                        <Typography sx={{ fontSize: "0.8rem", color: theme.ink, fontWeight: 700, fontFamily: "'Nunito', sans-serif" }}>{state.happiness}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={state.happiness} sx={{ height: 10, borderRadius: 5, bgcolor: theme.ph, '& .MuiLinearProgress-bar': { bgcolor: theme.leaf } }} />
                </Box>
                
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography sx={{ fontSize: "0.8rem", color: theme.mute, fontWeight: 700, fontFamily: "'Nunito', sans-serif" }}>Trader IQ</Typography>
                        <Typography sx={{ fontSize: "0.8rem", color: theme.ink, fontWeight: 700, fontFamily: "'Nunito', sans-serif" }}>{state.traderIQ}</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={state.traderIQ} sx={{ height: 10, borderRadius: 5, bgcolor: theme.ph, '& .MuiLinearProgress-bar': { bgcolor: '#8b5cf6' } }} />
                </Box>
            </Box>
        </Box>
    );
};

export default PlayerHeader;
