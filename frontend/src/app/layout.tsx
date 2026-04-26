import type { Metadata } from "next";
// ▼ 1. Noto_Sans_JP をインポートする
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

// ▼ 2. フォントの設定をする
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // 通常、やや太め、太字を読み込む
});

export const metadata: Metadata = {
  title: "Todo App",
  description: "My Todo Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ▼ 3. lang="ja" にして、body の className にフォントを適用する
    <html lang="ja">
      <body className={notoSansJP.className}>
        {children}
      </body>
    </html>
  );
}