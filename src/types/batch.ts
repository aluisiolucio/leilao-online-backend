export type BatchData = {
    auctionId?: string | null;
    title: string;
    price: number;
    code: number;
    startDateTime: Date;
    specification: string;
    imagesPath: string[];
    action?: string;
};
