import Footer from "@/client/components/footer"
import Nav from "@/client/components/nav"
import { Metadata } from "next"


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {props.children}
      <Footer />
    </>
  );
}
