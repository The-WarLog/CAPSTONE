import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STOCKS = [
    { ticker: 'AAPL', companyName: 'Apple Inc.', sector: 'Technology', marketCap: 'Large', volatility: 'Stable', investorRating: 'Buy', basePrice: 150 },
    { ticker: 'GOOG', companyName: 'Alphabet Inc.', sector: 'Technology', marketCap: 'Large', volatility: 'Normal', investorRating: 'Hold', basePrice: 2800 },
    { ticker: 'MSFT', companyName: 'Microsoft Corp.', sector: 'Technology', marketCap: 'Large', volatility: 'Stable', investorRating: 'Buy', basePrice: 300 },
    { ticker: 'TSLA', companyName: 'Tesla Inc.', sector: 'Consumer Cyclical', marketCap: 'Large', volatility: 'High', investorRating: 'Hold', basePrice: 800 },
    { ticker: 'AMZN', companyName: 'Amazon.com Inc.', sector: 'Consumer Cyclical', marketCap: 'Large', volatility: 'Normal', investorRating: 'Buy', basePrice: 3300 },
];

const stocksCsvPath = path.join(__dirname, 'public', 'dummy_stocks.csv');
const historyCsvPath = path.join(__dirname, 'public', 'dummy_history.csv');

// Write dummy_stocks.csv
let stocksCsv = 'ticker,companyName,price,sector,marketCap,volatility,investorRating\n';
for (const s of STOCKS) {
    const currentPrice = (s.basePrice * (1 + (Math.random() * 0.2 - 0.1))).toFixed(2);
    stocksCsv += `${s.ticker},${s.companyName},${currentPrice},${s.sector},${s.marketCap},${s.volatility},${s.investorRating}\n`;
}
fs.writeFileSync(stocksCsvPath, stocksCsv);

// Write dummy_history.csv
let historyCsv = 'ticker,date,open,high,low,close,volume\n';
const now = new Date();
for (const s of STOCKS) {
    let currentPrice = s.basePrice;
    // Generate 300 days of history for better indicators
    for (let i = 300; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        
        // Random walk for close
        const change = (Math.random() - 0.48) * (s.volatility === 'High' ? 0.05 : 0.02);
        const open = currentPrice;
        const close = open * (1 + change);
        const high = Math.max(open, close) * (1 + Math.random() * 0.02);
        const low = Math.min(open, close) * (1 - Math.random() * 0.02);
        const volume = Math.floor(Math.random() * 10000000) + 1000000;
        
        historyCsv += `${s.ticker},${d.toISOString()},${open.toFixed(2)},${high.toFixed(2)},${low.toFixed(2)},${close.toFixed(2)},${volume}\n`;
        currentPrice = close;
    }
}
fs.writeFileSync(historyCsvPath, historyCsv);

console.log('Dummy OHLCV CSV files generated successfully in public/');
