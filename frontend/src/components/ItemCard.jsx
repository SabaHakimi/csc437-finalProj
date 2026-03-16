import { useState, useId } from "react";

export default function ItemCard({ item, onUse }) {
  const [quantityToUse, setQuantityToUse] = useState("");
  const useInputId = useId();

  function handleSubmit(e) {
    e.preventDefault();
    const qty = quantityToUse.trim();
    onUse(item.id, qty === "" ? null : qty);
    setQuantityToUse("");
  }

  return (
    <div className="card">
      <h3>{item.name}</h3>
      <p>Quantity: {item.quantity ? `${item.quantity}${item.unit === "grams" ? " g" : item.unit === "milliliters" ? " ml" : ""}` : "—"}</p>
      <form onSubmit={handleSubmit} className="item-use-form">
        <label htmlFor={useInputId} className="sr-only">Amount to use</label>
        <input
          id={useInputId}
          type="text"
          placeholder="Amount to use (empty = all)"
          value={quantityToUse}
          onChange={(e) => setQuantityToUse(e.target.value)}
          className="item-use-input"
        />
        <button type="submit">Use</button>
      </form>
    </div>
  );
}
