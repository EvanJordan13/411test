import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import AppProvider from "@/components/AppProvider";
import ConnectionAlert from "@/components/ui/ConnectionAlert";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProCompare - Football Player Comparison Tool",
  description:
    "Compare NFL players using advanced statistics and ML insights for fantasy football.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          {children}
          <ConnectionAlert />
        </AppProvider>
      </body>
    </html>
  );
}
