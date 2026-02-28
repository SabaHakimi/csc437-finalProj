import { useState, useId } from "react";
import { useNavigate } from "react-router-dom";

export default function AddItemPage({ onAddItem }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("Fridge");
  const [quantity, setQuantity] = useState("");

  const navigate = useNavigate();
  const nameId = useId();
  const locationId = useId();
  const quantityId = useId();

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !quantity.trim()) return;

    onAddItem({
      name: name.trim(),
      location,
      quantity: quantity.trim(),
    });

    setName("");
    setLocation("Fridge");
    setQuantity("");
    navigate("/");
  }

  return (
    <main>
      <h1>Add Item</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor={nameId}>Item name</label>
        <input
          id={nameId}
          type="text"
          placeholder="e.g. Oats"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor={locationId}>Storage location</label>
        <select
          id={locationId}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="Fridge">Fridge</option>
          <option value="Pantry">Pantry</option>
        </select>

        <label htmlFor={quantityId}>Quantity</label>
        <input
          id={quantityId}
          type="text"
          placeholder="e.g. 2 cups"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <button type="submit">Add Item</button>
      </form>
    </main>
  );
}
