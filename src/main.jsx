import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, ArrowDownRight, ArrowUpRight, Bell, CalendarDays, ChevronDown,
  ChevronLeft, ChevronRight, CircleHelp, Command, Download, LayoutDashboard,
  Menu, MoreHorizontal, Search, Settings, ShoppingBag, Users, X, Zap
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import "./styles.css";

const salesData = [
  { day: "Mon", revenue: 4200, orders: 240 },
  { day: "Tue", revenue: 5100, orders: 310 },
  { day: "Wed", revenue: 4700, orders: 285 },
  { day: "Thu", revenue: 6300, orders: 390 },
  { day: "Fri", revenue: 5800, orders: 350 },
  { day: "Sat", revenue: 7600, orders: 470 },
  { day: "Sun", revenue: 7100, orders: 430 }
];

const initialOrders = [
  { id: "#ORD-1048", customer: "Olivia Rhye", email: "olivia@example.com", product: "Wireless Headphones", date: "Nov 12, 2026", amount: 249, status: "Completed", initials: "OR", color: "lavender" },
  { id: "#ORD-1047", customer: "Phoenix Baker", email: "phoenix@example.com", product: "Smart Watch Pro", date: "Nov 12, 2026", amount: 399, status: "Processing", initials: "PB", color: "peach" },
  { id: "#ORD-1046", customer: "Lana Steiner", email: "lana@example.com", product: "Studio Speaker", date: "Nov 11, 2026", amount: 189, status: "Completed", initials: "LS", color: "mint" },
  { id: "#ORD-1045", customer: "Demi Wilkinson", email: "demi@example.com", product: "Wireless Headphones", date: "Nov 11, 2026", amount: 249, status: "Pending", initials: "DW", color: "blue" },
  { id: "#ORD-1044", customer: "Candice Wu", email: "candice@example.com", product: "Smart Watch Pro", date: "Nov 10, 2026", amount: 399, status: "Completed", initials: "CW", color: "pink" },
  { id: "#ORD-1043", customer: "Natali Craig", email: "natali@example.com", product: "Studio Speaker", date: "Nov 10, 2026", amount: 189, status: "Cancelled", initials: "NC", color: "yellow" }
];

const customers = [
  { name: "Olivia Rhye", email: "olivia@example.com", orders: 8, spent: 1248, joined: "Aug 14, 2026", status: "Active", initials: "OR", color: "lavender" },
  { name: "Phoenix Baker", email: "phoenix@example.com", orders: 5, spent: 975, joined: "Sep 02, 2026", status: "Active", initials: "PB", color: "peach" },
  { name: "Lana Steiner", email: "lana@example.com", orders: 12, spent: 2189, joined: "Jun 21, 2026", status: "Active", initials: "LS", color: "mint" },
  { name: "Demi Wilkinson", email: "demi@example.com", orders: 3, spent: 497, joined: "Oct 05, 2026", status: "New", initials: "DW", color: "blue" },
  { name: "Candice Wu", email: "candice@example.com", orders: 9, spent: 1599, joined: "Jul 18, 2026", status: "Active", initials: "CW", color: "pink" },
  { name: "Natali Craig", email: "natali@example.com", orders: 2, spent: 378, joined: "Nov 01, 2026", status: "New", initials: "NC", color: "yellow" }
];

const money = (n) => "$" + n.toLocaleString("en-US");

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("overview");
  const [customerSearch, setCustomerSearch] = useState("");
  const [period, setPeriod] = useState("Last 7 days");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All orders");
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState("");
  const [rangeOpen, setRangeOpen] = useState(false);

  const filteredOrders = useMemo(() => initialOrders.filter((order) => {
    const q = search.toLowerCase();
    const matchesSearch = [order.id, order.customer, order.email, order.product].some((v) => v.toLowerCase().includes(q));
    const matchesStatus = status === "All orders" || order.status === status;
    return matchesSearch && matchesStatus;
  }), [search, status]);

  const visibleOrders = filteredOrders.slice((page - 1) * 5, page * 5);
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / 5));

  const exportCsv = () => {
    const header = ["Order", "Customer", "Email", "Product", "Date", "Amount", "Status"];
    const rows = filteredOrders.map(o => [o.id, o.customer, o.email, o.product, o.date, o.amount, o.status]);
    const csv = [header, ...rows].map(row => row.map(v => `"${String(v).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "pulse-orders.csv"; a.click();
    URL.revokeObjectURL(url);
    setNotice("Your order report has been exported.");
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand"><span className="brand-mark"><Activity size={19} /></span><span>pulse<span className="brand-dot">.</span></span></div>
        <div className="workspace"><div className="workspace-icon">S</div><div><strong>Studio Commerce</strong><small>Free workspace</small></div><ChevronDown size={15} /></div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          <a className={`nav-item ${activePage === "overview" ? "active" : ""}`} href="#overview" onClick={(e) => { e.preventDefault(); setActivePage("overview"); setMenuOpen(false); }}><LayoutDashboard size={18}/> Overview</a>
          <a className="nav-item" href="#orders" onClick={() => { setActivePage("overview"); setMenuOpen(false); }}><ShoppingBag size={18}/> Orders <span className="nav-count">12</span></a>
          <a className={`nav-item ${activePage === "customers" ? "active" : ""}`} href="#customers" onClick={(e) => { e.preventDefault(); setActivePage("customers"); setMenuOpen(false); }}><Users size={18}/> Customers</a>
          <a className="nav-item" href="#analytics" onClick={() => { setActivePage("overview"); setMenuOpen(false); }}><Activity size={18}/> Analytics</a>
        </nav>
        <div className="nav-label tools-label">PREFERENCES</div>
        <nav>
          <a className="nav-item" href="#settings" onClick={() => setNotice("Settings are not connected in this demo.")}><Settings size={18}/> Settings</a>
          <a className="nav-item" href="#help" onClick={() => setNotice("Help center demo link.")}><CircleHelp size={18}/> Help center</a>
        </nav>
        <div className="sidebar-bottom"><div className="upgrade-card"><div className="upgrade-icon"><Zap size={16}/></div><strong>Unlock your growth</strong><p>Get more insights with Pulse Pro.</p><button onClick={() => setNotice("Thanks for your interest! This is a UI demo.")}>Explore plans <ArrowUpRight size={14}/></button></div><div className="profile"><div className="profile-avatar">DC</div><div><strong>Dhanush Chimma</strong><small>Admin account</small></div><MoreHorizontal size={18}/></div></div>
      </aside>

      {menuOpen && <button className="scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
      <main className="main-content" id="overview">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={20}/></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>{activePage === "customers" ? "Customers" : "Overview"}</strong></div>
          <div className="top-actions"><div className="search-global"><Search size={16}/><span>Search anything...</span><kbd>⌘ K</kbd></div><button className="icon-button notification" aria-label="Notifications" onClick={() => setNotice("You're all caught up!") }><Bell size={18}/><i/></button><div className="top-avatar">DC</div></div>
        </header>

        {activePage === "overview" && <>
        <section className="page-heading">
          <div><div className="eyebrow"><span className="live-dot"/> LIVE OVERVIEW</div><h1>Good morning, Dhanush <span>✦</span></h1><p>Here's what's happening with your store today.</p></div>
          <div className="heading-actions"><div className="range-wrap"><button className="secondary-button" onClick={() => setRangeOpen(!rangeOpen)}><CalendarDays size={16}/>{period}<ChevronDown size={15}/></button>{rangeOpen && <div className="range-menu">{["Today","Last 7 days","Last 30 days","This year"].map(p => <button key={p} onClick={() => {setPeriod(p);setRangeOpen(false);}}>{p}{period === p && " ✓"}</button>)}</div>}</div><button className="primary-button" onClick={exportCsv}><Download size={16}/> Export report</button></div>
        </section>

        <section className="metric-grid" aria-label="Key metrics">
          <Metric title="Total revenue" value="$48,294" change="+12.8%" note="vs. previous period" icon={<span className="metric-symbol">$</span>} positive />
          <Metric title="Total orders" value="1,284" change="+8.2%" note="vs. previous period" icon={<ShoppingBag size={19}/>} positive />
          <Metric title="Active customers" value="8,549" change="+4.6%" note="vs. previous period" icon={<Users size={19}/>} positive />
          <Metric title="Avg. order value" value="$37.61" change="-2.4%" note="vs. previous period" icon={<Activity size={19}/>} />
        </section>

        <section className="content-grid" id="analytics">
          <div className="panel revenue-panel">
            <div className="panel-heading"><div><h2>Revenue over time</h2><p>Track your store's performance</p></div><button className="more-button" aria-label="More revenue options" onClick={() => setNotice("Revenue chart options are coming soon.")}><MoreHorizontal size={20}/></button></div>
            <div className="chart-legend"><span><i className="legend-dot revenue-dot"/> Revenue</span><span><i className="legend-dot orders-dot"/> Orders</span></div>
            <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={salesData} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}><defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7467f0" stopOpacity={0.22}/><stop offset="95%" stopColor="#7467f0" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#edf0f5" vertical={false}/><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#98a2b3", fontSize: 12 }} dy={10}/><YAxis axisLine={false} tickLine={false} tick={{ fill: "#98a2b3", fontSize: 11 }} tickFormatter={(v) => `$${v/1000}k`}/><Tooltip formatter={(v, name) => [name === "revenue" ? money(v) : v, name === "revenue" ? "Revenue" : "Orders"]} contentStyle={{borderRadius:12,border:"1px solid #edf0f5",boxShadow:"0 8px 24px #18223012"}}/><Area type="monotone" dataKey="revenue" stroke="#7467f0" strokeWidth={2.6} fill="url(#revenueFill)" activeDot={{r:5,strokeWidth:0}}/></AreaChart></ResponsiveContainer></div>
            <div className="chart-footer"><span><strong>$48,294</strong> total revenue</span><span className="footer-growth"><ArrowUpRight size={14}/> 12.8% from last period</span></div>
          </div>
          <div className="panel channel-panel">
            <div className="panel-heading"><div><h2>Sales by channel</h2><p>Where your customers find you</p></div><button className="more-button" aria-label="More channel options" onClick={() => setNotice("Channel details are sample data.")}><MoreHorizontal size={20}/></button></div>
            <div className="channel-total"><strong>1,284</strong><span>total orders</span></div>
            <div className="channel-list"><Channel name="Online store" percent={58} value="745 orders" color="purple"/><Channel name="Social media" percent={26} value="334 orders" color="blue"/><Channel name="Direct" percent={16} value="205 orders" color="orange"/></div>
            <div className="channel-note"><span className="note-icon"><Zap size={15}/></span><p><strong>Good momentum!</strong> Online store is your top-performing channel this week.</p></div>
          </div>
        </section>

        <section className="panel orders-panel" id="orders">
          <div className="panel-heading orders-heading"><div><h2>Recent orders</h2><p>Keep track of your latest transactions</p></div><button className="text-button" onClick={() => {setSearch("");setStatus("All orders");setPage(1);}}>View all orders <ArrowUpRight size={15}/></button></div>
          <div className="table-tools"><div className="table-search"><Search size={16}/><input value={search} onChange={e => {setSearch(e.target.value);setPage(1);}} placeholder="Search orders or customers..." aria-label="Search orders or customers"/></div><select value={status} onChange={e => {setStatus(e.target.value);setPage(1);}} aria-label="Filter by order status"><option>All orders</option><option>Completed</option><option>Processing</option><option>Pending</option><option>Cancelled</option></select></div>
          <div className="table-scroll"><table><thead><tr><th>ORDER</th><th>CUSTOMER</th><th>PRODUCT</th><th>DATE</th><th>AMOUNT</th><th>STATUS</th><th></th></tr></thead><tbody>{visibleOrders.map(order => <tr key={order.id}><td className="order-id">{order.id}</td><td><div className="customer-cell"><span className={`customer-avatar ${order.color}`}>{order.initials}</span><span><strong>{order.customer}</strong><small>{order.email}</small></span></div></td><td>{order.product}</td><td>{order.date}</td><td className="amount">{money(order.amount)}</td><td><span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span></td><td><button className="row-more" aria-label={`More options for ${order.id}`} onClick={() => setNotice(`${order.id} · ${order.customer} · ${order.status}`)}><MoreHorizontal size={18}/></button></td></tr>)}</tbody></table>{visibleOrders.length === 0 && <div className="empty-state">No orders match your search.</div>}</div>
          <div className="table-footer"><span>Showing <strong>{visibleOrders.length ? (page - 1) * 5 + 1 : 0}-{Math.min(page * 5, filteredOrders.length)}</strong> of <strong>{filteredOrders.length}</strong> orders</span><div className="pagination"><button disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Previous page"><ChevronLeft size={16}/></button><span>{page} / {totalPages}</span><button disabled={page === totalPages} onClick={() => setPage(page + 1)} aria-label="Next page"><ChevronRight size={16}/></button></div></div>
        </section>
        </>}
        {activePage === "customers" && <CustomersPage search={customerSearch} setSearch={setCustomerSearch} />}
        <footer className="footer"><span>© 2026 Pulse Dashboard</span><span>Sample data · Portfolio demonstration</span></footer>
      </main>
      {notice && <div className="toast" role="status"><span className="toast-check">✓</span>{notice}<button onClick={() => setNotice("")} aria-label="Dismiss notification"><X size={15}/></button></div>}
    </div>
  );
}

function CustomersPage({ search, setSearch }) {
  const filteredCustomers = customers.filter((customer) =>
    [customer.name, customer.email, customer.status].some((value) =>
      value.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <section className="customers-page">
      <section className="page-heading">
        <div>
          <div className="eyebrow"><span className="live-dot"/> CUSTOMER MANAGEMENT</div>
          <h1>Customers</h1>
          <p>View and manage your store's customer relationships.</p>
        </div>
      </section>
      <section className="metric-grid" aria-label="Customer metrics">
        <Metric title="Total customers" value="8,549" change="+4.6%" note="vs. previous period" icon={<Users size={19}/>} positive />
        <Metric title="Returning customers" value="5,214" change="+6.2%" note="vs. previous period" icon={<Activity size={19}/>} positive />
        <Metric title="New customers" value="1,128" change="+3.8%" note="this month" icon={<ShoppingBag size={19}/>} positive />
        <Metric title="Average lifetime value" value="$286.40" change="+2.1%" note="vs. previous period" icon={<span className="metric-symbol">$</span>} positive />
      </section>
      <section className="panel orders-panel">
        <div className="panel-heading orders-heading">
          <div><h2>Customer directory</h2><p>Search and review customer activity</p></div>
          <span className="text-button">{filteredCustomers.length} customers</span>
        </div>
        <div className="table-tools">
          <div className="table-search"><Search size={16}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." aria-label="Search customers"/></div>
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>CUSTOMER</th><th>ORDERS</th><th>TOTAL SPENT</th><th>JOINED</th><th>STATUS</th></tr></thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.email}>
                  <td><div className="customer-cell"><span className={`customer-avatar ${customer.color}`}>{customer.initials}</span><span><strong>{customer.name}</strong><small>{customer.email}</small></span></div></td>
                  <td>{customer.orders}</td><td className="amount">{money(customer.spent)}</td><td>{customer.joined}</td>
                  <td><span className={`status status-${customer.status.toLowerCase()}`}>{customer.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && <div className="empty-state">No customers match your search.</div>}
        </div>
      </section>
    </section>
  );
}

function Metric({ title, value, change, note, icon, positive }) {
  return <div className="metric-card"><div className="metric-top"><span>{title}</span><span className="metric-icon">{icon}</span></div><div className="metric-value">{value}</div><div className="metric-bottom"><span className={`change ${positive ? "positive" : "negative"}`}>{positive ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {change}</span><span>{note}</span></div></div>;
}
function Channel({ name, percent, value, color }) {
  return <div className="channel-row"><div className="channel-label"><span>{name}</span><strong>{value}</strong></div><div className="progress-track"><div className={`progress-fill ${color}`} style={{width: `${percent}%`}}/></div></div>;
}

createRoot(document.getElementById("root")).render(<App />);
