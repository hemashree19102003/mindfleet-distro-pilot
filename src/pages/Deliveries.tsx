import { useState, useMemo } from "react";
import {
  MapPin, CheckCircle, Package, Navigation, Search, Filter,
  AlertTriangle, Clock, User, Layers, RefreshCw
} from "lucide-react";
import { useStaffStore, useDispatchStore, useShopStore, useUserStore, useDraftStore } from "@/store";
import StatusBadge from "@/components/shared/StatusBadge";
import { toast } from "sonner";
import { createDraftFromAI } from "@/data/generators";
import DeliveryTable, { DeliveryRow } from "@/components/deliveries/DeliveryTable";
import ExceptionsPanel from "@/components/deliveries/ExceptionsPanel";
import RouteMap from "@/components/dispatch/RouteMap";


const Deliveries = () => {
  const [activeView, setActiveView] = useState<'table' | 'map'>('table');
  const [filters, setFilters] = useState({ search: "", status: "All", staffId: "All" });

  const { staff } = useStaffStore();
  const { plan } = useDispatchStore();
  const { shops } = useShopStore();
  const { currentUser } = useUserStore();
  const { addDraft } = useDraftStore();

  // Combine data for monitoring
  const allStops = useMemo<DeliveryRow[]>(() => {
    return plan.assignments.flatMap(a => {
      const staffMember = staff.find(s => s.id === a.staffId);
      return a.shopIds.map(shopId => {
        const shop = shops.find(sh => sh.id === shopId);
        // Mocking random status for demo purposes
        const rand = Math.random();
        let status: DeliveryRow['status'] = 'PENDING';
        if (rand > 0.8) status = 'DELIVERED';
        else if (rand > 0.7) status = 'FAILED';
        else if (rand > 0.6) status = 'SKIPPED';

        return {
          id: `${a.staffId}-${shopId}`,
          shopId,
          shopName: shop?.name || "Unknown",
          area: shop?.area || "Unknown",
          zone: shop?.zone || "North Zone", // Mock zone
          staffId: a.staffId,
          staffName: staffMember?.name || "Unassigned",
          status,
          eta: "14:20",
          slaRisk: Math.random() > 0.9,
          lat: shop?.lat || 13.08 + Math.random() * 0.05,
          lng: shop?.lng || 80.25 + Math.random() * 0.05,
        };
      });
    });
  }, [plan, staff, shops]);

  const filtered = useMemo(() => allStops.filter(s => {
    const matchSearch = s.shopName.toLowerCase().includes(filters.search.toLowerCase()) ||
      s.staffName.toLowerCase().includes(filters.search.toLowerCase()) ||
      s.area.toLowerCase().includes(filters.search.toLowerCase());
    const matchStatus = filters.status === "All" || s.status === filters.status;
    const matchStaff = filters.staffId === "All" || s.staffId === filters.staffId;
    return matchSearch && matchStatus && matchStaff;
  }), [allStops, filters]);

  const failedStops = useMemo(() => allStops.filter(s => s.status === 'FAILED'), [allStops]);
  const delayedStops = useMemo(() => allStops.filter(s => s.slaRisk && s.status !== 'DELIVERED' && s.status !== 'FAILED'), [allStops]);

  const handleReassignExceptions = () => {
    const draft = createDraftFromAI('REBALANCE', currentUser.name);
    draft.description = `Reassign ${failedStops.length} failed/skipped deliveries to nearest available staff`;
    addDraft(draft);
    toast.success("Reassignment draft created for exceptions");
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Operations Monitoring</h1>
          <p className="text-sm text-gray-500 font-medium">Real-time status of {allStops.length} scheduled stops</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveView('table')}
              className={`h-9 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeView === 'table' ? "bg-white text-purple-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              <Layers className="h-4 w-4" /> TABLE
            </button>
            <button
              onClick={() => setActiveView('map')}
              className={`h-9 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${activeView === 'map' ? "bg-white text-purple-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              <MapPin className="h-4 w-4" /> MAP
            </button>
          </div>
          <button
            onClick={() => {
              toast.success("Refreshing real-time status...");
            }}
            className="h-10 px-4 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600 shadow-sm hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> REFRESH
          </button>
        </div>
      </div>

      {activeView === 'table' ? (
        <>
          <ExceptionsPanel
            failedStops={failedStops}
            delayedStops={delayedStops}
            onCreateReassignment={handleReassignExceptions}
          />

          <DeliveryTable
            rows={filtered}
            filters={filters}
            onChangeFilters={setFilters}
            onOpenStop={(id) => toast.info(`Viewing details for stop ${id}`)}
          />
        </>
      ) : (
        <div className="h-[700px] w-full rounded-3xl overflow-hidden border border-purple-100 shadow-2xl relative z-10">
          <RouteMap
            routes={[]}
            stops={filtered.map(s => ({
              stop_id: s.id,
              lat: (s as any).lat,
              lng: (s as any).lng,
              label: s.shopName,
              status: s.status
            }))}
            onSelectStaff={(id) => toast.info(`Staff ${id} selected`)}
            onSelectStop={(id) => toast.info(`Stop ${id} selected`)}
          />
        </div>
      )}
    </div>
  );
};

export default Deliveries;
