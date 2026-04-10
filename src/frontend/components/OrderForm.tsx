import { useState } from "react";

// IMPORTS BACKEND
import { createOrder } from "../../backend/models/Order";
import { discountOrder } from "../../backend/decorators/DiscountOrder";
import { taxOrder } from "../../backend/decorators/TaxOrder";
import { sendOrder } from "../../backend/decorators/SendOrder";
import { surchargeOrder } from "../../backend/decorators/SurchargeOrder";

import { createOrderService } from "../../backend/OrderService";
import { consoleObserver } from "../../backend/observers/ConsoleObserver";
import { textFileObserver } from "../../backend/observers/TextFileObserver";

import OrderSummary from "./OrderSummary";
import { notificationObserver} from "../../backend/observers/NotificationObserver";

// IMPORTS BACKEND (igual que antes)

export default function OrderForm() {
  const [baseAmount, setBaseAmount] = useState<number | string>("");

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

    if (baseAmount === "" || isNaN(Number(baseAmount))) {
      showPopup("Introduce un precio válido");
      return;
    }

    if (email !== "" && !isValidEmail(email)) {
      showPopup("Email inválido");
      return;
    }

    let order = createOrder(Number(baseAmount));

    if (discount != "") order = discountOrder(order,discount as number);
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

        <div className="options">

          <label className="option">
            <span>Descuento (%)</span>
            <input
              type="text"
              value={discount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setDiscount(value === "" ? "" : Number(value));
                }
              }}
            />
          </label>

          <label className="option">
            <span>Impuesto (%)</span>
            <input
              type="text"
              value={tax}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setTax(value === "" ? "" : Number(value));
                }
              }}
            />
          </label>

          <label className="option">
            <span>Envío (€)</span>
            <input
              type="text"
              value={shipping}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setShipping(value === "" ? "" : Number(value));
                }
              }}
            />
          </label>

          <label className="option">
            <span>Recargo (€)</span>
            <input
              type="text"
              value={surcharge}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setSurcharge(value === "" ? "" : Number(value));
                }
              }}
            />
          </label>

        </div>

        <div>
          <input
            type="email"
            placeholder="Correo del cliente (opcional)"
            className="input-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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