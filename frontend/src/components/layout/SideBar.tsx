import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import DashboardIcon from "@mui/icons-material/Dashboard";

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick: () => void;
    id: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, id }) => (
    <Box
        id={id}
        onClick={onClick}
        sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 1.2,
            borderRadius: "10px",
            cursor: "pointer",
            bgcolor: active ? "rgba(99,102,241,0.15)" : "transparent",
            border: active ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
            color: active ? "#818cf8" : "rgba(148,163,184,0.6)",
            transition: "all 0.15s ease",
            "&:hover": {
                bgcolor: active ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.04)",
                color: active ? "#818cf8" : "#cbd5e1",
            },
        }}
    >
        <Box sx={{ fontSize: "1.1rem", display: "flex", alignItems: "center" }}>{icon}</Box>
        <Typography sx={{ fontSize: "0.85rem", fontWeight: active ? 600 : 400 }}>{label}</Typography>
    </Box>
);

const SideBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isMarket = location.pathname === "/" || location.pathname === "";

    return (
        <Box
            sx={{
                width: "18%",
                minWidth: 180,
                height: "100%",
                bgcolor: "#0a0f1e",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                flexDirection: "column",
                p: 2,
                gap: 0.5,
                flexShrink: 0,
            }}
        >
            {/* Logo / Brand */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 1,
                    py: 2,
                    mb: 1,
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
            >
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "8px",
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <ShowChartIcon sx={{ color: "white", fontSize: "1.1rem" }} />
                </Box>
                <Box>
                    <Typography
                        sx={{
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            color: "#f1f5f9",
                            lineHeight: 1.1,
                        }}
                    >
                        MarketSim
                    </Typography>
                    <Typography sx={{ fontSize: "0.65rem", color: "rgba(148,163,184,0.5)" }}>
                        Simulation
                    </Typography>
                </Box>
            </Box>

            {/* Navigation */}
            <Typography
                sx={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: "rgba(148,163,184,0.35)",
                    letterSpacing: "1.5px",
                    px: 2,
                    py: 0.5,
                    mt: 0.5,
                }}
            >
                NAVIGATION
            </Typography>
            <NavItem
                id="nav-market-dashboard"
                icon={<DashboardIcon sx={{ fontSize: "inherit" }} />}
                label="Market Dashboard"
                active={isMarket}
                onClick={() => navigate("/")}
            />

            {/* Footer */}
            <Box sx={{ mt: "auto", pt: 2, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <Typography
                    sx={{
                        fontSize: "0.65rem",
                        color: "rgba(148,163,184,0.3)",
                        textAlign: "center",
                        px: 1,
                    }}
                >
                    Stock Market Simulation
                </Typography>
            </Box>
        </Box>
    );
};

export default SideBar;