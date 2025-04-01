// app/products/[id]/page.tsx (Server Component)
import { Metadata } from "next";
import ProductPage from "./ProductPageId";
import { getProductById } from "@/lib/product";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProductById(params.id);
  
  return {
    title: product ? `${product.name} | E commerce Store` : "Product Not Found",
    description: product ? product.description : "This product does not exist.",
    keywords: product ? product.name : "Product Not Found",
    category: product ? product.category : "Product Not Found",
    openGraph: {
      title: product ? `${product.name} | Your Store` : "Product Not Found",
      description: product ? product.description : "This product does not exist.",
      images: product ? [{ url: product.photo_url }] : [],
    },
   
  };
}

export default function ProductPageWrapper({ params }: { params: { id: string } }) {
  return <ProductPage id={params.id} />;
}
