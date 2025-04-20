import './globals.css';

export const metadata = {
  title: 'FealtyX Bug Tracker',
  description: 'A bug/task tracker web application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
} 