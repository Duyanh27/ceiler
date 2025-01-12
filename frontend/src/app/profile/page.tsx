"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/api/index";
import { UserProfile } from "@/types/index";
import Image from "next/image";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-50 bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const { getProfile, addFundsToWallet } = useApi();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [addingFunds, setAddingFunds] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      setError("");
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to fetch your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async () => {
    const numAmount = parseInt(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setAddingFunds(true);
      setError("");
      await addFundsToWallet(numAmount);
      await fetchProfile();
      setIsModalOpen(false);
      setAmount("");
    } catch (err) {
      console.error("Error adding funds:", err);
      setError("Failed to add funds to your wallet.");
    } finally {
      setAddingFunds(false);
    }
  };

  const AddFundsModal = () => (
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Add Funds to Wallet</h3>
        
        {/* Quick Select Amount */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Quick Select Amount
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[50, 100, 250, 500, 2000].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    amount === quickAmount.toString()
                      ? 'bg-blue-500 border-blue-400 text-white'
                      : 'border-gray-600 hover:border-blue-400 text-gray-200 hover:bg-gray-700'
                  }`}
                >
                  ${quickAmount}
                </button>
              ))}
            </div>
          </div>
          
          {/* Custom Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Or Enter Custom Amount ($)
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="Enter amount"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setIsModalOpen(false);
              setError("");
              setAmount("");
            }}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddFunds}
            disabled={addingFunds || !amount}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-800/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center"
          >
            {addingFunds ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </>
            ) : (
              'Add Funds'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Profile Page</h1>

      {error && (
        <div className="p-4 bg-red-500/80 text-white rounded-lg mb-4 shadow">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500" />
        </div>
      ) : profile && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
          {/* Profile Header */}
          <div className="flex items-center mb-6">
            <Image
              src={profile.imageUrl || "/images/default-profile.png"}
              alt="Profile Picture"
              width={100}
              height={100}
              className="rounded-full border-2 border-gray-700"
            />
            <div className="ml-6">
              <p className="text-2xl font-semibold">{profile.username}</p>
              <p className="text-lg text-gray-400">{profile.email}</p>
            </div>
          </div>

          {/* Wallet Section */}
          <div className="flex items-center justify-between mb-6 bg-gray-700 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-400">Wallet Balance</p>
              <p className="text-2xl font-bold">${profile.walletBalance.toFixed(2)}</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Add Funds
            </button>
          </div>

          {/* Active Bids */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Active Bids</h2>
            {profile.activeBids.length > 0 ? (
              <ul className="space-y-2">
                {profile.activeBids.map((bid, index) => (
                  <li key={index} className="bg-gray-700 p-3 rounded-lg">
                    {bid}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No active bids</p>
            )}
          </div>

          {/* Won Auctions */}
          <div>
            <h2 className="text-xl font-bold mb-3">Won Auctions</h2>
            {profile.wonAuctions.length > 0 ? (
              <ul className="space-y-2">
                {profile.wonAuctions.map((auction, index) => (
                  <li key={index} className="bg-gray-700 p-3 rounded-lg">
                    {auction}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No won auctions</p>
            )}
          </div>
        </div>
      )}

      <AddFundsModal />
    </div>
  );
}