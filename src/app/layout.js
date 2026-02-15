import "./globals.css";

export const metadata = {
  title: "PlateRate — Turn Happy Diners Into 5-Star Reviews",
  description:
    "PlateRate automatically routes happy customers to Google Reviews and sends unhappy feedback straight to you — privately.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased text-gray-900">{children}</body>
    </html>
  );
}