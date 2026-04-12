import { useState } from "react";

import { createOrder } from "../../backend/models/Order";

import { discountOrder } from "../../backend/decorators/DiscountOrder";
import { taxOrder } from "../../backend/decorators/TaxOrder";
import { shippingOrder } from "../../backend/decorators/ShippingOrder";
import { surchargeOrder } from "../../backend/decorators/SurchargeOrder";

import { createOrderService } from "../../backend/OrderService";
import { consoleObserver } from "../../backend/observers/ConsoleObserver";
import { textFileObserver } from "../../backend/observers/TextFileObserver";
import { notificationObserver } from "../../backend/observers/NotificationObserver";

import OrderSummary from "./OrderSummary";

export default function OrderForm() {

  const [baseAmount, setBaseAmount] = useState<number | string>("");

  const [discount, setDiscount] = useState<number | string>("");
  const [tax, setTax] = useState<number | string>("");
  const [shipping, setShipping] = useState<number | string>("");
  const [surcharge, setSurcharge] = useState<number | string>("");

  const [email, setEmail] = useState("");
  const [popup, setPopup] = useState("");
  const [result, setResult] = useState("");

  const [errors, setErrors] = useState({
    baseAmount: "",
    discount: "",
    tax: "",
    shipping: "",
    surcharge: "",
    email: ""
  });

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleConfirm = () => {
    const newErrors = {
      baseAmount: "",
      discount: "",
      tax: "",
      shipping: "",
      surcharge: "",
      email: ""
    };

    let hasError = false;

    if (baseAmount === "" || isNaN(Number(baseAmount))) {
      newErrors.baseAmount = "Precio inválido";
      hasError = true;
    }

    if (email !== "" && !isValidEmail(email)) {
      newErrors.email = "Email inválido";
      hasError = true;
    }

    if (discount !== "") {
      const d = Number(discount);
      if (d < 0 || d > 100) {
        newErrors.discount = "Entre 0 y 100";
        hasError = true;
      }
    }

    if (tax !== "") {
      const t = Number(tax);
      if (t < 0 || t > 100) {
        newErrors.tax = "Entre 0 y 100";
        hasError = true;
      }
    }

    if (shipping !== "") {
      const s = Number(shipping);
      if (s < 0) {
        newErrors.shipping = "Debe ser ≥ 0";
        hasError = true;
      }
    }

    if (surcharge !== "") {
      const r = Number(surcharge);
      if (r < 0) {
        newErrors.surcharge = "Debe ser ≥ 0";
        hasError = true;
      }
    }

    setErrors(newErrors);
    if (hasError) return;

    let order = createOrder(Number(baseAmount));

    if (discount !== "") order = discountOrder(order, discount as number);
    if (tax !== "") order = taxOrder(order, tax as number);
    if (shipping !== "") order = shippingOrder(order, shipping as number);
    if (surcharge !== "") order = surchargeOrder(order, surcharge as number);

    if (email !== "") {
      order = { ...order, email };
    }

    const service = createOrderService();
    service.addObserver(consoleObserver);

    if (email !== "") {
      service.addObserver(notificationObserver(email, showPopup));
    }


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

  const showPopup = (message: string) => {
    setPopup(message);
    setTimeout(() => setPopup(""), 4000);
  };

  return (
    <>
      <div className="header">
        <h1>Sistema de Pedidos</h1>

        <h3>Crear Pedido</h3>

        <div className="field">
          <input
            type="text"
            placeholder="Precio base (€)"
            className={errors.baseAmount ? "input-error" : ""}
            value={baseAmount}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setBaseAmount(value === "" ? "" : Number(value));
              }
            }}
          />
        </div>
        {errors.baseAmount && <span className="error">{errors.baseAmount}</span>}

        <hr />

        <div className="options">

          <div className="field">
            <div className="row">
              <span>Descuento (%)</span>
              <input
                className={errors.discount ? "input-error" : ""}
                type="number"
                value={discount}
                onChange={(e) =>
                  setDiscount(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            </div>
            {errors.discount && <span className="error">{errors.discount}</span>}
          </div>

          <div className="field">
            <div className="row">
              <span>Impuesto (%)</span>
              <input
                className={errors.tax ? "input-error" : ""}
                type="number"
                value={tax}
                onChange={(e) =>
                  setTax(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            </div>
            {errors.tax && <span className="error">{errors.tax}</span>}
          </div>

          <div className="field">
            <div className="row">
              <span>Envío (€)</span>
              <input
                className={errors.shipping ? "input-error" : ""}
                type="number"
                value={shipping}
                onChange={(e) =>
                  setShipping(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            </div>
            {errors.shipping && <span className="error">{errors.shipping}</span>}
          </div>

          <div className="field">
            <div className="row">
              <span>Recargo (€)</span>
              <input
                className={errors.surcharge ? "input-error" : ""}
                type="number"
                value={surcharge}
                onChange={(e) =>
                  setSurcharge(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            </div>
            {errors.surcharge && (<span className="error">{errors.surcharge}</span>)}
          </div>

        </div>

        <div className="field">
          <input
            type="email"
            placeholder="Correo del cliente (opcional)"
            className={errors.email ? "input-error" : ""}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (<span className="error">{errors.email}</span>)}
        </div>

        <button onClick={handleConfirm}>
          Confirmar Pedido
        </button>

        <OrderSummary result={result} />
      </div>

      {popup && <div className="popup">{popup}</div>}
    </>
  );
}