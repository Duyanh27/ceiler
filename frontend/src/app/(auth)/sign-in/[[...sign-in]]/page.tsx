import Image from "next/image";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#9F3247" }}>
      {/* Left Side: Image with Quote */}
      <div className="flex flex-col justify-start items-center bg-white text-gray-800 w-7/10 p-10">
        <div className="flex flex-col justify-start items-center text-center">
          <Image
            src="/images/Aunction2.jpg"
            alt="Person"
            width={800}
            height={600}
            className="rounded-lg mb-4"
          />
          <h2 className="text-3xl font-bold mb-3">
            &quot;Ceiler has revolutionized the way we bid and sell.&quot;
          </h2>
          <p className="text-lg">
            It’s intuitive, efficient, and built to bring buyers and sellers
            together seamlessly. Ceiler makes every auction an opportunity to
            succeed.
          </p>
        </div>
      </div>

      {/* Right Side: Sign-In Form */}
      <div className="flex flex-col justify-center items-center w-3/10 p-10">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white text-[#9F3247] px-6 py-2 rounded-full shadow-md">
            <h1 className="text-lg font-bold">Permit</h1>
          </div>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Step into the World of Ceiler
            </h1>
            <p className="text-sm italic text-gray-600">
              &quot;Empowering every bidder, one auction at a time.&quot;
            </p>
          </div>
          <div className="mt-8">
            <SignIn
              appearance={{
                layout: {
                  socialButtonsPlacement: "bottom",
                },
                variables: {
                  colorPrimary: "#9F3247",
                  colorBackground: "white",
                  borderRadius: "0.5rem",
                },
                elements: {
                  formButtonPrimary:
                    "bg-[#9F3247] hover:bg-[#841f36] text-white text-sm",
                  formFieldWrapper: "mb-4",
                  formFieldLabel: "text-gray-700 mb-1",
                  cardSubtitle: "hidden", // Hides the "Welcome back!" subtitle
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
