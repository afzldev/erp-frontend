"use client";

import { useState, useEffect } from "react";
import { getApiUrl } from "@/lib/api";

type Vendor = {
  _id?: string;
  name: string;
  email: string;
  phone: string;
};

export default function VendorsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const [vendors, setVendors] = useState<Vendor[]>([]);

  const fetchVendors = async () => {
    try {
      setError("");

      const res = await fetch(getApiUrl("/api/vendors"));
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("GET /api/vendors failed", {
          status: res.status,
          data,
        });
        throw new Error(data?.message || "Failed to fetch vendors");
      }

      setVendors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("fetchVendors error", error);
      setError(error instanceof Error ? error.message : "Failed to fetch vendors");
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");

      const payload = { name, email, phone };
      console.log("POST /api/vendors payload", payload);

      const res = await fetch(getApiUrl("/api/vendors"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("POST /api/vendors failed", {
          status: res.status,
          data,
        });
        throw new Error(data?.message || "Failed to create vendor");
      }

      setName("");
      setEmail("");
      setPhone("");

      fetchVendors();
    } catch (error) {
      console.error("handleSubmit vendor error", error);
      setError(error instanceof Error ? error.message : "Failed to create vendor");
    }
  };

  return (
    <div>
      <h1>Vendors</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <button type="submit">Create Vendor</button>
      </form>

      <hr />

      <h2>Vendor List</h2>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>

        <tbody>
          {vendors.map((vendor) => (
            <tr key={vendor._id}>
              <td>{vendor.name}</td>
              <td>{vendor.email}</td>
              <td>{vendor.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}   
