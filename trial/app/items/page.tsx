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
  const [error, setError] = useState("");

  const [items, setItems] = useState<Item[]>([]);

  // Load items from backend
  const fetchItems = async () => {
    try {
      setError("");

      const res = await fetch(getApiUrl("/api/items"));
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("GET /api/items failed", {
          status: res.status,
          data,
        });
        throw new Error(data?.message || "Failed to fetch items");
      }

      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("fetchItems error", error);
      setError(error instanceof Error ? error.message : "Failed to fetch items");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");

      const payload = {
        name,
        sku,
        unitPrice: Number(price),
      };

      console.log("POST /api/items payload", payload);

      const res = await fetch(getApiUrl("/api/items"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("POST /api/items failed", {
          status: res.status,
          data,
        });
        throw new Error(data?.message || "Failed to create item");
      }

      setName("");
      setSku("");
      setPrice("");

      fetchItems();
    } catch (error) {
      console.error("handleSubmit item error", error);
      setError(error instanceof Error ? error.message : "Failed to create item");
    }
  };

  return (
    <div>
      <h1>Items</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

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
