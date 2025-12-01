export const handleApiError = (error: any): string => {
  console.group("BACKEND ERROR:");
  console.log(error);
  console.groupEnd();

  if (error?.message && error?.errors) {
    const formatted = Object.values(error.errors)
      .flat()
      .map((msg) => `${msg}`) 
      .join("\n");
    return formatted;
  }

  if (typeof error?.message === "string") { 
    return error?.message ?? "";
  }

  if (error?.response?.data) {
    const data = error.response.data;
    const formatted = Object.values(data.errors || {})
      .flat()
      .map((msg) => `${msg}`) 
      .join("\n");

    return formatted || data.message || "Error en la solicitud";
  }

  return "Ocurrió un error inesperado. Inténtalo nuevamente.";
};
