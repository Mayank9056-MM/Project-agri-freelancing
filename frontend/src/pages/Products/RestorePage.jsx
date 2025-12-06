import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductContext } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";

const RestockPage = () => {
  const { sku } = useParams();
  const navigate = useNavigate();

  const { products, getAllProducts, restockProduct } = useContext(ProductContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    const p = products.find((item) => item.sku === sku);
    setProduct(p);
  }, [products]);

  const handleRestock = async () => {
    if (!quantity || quantity <= 0) {
      toast.error("Enter a valid quantity");
      return;
    }

    await restockProduct(sku, quantity);
    navigate("/low-stock");
  };

  if (!product) return <p className="p-6">Loading product...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Restock Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-semibold">Product: {product.name}</p>
          <p>Current Stock: {product.stock}</p>

          <Input
            type="number"
            placeholder="Enter quantity to add"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <Button className="w-full" onClick={handleRestock}>
            Update Stock
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/low-stock")}
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RestockPage;
