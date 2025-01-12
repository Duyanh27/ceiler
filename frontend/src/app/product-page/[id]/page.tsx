"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useApi } from '@/api';
import { Item, BidResponse } from '@/types';
import io from 'socket.io-client';
import { DollarSign, Clock, Tag, User, Gavel } from 'lucide-react';

const socket = io('http://localhost:5000');

const ProductPage: React.FC = () => {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const router = useRouter();
    const { isSignedIn } = useAuth();
    const { getItemById, bidOnItem } = useApi();

    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bidAmount, setBidAmount] = useState<string>('');
    const [bidError, setBidError] = useState<string | null>(null);
    const [bidLoading, setBidLoading] = useState(false);

    const [highestBidderName, setHighestBidderName] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Invalid item ID');
      setLoading(false);
      return;
    }

    const fetchItemDetails = async () => {
      try {
        const fetchedItem = await getItemById(id);
        setItem(fetchedItem);

        // Fetch the highest bidder's name
        if (fetchedItem.highestBid) {
        } else {
          setHighestBidderName('No bids yet');
        }
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Failed to fetch item details');
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();

    // Socket listener remains the same
    socket.on('newBid', (data) => {
      if (data.itemId === id) {
        setItem((prevItem) => {
          if (!prevItem) return null;
          return {
            ...prevItem,
            highestBid: {
              bidId: data.bidId,
              amount: data.amount,
              userId: data.userId,
              timestamp: new Date(),
            },
            totalBids: (prevItem.totalBids || 0) + 1,
          };
        });

        // Update the highest bidder's name
        setHighestBidderName('Anonymous');
      }
    });

    return () => {
      socket.off('newBid');
    };
  }, [id]);


    const handleBid = async () => {
        if (!isSignedIn) {
          router.push('/sign-in');
          return;
        }
      
        if (!id) {
          setBidError('Invalid item ID');
          return;
        }
      
        const numericBid = parseFloat(bidAmount);
        
        const currentHighestBid = item?.highestBid?.amount || item?.startingPrice || 0;
      
        if (isNaN(numericBid)) {
          setBidError('Please enter a valid bid amount');
          return;
        }
      
        if (numericBid <= currentHighestBid) {
          setBidError(`Bid must be higher than ${currentHighestBid}`);
          return;
        }
      
        setBidLoading(true);
        setBidError(null);
      
        try {
          const bidResponse: BidResponse = await bidOnItem(id, { newBid: numericBid });
          console.log('Bid successful:', bidResponse);
          setBidAmount('');
        } catch (err: any) {
          console.error('Bid error:', err.message);
          setBidError(err.message);
        } finally {
          setBidLoading(false);
        }
      };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatTimeLeft = (endTime: Date) => {
        const now = new Date();
        const end = new Date(endTime);
        const diff = end.getTime() - now.getTime();

        if (diff <= 0) return 'Auction Ended';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `${days}d ${hours}h left`;
        if (hours > 0) return `${hours}h ${minutes}m left`;
        return `${minutes}m left`;
    };

    const getDisplayCategory = (category: string): string => {
        return category.includes('/') ? category.split('/').pop() || category : category;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center text-red-500">
                {error || 'Item not found'}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="bg-white rounded-lg shadow-md overflow-hidden md:flex">
                    {/* Item Image */}
                    <div className="md:w-1/2 relative pb-[60%] md:pb-0">
                        {item.image ? (
                            <img
                                src={item.image}
                                alt={item.title}
                                className="absolute top-0 left-0 w-full h-full object-cover"
                            />
                        ) : (
                            <div className="absolute top-0 left-0 w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">No image available</span>
                            </div>
                        )}
                        <div className="absolute top-2 right-2">
                            <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                                {item.status}
                            </span>
                        </div>
                    </div>

                    {/* Item Details */}
                    <div className="md:w-1/2 p-6">
                        <h1 className="text-2xl font-bold mb-4 text-gray-900">{item.title}</h1>

                        <div className="space-y-4">
                            {/* Description */}
                            <p className="text-gray-600 mb-4">{item.description || 'No description available.'}</p>

                            {/* Auction Details */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Current Price */}
                                <div className="flex items-center">
                                    <DollarSign className="mr-2 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Current Price</p>
                                        <p className="font-semibold text-gray-900">
                                            {formatPrice(item.highestBid?.amount || item.startingPrice)}
                                        </p>
                                    </div>
                                </div>

                                {/* Time Left */}
                                <div className="flex items-center">
                                    <Clock className="mr-2 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Time Left</p>
                                        <p className="font-semibold text-gray-900">
                                            {formatTimeLeft(item.endTime)}
                                        </p>
                                    </div>
                                </div>

                                {/* Total Bids */}
                                <div className="flex items-center">
                                    <Tag className="mr-2 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Total Bids</p>
                                        <p className="font-semibold text-gray-900">{item.totalBids}</p>
                                    </div>
                                </div>

                                {/* Highest Bidder */}
                                <div className="flex items-center">
                                    <User className="mr-2 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-600">Highest Bidder</p>
                                        <p className="font-semibold text-gray-900">
                                            {item.highestBid?.userId ? 'Anonymous' : 'No bids yet'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Categories */}
                            {Array.isArray(item.categories) && item.categories.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-4">
                                    {item.categories.map((category, index) => (
                                        <span
                                            key={`${item._id}-category-${index}`}
                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                        >
                                            {getDisplayCategory(category)}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Bid Section */}
                            <div className="mt-6">
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        value={bidAmount}
                                        onChange={(e) => {
                                            setBidAmount(e.target.value);
                                            setBidError(null);
                                        }}
                                        placeholder={`Minimum bid: ${formatPrice(item.highestBid?.amount || item.startingPrice)}`}
                                        className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
                                    />
                                    <button
                                        onClick={handleBid}
                                        disabled={bidLoading || item.status !== 'active'}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                                    >
                                        <Gavel className="mr-2" />
                                        {bidLoading ? 'Bidding...' : 'Place Bid'}
                                    </button>
                                </div>
                                {bidError && (
                                    <p className="text-red-500 text-sm mt-2">{bidError}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;