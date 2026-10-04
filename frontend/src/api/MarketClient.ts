import type { MarketStateDTO } from "../types/MarketDTOs";

let mockState: MarketStateDTO = {
    date: new Date().toISOString(),
    isRunning: true,
    currentIntervalMs: 5000,
    trajectory: "NORMAL",
};

export async function fetchMarketState(): Promise<MarketStateDTO> {
    // Simulate slight time progression
    if (mockState.isRunning) {
        const d = new Date(mockState.date);
        d.setMinutes(d.getMinutes() + 5);
        mockState.date = d.toISOString();
    }
    return Promise.resolve({ ...mockState });
}

export async function fetchPauseMarket(): Promise<MarketStateDTO> {
    mockState.isRunning = false;
    return Promise.resolve({ ...mockState });
}

export async function fetchResumeMarket(): Promise<MarketStateDTO> {
    mockState.isRunning = true;
    return Promise.resolve({ ...mockState });
}

export async function fetchUpdateInterval(interval: number): Promise<MarketStateDTO> {
    mockState.currentIntervalMs = Math.max(500, interval);
    return Promise.resolve({ ...mockState });
}