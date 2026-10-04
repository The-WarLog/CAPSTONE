
export interface PriceRecordDTO {
    marketDate: string;
    stockPrice: number;
}

export interface NewsReleaseDTO {
    ticker: string;
    eventType: string;
    template: string;
    dateReleased: string;
}

export interface StockBasicDTO {
    ticker: string;
    companyName: string;
    price: number;
}

export interface StockDetailedDTO extends StockBasicDTO {
    sector: string;
    marketCap: string;
    volatility: string;
    investorRating: string;
}

export interface StockFullDTO extends StockDetailedDTO {
    priceRecords: PriceRecordDTO[];
    newsReleases: NewsReleaseDTO[];
}