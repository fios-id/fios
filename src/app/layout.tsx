import { Web3Provider } from "@/components/Web3Provider";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Web3Provider>
          <Header />
          <div className="flex flex-1 pt-16">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 bg-gray-100">{children}</main>
          </div>
        </Web3Provider>
      </body>
    </html>
  );
}
