'use client';

import React, { useEffect, useState } from "react";
import { useApi } from "../../api/index";
import { Item, GetAllItemsParams } from "../../types"; // Adjust the import path as needed

const TestGetAllItems = () => {
    const { getAllItems } = useApi();
    const [items, setItems] = useState<Item[]>([]); // Specify type explicitly
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);

                // Use the most parameters for the request
                const params: GetAllItemsParams = {
                    "page": 1,
                    "limit": 5,
                    "categoryId": "Electronic", // Example: "Electronics"
                    "status": "active",
                    "search": "Apple Watch 3",
                    "minPrice": 500,
                    "maxPrice": 1000,
                    "sortBy": "endTime",
                    "sortOrder": "asc"
                };

                const response = await getAllItems(params);
                setItems(response.items); // Assuming response includes an `items` array
            } catch (err) {
                console.error(err);
                setError("Failed to fetch items");
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []); // Empty dependency array ensures this runs only once

    if (loading) return <p>Loading items...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Items</h1>
            {items.length > 0 ? (
                <ul>
                    {items.map((item) => (
                        <li key={item._id}>
                            {item.title} - {item.startingPrice} USD
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No items found</p>
            )}
        </div>
    );
};

export default TestGetAllItems;
