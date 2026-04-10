import { useState } from "react";

import { createOrder } from "../../backend/models/Order";
import { discountOrder } from "../../backend/decorators/DiscountOrder";
import { taxOrder } from "../../backend/decorators/TaxOrder";
import { sendOrder } from "../../backend/decorators/SendOrder";
import { surchargeOrder } from "../../backend/decorators/SurchargeOrder";

import { createOrderService } from "../../backend/OrderService";
import { consoleObserver } from "../../backend/observers/ConsoleObserver";
import { textFileObserver } from "../../backend/observers/TextFileObserver";

import OrderSummary from "./OrderSummary";
import { notificationObserver } from "../../backend/observers/NotificationObserver";


export default function OrderForm() {
  const [baseAmount, setBaseAmount] = useState<number | string>("");

  const [errors, setErrors] = useState({
    baseAmount: "",
    discount: "",
    tax: "",
    shipping: "",
    surcharge: "",
    email: ""
  });

  const [discount, setDiscount] = useState<number | string>("");
  const [tax, setTax] = useState<number | string>("");
  const [shipping, setShipping] = useState<number | string>("");
  const [surcharge, setSurcharge] = useState<number | string>("");

  const [email, setEmail] = useState("");
  const [popup, setPopup] = useState("");

  const [result, setResult] = useState("");

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

    // SURCHARGE
    if (surcharge !== "") {
      const r = Number(surcharge);
      if (r < 0) {
        newErrors.surcharge = "Debe ser ≥ 0";
        hasError = true;
      }
    }

    // SET ERRORS
    setErrors(newErrors);

    // SI HAY ERROR → NO CONTINÚA
    if (hasError) return;

    let order = createOrder(Number(baseAmount));

    if (discount != "") order = discountOrder(order, discount as number);
    if (tax != "") order = taxOrder(order, tax as number);
    if (shipping != "") order = sendOrder(order, shipping as number);
    if (surcharge != "") order = surchargeOrder(order, surcharge as number);



    if (email !== "") {
      order = { ...order, email };
    }

    const service = createOrderService();

    service.addObserver(consoleObserver);

    if (email !== "") {
      service.addObserver(notificationObserver(email, showPopup));
    }
    service.addObserver(textFileObserver);
    service.confirmOrder(order);

    setResult(`Total: ${order.getPrice().toFixed(2)}€`);

    setEmail("");
    setBaseAmount("");
    setDiscount("");
    setTax("");
    setShipping("");
    setSurcharge("");
  };

  const showPopup = (message: string) => {
    setPopup(message);

    setTimeout(() => {
      setPopup("");
    }, 10000);
  };

  return (
    <>
      <div className="header">
        <h1>
          Sistema de <span>Pedidos</span>
        </h1>

        <h3>Crear Pedido</h3>

        <input
          type="text"
          placeholder="Precio base"
          className="input-price"
          value={baseAmount}
          onChange={(e) => {
            const value = e.target.value;

            // solo números o vacío
            if (/^\d*$/.test(value)) {
              setBaseAmount(value === "" ? "" : Number(value));
            }
          }}
        />
        {errors.baseAmount && <p className="error">{errors.baseAmount}</p>}

        <div className="options">

          <div className="option">
            <span>Descuento (%)</span>
            <input
              className={errors.discount ? "input-error" : ""}
              type="number"
              value={discount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setDiscount(value === "" ? "" : Number(value));
                }
              }}
            />
            {errors.discount && <span className="error">{errors.discount}</span>}
          </div>

          <div className="option">
            <span>Impuesto (%)</span>
            <input
              className={errors.tax ? "input-error" : ""}
              type="number"
              value={tax}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setTax(value === "" ? "" : Number(value));
                }
              }}
            />
            {errors.tax && <span className="error">{errors.tax}</span>}
          </div>

          <label className="option">
            <span>Envío (€)</span>
            <input
              className={errors.shipping ? "input-error" : ""}
              type="number"
              value={shipping}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setShipping(value === "" ? "" : Number(value));
                }
              }}
            />
            {errors.shipping && <span className="error">{errors.shipping}</span>}
          </label>

          <div className="option">
            <span>Recargo (€)</span>
            <input
              className={errors.surcharge ? "input-error" : ""}
              type="number"
              value={surcharge}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setSurcharge(value === "" ? "" : Number(value));
                }
              }}
            />
            {errors.surcharge && <span className="error">{errors.surcharge}</span>}
          </div>

        </div>

        <div>
          <input
            type="email"
            placeholder="Correo del cliente (opcional)"
            className="input-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <button onClick={handleConfirm}>Confirmar Pedido</button>

        <OrderSummary result={result} />
      </div>

      {popup && (
        <div className="popup">
          {popup}
        </div>
      )}
    </>
  );
}