import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import HeaderAuth from "@/components/header-auth";
import Background from "@/components/background";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Custom Word of the Day",
  description: "Discover a new personalised word of the day",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <Background />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 bg-black/10">
              <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <HeaderAuth />
              </div>
            </nav>
            <div className="flex flex-col gap-20 max-w-5xl p-5">{children}</div>

            <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
              Footer stuff here
            </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
