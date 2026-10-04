import React, { useState, useMemo, useEffect, useRef } from "react";
import { Box, ToggleButtonGroup, ToggleButton, Typography, Chip, Switch, FormControlLabel } from "@mui/material";
import { createChart, CandlestickSeries, AreaSeries, LineSeries } from "lightweight-charts";
import type { IChartApi } from "lightweight-charts";
import type { PriceRecordDTO } from "../../types/StockDTOs";

interface AdvancedStockChartProps {
    ticker: string;
    priceRecords: PriceRecordDTO[];
}

type TimeRange = "1W" | "1M" | "3M" | "1Y" | "ALL";
type ChartType = "Line" | "Candle";

// Technical Indicators
const calculateSMA = (data: PriceRecordDTO[], windowSize: number) => {
    const sma = [];
    for (let i = 0; i < data.length; i++) {
        if (i < windowSize - 1) continue;
        let sum = 0;
        for (let j = 0; j < windowSize; j++) {
            sum += data[i - j].close;
        }
        sma.push({ time: data[i].marketDate.split('T')[0], value: sum / windowSize });
    }
    return sma;
};

const calculateRSI = (data: PriceRecordDTO[], periods = 14) => {
    const rsi = [];
    let gains = 0, losses = 0;
    
    for (let i = 1; i < data.length; i++) {
        const change = data[i].close - data[i - 1].close;
        const time = data[i].marketDate.split('T')[0];
        
        if (i <= periods) {
            if (change >= 0) gains += change;
            else losses -= change;
            
            if (i === periods) {
                let rs = (gains / periods) / (losses / periods);
                rsi.push({ time, value: losses === 0 ? 100 : 100 - (100 / (1 + rs)) });
            }
        } else {
            const avgGain = ((gains * (periods - 1)) + (change >= 0 ? change : 0)) / periods;
            const avgLoss = ((losses * (periods - 1)) + (change < 0 ? -change : 0)) / periods;
            gains = avgGain;
            losses = avgLoss;
            let rs = avgGain / avgLoss;
            rsi.push({ time, value: avgLoss === 0 ? 100 : 100 - (100 / (1 + rs)) });
        }
    }
    return rsi;
};

const calculateBollingerBands = (data: PriceRecordDTO[], periods = 20, multiplier = 2) => {
    const upper = [];
    const lower = [];
    const basis = calculateSMA(data, periods);
    
    for (let i = periods - 1; i < data.length; i++) {
        const time = data[i].marketDate.split('T')[0];
        const slice = data.slice(i - periods + 1, i + 1);
        const mean = basis.find(b => b.time === time)?.value || data[i].close;
        const variance = slice.reduce((sum, val) => sum + Math.pow(val.close - mean, 2), 0) / periods;
        const stdDev = Math.sqrt(variance);
        
        upper.push({ time, value: mean + (stdDev * multiplier) });
        lower.push({ time, value: mean - (stdDev * multiplier) });
    }
    return { upper, lower, basis };
};


const AdvancedStockChart: React.FC<AdvancedStockChartProps> = ({ ticker, priceRecords }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const rsiContainerRef = useRef<HTMLDivElement>(null);
    const [chartApi, setChartApi] = useState<IChartApi | null>(null);
    const [rsiChartApi, setRsiChartApi] = useState<IChartApi | null>(null);
    
    const [timeRange, setTimeRange] = useState<TimeRange>("ALL");
    const [chartType, setChartType] = useState<ChartType>("Candle");
    
    const [showSMA, setShowSMA] = useState(false);
    const [showBB, setShowBB] = useState(false);
    const [showRSI, setShowRSI] = useState(false);

    const filteredRecords = useMemo(() => {
        if (!priceRecords || priceRecords.length === 0) return [];
        const sorted = [...priceRecords].sort((a, b) => new Date(a.marketDate).getTime() - new Date(b.marketDate).getTime());
        if (timeRange === "ALL") return sorted;

        const latestDate = new Date(sorted[sorted.length - 1].marketDate);
        const cutoffDate = new Date(latestDate);

        switch (timeRange) {
            case "1W": cutoffDate.setDate(cutoffDate.getDate() - 7); break;
            case "1M": cutoffDate.setMonth(cutoffDate.getMonth() - 1); break;
            case "3M": cutoffDate.setMonth(cutoffDate.getMonth() - 3); break;
            case "1Y": cutoffDate.setFullYear(cutoffDate.getFullYear() - 1); break;
        }

        return sorted.filter((r) => new Date(r.marketDate) >= cutoffDate);
    }, [priceRecords, timeRange]);

    const [chartError, setChartError] = useState<string | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;
        
        try {
            const chart = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: "solid" as any, color: "transparent" },
                    textColor: "#93b0b3",
                    fontFamily: "'Nunito', sans-serif",
                },
                grid: {
                    vertLines: { color: "#2b4549" },
                    horzLines: { color: "#2b4549" },
                },
                crosshair: {
                    mode: 0 as any,
                    vertLine: { width: 1, color: "#ffcf33", style: 0 },
                    horzLine: { width: 1, color: "#ffcf33", style: 0 },
                },
                rightPriceScale: {
                    borderColor: "#2b4549",
                },
                timeScale: {
                    borderColor: "#2b4549",
                    timeVisible: true,
                    secondsVisible: false,
                },
                autoSize: true,
            });
            
            setChartApi(chart);

            return () => {
                chart.remove();
            };
        } catch (e: any) {
            setChartError(e.message || String(e));
        }
    }, []);

    useEffect(() => {
        if (!rsiContainerRef.current || !showRSI) {
            if (rsiChartApi) {
                rsiChartApi.remove();
                setRsiChartApi(null);
            }
            return;
        }
        
        const chart = createChart(rsiContainerRef.current, {
            layout: {
                background: { type: "solid" as any, color: "transparent" },
                textColor: "#93b0b3",
                fontFamily: "'Nunito', sans-serif",
            },
            grid: {
                vertLines: { color: "#2b4549" },
                horzLines: { color: "#2b4549" },
            },
            rightPriceScale: { borderColor: "#2b4549" },
            timeScale: { visible: false },
            autoSize: true,
        });
        setRsiChartApi(chart);
        return () => chart.remove();
    }, [showRSI]);

    useEffect(() => {
        if (!chartApi || filteredRecords.length === 0) return;

        // Clear existing series
        

        const isUp = filteredRecords[filteredRecords.length-1].close >= filteredRecords[0].close;
        const color = isUp ? "#4cc989" : "#ef7070";

        let mainSeries: any;
        try {
            if (chartType === "Line") {
                mainSeries = chartApi.addSeries(AreaSeries, {
                    lineColor: color,
                    topColor: isUp ? "#4cc98966" : "#ef707066",
                    bottomColor: "rgba(0,0,0,0)",
                    lineWidth: 2,
                });
                const lineData = filteredRecords.map(r => ({
                    time: r.marketDate.split('T')[0] as any,
                    value: r.close
                }));
                mainSeries.setData(lineData);
            } else {
                mainSeries = chartApi.addSeries(CandlestickSeries, {
                    upColor: '#4cc989',
                    downColor: '#ef7070',
                    borderVisible: false,
                    wickUpColor: '#4cc989',
                    wickDownColor: '#ef7070',
                });
                const candleData = filteredRecords.map(r => ({
                    time: r.marketDate.split('T')[0] as any,
                    open: r.open,
                    high: r.high,
                    low: r.low,
                    close: r.close
                }));
                mainSeries.setData(candleData);
            }

            if (showSMA) {
                const smaSeries = chartApi.addSeries(LineSeries, { color: '#ffcf33', lineWidth: 2 });
                smaSeries.setData(calculateSMA(filteredRecords, 10));
            }

            if (showBB) {
                const bb = calculateBollingerBands(filteredRecords, 20, 2);
                const upperSeries = chartApi.addSeries(LineSeries, { color: '#e9b400', lineWidth: 1, lineStyle: 2 });
                const lowerSeries = chartApi.addSeries(LineSeries, { color: '#e9b400', lineWidth: 1, lineStyle: 2 });
                upperSeries.setData(bb.upper);
                lowerSeries.setData(bb.lower);
            }
        } catch (e: any) {
            setChartError(e.message || String(e));
        }

        if (showRSI && rsiChartApi) {
            try {
                const rsiData = calculateRSI(filteredRecords, 14);
                const rsiLine = rsiChartApi.addSeries(LineSeries, { color: '#c084fc', lineWidth: 2 });
                rsiLine.setData(rsiData);
                
                // Add RSI bounds 30 / 70
                const topBound = rsiChartApi.addSeries(LineSeries, { color: 'rgba(255,255,255,0.2)', lineWidth: 1, lineStyle: 2, crosshairMarkerVisible: false });
                const bottomBound = rsiChartApi.addSeries(LineSeries, { color: 'rgba(255,255,255,0.2)', lineWidth: 1, lineStyle: 2, crosshairMarkerVisible: false });
                topBound.setData(filteredRecords.map(r => ({ time: r.marketDate.split('T')[0] as any, value: 70 })));
                bottomBound.setData(filteredRecords.map(r => ({ time: r.marketDate.split('T')[0] as any, value: 30 })));
            } catch (e: any) {
                console.error("RSI Error", e);
            }
        }

        chartApi.timeScale().fitContent();

        return () => {
            if (mainSeries) {
                try {
                    chartApi.removeSeries(mainSeries);
                } catch(e) {}
            }
            // removing all series is handled by recreating chart or manually cleaning up if needed
            // Lightweight charts doesn't have a clearAll method easily, so we usually just let it re-init
            // but for performance, we should remove them. In this simple wrapper, React strict mode might double mount.
            // We just clear container if we wanted, but let's rely on chartApi state.
        }
    }, [chartApi, rsiChartApi, filteredRecords, chartType, showSMA, showBB, showRSI]);


    const currentPrice = filteredRecords[filteredRecords.length - 1]?.close || 0;
    const maxPrice = Math.max(...filteredRecords.map(r => r.high || r.close));
    const minPrice = Math.min(...filteredRecords.map(r => r.low || r.close));

    if (chartError) {
        return <Box sx={{ p: 4, color: 'red' }}>Chart Error: {chartError}</Box>;
    }

    return (
        <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Toolbar */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 2 }}>
                
                <Box sx={{ display: "flex", gap: 1 }}>
                    <ToggleButtonGroup
                        value={chartType}
                        exclusive
                        onChange={(_, val) => val && setChartType(val)}
                        size="small"
                        sx={{
                            '& .MuiToggleButton-root': {
                                color: "#93b0b3", borderColor: "#2b4549", fontSize: "0.75rem", py: 0.5, px: 1.5, fontFamily: "'Nunito', sans-serif", fontWeight: 700,
                                '&.Mui-selected': { color: "#1d3538", bgcolor: "#ffcf33" }
                            }
                        }}
                    >
                        <ToggleButton value="Line">Line</ToggleButton>
                        <ToggleButton value="Candle">Candle</ToggleButton>
                    </ToggleButtonGroup>

                    <Chip label={`High: 🍌${maxPrice.toFixed(2)}`} size="small" sx={{ bgcolor: "#4cc98922", color: "#4cc989", borderRadius: "10px", fontWeight: 700, fontFamily: "'Nunito', sans-serif" }} />
                    <Chip label={`Low: 🍌${minPrice.toFixed(2)}`} size="small" sx={{ bgcolor: "#ef707022", color: "#ef7070", borderRadius: "10px", fontWeight: 700, fontFamily: "'Nunito', sans-serif" }} />
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <FormControlLabel control={<Switch checked={showSMA} onChange={(e) => setShowSMA(e.target.checked)} size="small" sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#ffcf33' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#ffcf33' } }} />} label={<Typography sx={{ fontSize: "0.75rem", color: "#93b0b3", fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>SMA (10)</Typography>} />
                        <FormControlLabel control={<Switch checked={showBB} onChange={(e) => setShowBB(e.target.checked)} size="small" sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#e9b400' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#e9b400' } }} />} label={<Typography sx={{ fontSize: "0.75rem", color: "#93b0b3", fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>Bollinger Bands</Typography>} />
                        <FormControlLabel control={<Switch checked={showRSI} onChange={(e) => setShowRSI(e.target.checked)} size="small" sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#c084fc' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#c084fc' } }} />} label={<Typography sx={{ fontSize: "0.75rem", color: "#93b0b3", fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>RSI</Typography>} />
                    </Box>
                    
                    <ToggleButtonGroup
                        value={timeRange}
                        exclusive
                        onChange={(_, val) => val && setTimeRange(val)}
                        size="small"
                        sx={{
                            '& .MuiToggleButton-root': {
                                color: "#93b0b3", borderColor: "#2b4549", fontSize: "0.75rem", py: 0.5, px: 1, fontFamily: "'Nunito', sans-serif", fontWeight: 700,
                                '&.Mui-selected': { color: "#1d3538", bgcolor: "#ffcf33" }
                            }
                        }}
                    >
                        {["1W", "1M", "3M", "1Y", "ALL"].map((range) => (
                            <ToggleButton key={range} value={range}>{range}</ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>
            </Box>
            
            {/* Chart Area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box ref={chartContainerRef} sx={{ flex: showRSI ? 0.75 : 1, position: 'relative' }} />
                {showRSI && (
                    <Box sx={{ flex: 0.25, position: 'relative', borderTop: '2px solid #2b4549', pt: 1 }}>
                        <Typography sx={{ position: 'absolute', top: 5, left: 10, fontSize: '0.75rem', fontWeight: 700, color: '#c084fc', zIndex: 10, fontFamily: "'Nunito', sans-serif" }}>RSI (14)</Typography>
                        <Box ref={rsiContainerRef} sx={{ width: '100%', height: '100%' }} />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default AdvancedStockChart;
