import type { StockBasicDTO, StockFullDTO } from "../types/StockDTOs";

const BASE = "/api/v1/stocks";

export async function fetchAllStocks(): Promise<StockBasicDTO[]> {
    const response = await fetch(BASE);
    return response.json() as Promise<StockBasicDTO[]>;
}

export async function fetchFullStockByTicker(ticker: string): Promise<StockFullDTO> {
    const response = await fetch(`${BASE}/${ticker}?view=full`);
    return response.json() as Promise<StockFullDTO>;
}