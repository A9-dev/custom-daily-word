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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <nav className="w-full flex justify-center bg-[rgba(255,255,255,0.1)] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[10px] border-b border-[rgba(255,255,255,0.3)] h-16">
              <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <HeaderAuth />
              </div>
            </nav>
            <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5 mx-auto w-full">
              {children}
            </div>

            <footer className="w-full flex items-center justify-center border-t border-[rgba(255,255,255,0.3)] mx-auto text-xs py-16 h-32 bg-[rgba(255,255,255,0.1)] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-blur-[10px]">
              Made by&nbsp;
              <a
                href="https://github.com/A9-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                A9-dev
              </a>
            </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
