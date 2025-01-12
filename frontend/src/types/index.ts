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

export interface Bid {
  _id: string;
  itemId: string; // Reference to the Item ID
  userId: string; // Reference to the User ID
  amount: number; // The bid amount
  status: "active" | "won" | "outbid" | "cancelled"; // Status of the bid
  createdAt: Date; // When the bid was created
}

export interface Item {
  _id: string;
  title: string;
  description?: string;
  startingPrice: number;
  image: string;  // Base64 string
  categories: string[];  // Array of category IDs
  createdBy: string;
  endTime: Date;
  status: "active" | "completed" | "cancelled";
  highestBid?: {
    bidId: string | null;
    amount: number | null;
    userId: string | null;
    timestamp: Date | null;
  } | null;
  totalBids: number;
  winner?: string | null;
  createdAt: Date;
  updatedAt: Date;
}


export interface AllItems {
  items: Item[]; // Array of Item objects
  pagination?: {
    current: number;
    pages: number;
    total: number;
  }; // Optional pagination details
}

export interface GetAllItemsParams {
  page?: number; // Page number for pagination
  limit?: number; // Number of items per page
  categoryId?: string; // Filter by category ID
  status?: "active" | "completed" | "cancelled"; // Filter by item status
  search?: string; // Search keyword for title or description
  minPrice?: number; // Minimum price filter
  maxPrice?: number; // Maximum price filter
  sortBy?: "createdAt" | "startingPrice" | "endTime" | "totalBids"; // Sorting field
  sortOrder?: "asc" | "desc"; // Sorting order
}

// Interface for category data
export interface Category {
  _id: string;
  parentCategory: string | null;
  path: string;
  createdAt: Date;
}

// Interface for form data
export interface CreateItemFormData {
  title: string;
  description: string;
  startingPrice: string;
  image: string;
  endTime: string;
  categories: string[];
}


// Interface for form errors
export interface FormErrors {
  title?: string;
  description?: string;
  startingPrice?: string;
  image?: string;
  endTime?: string;
  categories?: string;
  submit?: string;
}

export interface CreateItemRequest {
  title: string;
  description: string;
  startingPrice: number;
  image: string;  // Base64 string
  categories: string[];  // Array of category IDs
  endTime: Date;
  userId: string;
}

export interface CreateItemResponse {
  message: string;
  item: Item;
}

export interface BidRequest {
  newBid: number;
}

export interface BidResponse {
  message: string;
  bid: {
    _id: string;
    amount: number;
    userId: string;
    createdAt: Date;
  };
  highestBid: {
    bidId: string;
    amount: number;
    userId: string;
    timestamp: Date;
  };
}

