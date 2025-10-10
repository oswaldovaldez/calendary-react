import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import type { ProductType } from "../../types";

const ShowProduct = () => {
  const { productId } = useParams({ from: "/products/$productId" });
  const token = useAuthStore((state) => state.token);

  const [product, setProduct] = useState<ProductType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(true);
  useEffect(() => {
    if (!token) {
      setError("No hay sesión activa");
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await Api.showProduct({
          _token: `${token}`,
          product_id: Number(productId),
        });

        if (!isMounted) return;
        setProduct(response as ProductType);
        setError(null);
      } catch (err) {
        console.error("Error cargando el producto", err);
        if (!isMounted) return;
        setError("No pudimos cargar el producto");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      setIsMounted(false);
    };
  }, [productId, token]);

  if (isLoading) {
    return <div className="card neumo p-6">Cargando producto...</div>;
  }

  if (error || !product) {
    return (
      <div className="card neumo p-6">{error ?? "Producto no encontrado"}</div>
    );
  }

  return (
    <div className="card neumo">
      <div className="card-header">
        <h2 className="text-lg font-semibold">Detalle de producto</h2>
        <p className="text-sm text-gray-500">ID: {product.id}</p>
      </div>

      <div className="card-body grid gap-3 md:grid-cols-2">
        <div>
          <span className="font-semibold">Nombre:</span> {product.name}
        </div>
        <div>
          <span className="font-semibold">SKU:</span> {product.sku ?? "-"}
        </div>
        <div>
          <span className="font-semibold">Marca:</span> {product.brand ?? "-"}
        </div>
        <div>
          <span className="font-semibold">Formato:</span>{" "}
          {product.format ?? "-"}
        </div>
        <div>
          <span className="font-semibold">Precio:</span> ${product.price}
        </div>
        <div>
          <span className="font-semibold">Precio con descuento:</span> $
          {product.price_with_discount}
        </div>
        <div>
          <span className="font-semibold">Costo:</span> ${product.cost}
        </div>
        <div>
          <span className="font-semibold">Comisión:</span> ${product.commission}
        </div>
        <div>
          <span className="font-semibold">IVA:</span> {product.iva}%
        </div>
        <div>
          <span className="font-semibold">Stock:</span> {product.stock}
        </div>
        <div>
          <span className="font-semibold">Alerta de stock:</span>{" "}
          {product.stock_alert}
        </div>
        <div>
          <span className="font-semibold">Activo:</span>{" "}
          {product.active ? "Sí" : "No"}
        </div>
        <div>
          <span className="font-semibold">Estatus:</span>{" "}
          {product.status ? "Publicado" : "No publicado"}
        </div>
        <div className="md:col-span-2">
          <span className="font-semibold">Descripción:</span>{" "}
          {product.description || "Sin descripción"}
        </div>
        <div>
          <span className="font-semibold">Creado:</span>{" "}
          {product.created_at
            ? new Date(product.created_at).toLocaleString("es-MX", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "-"}
        </div>
        <div>
          <span className="font-semibold">Última actualización:</span>{" "}
          {product.updated_at
            ? new Date(product.updated_at).toLocaleString("es-MX", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "-"}
        </div>

        {/* Solo el nombre de la categoría */}
        <div className="md:col-span-2 mt-4">
          <span className="font-semibold">Categorías:</span>{" "}
          {product.categories?.length === 0
            ? "Sin categoría"
            : product.categories
                ?.map((cat) => (typeof cat === "number" ? cat : cat.name))
                .join(", ")}
        </div>
      </div>
    </div>
  );
};

export default ShowProduct;
