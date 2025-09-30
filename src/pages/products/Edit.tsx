import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";
import { Api } from "../../services/api";
import { useParams, useNavigate } from "@tanstack/react-router";
import FormProduct, { type ProductFormValues } from "./FormProduct";
import toast from "react-hot-toast";

const EditProduct = () => {
  const token = useAuthStore((s) => s.token);
  const commerce = useAuthStore((s) => s.commerce);
  const navigate = useNavigate();
  const { productId } = useParams({ from: "/products/$productId/edit" });

  const currentCommerceId = commerce?.id ?? 0;

  const [formData, setFormData] = useState<ProductFormValues>({
    name: "",
    description: "",
    commerce_id: currentCommerceId,
  });

  const [loading, setLoading] = useState(true);

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      const payload: ProductFormValues = {
        ...values,
        name: values.name.trim().toUpperCase(),
        commerce_id: currentCommerceId,
      };

      await Api.updateProduct({
        ...payload,
        _token: `${token}`,
        product_id: productId,
      });

      toast.success("Producto actualizado con éxito", {
        duration: 4000,
      });

      navigate({ to: "/products" });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al actualizar producto", {
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    Api.showProduct({
      _token: `${token}`,
      product_id: productId,
    })
      .then((res) => {
        setFormData({
          name: res.name,
          description: res.description ?? "",
          commerce_id: res.commerce_id,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error al cargar el producto");
        setLoading(false);
      });
  }, [token, productId]);

  if (loading) return <div>Cargando...</div>;

  return (
    <FormProduct
      initialValues={formData}
      onSubmit={handleSubmit}
      isEdit={true}
    />
  );
};

export default EditProduct;
