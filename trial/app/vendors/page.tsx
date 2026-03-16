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

  const [vendors, setVendors] = useState<Vendor[]>([]);

  const fetchVendors = async () => {
    const res = await fetch(getApiUrl("/api/vendors"));
    const data = await res.json();
    setVendors(data);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch(getApiUrl("/api/vendors"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, phone }),
    });

    setName("");
    setEmail("");
    setPhone("");

    fetchVendors();
  };

  return (
    <div>
      <h1>Vendors</h1>

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
