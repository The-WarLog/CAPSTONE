import { Box, Typography } from "@mui/material";
import Page from "../../layout/Page";
import MarketUtilities from "./MarketUtilities";
import StockDisplay from "./StockDisplay";
import ShowChartIcon from "@mui/icons-material/ShowChart";

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

const MarketDashboard: React.FC = () => {
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
                    overflow: "hidden",
                    fontFamily: "'Nunito', sans-serif",
                }}
            >
                {/* Page title bar */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        px: 3,
                        pt: 3,
                        pb: 0,
                    }}
                >
                    <Typography sx={{ fontSize: "1.8rem", lineHeight: 1 }}>🐵</Typography>
                    <Typography
                        sx={{
                            fontFamily: "'Baloo 2', sans-serif",
                            fontWeight: 800,
                            color: theme.ban,
                            letterSpacing: "1px",
                            fontSize: "1.6rem",
                        }}
                    >
                        Banana Market
                    </Typography>
                </Box>

                <MarketUtilities />
                <StockDisplay />
            </Box>
        </Page>
    );
};

export default MarketDashboard;