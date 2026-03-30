// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Family Alias - משחק משפחתי",
  description: "משחק אליאס משפחתי עם מילים ותמונות לכל הגילאים",
  // מונע מהטלפון לנסות לזהות מספרי טלפון ולהפוך אותם ללינקים (יכול להרוס עיצוב)
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // הפקודה הקריטית ביותר למכשירים מודרניים עם Notch
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
      <head>
        {/* תגי מטא נוספים לאופטימיזציה של אפליקציית ווב (PWA ready) */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#05081c",
          // מונע הקפצה של המסך בגלילה בטלפונים (Overscroll)
          overscrollBehavior: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {children}
      </body>
    </html>
  );
}