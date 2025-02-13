import { Noto_Sans_JP, Noto_Sans_SC } from "@next/font/google";

const noto_sans_jp = Noto_Sans_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--noto-sans-jp",
});

const noto_sans_sc = Noto_Sans_SC({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--noto-sans-sc",
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${noto_sans_jp.variable} ${noto_sans_sc.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
