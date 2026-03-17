"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "@/lib/api";

type Item = {
  _id: string;
  name: string;
};

type Vendor = {
  _id: string;
  name: string;
};

type PurchaseRequest = {
  _id: string;
  item?: Item;
  vendor?: Vendor;
  quantity: number;
  status: string;
};

export default function PurchaseRequestsPage() {
  const router = useRouter();

  const [items, setItems] = useState<Item[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);

  const [item, setItem] = useState("");
  const [vendor, setVendor] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  const fetchItems = async () => {
    const res = await fetch(getApiUrl("/api/items"));
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message || "Failed to fetch items");
    setItems(Array.isArray(data) ? data : []);
  };

  const fetchVendors = async () => {
    const res = await fetch(getApiUrl("/api/vendors"));
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message || "Failed to fetch vendors");
    setVendors(Array.isArray(data) ? data : []);
  };

  const fetchRequests = async () => {
    const res = await fetch(getApiUrl("/api/requests"));
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.message || "Failed to fetch requests");
    setRequests(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    const loadPage = async () => {
      try {
        setError("");
        await Promise.all([fetchItems(), fetchVendors(), fetchRequests()]);
      } catch (error) {
        console.error(error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load purchase requests"
        );
      }
    };

    void loadPage();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");
      const res = await fetch(getApiUrl("/api/requests"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item, vendor, quantity }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message || "Failed to create request");
      }

      setItem("");
      setVendor("");
      setQuantity("");

      await fetchRequests();
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "Failed to create request"
      );
    }
  };

  const createOrderFromRequest = async (requestId: string) => {
    try {
      setError("");
      const res = await fetch(getApiUrl(`/api/requests/${requestId}/convert`), {
        method: "POST",
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message || "Failed to create order");
      }

      await fetchRequests();
      router.push("/purchase-orders");
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "Failed to create order"
      );
    }
  };

  return (
    <div>
      <h1>Purchase Requests</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Item</label>
          <select value={item} onChange={(e) => setItem(e.target.value)}>
            <option value="">Select Item</option>
            {items.map((i) => (
              <option key={i._id} value={i._id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Vendor</label>
          <select value={vendor} onChange={(e) => setVendor(e.target.value)}>
            <option value="">Select Vendor</option>
            {vendors.map((v) => (
              <option key={v._id} value={v._id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <button type="submit">Create Request</button>
      </form>

      <hr style={{ margin: "30px 0" }} />

      <h2>Requests</h2>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Vendor</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((r) => (
            <tr key={r._id}>
              <td>{r.item?.name}</td>
              <td>{r.vendor?.name}</td>
              <td>{r.quantity}</td>
              <td>{r.status}</td>

              <td>
                {r.status === "Pending" && (
                  <button
                    type="button"
                    onClick={() => createOrderFromRequest(r._id)}
                  >
                    Create Order
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
