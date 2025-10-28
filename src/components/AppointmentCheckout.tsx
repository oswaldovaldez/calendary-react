// src/views/AppointmentCheckout.tsx
import React, { type JSX } from "react";
import { useCartStore } from "../store/cartStore";

import { toast } from "react-hot-toast";

export default function AppointmentCheckout(): JSX.Element {
  const {
    items,
    subtotal,
    taxRate,
    // discountType & discountValue are reused to compute magnitude
    discountType,
    discountValue,
    adjustmentMode,
    adjustmentConcept,
    walletAmount,
    paymentMethod,
    folio,
    grandTotal,
    clear,
  } = useCartStore();

  async function handleCheckout() {
    if (!items.length) {
      toast.error("El carrito está vacío");
      return;
    }
    // if no payment and wallet 0 -> warn
    if (!paymentMethod && (!walletAmount || walletAmount <= 0)) {
      toast.error(
        "Selecciona un método de pago o especifica un monto de wallet"
      );
      return;
    }

    try {
      const payload = {
        items,
        subtotal: subtotal(),
        tax_rate: taxRate,
        discount_type: discountType,
        discount_value: discountValue,
        adjustment_mode: adjustmentMode, // "add" | "subtract"
        adjustment_concept: adjustmentConcept,
        wallet_amount: walletAmount,
        payment_method: paymentMethod,
        status: "pending",
        folio: folio || null,
        total: grandTotal(),
      };

      console.log("Enviando orden al backend:", payload);
      // const { data } = await axios.post("/api/orders", payload);

      // toast.success("Orden registrada correctamente");
      // clear();
      // console.log("Backend respuesta:", data);
    } catch (err: any) {
      console.error(err);
      toast.error("Error registrando orden");
    }
  }

  return (
    <div>
      <button onClick={handleCheckout} className="btn btn-success">
        Generar Orden
      </button>
    </div>
  );
}
