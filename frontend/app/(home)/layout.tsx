import { Header } from "@/components/ui/header";
import { LeftBar } from "@/components/ui/left_bar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Header />
      <div className="w-full h-[calc(100%-48px)] flex flex-row">
        <LeftBar />
        <div className="h-full w-full xl:ml-64 max-xl:ml-12">{children}</div>
      </div>
    </div>
  );
}
