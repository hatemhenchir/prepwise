import Navbar from "@/components/blocks/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="w-[90%] mx-auto">{children}</main>
    </>
  );
}
