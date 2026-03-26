export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        {/* מחקנו מכאן את ה-Header */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}