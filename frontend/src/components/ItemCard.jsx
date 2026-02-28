export default function ItemCard({ item, onMarkUsed }) {
  return (
    <div className={`card${item.used ? " card-used" : ""}`}>
      <h3>{item.name}</h3>
      <p>Quantity: {item.quantity}</p>
      <button onClick={() => onMarkUsed(item.id)} disabled={item.used}>
        {item.used ? "Used" : "Mark Used"}
      </button>
    </div>
  );
}
