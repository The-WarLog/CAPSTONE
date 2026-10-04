import type { StockBasicDTO, StockFullDTO, PriceRecordDTO, NewsReleaseDTO } from "../types/StockDTOs";
import Papa from "papaparse";

export async function fetchAllStocks(): Promise<StockBasicDTO[]> {
    const response = await fetch("/dummy_stocks.csv");
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const stocks = results.data.map((row: any) => ({
                    ticker: row.ticker,
                    companyName: row.companyName,
                    price: parseFloat(row.price),
                }));
                resolve(stocks);
            },
            error: (error: any) => reject(error)
        });
    });
}

export async function fetchFullStockByTicker(ticker: string): Promise<StockFullDTO> {
    // 1. Fetch stock basic data
    const stocksResponse = await fetch("/dummy_stocks.csv");
    const stocksText = await stocksResponse.text();
    
    const stockInfo = await new Promise<any>((resolve, reject) => {
        Papa.parse(stocksText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const stock = results.data.find((row: any) => row.ticker === ticker);
                resolve(stock);
            },
            error: reject
        });
    });

    if (!stockInfo) throw new Error("Stock not found");

    // 2. Fetch history
    const historyResponse = await fetch("/dummy_history.csv");
    const historyText = await historyResponse.text();
    
    const priceRecords = await new Promise<PriceRecordDTO[]>((resolve, reject) => {
        Papa.parse(historyText, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const records = results.data
                    .filter((row: any) => row.ticker === ticker)
                    .map((row: any) => ({
                        marketDate: row.date,
                        stockPrice: parseFloat(row.close), // backward compatibility
                        open: parseFloat(row.open),
                        high: parseFloat(row.high),
                        low: parseFloat(row.low),
                        close: parseFloat(row.close),
                        volume: parseFloat(row.volume)
                    }));
                resolve(records);
            },
            error: reject
        });
    });

    // 3. Mock News
    const mockNews: NewsReleaseDTO[] = [
        { ticker, eventType: "Earnings", template: `${ticker} exceeds Q4 earnings expectations.`, dateReleased: new Date().toISOString() },
        { ticker, eventType: "Product", template: `New product announcement boosts ${ticker} sentiment.`, dateReleased: new Date(Date.now() - 86400000 * 2).toISOString() },
    ];

    return {
        ticker: stockInfo.ticker,
        companyName: stockInfo.companyName,
        price: parseFloat(stockInfo.price),
        sector: stockInfo.sector,
        marketCap: stockInfo.marketCap,
        volatility: stockInfo.volatility,
        investorRating: stockInfo.investorRating,
        priceRecords,
        newsReleases: mockNews
    };
}