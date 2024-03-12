export type BatchData = {
    auctionId: string
    title: string
    price: number
    startDateTime: Date
    especification: string
    contact: {
        name: string
        phone: string
    }
}