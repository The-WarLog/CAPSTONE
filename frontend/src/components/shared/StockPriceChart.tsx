import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
} from "chart.js";
import type { PriceRecordDTO } from "../../types/StockDTOs";
import { buildChartData } from "../../shared-functions/ChartUtils";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface StockPriceChartProps {
    ticker: string;
    priceRecords: PriceRecordDTO[];
}

const StockPriceChart: React.FC<StockPriceChartProps> = ({ ticker, priceRecords }) => {
    if (priceRecords.length === 0) {
        return (
            <div style={{ color: "rgba(148,163,184,0.5)", fontSize: "0.85rem", textAlign: "center", padding: "2rem" }}>
                No price history available yet.
            </div>
        );
    }

    const { labels, prices } = buildChartData(priceRecords);

    const isPositive = prices[prices.length - 1] >= prices[0];
    const lineColor = isPositive ? "#4ade80" : "#f87171";
    const gradientId = `gradient-${ticker}`;

    const data = {
        labels,
        datasets: [
            {
                label: `${ticker} Price`,
                data: prices,
                borderColor: lineColor,
                borderWidth: 2,
                pointRadius: priceRecords.length > 50 ? 0 : 3,
                pointHoverRadius: 5,
                pointBackgroundColor: lineColor,
                fill: true,
                backgroundColor: (ctx: { chart: ChartJS }) => {
                    const chart = ctx.chart;
                    const { ctx: canvasCtx, chartArea } = chart;
                    if (!chartArea) return "transparent";
                    const gradient = canvasCtx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, isPositive ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)");
                    gradient.addColorStop(1, "rgba(0,0,0,0)");
                    return gradient;
                },
                tension: 0.35,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "rgba(15,23,42,0.95)",
                borderColor: "rgba(99,102,241,0.3)",
                borderWidth: 1,
                titleColor: "#94a3b8",
                bodyColor: "#f1f5f9",
                callbacks: {
                    label: (item: { raw: unknown }) => ` $${(item.raw as number).toFixed(2)}`,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "rgba(148,163,184,0.5)",
                    font: { size: 10 },
                    maxTicksLimit: 8,
                    maxRotation: 0,
                },
                grid: { color: "rgba(255,255,255,0.04)" },
                border: { color: "rgba(255,255,255,0.06)" },
            },
            y: {
                ticks: {
                    color: "rgba(148,163,184,0.5)",
                    font: { size: 10 },
                    callback: (v: unknown) => `$${(v as number).toFixed(2)}`,
                },
                grid: { color: "rgba(255,255,255,0.04)" },
                border: { color: "rgba(255,255,255,0.06)" },
            },
        },
        animation: { duration: 600 },
    };

    return (
        <div style={{ width: "100%", height: "100%", minHeight: 300 }} id={gradientId}>
            <Line data={data} options={options as Parameters<typeof Line>[0]["options"]} />
        </div>
    );
};

export default StockPriceChart;
