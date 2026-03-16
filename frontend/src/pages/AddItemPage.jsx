import { useState, useId } from "react";
import { useNavigate } from "react-router-dom";

const UNIT_OPTIONS = [
  { value: "", label: "— (count, e.g. 2 eggs)" },
  { value: "grams", label: "grams" },
  { value: "milliliters", label: "milliliters" },
];

export default function AddItemPage({ onAddItem }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("Fridge");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  const navigate = useNavigate();
  const nameId = useId();
  const locationId = useId();
  const quantityId = useId();
  const unitId = useId();

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !quantity.trim()) return;

    onAddItem({
      name: name.trim(),
      location,
      quantity: quantity.trim(),
      unit: unit || "",
    });

    setName("");
    setLocation("Fridge");
    setQuantity("");
    setUnit("");
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
          placeholder="e.g. 2 or 200"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <label htmlFor={unitId}>Unit</label>
        <select
          id={unitId}
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        >
          {UNIT_OPTIONS.map((opt) => (
            <option key={opt.value || "blank"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button type="submit">Add Item</button>
      </form>
    </main>
  );
}
