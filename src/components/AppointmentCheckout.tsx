// src/views/AppointmentCheckout.tsx
import React  from "react";
import { useCartStore } from "../store/cartStore";

import { toast } from "react-hot-toast";
import { Api } from "../services/api";
import { useAuthStore } from "../store/auth.store";
import { useNavigate } from "@tanstack/react-router";
import { useNotificationStore } from "../store/notification.store";

export default function AppointmentCheckout({ appointmentId }:any): React.ReactElement {
  const {
    items,
    subtotal,
    taxRate,
    discountType,
    discountValue,
    adjustmentMode,
    adjustmentConcept,
    walletAmount,
    paymentMethod,
    folio,
    grandTotal,
  } = useCartStore();
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();
  const notify = useNotificationStore((state) => state.notify);

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
      // const payload = {
      //   items,
      //   subtotal: subtotal(),
      //   tax_rate: taxRate,
      //   discount_type: discountType,
      //   discount_value: discountValue,
      //   adjustment_mode: adjustmentMode, // "add" | "subtract"
      //   adjustment_concept: adjustmentConcept,
      //   wallet_amount: walletAmount,
      //   payment_method: paymentMethod,
      //   status: "pending",
      //   folio: folio || null,
      //   total: grandTotal(),
      // };

      const res = await Api.createOrder({
        appointment_id: appointmentId,
        subtotal: subtotal(),
        total: grandTotal(),
        consultation_fee: 0,
        payment_method: paymentMethod,
        folio: folio || null,
        items: items,
        status: "pending",
        tax_rate: taxRate,
        discount_type: discountType,
        discount_value: discountValue,
        wallet_amount: walletAmount,
        adjustment_mode: adjustmentMode,
        adjustment_concept: adjustmentConcept,

        _token: `${token}`,
      });
      console.log(res);
      notify("success", "Orden creada correctamente");
      navigate({ to: "/orders" });
    } catch (err: any) {
      console.error(err);
      toast.error("Error registrando orden");
    }
  }

  return (
    <div>
      <button onClick={handleCheckout} className="btn btn-sm btn-success">
        Generar Orden
      </button>
    </div>
  );
}
