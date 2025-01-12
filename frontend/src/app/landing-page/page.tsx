"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Filter, X, Clock, DollarSign, Tag } from 'lucide-react';
import { useApi } from '../../api';
import { Item, GetAllItemsParams } from '../../types';
import io from 'socket.io-client';
import { debounce } from 'lodash';

const socket = io('http://localhost:5000');

const LandingPage = () => {
    const router = useRouter();
    const { getAllItems } = useApi();
    const [items, setItems] = useState<Item[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [filters, setFilters] = useState<GetAllItemsParams>({
        page: 1,
        limit: 9,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });
    const [pagination, setPagination] = useState({
        current: 1,
        pages: 1,
        total: 0
    });

    const fetchItems = async () => {
        try {
            setLoading(true);
            setError('');

            // Clean filters - remove undefined, null, or empty string values
            const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
                if (value !== undefined && value !== '' && value !== null) {
                    acc[key] = value;
                }
                return acc;
            }, {} as Record<string, any>);

            const response = await getAllItems(cleanFilters);
            setItems(response.items);
            if (response.pagination) {
                setPagination(response.pagination);
            }
        } catch (err) {
            console.error('Error fetching items:', err);
            setError('Failed to fetch items. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((term: string) => {
            setFilters(prev => ({
                ...prev,
                search: term,
                page: 1
            }));
            setIsSearching(false);
        }, 500),
        []
    );

    useEffect(() => {
        if (!isSearching) {
            fetchItems();
        }
    }, [filters, isSearching]);

    useEffect(() => {
        if (searchTerm === '') {
            setFilters(prev => ({
                ...prev,
                search: undefined,
                page: 1
            }));
        }
    }, [searchTerm]);

    // Socket.IO connection effect
    useEffect(() => {
        socket.on('priceUpdate', ({ itemId, newPrice}) => {
            setItems(prevItems => {
                const itemExists = prevItems.some(item => item._id === itemId);

                if (!itemExists) {
                    console.warn(`Price update received for an item not in the current state: ${itemId}`);
                }

                return prevItems.map(item =>
                    item._id === itemId
                        ? {
                            ...item,
                            highestBid: {
                                ...item.highestBid,
                                amount: newPrice,
                                bidId: item.highestBid?.bidId ?? null,
                                userId: item.highestBid?.userId ?? null,
                                timestamp: item.highestBid?.timestamp ?? null,
                            },
                        }
                        : item
                );
            });
        });

    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setIsSearching(true);
        debouncedSearch(value);
    };

    const handleFilterChange = (key: keyof GetAllItemsParams, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePriceChange = (key: 'minPrice' | 'maxPrice', value: string) => {
        // Allow empty string or valid numbers
        const numValue = value === '' ? undefined : parseFloat(value);
        handleFilterChange(key, numValue);
    };

    const handleStatusChange = (value: string) => {
        handleFilterChange('status', value === 'all' ? undefined : value);
    };

    const handleItemClick = (itemId: string) => {
        router.push(`/product-page/${itemId}`);
    };

    const formatTimeLeft = (endTime: Date) => {
        const now = new Date();
        const end = new Date(endTime);
        const diff = end.getTime() - now.getTime();

        if (diff <= 0) return 'Ended';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `${days}d ${hours}h left`;
        if (hours > 0) return `${hours}h ${minutes}m left`;
        return `${minutes}m left`;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getDisplayCategory = (category: string): string => {
        return category.includes('/') ? category.split('/').pop() || category : category;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Ongoing Auctions</h1>
                        <div className="flex gap-4">
                            <Link
                                href="/create-item"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Create Auction
                            </Link>
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white border rounded-md hover:bg-gray-50"
                            >
                                <Filter size={20} />
                                <span>Filters</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className={`lg:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="lg:hidden text-gray-500 hover:text-gray-700"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Search */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Search
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search items..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white"
                                    />
                                    {isSearching && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                    value={filters.status || 'all'}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price Range
                                </label>
                                <div className="space-y-2">
                                    <input
                                        type="number"
                                        placeholder="Min Price"
                                        value={filters.minPrice || ''}
                                        onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max Price"
                                        value={filters.maxPrice || ''}
                                        onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white"
                                    />
                                </div>
                            </div>

                            {/* Sort By */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sort By
                                </label>
                                <select
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                >
                                    <option value="createdAt">Recently Added</option>
                                    <option value="startingPrice">Price</option>
                                    <option value="endTime">End Time</option>
                                    <option value="totalBids">Total Bids</option>
                                </select>
                            </div>

                            {/* Sort Order */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sort Order
                                </label>
                                <select
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                    value={filters.sortOrder}
                                    onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
                                >
                                    <option value="desc">Highest to Lowest</option>
                                    <option value="asc">Lowest to Highest</option>
                                </select>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-600 p-4">
                                {error}
                            </div>
                        ) : items.length === 0 ? (
                            <div className="text-center text-gray-500 p-4">
                                No items found
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {items.map((item) => (
                                    <div
                                        key={item._id}
                                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                        onClick={() => handleItemClick(item._id)}
                                    >
                                        <div className="relative pb-[60%]">
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
                                            </div></div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {item.description || 'No description available.'}
                                            </p>

                                            <div className="space-y-2">
                                                <div className="flex items-center text-gray-700">
                                                    <DollarSign size={16} className="mr-2" />
                                                    <span className="font-medium">
                                                        {formatPrice(item.highestBid?.amount || item.startingPrice)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center text-gray-700">
                                                    <Clock size={16} className="mr-2" />
                                                    <span>{formatTimeLeft(item.endTime)}</span>
                                                </div>

                                                <div className="flex items-center text-gray-700">
                                                    <Tag size={16} className="mr-2" />
                                                    <span>{item.totalBids} bids</span>
                                                </div>

                                                {/* Categories */}
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {Array.isArray(item.categories) && item.categories.map((category, index) => (
                                                        <span
                                                            key={`${item._id}-category-${index}`}
                                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                        >
                                                            {getDisplayCategory(category)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {!loading && items.length > 0 && (
                            <div className="mt-6 flex justify-center">
                                <nav className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleFilterChange('page', filters.page ? filters.page - 1 : 1)}
                                        disabled={filters.page === 1}
                                        className="px-3 py-2 rounded-md bg-white border disabled:opacity-50 text-gray-700 hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-2 text-gray-700">
                                        Page {pagination.current} of {pagination.pages}
                                    </span>
                                    <button
                                        onClick={() => handleFilterChange('page', filters.page ? filters.page + 1 : 2)}
                                        disabled={pagination.current >= pagination.pages}
                                        className="px-3 py-2 rounded-md bg-white border disabled:opacity-50 text-gray-700 hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;