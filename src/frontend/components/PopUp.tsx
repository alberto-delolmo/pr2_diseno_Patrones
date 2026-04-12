export function Popup({ message }: { message: string }) {
    if (!message) return null;

    return <div className="popup">{message}</div>;
}