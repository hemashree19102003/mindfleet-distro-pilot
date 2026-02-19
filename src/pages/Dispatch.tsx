import { useState, useMemo } from "react";
import {
  Users, Map as MapIcon, History,
  Plus, LayoutGrid, List
} from "lucide-react";
import { useStaffStore, useShopStore, useDispatchStore, useDraftStore, useUserStore } from "@/store";
import RiskBanner from "@/components/shared/RiskBanner";
import ReasonTagModal from "@/components/shared/ReasonTagModal";
import DispatchPlanPanel from "@/components/dispatch/DispatchPlanPanel";
import AssignmentBoard from "@/components/dispatch/AssignmentBoard";
import RouteMap from "@/components/dispatch/RouteMap";
import StopDrawer from "@/components/dispatch/StopDrawer";
import DecisionJournalDrawer from "@/components/shared/DecisionJournalDrawer";
import { toast } from "sonner";
import { DraftCard } from "@/store/types";
import { createDraftFromAI } from "@/data/generators";

const Dispatch = () => {
  const [activeTab, setActiveTab] = useState<"plan" | "assignments" | "map" | "journal">("plan");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showJournal, setShowJournal] = useState(false);

  // Modal states
  const [reassigningShop, setReassigningShop] = useState<{ shopId: string; shopName: string } | null>(null);
  const [movingStop, setMovingStop] = useState<{ stopId: string; fromStaffId: string; toStaffId: string } | null>(null);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  const { staff } = useStaffStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { shops } = useShopStore(); // Kept for future map plotting
  const { plan, reassignShop, reorderStops } = useDispatchStore();
  const dispatchStatus = plan.status;
  const { drafts, addDraft, updateDraftStatus } = useDraftStore();
  const { currentUser } = useUserStore();

  const handleManualReassign = (reason: string) => {
    if (reassigningShop) {
      // Logic for shop-to-staff assignment (e.g., from unassigned list)
      // For demo, assume reassigning to first active staff
      const targetStaff = staff.find(s => s.status === 'Active');
      if (targetStaff) {
        reassignShop(reassigningShop.shopId, 'unassigned', targetStaff.id, reason, currentUser.name);
        toast.success(`Assigned ${reassigningShop.shopName} to ${targetStaff.name}`);
      }
      setReassigningShop(null);
    } else if (movingStop) {
      // Logic for stop-to-other-staff assignment
      reassignShop(movingStop.stopId, movingStop.fromStaffId, movingStop.toStaffId, reason, currentUser.name);
      toast.success("Stop reassigned successfully");
      setMovingStop(null);
    }
  };

  const dispatchDrafts = useMemo(() => drafts.filter(d => d.type === 'DISPATCH_PLAN'), [drafts]);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(dispatchDrafts[0]?.id || null);

  const handleNewDispatch = () => {
    const newDraft = createDraftFromAI('DISPATCH_PLAN', currentUser.name);
    addDraft(newDraft);
    setSelectedDraftId(newDraft.id);
    setActiveTab('plan');
    toast.success("New Dispatch Plan drafted by AI");
  };

  const handleApproveDraft = (id: string) => {
    updateDraftStatus(id, 'APPROVED', currentUser.name);
    toast.success("Dispatch Plan Approved");
    // In real app, this would trigger applyPlan() action
  };

  const handleRejectDraft = (id: string) => {
    // In real app, open reason modal first
    updateDraftStatus(id, 'REJECTED', currentUser.name, "Rejected by user");
    toast.info("Draft Rejected");
  };

  // Prepare assignments for board
  const boardAssignments = useMemo(() => {
    return staff.filter(s => s.status === 'Active').map(s => {
      const assignment = plan.assignments.find(a => a.staffId === s.id);
      // Mocking stops data since store 'plan' only has shopIds currently
      // In real app, join with shop data
      const stops = (assignment?.shopIds || []).map((sid, idx) => ({
        stop_id: sid,
        shop_id: sid,
        shop_name: `Shop ${sid}`, // Mock name
        address: "123 Main St, Chennai", // Mock address
        qty_summary: "12 crates",
        status: 'PENDING' as const,
        sla_risk: idx % 10 === 0 ? 'HIGH' as const : 'LOW' as const,
      }));

      return {
        staff_id: s.id,
        staff_name: s.name,
        capacity_stops: 50,
        stops: stops,
        metrics: { stops_count: stops.length, distance_est_km: 12 + stops.length * 0.5, sla_risk_score: 5 }
      };
    });
  }, [staff, plan]);

  // Handle Stop Drawer actions
  const selectedStopDetail = useMemo(() => {
    if (!selectedStopId) return null;
    // Search in all assignments
    for (const assign of boardAssignments) {
      const found = assign.stops.find(s => s.stop_id === selectedStopId);
      if (found) return found;
    }
    return null;
  }, [selectedStopId, boardAssignments]);

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dispatch Operations</h1>
          <p className="text-sm text-gray-500">Manage routes, rebalance staff, and monitor live progress</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowJournal(true)}
            className="flex h-10 items-center gap-2 rounded-xl border border-purple-100 bg-white px-4 text-xs font-bold text-gray-600 hover:bg-purple-50 transition-all active:scale-95"
          >
            <History className="h-4 w-4" /> JOURNAL
          </button>
          <button
            onClick={handleNewDispatch}
            className="flex h-10 items-center gap-2 rounded-xl purple-gradient px-4 text-xs font-bold text-white shadow-lg shadow-purple-200 hover:opacity-90 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" /> NEW DISPATCH
          </button>
        </div>
      </div>

      {dispatchStatus === 'APPROVED' && (
        <RiskBanner
          title="Manual Override Detected"
          description="A shop was reassigned after AI optimization. Confidence reduced to 89%."
          actionLabel="RE-OPTIMIZE"
          onAction={() => toast.success("AI re-optimizing routes...")}
        />
      )}

      <div className="flex border-b border-gray-100 space-x-8">
        {[
          { id: 'plan', label: 'Draft Plan', icon: LayoutGrid },
          { id: 'assignments', label: 'Assignments', icon: Users },
          { id: 'map', label: 'Route Map', icon: MapIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 py-4 text-sm font-bold transition-all relative ${activeTab === tab.id ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
              }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full bg-purple-600 animate-fade-in" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'plan' && (
        <DispatchPlanPanel
          dispatchDrafts={dispatchDrafts}
          selectedDraftId={selectedDraftId}
          onSelectDraft={setSelectedDraftId}
          onApproveDraft={handleApproveDraft}
          onRejectDraft={handleRejectDraft}
          onViewDiff={(draft) => {
            toast.info(`Opening diff for ${draft.title} (Mock)`);
            // In real app: setShowDiff(true); setDiffDraft(draft);
          }}
        />
      )}

      {activeTab === 'assignments' && (
        <AssignmentBoard
          assignments={boardAssignments}
          onMoveStop={(stopId, fromId, toId) => setMovingStop({ stopId, fromStaffId: fromId, toStaffId: toId })}
          onRebalance={() => toast.info("AI Rebalance triggered")}
        />
      )}

      {activeTab === 'map' && (
        <RouteMap
          routes={[]}
          stops={[]} // Pass actual stops here 
          onSelectStaff={() => { }}
          onSelectStop={setSelectedStopId}
        />
      )}

      {/* Decision Journal Drawer */}
      <DecisionJournalDrawer
        open={showJournal}
        onClose={() => setShowJournal(false)}
      />

      <StopDrawer
        open={!!selectedStopId}
        stop={selectedStopDetail}
        onClose={() => setSelectedStopId(null)}
        onReorder={() => { }}
        onSkip={() => { }}
        onReassign={() => { }}
      />

      <ReasonTagModal
        open={!!reassigningShop || !!movingStop}
        title={reassigningShop ? `Reassign ${reassigningShop.shopName}` : "Reassign Stop"}
        onSubmit={handleManualReassign}
        onCancel={() => { setReassigningShop(null); setMovingStop(null); }}
      />
    </div>
  );
};

export default Dispatch;
