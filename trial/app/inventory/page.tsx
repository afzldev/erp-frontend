"use client";

import { useState, useEffect } from "react";
import { getApiUrl } from "@/lib/api";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);

  const fetchInventory = async () => {
    const res = await fetch(getApiUrl("/api/inventory"));
    const data = await res.json();
    setInventory(data);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div>
      <h1>Inventory</h1>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Stock</th>
          </tr>
        </thead>

        <tbody>
          {inventory.map((i: any) => (
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
