import { BrowserRouter, Routes, Route } from "react-router-dom"
import MarketDashboard from "./components/pages/MarketDashboard/MarketDashboard"
import StockDashboard from "./components/pages/StockDashboard/StockDashboard"

import { PlayerProvider } from "./context/PlayerContext"
import JobsPage from "./components/pages/Jobs/JobsPage"
import LoansPage from "./components/pages/Loans/LoansPage"
import PortfolioPage from "./components/pages/Portfolio/PortfolioPage"

function App(){
    return (
        <PlayerProvider>
            <BrowserRouter>
                <Routes>
                    <Route index element={<MarketDashboard/>} />
                    <Route path="stocks/:ticker" element={<StockDashboard/>} />
                    <Route path="jobs" element={<JobsPage/>} />
                    <Route path="loans" element={<LoansPage/>} />
                    <Route path="portfolio" element={<PortfolioPage/>} />
                </Routes>
            </BrowserRouter>
        </PlayerProvider>
    )
}

export default App
