import { BatchData } from "./batch";

export type AuctionData = {
    title: string;
    description: string;
    imagePath: string;
    contact: {
        name: string;
        phone: string;
    };
    batchs: BatchData[];
};