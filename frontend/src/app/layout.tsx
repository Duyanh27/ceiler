import { ClerkProvider } from '@clerk/nextjs'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}</main>
          {/* Spacer with white background */}
          <div className="h-[75px] bg-white"></div>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}
