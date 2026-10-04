
export interface MarketStateDTO{
    date: string,
    isRunning: boolean,
    currentIntervalMs: number,
    trajectory: string,
}

export interface MarketState{
    date: Date,
    isRunning: boolean,
    currentIntervalMs: number,
    trajectory: string,
}

export function mapDTO(dto: MarketStateDTO): MarketState{
    // Java's ZonedDateTime.toString() produces e.g. "2024-01-15T10:30:00+05:30[Asia/Kolkata]"
    // The trailing "[Asia/Kolkata]" is not valid ISO 8601 — strip it before parsing.
    const cleanDate = dto.date.replace(/\[.*?\]$/, '');
    const parsedDate = new Date(cleanDate);
    return {
        date: isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
        isRunning: dto.isRunning,
        currentIntervalMs: dto.currentIntervalMs,
        trajectory: dto.trajectory,
    }
}