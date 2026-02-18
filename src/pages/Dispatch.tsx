import { useState, useMemo } from "react";
import {
  Sparkles, AlertTriangle, Clock, CheckCircle, MapPin, User,
  RefreshCw, SkipForward, Hash, Target, Shield, ChevronDown, ChevronUp
} from "lucide-react";
import { useDispatchStore, useStaffStore, useShopStore, useDraftStore, useUserStore } from "@/store";
import ReasonTagModal from "@/components/shared/ReasonTagModal";
import ConfirmModal from "@/components/shared/ConfirmModal";
import StatusBadge from "@/components/shared/StatusBadge";
import { toast } from "sonner";
import { createDraftFromAI } from "@/data/generators";

const tabs = ["Plan", "Assignments", "Map", "Journal"] as const;

const Dispatch = () => {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("Plan");
  const [selectedStaffId, setSelectedStaffId] = useState<string>("s1");
  const { plan, reassignShop, skipStop } = useDispatchStore();
  const { staff } = useStaffStore();
  const { shops } = useShopStore();
  const { addDraft } = useDraftStore();
  const { currentUser } = useUserStore();

  // Rebalance draft
  const handleRebalance = () => {
    const draft = createDraftFromAI('REBALANCE', currentUser.name);
    addDraft(draft);
    toast.success("Rebalance draft created — awaiting approval");
  };

  const activeStaff = staff.filter(s => s.status === 'Active');
  const selectedAssignment = plan.assignments.find(a => a.staffId === selectedStaffId);
  const assignedShops = selectedAssignment
    ? shops.filter(sh => selectedAssignment.shopIds.includes(sh.id))
    : [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dispatch</h1>
          <p className="text-sm text-gray-500">17 Feb 2025</p>
        </div>
        <div className="flex flex-wrap gap-2 ml-auto">
          <StatusBadge status={plan.status} size="md" />
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> {plan.confidence}% Confidence
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-5 py-3 text-sm font-medium transition-colors relative ${activeTab === tab ? "text-purple-600" : "text-gray-400 hover:text-gray-700"
              }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ── PLAN TAB ── */}
      {activeTab === "Plan" && (
        <div className="space-y-4 animate-fade-in">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Staff Active", value: `${activeStaff.length}`, icon: User, color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Shops Assigned", value: "100", icon: MapPin, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Low Stock Risks", value: "4", icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-50" },
              { label: "Confidence", value: `${plan.confidence}%`, icon: Sparkles, color: "text-green-600", bg: "bg-green-50" },
            ].map(item => (
              <div key={item.label} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.bg} ${item.color} mb-3`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-xl font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Draft Plan Card */}
          <div className="rounded-2xl border-2 border-purple-200 bg-purple-50/60 p-6 ai-glow">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Draft Dispatch Plan – 17 Feb</h3>
              <StatusBadge status={plan.status} />
            </div>

            {/* Confidence bar */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium text-gray-500">Confidence</span>
              <div className="flex-1 h-2 rounded-full bg-white overflow-hidden">
                <div className="h-full rounded-full purple-gradient transition-all duration-700" style={{ width: `${plan.confidence}%` }} />
              </div>
              <span className="text-sm font-bold text-purple-600">{plan.confidence}%</span>
            </div>

            {/* Warning */}
            <div className="flex items-center gap-2 rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-3 mb-4">
              <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0" />
              <span className="text-xs text-gray-700">Milk 500ml may stock out in 3 zones · 4 SLA risks detected</span>
            </div>

            {/* Generate Plan Button */}
            <button
              onClick={handleRebalance}
              className="flex items-center gap-2 rounded-xl purple-gradient px-5 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
            >
              <RefreshCw className="h-4 w-4" />
              Generate New Plan (Draft)
            </button>
          </div>
        </div>
      )}

      {/* ── ASSIGNMENTS TAB ── */}
      {activeTab === "Assignments" && (
        <div className="animate-fade-in space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-sm font-semibold text-gray-900">Staff Assignments</h3>
            <button
              onClick={handleRebalance}
              className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 transition-all hover:bg-purple-100"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Rebalance (Draft)
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Staff List */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff ({activeStaff.length} active)</h4>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {activeStaff.map((s) => {
                  const assignment = plan.assignments.find(a => a.staffId === s.id);
                  const shopCount = assignment?.shopIds.length || 0;
                  const utilization = Math.round((shopCount / s.capacity) * 100);
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStaffId(s.id)}
                      className={`w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${selectedStaffId === s.id
                          ? "border-purple-400 bg-purple-50 shadow-sm"
                          : "border-gray-100 bg-white hover:border-purple-200 hover:bg-purple-50/50"
                        }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full purple-gradient text-white text-sm font-bold shrink-0">
                        {s.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{s.name}</p>
                        <p className="text-xs text-gray-500">{shopCount} shops · {s.distance} · {s.vehicle}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${utilization > 90 ? 'bg-red-500' : utilization > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                              style={{ width: `${Math.min(100, utilization)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-gray-400">{utilization}%</span>
                        </div>
                      </div>
                      {s.risk && (
                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold text-yellow-700">Risk</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Assigned Shops */}
            <AssignedShopsPanel
              staffId={selectedStaffId}
              shops={assignedShops}
              staffName={staff.find(s => s.id === selectedStaffId)?.name || ''}
              onSkip={(shopId, reason) => {
                skipStop(selectedStaffId, shopId, reason, currentUser.name);
                toast.success("Stop skipped — logged as override");
              }}
            />
          </div>
        </div>
      )}

      {/* ── MAP TAB ── */}
      {activeTab === "Map" && (
        <div className="animate-fade-in">
          <SimulatedMap
            staff={activeStaff}
            shops={shops}
            assignments={plan.assignments}
            selectedStaffId={selectedStaffId}
            onSelectStaff={setSelectedStaffId}
          />
        </div>
      )}

      {/* ── JOURNAL TAB ── */}
      {activeTab === "Journal" && (
        <div className="animate-fade-in space-y-5">
          {/* Plan metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <Hash className="h-4 w-4 text-purple-500" />
                <h4 className="text-sm font-semibold text-gray-900">Inputs Hash</h4>
              </div>
              <code className="text-xs text-gray-500 font-mono break-all">{plan.inputsHash}</code>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-purple-500" />
                <h4 className="text-sm font-semibold text-gray-900">Objective Weights</h4>
              </div>
              <div className="space-y-2">
                {Object.entries(plan.objectiveWeights).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-24 capitalize">{key}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full purple-gradient" style={{ width: `${val * 100}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{Math.round(val * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-purple-500" />
                <h4 className="text-sm font-semibold text-gray-900">Constraints</h4>
              </div>
              <ul className="space-y-1.5">
                {plan.constraints.map((c, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <h4 className="text-sm font-semibold text-gray-900">Confidence Score</h4>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full purple-gradient" style={{ width: `${plan.confidence}%` }} />
                </div>
                <span className="text-2xl font-bold text-purple-600">{plan.confidence}%</span>
              </div>
            </div>
          </div>

          {/* Override History */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Override History ({plan.overrideHistory.length})</h4>
            <div className="space-y-3">
              {plan.overrideHistory.map((ev, i) => (
                <div key={ev.id} className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 shrink-0">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">{ev.action}</span>
                        <span className="text-xs text-gray-400">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">Reason: <span className="font-medium">{ev.reason}</span></p>
                      <p className="text-xs text-gray-400">By: {ev.performedBy}</p>
                      {/* Diff */}
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-red-50 border border-red-100 p-2">
                          <p className="text-[10px] font-semibold text-red-500 mb-1">BEFORE</p>
                          <pre className="text-[10px] text-gray-600 whitespace-pre-wrap">{JSON.stringify(ev.before, null, 2)}</pre>
                        </div>
                        <div className="rounded-lg bg-green-50 border border-green-100 p-2">
                          <p className="text-[10px] font-semibold text-green-600 mb-1">AFTER</p>
                          <pre className="text-[10px] text-gray-600 whitespace-pre-wrap">{JSON.stringify(ev.after, null, 2)}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {plan.overrideHistory.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">No overrides recorded</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Assigned Shops Panel ──────────────────────────────────────────────────────
const AssignedShopsPanel = ({
  staffId, shops, staffName, onSkip
}: {
  staffId: string;
  shops: ReturnType<typeof useShopStore.getState>['shops'];
  staffName: string;
  onSkip: (shopId: string, reason: string) => void;
}) => {
  const [skipModal, setSkipModal] = useState<{ open: boolean; shopId: string }>({ open: false, shopId: '' });
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;
  const paged = shops.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 flex flex-col max-h-[500px]">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <h4 className="text-sm font-semibold text-gray-900 truncate">
          {staffName}'s Shops ({shops.length})
        </h4>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1.5">
        {paged.map((shop, i) => (
          <div key={shop.id} className="flex items-center gap-2 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2 group hover:border-purple-200 hover:bg-purple-50/50 transition-all">
            <span className="text-[10px] text-gray-400 w-5 shrink-0">{page * PAGE_SIZE + i + 1}</span>
            <MapPin className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-800 truncate">{shop.name}</p>
              <p className="text-[10px] text-gray-400">{shop.area} · {shop.zone}</p>
            </div>
            <button
              onClick={() => setSkipModal({ open: true, shopId: shop.id })}
              className="opacity-0 group-hover:opacity-100 flex items-center gap-1 rounded-lg bg-yellow-100 px-2 py-1 text-[10px] font-medium text-yellow-700 transition-all hover:bg-yellow-200"
            >
              <SkipForward className="h-3 w-3" /> Skip
            </button>
          </div>
        ))}
        {shops.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">No shops assigned</p>
        )}
      </div>
      {/* Pagination */}
      {shops.length > PAGE_SIZE && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 shrink-0">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="text-xs text-purple-600 disabled:opacity-30 hover:underline"
          >← Prev</button>
          <span className="text-xs text-gray-400">{page + 1} / {Math.ceil(shops.length / PAGE_SIZE)}</span>
          <button
            disabled={(page + 1) * PAGE_SIZE >= shops.length}
            onClick={() => setPage(p => p + 1)}
            className="text-xs text-purple-600 disabled:opacity-30 hover:underline"
          >Next →</button>
        </div>
      )}
      <ReasonTagModal
        open={skipModal.open}
        title="Skip Stop"
        onSubmit={(reason) => {
          onSkip(skipModal.shopId, reason);
          setSkipModal({ open: false, shopId: '' });
        }}
        onCancel={() => setSkipModal({ open: false, shopId: '' })}
      />
    </div>
  );
};

// ── Simulated Map ─────────────────────────────────────────────────────────────
const STAFF_COLORS = [
  '#7c3aed', '#2563eb', '#059669', '#d97706', '#dc2626',
  '#7c3aed', '#0891b2', '#65a30d', '#9333ea', '#ea580c',
  '#0284c7', '#16a34a', '#ca8a04',
];

const SimulatedMap = ({
  staff, shops, assignments, selectedStaffId, onSelectStaff
}: {
  staff: ReturnType<typeof useStaffStore.getState>['staff'];
  shops: ReturnType<typeof useShopStore.getState>['shops'];
  assignments: ReturnType<typeof useDispatchStore.getState>['plan']['assignments'];
  selectedStaffId: string;
  onSelectStaff: (id: string) => void;
}) => {
  const [selectedShop, setSelectedShop] = useState<typeof shops[0] | null>(null);

  // Map bounds
  const minLat = 12.85, maxLat = 13.35, minLng = 79.95, maxLng = 80.55;
  const toX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * 100;
  const toY = (lat: number) => (1 - (lat - minLat) / (maxLat - minLat)) * 100;

  const staffColorMap = Object.fromEntries(
    staff.map((s, i) => [s.id, STAFF_COLORS[i % STAFF_COLORS.length]])
  );

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {staff.slice(0, 8).map((s, i) => (
          <button
            key={s.id}
            onClick={() => onSelectStaff(s.id)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all ${selectedStaffId === s.id ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-white hover:border-purple-200'
              }`}
          >
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: STAFF_COLORS[i] }} />
            {s.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Map Canvas */}
      <div className="relative rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 overflow-hidden" style={{ height: '420px' }}>
        {/* Grid lines */}
        {[20, 40, 60, 80].map(p => (
          <div key={p}>
            <div className="absolute top-0 bottom-0 border-l border-gray-200/50" style={{ left: `${p}%` }} />
            <div className="absolute left-0 right-0 border-t border-gray-200/50" style={{ top: `${p}%` }} />
          </div>
        ))}

        {/* Shop dots */}
        {shops.slice(0, 80).map((shop) => {
          const assignment = assignments.find(a => a.shopIds.includes(shop.id));
          const color = assignment ? staffColorMap[assignment.staffId] || '#9ca3af' : '#9ca3af';
          const x = toX(shop.lng);
          const y = toY(shop.lat);
          return (
            <button
              key={shop.id}
              onClick={() => setSelectedShop(shop)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-150 z-10"
              style={{ left: `${x}%`, top: `${y}%` }}
              title={shop.name}
            >
              <div
                className="h-2.5 w-2.5 rounded-full border border-white shadow-sm"
                style={{ background: color }}
              />
            </button>
          );
        })}

        {/* Staff labels */}
        {staff.slice(0, 5).map((s, i) => (
          <div
            key={s.id}
            className="absolute flex items-center gap-1.5 rounded-full border border-white bg-white/90 px-2 py-1 shadow-sm text-[10px] font-semibold"
            style={{
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 2) * 30}%`,
              color: STAFF_COLORS[i],
            }}
          >
            <User className="h-3 w-3" />
            {s.name.split(' ')[0]}
          </div>
        ))}

        {/* Map label */}
        <div className="absolute bottom-3 left-3 rounded-lg bg-white/80 px-3 py-1.5 text-[10px] text-gray-500 font-medium backdrop-blur-sm">
          Chennai Distribution Map · {shops.length} shops
        </div>

        {/* Shop drawer */}
        {selectedShop && (
          <div className="absolute right-3 top-3 w-56 rounded-xl bg-white shadow-xl border border-purple-100 p-4 animate-fade-in z-20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-900 truncate">{selectedShop.name}</p>
              <button onClick={() => setSelectedShop(null)} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
            </div>
            <p className="text-xs text-gray-500">{selectedShop.area} · {selectedShop.zone}</p>
            <p className="text-xs text-gray-500 mt-1">Owner: {selectedShop.owner}</p>
            <p className="text-xs text-gray-500">Cadence: {selectedShop.cadence}</p>
            <p className="text-xs text-gray-500">Outstanding: ₹{selectedShop.outstanding.toLocaleString()}</p>
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-[10px] text-gray-400">Quality Score</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 rounded-full bg-gray-100">
                  <div className="h-full rounded-full purple-gradient" style={{ width: `${selectedShop.qualityScore}%` }} />
                </div>
                <span className="text-[10px] font-semibold text-purple-600">{selectedShop.qualityScore}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dispatch;
