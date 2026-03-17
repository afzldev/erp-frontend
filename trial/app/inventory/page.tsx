"use client";

import { useState, useEffect } from "react";
import { getApiUrl } from "@/lib/api";

type InventoryItem = {
  _id: string;
  item?: {
    name?: string;
  };
  quantity: number;
};

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInventory = async () => {
      try {
        setError("");

        const res = await fetch(getApiUrl("/api/inventory"));
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch inventory");
        }

        setInventory(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("inventory load error", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch inventory"
        );
      }
    };

    void loadInventory();
  }, []);

  return (
    <div>
      <h1>Inventory</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Stock</th>
          </tr>
        </thead>

        <tbody>
          {inventory.map((i) => (
            <tr key={i._id}>
              <td>{i.item?.name}</td>
              <td>{i.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
