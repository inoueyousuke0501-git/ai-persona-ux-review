import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIペルソナUXレビュー",
  description: "AIペルソナによるUX仮説生成支援ツール"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
