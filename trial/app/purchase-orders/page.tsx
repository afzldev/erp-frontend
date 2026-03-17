"use client";

export const dynamic = "force-dynamic";

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

type Order = {
  _id: string;
  item?: Item;
  vendor?: Vendor;
  quantity: number;
  status: string;
};

type RequestDetails = {
  item: Item;
  vendor: Vendor;
  quantity: number;
};

export default function PurchaseOrdersPage() {
  const router = useRouter();

  const [items, setItems] = useState<Item[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [item, setItem] = useState("");
  const [vendor, setVendor] = useState("");
  const [quantity, setQuantity] = useState("");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Fetch Items
  const fetchItems = async () => {
    const res = await fetch(getApiUrl("/api/items"));
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      console.error("GET /api/items failed", { status: res.status, data });
      throw new Error(data?.message || "Failed to fetch items");
    }
    setItems(Array.isArray(data) ? data : []);
  };

  // Fetch Vendors
  const fetchVendors = async () => {
    const res = await fetch(getApiUrl("/api/vendors"));
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      console.error("GET /api/vendors failed", { status: res.status, data });
      throw new Error(data?.message || "Failed to fetch vendors");
    }
    setVendors(Array.isArray(data) ? data : []);
  };

  // Fetch Orders
  const fetchOrders = async () => {
    const res = await fetch(getApiUrl("/api/orders"));
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      console.error("GET /api/orders failed", { status: res.status, data });
      throw new Error(data?.message || "Failed to fetch orders");
    }
    setOrders(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRequestId(params.get("requestId"));
  }, []);

  useEffect(() => {
    const loadPage = async () => {
      try {
        setError("");
        await Promise.all([fetchItems(), fetchVendors(), fetchOrders()]);

        if (requestId) {
          const res = await fetch(getApiUrl(`/api/requests/${requestId}`));

          if (!res.ok) throw new Error("Failed to fetch request");

          const data: RequestDetails = await res.json();
          setItem(data.item._id);
          setVendor(data.vendor._id);
          setQuantity(String(data.quantity));
        }
      } catch (error) {
        console.error(error);
        setError(error instanceof Error ? error.message : "Failed to load purchase orders");
      }
    };

    loadPage();
  }, [requestId]);

  // Create Order
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");
      const endpoint = requestId
        ? getApiUrl(`/api/requests/${requestId}/convert`)
        : getApiUrl("/api/orders");

      const options: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (!requestId) {
        options.body = JSON.stringify({ item, vendor, quantity });
        console.log("POST /api/orders payload", { item, vendor, quantity });
      }

      const res = await fetch(endpoint, options);

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message || "Failed to create order");
      }

      setItem("");
      setVendor("");
      setQuantity("");

      await fetchOrders();

      if (requestId) {
        router.push("/purchase-orders");
      }
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Failed to create order");
    }
  };

  // Receive Order
  const receiveOrder = async (id: string) => {
    try {
      setError("");
      const res = await fetch(getApiUrl(`/api/orders/${id}/receive`), {
        method: "POST",
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message || "Failed to receive order");
      }

      await fetchOrders();
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Failed to receive order");
    }
  };

  return (
    <div>
      <h1>Purchase Orders</h1>

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

        <button type="submit">Create Order</button>
      </form>

      <hr style={{ margin: "30px 0" }} />

      <h2>Orders</h2>

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
          {orders.map((o) => (
            <tr key={o._id}>
              <td>{o.item?.name}</td>
              <td>{o.vendor?.name}</td>
              <td>{o.quantity}</td>
              <td>{o.status}</td>

              <td>
                {o.status === "Ordered" && (
                  <button onClick={() => receiveOrder(o._id)}>
                    Receive
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
