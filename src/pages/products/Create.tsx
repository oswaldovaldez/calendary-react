import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import { Api } from "../../services/api";
import { useNavigate } from "@tanstack/react-router";
import FormProduct, { type ProductFormValues } from "./FormProduct";
import toast from "react-hot-toast";

const CreateProduct = () => {
  const token = useAuthStore((s) => s.token);
  const commerce = useAuthStore((s) => s.commerce);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await Api.readCategories({
          _token: `${token}`,
          query: {},
        });
        setCategories(response.data ?? []);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        toast.error("No se pudieron cargar las categorías");
      }
    };

    fetchCategories();
  }, [token]);

  const initialValues: ProductFormValues = {
    category_id: 0,
    sku: "",
    name: "",
    barcode: null,
    brand: "",
    status: true,
    description: "",
    format: "",
    cost: 0,
    price: 0,
    price_with_discount: 0,
    commission: 0,
    iva: 16,
    stock: 0,
    stock_alert: 0,
    active: true,
    image: null,
  };

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      await Api.createProduct({
        ...values,
        commerce_id: commerce?.id ?? 0,
        _token: `${token}`,
      });
      toast.success("Producto creado con éxito");
      navigate({ to: "/products" });
    } catch (error) {
      console.error("Error al crear producto:", error);
      toast.error("Hubo un error al crear el producto");
    }
  };

  return (
    <FormProduct
      initialValues={initialValues}
      categories={categories}
      onSubmit={handleSubmit}
    />
  );
};

export default CreateProduct;
