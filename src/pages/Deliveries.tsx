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


const Deliveries = () => {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Operations Monitoring</h1>
          <p className="text-sm text-gray-500 font-medium">Real-time status of {allStops.length} scheduled stops</p>
        </div>
        <div className="flex gap-2">
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
    </div>
  );
};

export default Deliveries;
