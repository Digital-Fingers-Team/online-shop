import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = { title: "MarketPilot Marketplace", description: "Amazon-inspired production-ready marketplace MVP" };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body><AuthProvider><Header />{children}<Footer /></AuthProvider></body></html>; }
