// src/views/CartView.tsx
import React, { useEffect, useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { toast } from "react-hot-toast";
import AppointmentCheckout from "../../components/AppointmentCheckout";
import Modal from "../../components/Modal";
import AddProduct from "../../components/AddProduct";
import type { AppointmentType } from "../../types";
import { useParams } from "@tanstack/react-router";
import { useAuthStore } from "../../store/auth.store";
import { Api } from "../../services/api";

export default function CartView(): React.ReactElement {
  const {
    items,

    removeItem,
    updateQty,
    editPrice,
    subtotal,
    taxRate,
    setTaxRate,
    discountType,
    discountValue,
    setDiscount,
    adjustmentMode,
    adjustmentConcept,
    setAdjustment,
    adjustmentSignedAmount,
    taxAmount,
    grandTotal,
    walletAmount,
    setWalletAmount,
    paymentMethod,
    setPaymentMethod,
    clear,
  } = useCartStore();

  const [openProduct, setOpenProduct] = useState(false);
  const [openDiscount, setOpenDiscount] = useState(false);

  const [appointment, setAppointment] = useState<AppointmentType | null>(null);
  const { appointmentId } = useParams({
    from: "/appointments/$appointmentId/checkout",
  });
  const token = useAuthStore((state) => state.token);
  useEffect(() => {
    Api.showAppointment({
      _token: `${token}`,
      appointment_id: Number(appointmentId),
    })
      .then((response) => {
        setAppointment(response as AppointmentType);
      })
      .catch(() => {});
  }, []);
  // Local inputs for discount/adjustment
  const [localDiscountType, setLocalDiscountType] = useState<
    "percent" | "fixed"
  >(discountType || "percent");
  const [localDiscountValue, setLocalDiscountValue] = useState<number>(
    discountValue || 0
  );
  const [localAdjustmentMode, setLocalAdjustmentMode] = useState<
    "add" | "subtract"
  >(adjustmentMode || "subtract");
  const [localAdjustmentConcept, setLocalAdjustmentConcept] = useState<string>(
    adjustmentConcept || ""
  );

  function handleApplyDiscount() {
    setDiscount(localDiscountType, localDiscountValue);
    setAdjustment(localAdjustmentMode, localAdjustmentConcept);
    toast.success("Descuento / Incremento aplicado");
  }

  return (
    <>
      <Modal
        isOpen={openProduct}
        onClosex={() => {
          setOpenProduct(false);
        }}
        title="Añadir Producto"
      >
        <AddProduct />
      </Modal>
      <Modal
        isOpen={openDiscount}
        onClosex={() => {
          setOpenDiscount(false);
        }}
        title="Inpuesto / Descuento"
      >
        {/* Ajustes: IVA y Descuento/Incremento */}
        <div
          style={{ border: "1px solid #e5e7eb", padding: 12, marginBottom: 12 }}
        >
          <div className="grid grid-rows-2">
            <div>
              IVA (%):
              <input
                type="number"
                value={taxRate}
                className="input input-sm"
                onChange={(e) => setTaxRate(Number(e.target.value))}
              />
            </div>

            <div>
              Tipo (porcentaje/fijo):
              <select
                value={localDiscountType}
                className="input input-sm mb-4"
                onChange={(e) => setLocalDiscountType(e.target.value as any)}
              >
                <option value="percent">%</option>
                <option value="fixed">$</option>
              </select>
              <input
                type="number"
                value={localDiscountValue}
                onChange={(e) => setLocalDiscountValue(Number(e.target.value))}
                className="input input-sm"
              />
            </div>
          </div>

          {/* Radios para suma/resta y concepto */}
          <div className="mt-2">
            <div>
              <input
                id="subtract"
                type="radio"
                name="adjustMode"
                value="subtract"
                checked={localAdjustmentMode === "subtract"}
                onChange={() => setLocalAdjustmentMode("subtract")}
              />
              <label
                htmlFor="subtract"
                style={{ marginLeft: 6, marginRight: 12 }}
              >
                Resta (Descuento)
              </label>

              <input
                id="add"
                type="radio"
                name="adjustMode"
                value="add"
                checked={localAdjustmentMode === "add"}
                onChange={() => setLocalAdjustmentMode("add")}
              />
              <label htmlFor="add" style={{ marginLeft: 6 }}>
                Suma (Incremento)
              </label>
            </div>

            <div style={{ marginTop: 8 }}>
              Concepto:
              <input
                type="text"
                placeholder="Ej: Promoción verano / Recargo urgencia"
                value={localAdjustmentConcept}
                onChange={(e) => setLocalAdjustmentConcept(e.target.value)}
                className="input input-sm"
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  handleApplyDiscount();
                  setOpenDiscount(false);
                }}
                className="btn btn-sm btn-info"
              >
                Aplicar ajuste
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
        <div className="flex justify-end gap-3 mb-4">
          {/* Añadir producto */}
          <button
            className="btn btn-sm btn-primary"
            onClick={() => setOpenProduct(true)}
          >
            Añadir Producto
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => setOpenDiscount(true)}
          >
            Modificar Descuento/Impuesto
          </button>
        </div>
        <h1>Carrito</h1>

        {/* Lista de items */}
        <div className="card mb-2">
          {items.length === 0 && <div>No hay productos en el carrito.</div>}
          {items.map((it) => (
            <div
              key={it.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 8,
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{it.name}</div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  Cantidad:
                  <input
                    type="number"
                    className="input input-sm"
                    min={1}
                    value={it.qty}
                    onChange={(e) =>
                      updateQty(it.id, Math.max(1, Number(e.target.value)))
                    }
                    style={{ width: 60, marginLeft: 8, padding: 4 }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* precio editable */}
                <input
                  type="number"
                  className="input input-sm"
                  value={it.price}
                  onChange={(e) => editPrice(it.id, Number(e.target.value))}
                  style={{ width: 110, textAlign: "right", padding: 6 }}
                />
                <div
                  style={{ width: 120, textAlign: "right", fontWeight: 600 }}
                >
                  ${(it.price * it.qty).toFixed(2)}
                </div>
                <button
                  onClick={() => removeItem(it.id)}
                  className="btn btn-sm btn-danger"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Wallet / Payment */}

        <div className="card mb-2">
          {Number(appointment?.patient?.wallet?.balance ?? 0) > 0 && (
            <div className="mb-4">
              Pago con Wallet (monto):
              <input
                type="number"
                min={0}
                className="input input-sm"
                value={walletAmount || ""}
                onChange={(e) => setWalletAmount(Number(e.target.value))}
                style={{ width: 160, marginLeft: 8, padding: 6 }}
              />
            </div>
          )}

          <div>
            Método de pago:
            <select
              value={paymentMethod || ""}
              className="input input-sm"
              onChange={(e) =>
                setPaymentMethod((e.target.value as any) || null)
              }
              style={{ marginLeft: 8, padding: 6 }}
            >
              <option value="">-- seleccionar --</option>
              <option value="card">Tarjeta</option>
              <option value="cash">Efectivo</option>
              <option value="transfer">Transferencia</option>
            </select>
          </div>
        </div>

        {/* Totales y concepto visible */}
        <div className="card mb-2">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>Subtotal</div>
            <div>${subtotal().toFixed(2)}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>IVA ({taxRate}%)</div>
            <div>${taxAmount().toFixed(2)}</div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              {localAdjustmentMode === "add" ? "Incremento" : "Descuento"} (
              {localDiscountType === "percent"
                ? `${localDiscountValue}%`
                : `$${localDiscountValue}`}
              )
            </div>
            <div>
              {localAdjustmentMode === "add" ? "+" : "-"}$
              {adjustmentSignedAmount().toFixed(2)}
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <div>Concepto del ajuste: {adjustmentConcept || "-"}</div>
          </div>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 700,
            }}
          >
            <div>Total a pagar</div>
            <div>${grandTotal().toFixed(2)}</div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              clear();
              toast.success("Carrito vaciado");
            }}
            className="btn btn-sm btn-danger"
          >
            Vaciar carrito
          </button>

          <AppointmentCheckout />
        </div>
      </div>
    </>
  );
}
