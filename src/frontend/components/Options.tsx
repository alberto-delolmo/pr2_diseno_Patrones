import { OptionInput } from "./OptionInput";

export function Options({
    discount,
    setDiscount,
    tax,
    setTax,
    shipping,
    setShipping,
    surcharge,
    setSurcharge,
    errors
}: any) {
    return (
        <div className="options">

            <OptionInput
                label="Descuento (%)"
                value={discount}
                onChange={(v) => setDiscount(v === "" ? "" : Number(v))}
                error={errors.discount}
            />

            <OptionInput
                label="Impuesto (%)"
                value={tax}
                onChange={(v) => setTax(v === "" ? "" : Number(v))}
                error={errors.tax}
            />

            <OptionInput
                label="Envío (€)"
                value={shipping}
                onChange={(v) => setShipping(v === "" ? "" : Number(v))}
                error={errors.shipping}
            />

            <OptionInput
                label="Recargo (€)"
                value={surcharge}
                onChange={(v) => setSurcharge(v === "" ? "" : Number(v))}
                error={errors.surcharge}
            />

        </div>
    );
}