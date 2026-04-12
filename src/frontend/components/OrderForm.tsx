import { useState } from "react";

import { createOrder } from "../../backend/models/Order";

import { validateOrder } from "../../backend/validateErrors";

import { discountOrder } from "../../backend/decorators/DiscountOrder";
import { taxOrder } from "../../backend/decorators/TaxOrder";
import { shippingOrder } from "../../backend/decorators/ShippingOrder";
import { surchargeOrder } from "../../backend/decorators/SurchargeOrder";

import { createOrderService } from "../../backend/OrderService";
import { consoleObserver } from "../../backend/observers/ConsoleObserver";
import { textFileObserver } from "../../backend/observers/TextFileObserver";
import { notificationObserver } from "../../backend/observers/NotificationObserver";

import { OrderSummary } from "./OrderSummary";
import { FormField } from "./FormField";
import { Options } from "./Options";
import { Popup } from "./PopUp";

export function OrderForm() {

  const [baseAmount, setBaseAmount] = useState("");

  const [discount, setDiscount] = useState("");
  const [tax, setTax] = useState("");
  const [shipping, setShipping] = useState("");
  const [surcharge, setSurcharge] = useState("");

  const [email, setEmail] = useState("");
  const [popup, setPopup] = useState("");
  const [result, setResult] = useState("");
  const [errors, setErrors] = useState<any>({});

  const showPopup = (message: string) => {
    setPopup(message);
    setTimeout(() => setPopup(""), 4000);
  };

  const handleConfirm = () => {

    const { errors, hasError } = validateOrder({
      baseAmount,
      discount,
      tax,
      shipping,
      surcharge,
      email
    });

    setErrors(errors);
    if (hasError) return;

    let order = createOrder(Number(baseAmount));

    if (discount != "") { order = discountOrder(order, Number(discount)); }
    if (tax != "") { order = taxOrder(order, Number(tax)); }
    if (shipping != "") { order = shippingOrder(order, Number(shipping)); }
    if (surcharge != "") { order = surchargeOrder(order, Number(surcharge)); }

    if (email) { order = { ...order, email }; }

    const service = createOrderService();
    service.addObserver(consoleObserver);

    if (email) { service.addObserver(notificationObserver(email, showPopup)); }


    order.descripcion = order.descripcion + `-----------------------------------------
      Total: ${order.getPrice().toFixed(2)}€\n\n`

    service.addObserver(textFileObserver);
    service.confirmOrder(order);

    setResult(`${order.descripcion}`);

    setBaseAmount("");
    setDiscount("");
    setTax("");
    setShipping("");
    setSurcharge("");
    setEmail("");
  };

  return (
    <>
      <div className="header">
        <h1>Sistema de Pedidos</h1>

        <h3>Crear Pedido</h3>

        <FormField
          value={baseAmount}
          onChange={setBaseAmount}
          error={errors.baseAmount}
          placeholder="Precio base (€)"
          onlyNumbers
        />

        <Options
          discount={discount}
          setDiscount={setDiscount}
          tax={tax}
          setTax={setTax}
          shipping={shipping}
          setShipping={setShipping}
          surcharge={surcharge}
          setSurcharge={setSurcharge}
          errors={errors}
        />

        <FormField
          type="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
          placeholder="Correo del cliente (opcional)"
        />

        <button onClick={handleConfirm}>
          Confirmar Pedido
        </button>

        <OrderSummary result={result} />
      </div>

      <Popup message={popup} />
    </>
  );
}