// src/views/CartView.tsx
import React, { useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { toast } from "react-hot-toast";
import AppointmentCheckout from "../../components/AppointmentCheckout";

export default function CartView(): JSX.Element {
  const {
    items,
    addItem,
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

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newQty, setNewQty] = useState<number>(1);

  // Local inputs for discount/adjustment
  const [localDiscountType, setLocalDiscountType] = useState<"percent" | "fixed">(
    discountType || "percent"
  );
  const [localDiscountValue, setLocalDiscountValue] = useState<number>(discountValue || 0);
  const [localAdjustmentMode, setLocalAdjustmentMode] = useState<"add" | "subtract">(adjustmentMode || "subtract");
  const [localAdjustmentConcept, setLocalAdjustmentConcept] = useState<string>(adjustmentConcept || "");

  function handleAddProduct() {
    if (!newName || newPrice <= 0 || newQty <= 0) {
      toast.error("Nombre, precio y cantidad válidos son necesarios");
      return;
    }
    addItem({ id: Date.now(), name: newName, price: newPrice, quantity: newQty });
    setNewName("");
    setNewPrice(0);
    setNewQty(1);
    toast.success("Producto agregado");
  }

  function handleApplyDiscount() {
    setDiscount(localDiscountType, localDiscountValue);
    setAdjustment(localAdjustmentMode, localAdjustmentConcept);
    toast.success("Descuento / Incremento aplicado");
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1>Carrito</h1>

      {/* Añadir producto */}
      <div style={{ border: "1px solid #e5e7eb", padding: 12, marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="Nombre producto"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ flex: 2, padding: 8 }}
          />
          <input
            type="number"
            placeholder="Precio"
            value={newPrice}
            onChange={(e) => setNewPrice(Number(e.target.value))}
            style={{ width: 120, padding: 8 }}
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={newQty}
            onChange={(e) => setNewQty(Number(e.target.value))}
            style={{ width: 120, padding: 8 }}
          />
          <button onClick={handleAddProduct} style={{ padding: "8px 12px" }}>
            Añadir producto
          </button>
        </div>
      </div>

      {/* Lista de items */}
      <div style={{ border: "1px solid #e5e7eb", padding: 12, marginBottom: 12 }}>
        {items.length === 0 && <div>No hay productos en el carrito.</div>}
        {items.map((it) => (
          <div key={it.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 8, borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{it.name}</div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>Cantidad: 
                <input
                  type="number"
                  min={1}
                  value={it.quantity}
                  onChange={(e) => updateQty(it.id, Math.max(1, Number(e.target.value)))}
                  style={{ width: 60, marginLeft: 8, padding: 4 }}
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* precio editable */}
              <input
                type="number"
                value={it.price}
                onChange={(e) => editPrice(it.id, Number(e.target.value))}
                style={{ width: 110, textAlign: "right", padding: 6 }}
              />
              <div style={{ width: 120, textAlign: "right", fontWeight: 600 }}>
                ${(it.price * it.quantity).toFixed(2)}
              </div>
              <button onClick={() => removeItem(it.id)} style={{ color: "red", padding: 6 }}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ajustes: IVA y Descuento/Incremento */}
      <div style={{ border: "1px solid #e5e7eb", padding: 12, marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <div>
            IVA (%):
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              style={{ width: 80, marginLeft: 8, padding: 6 }}
            />
          </div>

          <div>
            Tipo (porcentaje/fijo):
            <select value={localDiscountType} onChange={(e) => setLocalDiscountType(e.target.value as any)} style={{ marginLeft: 8, padding: 6 }}>
              <option value="percent">%</option>
              <option value="fixed">$</option>
            </select>
            <input
              type="number"
              value={localDiscountValue}
              onChange={(e) => setLocalDiscountValue(Number(e.target.value))}
              style={{ width: 100, marginLeft: 8, padding: 6 }}
            />
          </div>
        </div>

        {/* Radios para suma/resta y concepto */}
        <div style={{ marginBottom: 12 }}>
          <div>
            <input
              id="subtract"
              type="radio"
              name="adjustMode"
              value="subtract"
              checked={localAdjustmentMode === "subtract"}
              onChange={() => setLocalAdjustmentMode("subtract")}
            />
            <label htmlFor="subtract" style={{ marginLeft: 6, marginRight: 12 }}>Resta (Descuento)</label>

            <input
              id="add"
              type="radio"
              name="adjustMode"
              value="add"
              checked={localAdjustmentMode === "add"}
              onChange={() => setLocalAdjustmentMode("add")}
            />
            <label htmlFor="add" style={{ marginLeft: 6 }}>Suma (Incremento)</label>
          </div>

          <div style={{ marginTop: 8 }}>
            Concepto:
            <input
              type="text"
              placeholder="Ej: Promoción verano / Recargo urgencia"
              value={localAdjustmentConcept}
              onChange={(e) => setLocalAdjustmentConcept(e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 6 }}
            />
          </div>

          <div style={{ marginTop: 8 }}>
            <button onClick={handleApplyDiscount} style={{ padding: "8px 12px" }}>
              Aplicar ajuste
            </button>
          </div>
        </div>
      </div>

      {/* Wallet / Payment */}
      <div style={{ border: "1px solid #e5e7eb", padding: 12, marginBottom: 12 }}>
        <div style={{ marginBottom: 8 }}>
          Pago con Wallet (monto):
          <input
            type="number"
            min={0}
            value={walletAmount || ""}
            onChange={(e) => setWalletAmount(Number(e.target.value))}
            style={{ width: 160, marginLeft: 8, padding: 6 }}
          />
        </div>

        <div>
          Método de pago adicional:
          <select value={paymentMethod || ""} onChange={(e) => setPaymentMethod((e.target.value as any) || null)} style={{ marginLeft: 8, padding: 6 }}>
            <option value="">-- seleccionar --</option>
            <option value="card">Tarjeta</option>
            <option value="cash">Efectivo</option>
            <option value="transfer">Transferencia</option>
          </select>
        </div>
      </div>

      {/* Totales y concepto visible */}
      <div style={{ border: "1px solid #e5e7eb", padding: 12, marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>Subtotal</div>
          <div>${subtotal().toFixed(2)}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>IVA ({taxRate}%)</div>
          <div>${taxAmount().toFixed(2)}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>{localAdjustmentMode === "add" ? "Incremento" : "Descuento"} ({localDiscountType === "percent" ? `${localDiscountValue}%` : `$${localDiscountValue}`})</div>
          <div>
            {localAdjustmentMode === "add" ? "+" : "-"}${adjustmentSignedAmount().toFixed(2)}
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <div>Concepto del ajuste: {adjustmentConcept || "-"}</div>
        </div>

        <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
          <div>Total a pagar</div>
          <div>${grandTotal().toFixed(2)}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => { clear(); toast.success("Carrito vaciado"); }} style={{ padding: "8px 12px" }}>
          Vaciar carrito
        </button>

        <AppointmentCheckout />
      </div>
    </div>
  );
}