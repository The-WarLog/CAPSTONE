import { Box, Typography, Button } from "@mui/material";
import Page from "../../layout/Page";
import { usePlayer } from "../../../context/PlayerContext";

const theme = { bg: "#0f1f22", card: "#1a3034", ink: "#e8f4f1", mute: "#93b0b3", ban: "#ffcf33", ban2: "#e9b400", leaf: "#4cc989", red: "#ef7070", line: "#2b4549", ph: "#142629" };

const JOBS = [
    { n: "Banana Picking", e: "🍌", pay: 60, h: 1, iq: 0, need: 0, d: "Steady, easy work." },
    { n: "Jungle Delivery", e: "🛵", pay: 90, h: -2, iq: 0, need: 0, d: "Good pay, small chance a parcel is lost." },
    { n: "Night Guard", e: "🌙", pay: 110, h: -4, iq: 0, need: 0, d: "Pays well but drains your happiness." },
    { n: "Tour Guide", e: "🧭", pay: 120, h: 3, iq: 1, need: 25, d: "Fun work for people with some know-how." },
    { n: "Freelance Tinkering", e: "🔧", pay: 220, h: -2, iq: 2, need: 45, d: "Big pay for skilled monkeys." }
];

const JobsPage: React.FC = () => {
    const { state, earnBananas, updateMood, useJobSlot } = usePlayer();

    const doJob = (job: typeof JOBS[0]) => {
        if (state.traderIQ < job.need) {
            alert(`You need Trader IQ of ${job.need} for this job.`);
            return;
        }
        if (useJobSlot()) {
            earnBananas(job.pay);
            updateMood(job.h, job.iq);
        } else {
            alert("No time slots left this year! Wait for the market to progress.");
        }
    };

    return (
        <Page>
            <Box sx={{ width: "100%", height: "100%", overflowY: "auto", p: 4, bgcolor: theme.bg, color: theme.ink, fontFamily: "'Nunito', sans-serif" }}>
                <Typography sx={{ fontFamily: "'Baloo 2', sans-serif", fontSize: "2.5rem", color: theme.ban, fontWeight: 800, mb: 1 }}>
                    🛠️ Odd Jobs
                </Typography>
                
                <Box sx={{ bgcolor: theme.card, p: 3, borderRadius: "14px", border: `2px solid ${theme.line}`, mb: 3 }}>
                    <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, mb: 1 }}>Time left this tick</Typography>
                    <Typography sx={{ fontSize: "2rem" }}>{"⏳".repeat(state.jobSlots) || "None"}</Typography>
                    <Typography sx={{ color: theme.mute, fontSize: "0.9rem", mt: 1 }}>Each job uses 1 slot. Slots refill every market tick.</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {JOBS.map((j, i) => (
                        <Box key={i} sx={{ bgcolor: theme.card, p: 3, borderRadius: "14px", border: `2px solid ${theme.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: state.traderIQ < j.need ? 0.5 : 1 }}>
                            <Box>
                                <Typography sx={{ fontSize: "1.2rem", fontWeight: 700 }}>{j.e} {j.n}</Typography>
                                <Typography sx={{ color: theme.mute, fontSize: "0.9rem" }}>{j.d} {j.need > 0 && `Needs Trader IQ ${j.need}.`}</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: theme.ban, fontFamily: "'Baloo 2', sans-serif" }}>🍌{j.pay}</Typography>
                                <Button 
                                    onClick={() => doJob(j)}
                                    sx={{ bgcolor: theme.ban, color: "#2b2200", fontWeight: 800, px: 3, borderRadius: "8px", "&:hover": { bgcolor: theme.ban2 } }}
                                >
                                    Work
                                </Button>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Page>
    );
};

export default JobsPage;
