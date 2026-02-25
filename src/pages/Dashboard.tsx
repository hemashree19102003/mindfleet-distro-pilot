import { Link } from "react-router-dom";
import {
  Sparkles, TrendingUp, Package, Store, Users, FileText,
  IndianRupee, AlertTriangle, CheckCircle, Clock, Truck, Activity
} from "lucide-react";
import { useInventoryStore, useInvoiceStore, useShopStore, useStaffStore, useDraftStore } from "@/store";
import StatusBadge from "@/components/shared/StatusBadge";
import { useTranslation } from "@/hooks/useTranslation";

const Dashboard = () => {
  const { skus } = useInventoryStore();
  const { invoices } = useInvoiceStore();
  const { shops } = useShopStore();
  const { staff } = useStaffStore();
  const { drafts } = useDraftStore();
  const { t } = useTranslation();

  // Calculate KPI values
  const dispatchRun = { status: 'IN_PROGRESS', planned: 22, approved: 18, progress: 12, completed: 8 };
  const deliveryStats = { delivered: 312, pending: 110, failed: 6 };
  const slaRisks = 4;
  const inventoryRisks = skus.filter(s => s.available < 50).length;
  const lowStockCount = skus.filter(s => s.lowStock).length;
  const dataQualityRisks = shops.filter(s => !s.lat || !s.lng || !s.phone).length;
  const staffUtil = 28; // avg stops per staff

  const kpis = [
    { label: t('dispatchStatus'), value: t('inProgress'), icon: Truck, color: "text-purple-600", bg: "bg-purple-0", change: `12 / 18 ${t('approved')}`, path: "/dispatch" },
    { label: t('deliveryProgress'), value: "73%", icon: CheckCircle, color: "text-purple-600", bg: "bg-green-0", change: `312 ${t('delivered')}`, path: "/deliveries" },
    { label: t('slaRisk'), value: slaRisks, icon: AlertTriangle, color: "text-purple-600", bg: "bg-red-0", change: t('highPriority'), path: "/insights" },
    { label: t('inventoryRisk'), value: inventoryRisks, icon: Package, color: "text-purple-600", bg: "bg-orange-0", change: t('stockoutAlerts'), path: "/inventory" },
    { label: t('dataQuality'), value: dataQualityRisks, icon: Activity, color: "text-purple-600", bg: "bg-blue-0", change: t('missingGpsPhone'), path: "/shops" },
    { label: t('staffUtilization'), value: `${staffUtil}`, icon: Users, color: "text-purple-600", bg: "bg-purple-0", change: t('avgStopsStaff'), path: "/staff" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard')}</h1>
        <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {t('realTimeOverview')}</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <Link key={kpi.label} to={kpi.path} className="rounded-xl border border-gray-100 bg-white p-5 card-hover block">
            <div className="flex items-center justify-between mb-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="h-5 w-5" />
              </div>
              <span className="text-xs text-gray-400">{kpi.change}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value ?? ''}</p>
            <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
          </Link>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Drafts */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{t('recentDrafts')}</h3>
            <span className="text-xs text-gray-400">{drafts.length} {t('total')}</span>
          </div>
          <div className="space-y-3">
            {drafts.slice(0, 5).map(draft => (
              <div key={draft.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 shrink-0">
                  <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{t(draft.title as any) || draft.title}</p>
                  <p className="text-xs text-gray-400">{draft.confidence}% {t('confidence')}</p>
                </div>
                <StatusBadge status={draft.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{t('inventoryAlerts')}</h3>
            <span className="text-xs text-red-500">{lowStockCount} {t('lowStock')}</span>
          </div>
          <div className="space-y-3">
            {skus.filter(s => s.lowStock).slice(0, 5).map(sku => (
              <div key={sku.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 shrink-0">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{sku.name}</p>
                  <p className="text-xs text-gray-400">{sku.available} / {sku.threshold} {t('threshold').toLowerCase()}</p>
                </div>
                <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-red-500" style={{ width: `${(sku.available / sku.threshold) * 100}%` }} />
                </div>
              </div>
            ))}
            {lowStockCount === 0 && (
              <div className="flex items-center gap-2 text-green-600 py-4 justify-center">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">{t('allStockHealthy')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Staff Performance */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{t('staffPerformance')}</h3>
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
            <h3 className="font-semibold text-gray-900">{t('invoiceStatus')}</h3>
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
