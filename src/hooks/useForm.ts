import { useState } from "react";

type FormValues = Record<string, any>;
type Errors = Record<string, string>;

interface UseFormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validate?: (values: T) => Errors;
}

export const useForm = <T extends FormValues>({
  initialValues,
  onSubmit,
  validate,
}: UseFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors>({});

  // Cambiar valor de un campo
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>|any) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Manejar submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;
    }
    await onSubmit(values);
  };

  // Resetear formulario
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    setValues,
    setErrors,
  };
};
