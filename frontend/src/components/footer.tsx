import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-8">
        {/* Top Section */}
        <div className="flex flex-wrap justify-between items-center">
          {/* Logo and Tagline */}
          <div className="mb-6 md:mb-0">
            <h1 className="text-2xl font-bold text-white">Ceiler</h1>
            <p className="text-sm text-gray-400 mt-2">
              Empowering every bidder, one auction at a time.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap space-x-6">
            <Link href="/" passHref>
              <span className="text-gray-300 hover:text-white text-sm cursor-pointer">
                Blog
              </span>
            </Link>
            <Link href="/" passHref>
              <span className="text-gray-300 hover:text-white text-sm cursor-pointer">
                Help
              </span>
            </Link>
            <Link href="/" passHref>
              <span className="text-gray-300 hover:text-white text-sm cursor-pointer">
                FAQ
              </span>
            </Link>
            <Link href="/" passHref>
              <span className="text-gray-300 hover:text-white text-sm cursor-pointer">
                Contact Us
              </span>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Middle Section */}
        <div className="flex flex-wrap justify-between items-center">
          {/* Social Media Links */}
          <div className="flex space-x-6">
            <Link href="/" passHref>
              <span className="text-gray-300 hover:text-white cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h3V6c0-1.1.9-2 2-2h2V0h-3c-3.31 0-6 2.69-6 6v2H5v4h4v12h4V12h3l1-4h-4z" />
                </svg>
              </span>
            </Link>
            <Link href="/" passHref>
              <span className="text-gray-300 hover:text-white cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.371 0 0 5.371 0 12c0 4.789 2.865 8.85 6.98 10.612-.097-.899-.184-2.285.038-3.269.202-.877 1.304-5.581 1.304-5.581s-.331-.662-.331-1.641c0-1.535.891-2.682 1.996-2.682.94 0 1.395.707 1.395 1.555 0 .947-.604 2.362-.913 3.677-.26 1.105.553 2.005 1.638 2.005 1.963 0 3.478-2.069 3.478-5.043 0-2.63-1.887-4.464-4.585-4.464-3.121 0-4.953 2.342-4.953 4.76 0 .943.365 1.957.82 2.507.09.11.103.207.077.318-.085.352-.28 1.112-.318 1.265-.05.211-.162.257-.374.154-1.383-.644-2.246-2.667-2.246-4.297 0-3.502 2.544-6.725 7.33-6.725 3.846 0 6.828 2.743 6.828 6.392 0 3.812-2.4 6.879-5.73 6.879-1.118 0-2.168-.576-2.524-1.261l-.687 2.614c-.25.973-.93 2.194-1.391 2.936.976.301 2.004.463 3.077.463 6.629 0 12-5.371 12-12 0-6.63-5.371-12-12-12z" />
                </svg>
              </span>
            </Link>
            <Link href="/" passHref>
              <span className="text-gray-300 hover:text-white cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.615 3.184c-4.888-.356-9.744-.356-14.63 0C1.736 3.469 0 5.247 0 7.735v8.528c0 2.488 1.736 4.266 4.985 4.551 4.888.356 9.744.356 14.63 0 3.249-.285 4.985-2.063 4.985-4.551V7.735c0-2.488-1.736-4.266-4.985-4.551zM9.738 15.019V8.925l6.694 3.049-6.694 3.045z" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-lg font-semibold">Subscribe to our Newsletter</h4>
            <form className="mt-2 flex">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-l-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-blue-500 text-white rounded-r-full hover:bg-blue-600">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Ceiler. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/" passHref>
              <span className="text-sm text-gray-400 hover:text-white cursor-pointer">
                Privacy Policy
              </span>
            </Link>
            <Link href="/" passHref>
              <span className="text-sm text-gray-400 hover:text-white cursor-pointer">
                Terms of Service
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
