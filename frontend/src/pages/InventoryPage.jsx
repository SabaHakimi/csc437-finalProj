import ItemCard from "../components/ItemCard";

export default function InventoryPage({ user, items, onMarkUsed }) {
  const fridgeItems = items.filter((i) => i.location === "Fridge");
  const pantryItems = items.filter((i) => i.location === "Pantry");

  return (
    <main>
      <h1>Inventory</h1>
      <p className="user-info">
        Logged in as <strong>{user.name}</strong>
      </p>

      <section className="section" aria-labelledby="fridge-heading">
        <h2 id="fridge-heading">Fridge</h2>
        {fridgeItems.length === 0 ? (
          <p className="empty-state">No items in the fridge.</p>
        ) : (
          <div className="card-grid">
            {fridgeItems.map((item) => (
              <ItemCard key={item.id} item={item} onMarkUsed={onMarkUsed} />
            ))}
          </div>
        )}
      </section>

      <section className="section" aria-labelledby="pantry-heading">
        <h2 id="pantry-heading">Pantry</h2>
        {pantryItems.length === 0 ? (
          <p className="empty-state">No items in the pantry.</p>
        ) : (
          <div className="card-grid">
            {pantryItems.map((item) => (
              <ItemCard key={item.id} item={item} onMarkUsed={onMarkUsed} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
