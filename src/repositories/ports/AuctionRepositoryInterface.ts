export interface IAuctionRepository {
    createAuction(title: string, description: string, startDateTime: Date, currentUser: string): Promise<object>
    getAuction(): Promise<object>
}
