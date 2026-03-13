export default function AdminDashboardPage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-foreground/50 font-medium">Welcome back to your spice empire control center.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Revenue", value: "12,450 MAD", change: "+12.5%", icon: "💰", color: "text-emerald-600 bg-emerald-50" },
          { label: "Active Orders", value: "24", change: "+4 this week", icon: "📦", color: "text-blue-600 bg-blue-50" },
          { label: "Products", value: "18", change: "2 out of stock", icon: "🌶️", color: "text-primary bg-primary/5" },
          { label: "New Messages", value: "5", change: "Requires action", icon: "✉️", color: "text-purple-600 bg-purple-50" },
        ].map((stat) => (
          <div key={stat.label} className="p-8 bg-white rounded-3xl border border-secondary shadow-sm flex flex-col gap-4">
            <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
            </div>
            <span className="text-xs font-bold text-foreground/40">{stat.change}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Placeholder */}
        <div className="bg-white rounded-[2.5rem] border border-secondary shadow-sm overflow-hidden p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Recent Orders</h3>
            <a href="/admin/orders" className="text-sm font-bold text-primary hover:underline">View All</a>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/10 border border-transparent hover:border-secondary transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-bold text-xs text-foreground/30 shadow-sm border">
                    #{1024 + i}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">Mehdi Fatimi</span>
                    <span className="text-[10px] text-foreground/40 font-bold uppercase">2 mins ago</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold underline">250.00 MAD</span>
                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase">Pending</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Placeholder */}
        <div className="bg-white rounded-[2.5rem] border border-secondary shadow-sm overflow-hidden p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Low Stock Alert</h3>
            <a href="/admin/products" className="text-sm font-bold text-primary hover:underline">Manage Stock</a>
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-red-50/50 border border-transparent hover:border-red-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white overflow-hidden shadow-sm border border-red-100 flex items-center justify-center">
                    🌿
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">Ras el Hanout</span>
                    <span className="text-[10px] text-red-500 font-black uppercase">Only 5 units left</span>
                  </div>
                </div>
                <button className="text-xs font-bold bg-white text-foreground px-4 py-2 rounded-xl border shadow-sm hover:bg-secondary/20">
                  Restock
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
