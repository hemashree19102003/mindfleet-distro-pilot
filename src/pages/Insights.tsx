import { BarChart3, TrendingUp, IndianRupee, Package, Users, Store } from "lucide-react";
import { useInvoiceStore, useInventoryStore, useStaffStore, useShopStore } from "@/store";

const Insights = () => {
  const { invoices } = useInvoiceStore();
  const { skus } = useInventoryStore();
  const { staff } = useStaffStore();
  const { shops } = useShopStore();

  // Zone revenue breakdown
  const zoneRevenue = shops.reduce((acc, shop) => {
    const shopInvoices = invoices.filter(i => i.shopId === shop.id);
    const revenue = shopInvoices.reduce((s, i) => s + i.paid, 0);
    acc[shop.zone] = (acc[shop.zone] || 0) + revenue;
    return acc;
  }, {} as Record<string, number>);

  const maxZoneRevenue = Math.max(...Object.values(zoneRevenue));

  // Top performing staff
  const topStaff = [...staff].sort((a, b) => b.performance - a.performance).slice(0, 5);

  // Category breakdown
  const categoryBreakdown = skus.reduce((acc, sku) => {
    acc[sku.category] = (acc[sku.category] || 0) + sku.available;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Insights</h1>
        <p className="text-sm text-gray-500">Performance analytics · 17 Feb 2025</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Zone Revenue */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <IndianRupee className="h-4 w-4 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Revenue by Zone</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(zoneRevenue).map(([zone, rev]) => (
              <div key={zone} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{zone}</span>
                  <span className="text-sm font-semibold text-gray-900">₹{(rev / 1000).toFixed(0)}K</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full purple-gradient transition-all duration-700"
                    style={{ width: `${(rev / maxZoneRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Performance */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Top Performers</h3>
          </div>
          <div className="space-y-3">
            {topStaff.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className={`text-sm font-bold w-5 ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-500' : 'text-gray-300'}`}>
                  #{i + 1}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full purple-gradient text-white text-xs font-bold shrink-0">
                  {s.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                    <span className="text-sm font-bold text-purple-600">{s.performance}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mt-1">
                    <div className="h-full rounded-full purple-gradient" style={{ width: `${s.performance}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory by Category */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-4 w-4 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Inventory by Category</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(categoryBreakdown).map(([cat, qty]) => {
              const total = Object.values(categoryBreakdown).reduce((s, v) => s + v, 0);
              const pct = Math.round((qty / total) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{cat}</span>
                    <span className="text-sm font-semibold text-gray-900">{qty.toLocaleString()} units ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-purple-400 transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shop Quality Distribution */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <Store className="h-4 w-4 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Shop Quality Distribution</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: "Excellent (80–100)", count: shops.filter(s => s.qualityScore >= 80).length, color: "bg-green-500" },
              { label: "Good (60–79)", count: shops.filter(s => s.qualityScore >= 60 && s.qualityScore < 80).length, color: "bg-yellow-500" },
              { label: "Poor (<60)", count: shops.filter(s => s.qualityScore < 60).length, color: "bg-red-500" },
            ].map(item => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count} shops</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full rounded-full ${item.color} transition-all duration-700`} style={{ width: `${(item.count / shops.length) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
