import {
  Sparkles, TrendingUp, Package, Store, Users, FileText,
  IndianRupee, AlertTriangle, CheckCircle, Clock, Truck
} from "lucide-react";
import { useInventoryStore, useInvoiceStore, useShopStore, useStaffStore, useDraftStore } from "@/store";
import StatusBadge from "@/components/shared/StatusBadge";

const Dashboard = () => {
  const { skus } = useInventoryStore();
  const { invoices } = useInvoiceStore();
  const { shops } = useShopStore();
  const { staff } = useStaffStore();
  const { drafts } = useDraftStore();

  const totalRevenue = invoices.reduce((s, i) => s + i.paid, 0);
  const totalOutstanding = invoices.reduce((s, i) => s + i.outstanding, 0);
  const lowStockCount = skus.filter(s => s.lowStock).length;
  const activeStaff = staff.filter(s => s.status === 'Active').length;
  const pendingDrafts = drafts.filter(d => d.status === 'DRAFT').length;

  const kpis = [
    { label: "Revenue Collected", value: `₹${(totalRevenue / 100000).toFixed(1)}L`, icon: IndianRupee, color: "text-purple-600", bg: "bg-purple-0", change: "+12.4%", },
    { label: "Outstanding", value: `₹${(totalOutstanding / 100000).toFixed(1)}L`, icon: Clock, color: "text-purple-600", bg: "bg-yellow-0", change: "-3.2%" },
    { label: "Active Staff", value: `${activeStaff} / ${staff.length}`, icon: Users, color: "text-purple-600", bg: "bg-green-0", change: "86.7%" },
    { label: "Shops Covered", value: shops.length, icon: Store, color: "text-purple-600", bg: "bg-blue-0", change: "100%" },
    { label: "Low Stock SKUs", value: lowStockCount, icon: Package, color: "text-purple-600", bg: "bg-red-0", change: `${lowStockCount} alerts` },
    { label: "Pending Drafts", value: pendingDrafts, icon: FileText, color: "text-purple-600", bg: "bg-orange-0", change: "Needs review" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">17 Feb 2025 · Real-time overview</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-gray-100 bg-white p-5 card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <span className="text-xs text-gray-400">{kpi.change}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Drafts */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Drafts</h3>
            <span className="text-xs text-gray-400">{drafts.length} total</span>
          </div>
          <div className="space-y-3">
            {drafts.slice(0, 5).map(draft => (
              <div key={draft.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 shrink-0">
                  <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{draft.title}</p>
                  <p className="text-xs text-gray-400">{draft.confidence}% confidence</p>
                </div>
                <StatusBadge status={draft.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Inventory Alerts</h3>
            <span className="text-xs text-red-500">{lowStockCount} low stock</span>
          </div>
          <div className="space-y-3">
            {skus.filter(s => s.lowStock).slice(0, 5).map(sku => (
              <div key={sku.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 shrink-0">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{sku.name}</p>
                  <p className="text-xs text-gray-400">{sku.available} / {sku.threshold} threshold</p>
                </div>
                <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-red-500" style={{ width: `${(sku.available / sku.threshold) * 100}%` }} />
                </div>
              </div>
            ))}
            {lowStockCount === 0 && (
              <div className="flex items-center gap-2 text-green-600 py-4 justify-center">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">All stock levels healthy</span>
              </div>
            )}
          </div>
        </div>

        {/* Staff Performance */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Staff Performance</h3>
          </div>
          <div className="space-y-3">
            {staff.slice(0, 6).map(s => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full purple-gradient text-white text-xs font-bold shrink-0">
                  {s.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-gray-800 truncate">{s.name}</p>
                    <span className="text-xs font-semibold text-purple-600">{s.performance}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full purple-gradient" style={{ width: `${s.performance}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Invoice Status</h3>
          </div>
          <div className="space-y-3">
            {(['DRAFT', 'SENT', 'PARTIAL', 'PAID'] as const).map(status => {
              const count = invoices.filter(i => i.status === status).length;
              const pct = Math.round((count / invoices.length) * 100);
              return (
                <div key={status} className="flex items-center gap-3">
                  <StatusBadge status={status} size="md" />
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${status === 'PAID' ? 'bg-green-500' :
                        status === 'PARTIAL' ? 'bg-yellow-500' :
                          status === 'SENT' ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-12 text-right">{count} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
