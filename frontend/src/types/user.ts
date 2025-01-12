export interface Notification {
    _id: string;
    message: string;
    isRead: boolean;
    type: "bidOutbid" | "bidWon" | "auctionEnding" | "walletUpdated";
    relatedItemId?: string;
    relatedBidId?: string;
    timestamp: Date;
  }
  
  export interface UserProfile {
    _id: string;
    clerkId: string;
    email: string;
    username: string;
    imageUrl: string;
    walletBalance: number;
    activeBids: string[];
    wonAuctions: string[];
    notifications: Notification[];
    createdAt: string;
    updatedAt: string;
  }

 