"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutUsPage() {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About Us</h1>
          <p className="text-lg text-gray-600">
            Welcome to Ceiler, your premier online bidding platform.
          </p>
        </div>

        {/* About Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Who We Are
            </h2>
            <p className="text-gray-600 mb-4">
              At Ceiler, we believe in creating a seamless and trustworthy
              platform where buyers and sellers come together to engage in
              exciting auctions. With our state-of-the-art tools and secure
              processes, we ensure a smooth experience for all participants.
            </p>
            <p className="text-gray-600">
              Whether you are bidding for rare collectibles or listing your
              products for auction, Ceiler is designed to empower your journey.
            </p>
          </div>
          <div className="relative w-full h-64 md:h-96">
            <Image
              src="/images/aunction4.jpeg"
              alt="Auction"
              layout="fill"
              className="rounded-lg object-cover"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Why Choose Ceiler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white shadow-lg rounded-lg p-6">
              <Image
                src="/images/trust.svg"
                alt="Trust"
                width={100}
                height={100}
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Trustworthy</h3>
              <p className="text-gray-600">
                Secure payments and transparent bidding processes ensure your
                peace of mind.
              </p>
            </div>

            <div className="text-center bg-white shadow-lg rounded-lg p-6">
              <Image
                src="/images/innovation.svg"
                alt="Innovation"
                width={100}
                height={100}
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Innovative</h3>
              <p className="text-gray-600">
                Advanced features like real-time bidding and analytics at your
                fingertips.
              </p>
            </div>

            <div className="text-center bg-white shadow-lg rounded-lg p-6">
              <Image
                src="/images/community.svg"
                alt="Community"
                width={100}
                height={100}
                className="mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Community</h3>
              <p className="text-gray-600">
                Join a vibrant community of buyers and sellers from all over
                the world.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Image
                src="/images/team1.jpg"
                alt="Team Member"
                width={150}
                height={150}
                className="rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800">Jane Doe</h3>
              <p className="text-gray-600">CEO & Founder</p>
            </div>

            <div className="text-center">
              <Image
                src="/images/team2.jpg"
                alt="Team Member"
                width={150}
                height={150}
                className="rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800">John Smith</h3>
              <p className="text-gray-600">CTO</p>
            </div>

            <div className="text-center">
              <Image
                src="/images/team3.jpg"
                alt="Team Member"
                width={150}
                height={150}
                className="rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800">Emily Brown</h3>
              <p className="text-gray-600">Lead Designer</p>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="text-center py-16 bg-blue-100 rounded-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Start Bidding?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Join Ceiler today and explore the exciting world of auctions.
          </p>
          <Link href="/">
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
