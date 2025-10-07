import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import FormProduct, { type ProductFormValues } from "./FormProduct";
import toast from "react-hot-toast";
import { useNotificationStore } from "../../store/notification.store";

const EditProduct = () => {
  const token = useAuthStore((s) => s.token);
  const commerce = useAuthStore((s) => s.commerce);
  const navigate = useNavigate();
  const { productId } = useParams({ from: "/products/$productId/edit" });
  const notify = useNotificationStore((state) => state.notify);
  const [initialValues, setInitialValues] = useState<ProductFormValues | null>(
    null
  );
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [product, catResponse] = await Promise.all([
          Api.showProduct({
            product_id: Number(productId),
            _token: `${token}`,
          }),
          Api.readCategories({
            _token: `${token}`,
            query: {},
          }),
        ]);

        setCategories(catResponse.data ?? []);
        setInitialValues({
          category_id: product.category_id,
          sku: product.sku,
          name: product.name,
          barcode: product.barcode,
          brand: product.brand,
          status: product.status,
          description: product.description,
          format: product.format,
          cost: product.cost,
          price: product.price,
          price_with_discount: product.price_with_discount,
          commission: product.commission,
          iva: product.iva,
          stock: product.stock,
          stock_alert: product.stock_alert,
          active: product.active,
          image: product.image,
        });
      } catch (error) {
        console.error("Error al obtener producto/categorías:", error);
        toast.error("No se pudo cargar la información");
      }
    };

    fetchData();
  }, [productId, token]);

  const handleSubmit = async (values: ProductFormValues) => {
    Api.updateProduct({
      ...values,
      product_id: Number(productId),
      commerce_id: commerce?.id ?? 0,
      _token: `${token}`,
    })
      .then((res) => {
        notify("success", res.message);
        navigate({ to: "/products" });
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  if (!initialValues) {
    return <p>Cargando producto...</p>;
  }

  return (
    <FormProduct
      initialValues={initialValues}
      categories={categories}
      onSubmit={handleSubmit}
      isEdit
    />
  );
};

export default EditProduct;
