import "./globals.css";

export const metadata = {
  title: "재능나눔 부스 예약",
  description: "재능나눔 부스 예약 서비스",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}