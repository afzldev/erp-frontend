import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h3>ERP</h3>

      <ul>
        <li>
          <Link href="/">Dashboard</Link>
        </li>

        <li>
          <Link href="/items">Items</Link>
        </li>

        <li>
          <Link href="/vendors">Vendors</Link>
        </li>

        <li>
          <Link href="/purchase-requests">Purchase Requests</Link>
        </li>

        <li>
          <Link href="/purchase-orders">Purchase Orders</Link>
        </li>

        <li>
          <Link href="/inventory">Inventory</Link>
        </li>
      </ul>
    </div>
  );
}