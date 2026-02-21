import "./globals.css";

export const metadata = {
  title: "GetFives â Help Your Coffee Shop Get More 5-Star Reviews",
  description:
    "GetFives helps coffee shops turn happy customers into 5-star Google reviews and catch negative feedback before it goes public.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased text-gray-900">{children}</body>
    </html>
  );
}