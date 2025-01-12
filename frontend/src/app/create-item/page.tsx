"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, ImagePlus, X, Info } from 'lucide-react';
import { useApi } from '../../api';
import { Category, CreateItemFormData } from '../../types';
import { useAuth } from '@clerk/nextjs';

const CreateItemForm = () => {
    const router = useRouter();
    const { getAllCategory, createItem } = useApi();
    const { userId } = useAuth();

    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState<CreateItemFormData>({
        title: '',
        description: '',
        startingPrice: '',
        image: '',
        endTime: '',
        categories: []
    });
    const [previewImage, setPreviewImage] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategory();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setErrors(prev => ({ ...prev, image: 'Please upload an image file' }));
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setErrors(prev => ({ ...prev, image: 'Image must be smaller than 5MB' }));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setFormData(prev => ({ ...prev, image: base64String }));
            setPreviewImage(base64String);
            setErrors(prev => ({ ...prev, image: '' }));
        };
        reader.readAsDataURL(file);
    };

    const handleCategoryToggle = (categoryId: string) => {
        const category = categories.find(cat => cat._id === categoryId);
        if (!category) return;

        let updatedCategories = [...formData.categories];

        if (updatedCategories.includes(categoryId)) {
            // Remove category
            updatedCategories = updatedCategories.filter(id => id !== categoryId);

            // If removing a parent, remove all its children too
            if (!category.parentCategory) {
                const childCategories = categories.filter(cat => cat.parentCategory === categoryId);
                updatedCategories = updatedCategories.filter(id =>
                    !childCategories.some(child => child._id === id)
                );
            }
        } else {
            // Add category
            updatedCategories.push(categoryId);

            // If adding a child, make sure parent is included
            if (category.parentCategory && !updatedCategories.includes(category.parentCategory)) {
                updatedCategories.push(category.parentCategory);
            }
        }

        setFormData(prev => ({ ...prev, categories: updatedCategories }));
        setErrors(prev => ({ ...prev, categories: '' }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.startingPrice || parseFloat(formData.startingPrice) <= 0) {
            newErrors.startingPrice = 'Starting price must be greater than 0';
        }

        if (!formData.image) {
            newErrors.image = 'Image is required';
        }

        if (!formData.endTime) {
            newErrors.endTime = 'End time is required';
        } else {
            const endTime = new Date(formData.endTime);
            const minTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
            const maxTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

            if (endTime < minTime) {
                newErrors.endTime = 'End time must be at least 1 hour in the future';
            } else if (endTime > maxTime) {
                newErrors.endTime = 'End time cannot be more than 30 days in the future';
            }
        }

        if (formData.categories.length === 0) {
            newErrors.categories = 'Please select at least one category';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !userId) return;

        setLoading(true);
        try {
            await createItem({
                title: formData.title,
                description: formData.description,
                startingPrice: parseFloat(formData.startingPrice),
                image: formData.image,
                categories: formData.categories,
                endTime: new Date(formData.endTime),
                userId
            });
            router.push('/');
        } catch (error) {
            console.error('Error creating item:', error);
            setErrors(prev => ({ ...prev, submit: 'Failed to create item' }));
        } finally {
            setLoading(false);
        }
    };

    // Get parent categories and their children
    const parentCategories = categories.filter(cat => !cat.parentCategory);
    const getChildCategories = (parentId: string) =>
        categories.filter(cat => cat.parentCategory === parentId);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Auction</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                                placeholder="Enter item title"
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>


                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                                placeholder="Enter item description"
                            />
                        </div>

                        {/* Starting Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Starting Price</label>
                            <div className="relative mt-1">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                                <input
                                    type="number"
                                    value={formData.startingPrice}
                                    onChange={e => setFormData(prev => ({ ...prev, startingPrice: e.target.value }))}
                                    className="block w-full pl-7 pr-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                                {errors.startingPrice && <p className="mt-1 text-sm text-red-600">{errors.startingPrice}</p>}
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image</label>
                                <div className="mt-1 flex items-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <ImagePlus className="h-5 w-5 mr-2 text-gray-500" />
                                        Choose Image
                                    </label>
                                </div>
                                {previewImage && (
                                    <div className="mt-2 relative inline-block">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="h-32 w-32 object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreviewImage('');
                                                setFormData(prev => ({ ...prev, image: '' }));
                                            }}
                                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                                {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                            </div>

                            {/* End Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Time</label>
                                <div className="relative mt-1">
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="datetime-local"
                                        value={formData.endTime}
                                        onChange={e => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                                        className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                                        min={new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)}
                                        max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)}
                                    />
                                </div>
                            </div>
                            {errors.endTime && <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>}
                        </div>

                        {/* Categories */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">Categories</label>
                                <div className="flex items-center text-xs text-gray-600">
                                    <Info className="h-4 w-4 mr-1" />
                                    <span>Selecting a subcategory automatically selects its parent</span>
                                </div>

                            </div>
                            <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                                {parentCategories.map(parent => (
                                    <div key={parent._id} className="mb-4 last:mb-0">
                                        {/* Parent Category */}
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={parent._id}
                                                checked={formData.categories.includes(parent._id)}
                                                onChange={() => handleCategoryToggle(parent._id)}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label htmlFor={parent._id} className="ml-2 text-sm font-medium text-gray-900">
                                                {parent._id}
                                            </label>
                                        </div>

                                        {/* Child Categories */}
                                        <div className="ml-6 mt-2 space-y-2">
                                            {getChildCategories(parent._id).map(child => (
                                                <div key={child._id} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={child._id}
                                                        checked={formData.categories.includes(child._id)}
                                                        onChange={() => handleCategoryToggle(child._id)}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor={child._id} className="ml-2 text-sm text-gray-700">
                                                        {child._id}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors.categories && <p className="mt-1 text-sm text-red-600">{errors.categories}</p>}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => router.push('/')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating...' : 'Create Auction'}
                            </button>
                        </div>

                        {errors.submit && (
                            <p className="text-sm text-red-600 text-center mt-2">{errors.submit}</p>
                        )}
                    </form>
                </div >
            </div >
        </div >
    );
};

export default CreateItemForm;