import { useState } from "react";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import * as Yup from "yup";
import ErrorForm from "../../components/ErrorForm";
import { handleApiError } from "../../utils/handleFormErrorApi";

export interface OrderFormValues {
  appointment_id: number;
  subtotal: number;
  total: number;
  consultation_fee: number;
  payment_method: string;
  folio: string;
  status: string;
  tax_rate: number;
  discount_type: string;
  discount_value: number;
  wallet_amount: number;
  adjustment_mode: string;
  adjustment_concept: string;
  items: any;
}

const orderSchema = Yup.object().shape({
  appointment_id: Yup.number().required("La cita es obligatoria"),
  subtotal: Yup.number()
    .min(0, "El subtotal debe ser mayor o igual a 0")
    .required("El subtotal es obligatorio"),
  total: Yup.number()
    .min(0, "El total debe ser mayor o igual a 0")
    .required("El total es obligatorio"),
  consultation_fee: Yup.number().min(
    0,
    "El costo de consulta debe ser mayor o igual a 0"
  ),
  payment_method: Yup.string().nullable(),
  folio: Yup.string().nullable(),
  status: Yup.string().nullable(),
  tax_rate: Yup.number().min(
    0,
    "La tasa de impuesto debe ser mayor o igual a 0"
  ),
  discount_value: Yup.number().min(
    0,
    "El descuento debe ser mayor o igual a 0"
  ),
  wallet_amount: Yup.number().min(
    0,
    "El monto de monedero debe ser mayor o igual a 0"
  ),
});

interface FormOrderProps {
  initialValues: OrderFormValues;
  isEdit?: boolean;
  onSubmit: (
    values: OrderFormValues,
    helpers: FormikHelpers<OrderFormValues>
  ) => void | Promise<void>;
}

const FormOrder: React.FC<FormOrderProps> = ({
  initialValues,
  isEdit = false,
  onSubmit,
}) => {
  const [backendError, setBackendError] = useState<string | null>(null);
  // const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const handleWrappedSubmit = async (
    values: OrderFormValues,
    helpers: FormikHelpers<OrderFormValues>
  ) => {
    setBackendError(null);
    // setLocalErrors({});

    try {
      await orderSchema.validate(values, { abortEarly: false });
    } catch (validationError: any) {
      const formErrors: Record<string, string> = {};
      validationError.inner.forEach((err: any) => {
        if (err.path) formErrors[err.path] = err.message;
      });
      // setLocalErrors(formErrors);
    }

    try {
      await onSubmit(values, helpers);
    } catch (apiError: any) {
      const formatted = handleApiError(apiError);
      setBackendError(formatted);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleWrappedSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <div className="card">
          <Form className="form-container">
            <ErrorForm message={backendError} />

            <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Appointment ID */}
              {/* <div className="form-group">
                <label htmlFor="appointment_id">ID de Cita</label>
                <Field
                  className={`input input-sm ${localErrors.appointment_id ? "input-invalid" : ""}`}
                  type="number"
                  name="appointment_id"
                  placeholder="ID de la cita"
                />
                {localErrors.appointment_id && (
                  <div className="form-text-invalid">
                    {localErrors.appointment_id}
                  </div>
                )}
              </div> */}

              {/* Folio */}
              {/* <div className="form-group">
                <label htmlFor="folio">Folio</label>
                <Field
                  className={`input input-sm ${localErrors.folio ? "input-invalid" : ""}`}
                  type="text"
                  name="folio"
                  placeholder="Folio (opcional)"
                />
              </div> */}

              {/* Subtotal */}
              {/* <div className="form-group">
                <label htmlFor="subtotal">Subtotal</label>
                <Field
                  className={`input input-sm ${localErrors.subtotal ? "input-invalid" : ""}`}
                  type="number"
                  step="0.01"
                  name="subtotal"
                  placeholder="0.00"
                />
                {localErrors.subtotal && (
                  <div className="form-text-invalid">
                    {localErrors.subtotal}
                  </div>
                )}
              </div> */}

              {/* Total */}
              {/* <div className="form-group">
                <label htmlFor="total">Total</label>
                <Field
                  className={`input input-sm ${localErrors.total ? "input-invalid" : ""}`}
                  type="number"
                  step="0.01"
                  name="total"
                  placeholder="0.00"
                />
                {localErrors.total && (
                  <div className="form-text-invalid">{localErrors.total}</div>
                )}
              </div> */}

              {/* Consultation Fee */}
              {/* <div className="form-group">
                <label htmlFor="consultation_fee">Costo de Consulta</label>
                <Field
                  className={`input input-sm`}
                  type="number"
                  step="0.01"
                  name="consultation_fee"
                  placeholder="0.00"
                />
              </div> */}

              {/* Payment Method */}
              <div className="form-group">
                <label htmlFor="payment_method">Método de Pago</label>
                <Field
                  as="select"
                  className="input input-sm"
                  name="payment_method"
                >
                  <option value="">Seleccionar...</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="monedero">Monedero</option>
                  <option value="mixto">Mixto</option>
                </Field>
              </div>

              {/* Status */}
              <div className="form-group">
                <label htmlFor="status">Estado</label>
                <Field as="select" className="input input-sm" name="status">
                  <option value="">Seleccionar...</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="pagado">Pagado</option>
                  <option value="parcial">Pago Parcial</option>
                  <option value="cancelado">Cancelado</option>
                </Field>
              </div>

              {/* Tax Rate */}
              {/* <div className="form-group">
                <label htmlFor="tax_rate">Tasa de Impuesto (%)</label>
                <Field
                  className="input input-sm"
                  type="number"
                  name="tax_rate"
                  placeholder="16"
                />
              </div> */}

              {/* Discount Type */}
              {/* <div className="form-group">
                <label htmlFor="discount_type">Tipo de Descuento</label>
                <Field
                  as="select"
                  className="input input-sm"
                  name="discount_type"
                >
                  <option value="">Sin descuento</option>
                  <option value="porcentaje">Porcentaje</option>
                  <option value="fijo">Cantidad Fija</option>
                </Field>
              </div> */}

              {/* Discount Value */}
              {/* <div className="form-group">
                <label htmlFor="discount_value">Valor del Descuento</label>
                <Field
                  className="input input-sm"
                  type="number"
                  step="0.01"
                  name="discount_value"
                  placeholder="0.00"
                />
              </div> */}

              {/* Wallet Amount */}
              {/* <div className="form-group">
                <label htmlFor="wallet_amount">Monto Monedero</label>
                <Field
                  className="input input-sm"
                  type="number"
                  step="0.01"
                  name="wallet_amount"
                  placeholder="0.00"
                />
              </div> */}

              {/* Adjustment Concept */}
              {/* <div className="form-group md:col-span-2">
                <label htmlFor="adjustment_concept">Concepto de Ajuste</label>
                <Field
                  className="input input-sm"
                  type="text"
                  name="adjustment_concept"
                  placeholder="Opcional"
                />
              </div> */}
            </div>

            <div className="card-footer">
              <div className="flex justify-end mt-6">
                <button
                  className="btn neumo btn-success ml-auto"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isEdit ? "Actualizar" : "Registrar"}
                </button>
              </div>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default FormOrder;
