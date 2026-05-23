export const metadata = {
  title: 'LifeFlow Dashboard',
  description: 'Personal life logging dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
