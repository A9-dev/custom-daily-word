import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import HeaderAuth from "@/components/header-auth";

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
    <html
      lang="en"
      className={`${geistSans.className} bg-background`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center bg-background">
            <nav className="w-full flex justify-center bg-card border-b-4 border-black h-16 shadow-[0_6px_0_0_rgba(0,0,0,1)] -rotate-1">
              <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <HeaderAuth />
              </div>
            </nav>
            <div className="flex-1 flex flex-col gap-20 max-w-5xl p-8 mx-auto w-full">
              {children}
            </div>

            <footer className="w-full flex items-center justify-center border-t-4 border-black mx-auto text-lg font-black py-16 h-32 bg-card shadow-[0_-6px_0_0_rgba(0,0,0,1)] rotate-1">
              Made by&nbsp;
              <a
                href="https://github.com/A9-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors font-black uppercase -rotate-2 hover:rotate-0 transition-transform"
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
