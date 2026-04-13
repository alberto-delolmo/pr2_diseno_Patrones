const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};


export function validateOrder({
    baseAmount,
    discount,
    tax,
    shipping,
    surcharge,
    email
}: any) {
    const errors: any = {};
    let hasError = false;

    const base = Number(baseAmount);
    const d = Number(discount);
    const t = Number(tax);
    const s = Number(shipping);
    const r = Number(surcharge);

    if (email !== "" && !isValidEmail(email)) {
        errors.email = "Email inválido";
        hasError = true;
    }

    if (baseAmount === "" || isNaN(base)) {
        errors.baseAmount = "Precio inválido";
        hasError = true;
    }

    if (discount !== "" && (d < 0 || d > 100)) {
        errors.discount = "Debe estar entre  0 y 100";
        hasError = true;
    }

    if (tax !== "" && (t < 0 || t > 100)) {
        errors.tax = "Debe estar entre 0 y 100";
        hasError = true;
    }

    if (shipping !== "" && s < 0) {
        errors.shipping = "Debe ser mayor o igual a 0";
        hasError = true;
    }

    if (surcharge !== "" && r < 0) {
        errors.surcharge = "Debe ser mayor o igual a 0";
        hasError = true;
    }

    return { errors, hasError };
}