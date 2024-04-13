import { BatchData } from "./batch";

export type AuctionData = {
    title: string;
    description: string;
    imagePath: string;
    category: string;
    contact: {
        name: string;
        phone: string;
    };
    batchs: BatchData[];
};

export type QueryParamsAuction = {
    dataInicial?: string
    dataFinal?: string
    limite?: string
    category?: string
    myAuctions?: string
}