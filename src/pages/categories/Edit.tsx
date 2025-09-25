import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";
import { Api } from "../../services/api";
import { useParams, useNavigate } from "@tanstack/react-router";
import FormCategory, { type CategoryFormValues } from "./FormCategory";
import toast from "react-hot-toast";

const EditCategory = () => {
  const token = useAuthStore((s) => s.token);
  const commerce = useAuthStore((s) => s.commerce);
  const navigate = useNavigate();
  const { categoryId } = useParams({ from: "/categories/$categoryId/edit" });

  const currentCommerceId = commerce?.id ?? 0;

  const [formData, setFormData] = useState<CategoryFormValues>({
    name: "",
    description: "",
    parent_id: null,
    commerce_id: currentCommerceId,
  });

  const [loading, setLoading] = useState(true);

  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      const payload: CategoryFormValues = {
        ...values,
        name: values.name.trim().toUpperCase(),
        commerce_id: currentCommerceId,
        parent_id: null,
      };

      await Api.updateCategory({
        ...payload,
        _token: token ?? "",
        category_id: categoryId,
      });

      toast.success("Categoría actualizada con éxito", {
        duration: 4000,
      });

      navigate({ to: "/categories" });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al actualizar categoría", {
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    Api.showCategory({
      _token: token ?? "",
      category_id: categoryId,
    })
      .then((res) => {
        setFormData({
          name: res.name,
          description: res.description ?? "",
          parent_id: res.parent_id ?? null,
          commerce_id: res.commerce_id,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error al cargar la categoría");
        setLoading(false);
      });
  }, [token, categoryId]);

  if (loading) return <div>Cargando...</div>;

  return (
    <FormCategory
      initialValues={formData}
      onSubmit={handleSubmit}
      isEdit={true}
    />
  );
};

export default EditCategory;
