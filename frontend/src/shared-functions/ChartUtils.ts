import type { PriceRecordDTO } from "../types/StockDTOs";

/**
 * Converts an array of PriceRecordDTO objects into
 * Chart.js-compatible labels and data arrays.
 */
export function buildChartData(priceRecords: PriceRecordDTO[]): {
    labels: string[];
    prices: number[];
} {
    const sorted = [...priceRecords].sort(
        (a, b) => new Date(a.marketDate).getTime() - new Date(b.marketDate).getTime()
    );

    const labels = sorted.map((r) =>
        new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "UTC",
        }).format(new Date(r.marketDate))
    );

    const prices = sorted.map((r) => r.stockPrice);

    return { labels, prices };
}
