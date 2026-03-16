"use client";

import { useState, useEffect } from "react";
import { getApiUrl } from "@/lib/api";

type Item = {
  _id?: string;
  name: string;
  sku: string;
  unitPrice: number;
};

export default function ItemsPage() {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");

  const [items, setItems] = useState<Item[]>([]);

  // Load items from backend
  const fetchItems = async () => {
    const res = await fetch(getApiUrl("/api/items"));
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch(getApiUrl("/api/items"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        sku,
        unitPrice: Number(price),
      }),
    });

    setName("");
    setSku("");
    setPrice("");

    fetchItems();
  };

  return (
    <div>
      <h1>Items</h1>

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Item Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>SKU</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Unit Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <button type="submit">Create Item</button>

      </form>

      <hr style={{ margin: "30px 0" }} />

      <h2>Item List</h2>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.sku}</td>
              <td>{item.unitPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
