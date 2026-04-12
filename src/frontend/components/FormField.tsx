type Props = {
    label?: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    onlyNumbers?: boolean;
};

export function FormField({
    label,
    type = "text",
    value,
    onChange,
    error,
    placeholder,
    onlyNumbers = false,
}: Props) {
    return (
        <div className="field">
            {label && <span>{label}</span>}

            <input
                type={type}
                value={value}
                placeholder={placeholder}
                className={error ? "input-error" : ""}
                onChange={(e) => {
                    const value = e.target.value;

                    if (onlyNumbers && !/^\d*$/.test(value)) return;

                    onChange(value);
                }}
            />

            {error && <span className="error">{error}</span>}
        </div>
    );
}