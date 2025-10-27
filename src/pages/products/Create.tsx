import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import { Api } from "../../services/api";
import { useNavigate } from "@tanstack/react-router";
import FormProduct from "./FormProduct";

import { useNotificationStore } from "../../store/notification.store";
import type { ProductType } from "../../types";

const CreateProduct = () => {
  const token = useAuthStore((s) => s.token);
  const commerce = useAuthStore((s) => s.commerce);
  const navigate = useNavigate();
  const notify = useNotificationStore((state) => state.notify);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  useEffect(() => {
    const fetchCategories = async () => {
      Api.readCategories({
        _token: `${token}`,
        query: {all:'true'},
      })
        .then((response) => {
          setCategories(response ?? []);
        })
        .catch((error) => {
          console.error("Error al cargar categorías:", error);
        });
    };

    fetchCategories();
  }, [token]);

  const initialValues: ProductType = {
    categories: [],
    sku: "",
    name: "",
    barcode: null,
    brand: "",
    status: true,
    description: "",
    format: "",
    cost: "0",
    price: "0",
    price_with_discount: "0",
    commission: "0",
    iva: 16,
    stock: 0,
    stock_alert: 0,
    active: true,
    image: null,
  };

  const handleSubmit = async (values: any) => {
    Api.createProduct({
      ...values,
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

  return (
    <FormProduct
      initialValues={initialValues}
      categories={categories}
      onSubmit={handleSubmit}
    />
  );
};

export default CreateProduct;
