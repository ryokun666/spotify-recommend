import { Inter } from "next/font/google";
import CssBaseline from "@mui/material/CssBaseline";
import "normalize.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ディスカバ",
  description:
    "ユーザが最近聴いたアーティストを参考にまだあまり聴かれていないおすすめ楽曲を提案します。ついでにプレイリストも作ります。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head />
      <body>{children}</body>
    </html>
  );
}
