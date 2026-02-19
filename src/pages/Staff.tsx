import { useState, useMemo } from "react";
import { Users, Search, Phone, Truck, MapPin, TrendingUp, AlertTriangle } from "lucide-react";
import { useStaffStore, useDispatchStore, useShopStore } from "@/store";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";

const Staff = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "On Leave" | "Inactive">("all");
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);

  const { staff } = useStaffStore();
  const { plan } = useDispatchStore();
  const { shops } = useShopStore();

  const filtered = useMemo(() => {
    return staff.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.zone.toLowerCase().includes(search.toLowerCase()) ||
        s.vehicle.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [staff, search, statusFilter]);

  const selectedStaffData = selectedStaff ? staff.find(s => s.id === selectedStaff) : null;
  const selectedAssignment = selectedStaff ? plan.assignments.find(a => a.staffId === selectedStaff) : null;
  const assignedShops = selectedAssignment
    ? shops.filter(sh => selectedAssignment.shopIds.includes(sh.id))
    : [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Staff</h1>
          <p className="text-sm text-gray-500">{staff.length} staff · {staff.filter(s => s.status === 'Active').length} active</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Staff", value: staff.length, icon: Users, color: "text-purple-600", bg: "bg-purple-0" },
          { label: "Active", value: staff.filter(s => s.status === 'Active').length, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-0" },
          { label: "On Leave", value: staff.filter(s => s.status === 'On Leave').length, icon: AlertTriangle, color: "text-purple-600", bg: "bg-purple-0" },
          { label: "At Risk", value: staff.filter(s => s.risk).length, icon: AlertTriangle, color: "text-purple-600", bg: "bg-purple-0" },
        ].map(item => (
          <div key={item.label} className="rounded-xl border border-gray-100 bg-white p-4">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.bg} ${item.color} mb-2`}>
              <item.icon className="h-4 w-4" />
            </div>
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="text-xl font-bold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 flex-1 min-w-[200px] w-full sm:w-auto">
          <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search staff, zone, vehicle…"
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
          />
        </div>
        <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden">
          {(['all', 'Active', 'On Leave', 'Inactive'] as const).map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-2 text-xs font-medium transition-colors ${statusFilter === f ? 'bg-purple-600 text-white' : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Staff List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.length === 0 ? (
            <EmptyState icon={Users} title="No staff found" />
          ) : (
            filtered.map((s) => {
              const assignment = plan.assignments.find(a => a.staffId === s.id);
              const shopCount = assignment?.shopIds.length || 0;
              const utilization = Math.round((shopCount / s.capacity) * 100);
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedStaff(s.id === selectedStaff ? null : s.id)}
                  className={`rounded-xl border p-4 cursor-pointer transition-all hover:shadow-sm ${selectedStaff === s.id
                    ? 'border-purple-400 bg-purple-50'
                    : 'border-gray-100 bg-white hover:border-purple-200'
                    }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      {/* Avatar */}
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full text-white text-lg font-bold shrink-0 ${s.status !== 'Active' ? 'bg-gray-300' : 'purple-gradient'
                        }`}>
                        {s.name[0]}
                      </div>

                      {/* Info (Mobile header) */}
                      <div className="flex-1 min-w-0 sm:hidden">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900">{s.name}</p>
                          <StatusBadge status={s.status} />
                        </div>
                      </div>
                    </div>

                    {/* Info (Desktop) */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="hidden sm:flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900">{s.name}</p>
                        <StatusBadge status={s.status} />
                        {s.risk && <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold text-yellow-700">⚠ Risk</span>}
                      </div>

                      {/* Mobile details block */}
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Truck className="h-3 w-3" />{s.vehicle}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{s.zone}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{s.phone}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex w-full sm:w-auto sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-1 shrink-0 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                      <p className="text-sm font-bold text-gray-900">{shopCount} shops</p>
                      <p className="text-xs text-gray-400">{s.distance}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${utilization > 90 ? 'bg-red-500' : utilization > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(100, utilization)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-400">{utilization}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance bar */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 w-20">Performance</span>
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full purple-gradient"
                        style={{ width: `${s.performance}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-purple-600">{s.performance}%</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detail Panel */}
        {selectedStaffData ? (
          <div className="rounded-xl border border-purple-200 bg-white p-5 space-y-4 h-fit sticky top-20">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full purple-gradient text-white text-xl font-bold">
                {selectedStaffData.name[0]}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{selectedStaffData.name}</h3>
                <StatusBadge status={selectedStaffData.status} size="md" />
              </div>
            </div>

            <div className="space-y-2">
              {[
                { label: "Zone", value: selectedStaffData.zone },
                { label: "Vehicle", value: selectedStaffData.vehicle },
                { label: "Phone", value: selectedStaffData.phone },
                { label: "Capacity", value: `${selectedStaffData.capacity} stops` },
                { label: "Distance", value: selectedStaffData.distance },
                { label: "Performance", value: `${selectedStaffData.performance}%` },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <span className="text-xs font-semibold text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Assigned Shops ({assignedShops.length})
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {assignedShops.slice(0, 10).map(shop => (
                  <div key={shop.id} className="flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-2">
                    <MapPin className="h-3 w-3 text-purple-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{shop.name}</p>
                      <p className="text-[10px] text-gray-400">{shop.area}</p>
                    </div>
                  </div>
                ))}
                {assignedShops.length > 10 && (
                  <p className="text-xs text-gray-400 text-center">+{assignedShops.length - 10} more</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 flex flex-col items-center justify-center text-center h-fit">
            <Users className="h-10 w-10 text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">Select a staff member to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Staff;
