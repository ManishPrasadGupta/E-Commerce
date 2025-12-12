import { IProduct } from "../../models/Product.model";
import { apiClient } from "../../lib/api-client";
import TopProducts from "./TopProducts";

export default async function TopProductsServer() {
  try {
    const products: IProduct[] = await apiClient.getTopProducts();

    return <TopProducts products={products} />;
  } catch (error) {
    console.error("SSR Fetch Error:", error);
    return <TopProducts products={[]} />;
  }
}
