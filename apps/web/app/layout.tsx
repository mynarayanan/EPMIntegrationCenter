import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Integration Centre | Enterprise Data Control Plane',
  description:
    'Control plane for Oracle EPM, Anaplan, Snowflake, IBM TM1, Board, REST/SFTP, and structured file integrations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
