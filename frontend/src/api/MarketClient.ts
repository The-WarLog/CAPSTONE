import type { MarketStateDTO } from "../types/MarketDTOs";

const BASE = "/api/v1/market";

export async function fetchMarketState(): Promise<MarketStateDTO> {
    const response = await fetch(BASE);
    return response.json() as Promise<MarketStateDTO>;
}

export async function fetchPauseMarket(): Promise<MarketStateDTO> {
    const response = await fetch(`${BASE}/pause`, { method: "PUT" });
    return response.json() as Promise<MarketStateDTO>;
}

export async function fetchResumeMarket(): Promise<MarketStateDTO> {
    const response = await fetch(`${BASE}/resume`, { method: "PUT" });
    return response.json() as Promise<MarketStateDTO>;
}

export async function fetchUpdateInterval(interval: number): Promise<MarketStateDTO> {
    const response = await fetch(`${BASE}/interval?millis=${interval}`, { method: "PUT" });
    return response.json() as Promise<MarketStateDTO>;
}