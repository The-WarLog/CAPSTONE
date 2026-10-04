import { Box, Typography } from "@mui/material";
import Page from "../../layout/Page";
import MarketUtilities from "./MarketUtilities";
import StockDisplay from "./StockDisplay";
import ShowChartIcon from "@mui/icons-material/ShowChart";

const MarketDashboard: React.FC = () => {
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
                    overflow: "hidden",
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
                    <ShowChartIcon sx={{ color: "#6366f1", fontSize: "1.3rem" }} />
                    <Typography
                        sx={{
                            fontWeight: 700,
                            color: "rgba(148,163,184,0.6)",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            fontSize: "0.75rem",
                        }}
                    >
                        Market Overview
                    </Typography>
                </Box>

                <MarketUtilities />
                <StockDisplay />
            </Box>
        </Page>
    );
};

export default MarketDashboard;