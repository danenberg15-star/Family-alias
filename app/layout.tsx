import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "מילה נרדפת - משחק לשיפור אוצר המילים ויכולת ההתבטאות האישית",
  description: "גלו את המילים הנרדפות! משחק מהנה לכל המשפחה",
  manifest: "/manifest.json",
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "מילה נרדפת",
  },
  icons: {
    apple: "/icon-192x192.png",
    shortcut: "/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#05081c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#05081c",
          overscrollBehavior: "none",
          WebkitTapHighlightColor: "transparent",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}