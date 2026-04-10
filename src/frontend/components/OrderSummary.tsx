interface Props {
  result: string;
}

export default function OrderSummary({ result }: Props) {
  if (!result) return null;

  return (
    <div className="summary">
      <h3>Resumen del Pedido</h3>
      <p>{result}</p>
    </div>
  );
}