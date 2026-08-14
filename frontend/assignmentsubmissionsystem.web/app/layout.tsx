import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/lib/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Assignment Submission System",
  description: "Assignment Submission System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
