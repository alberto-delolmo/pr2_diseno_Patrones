type Props = {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
};

export function OptionInput({
    label,
    value,
    onChange,
    error,
    placeholder
}: Props) {
    return (
        <div className="field">

            <div className="row">
                {label && <span>{label}</span>}

                <input
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    className={error ? "input-error" : ""}
                    onChange={(e) => {
                        const val = e.target.value;

                        if (!/^\d*$/.test(val)) return;
                        onChange(val)
                    }}
                />
            </div>

            {error && <span className="error">{error}</span>}

        </div>
    );
}