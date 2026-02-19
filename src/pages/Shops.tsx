import { useState, useMemo } from "react";
import { Store, Search, Upload, MapPin, Phone, CreditCard, Star, AlertTriangle } from "lucide-react";
import { useShopStore, useDraftStore, useUserStore } from "@/store";
import EmptyState from "@/components/shared/EmptyState";
import StatusBadge from "@/components/shared/StatusBadge";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { toast } from "sonner";
import { createDraftFromAI } from "@/data/generators";

const Shops = () => {
  const [search, setSearch] = useState("");
  const [zoneFilter, setZoneFilter] = useState("All");
  const [qualityFilter, setQualityFilter] = useState<"all" | "low" | "high">("all");
  const [page, setPage] = useState(0);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [importModal, setImportModal] = useState(false);
  const PAGE_SIZE = 15;

  const { shops } = useShopStore();
  const { addDraft } = useDraftStore();
  const { currentUser } = useUserStore();

  const zones = ["All", ...Array.from(new Set(shops.map(s => s.zone)))];

  const filtered = useMemo(() => {
    return shops.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.owner.toLowerCase().includes(search.toLowerCase()) ||
        s.area.toLowerCase().includes(search.toLowerCase());
      const matchZone = zoneFilter === "All" || s.zone === zoneFilter;
      const matchQuality = qualityFilter === "all" ||
        (qualityFilter === "low" ? s.qualityScore < 70 : s.qualityScore >= 70);
      return matchSearch && matchZone && matchQuality;
    });
  }, [shops, search, zoneFilter, qualityFilter]);

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const selectedShopData = selectedShop ? shops.find(s => s.id === selectedShop) : null;

  const handleImport = () => {
    const draft = createDraftFromAI('SHOP_IMPORT', currentUser.name);
    draft.description = 'Import 12 new shops from uploaded CSV';
    addDraft(draft);
    toast.success("CSV import draft created — approve to commit");
    setImportModal(false);
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Shops</h1>
          <p className="text-sm text-gray-500">{shops.length} shops · {shops.filter(s => s.qualityScore < 70).length} low quality</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setImportModal(true)}
            className="flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 transition-all hover:bg-purple-100"
          >
            <Upload className="h-4 w-4" /> Import CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 flex-1 min-w-[200px] w-full sm:w-auto">
          <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search shops, owners, areas…"
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
          />
        </div>
        <select
          value={zoneFilter}
          onChange={e => { setZoneFilter(e.target.value); setPage(0); }}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-purple-400"
        >
          {zones.map(z => <option key={z}>{z}</option>)}
        </select>
        <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden">
          {(['all', 'low', 'high'] as const).map(f => (
            <button
              key={f}
              onClick={() => { setQualityFilter(f); setPage(0); }}
              className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${qualityFilter === f ? 'bg-purple-600 text-white' : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              {f === 'all' ? 'All' : f === 'low' ? 'Low Quality' : 'High Quality'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Shops", value: shops.length, icon: Store, color: "text-purple-600", bg: "bg-purple-0" },
          { label: "Missing Geo", value: shops.filter(s => !s.hasGeo).length, icon: MapPin, color: "text-purple-600", bg: "bg-red-0" },
          { label: "No Contact", value: shops.filter(s => !s.hasContact).length, icon: Phone, color: "text-purple-600", bg: "bg-yellow-0" },
          { label: "Low Quality", value: shops.filter(s => s.qualityScore < 70).length, icon: AlertTriangle, color: "text-purple-600", bg: "bg-orange-0" },
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

      {/* Table */}
      {paged.length === 0 ? (
        <EmptyState icon={Store} title="No shops found" />
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm responsive-table">
              <thead>
                <tr className="border-b border-gray-100 bg-purple-50/50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Shop</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider hidden md:table-cell">Area</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider hidden lg:table-cell">Cadence</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider hidden md:table-cell">Credit Limit</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider hidden md:table-cell">Outstanding</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Quality</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider hidden lg:table-cell">Geo</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((shop) => (
                  <tr
                    key={shop.id}
                    onClick={() => setSelectedShop(shop.id === selectedShop ? null : shop.id)}
                    className="border-b border-gray-50 last:border-0 hover:bg-purple-50/30 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3" data-label="Shop">
                      <div>
                        <p className="font-medium text-gray-900">{shop.name}</p>
                        <p className="text-xs text-gray-400">{shop.owner}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell" data-label="Area">
                      <div>
                        <p>{shop.area}</p>
                        <p className="text-xs text-gray-400">{shop.zone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell" data-label="Cadence">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${shop.cadence === 'Daily' ? 'bg-green-100 text-green-700' :
                        shop.cadence === 'Alternate' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                        {shop.cadence}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700 hidden md:table-cell" data-label="Credit">
                      {shop.hasCreditLimit ? `₹${shop.creditLimit.toLocaleString()}` : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell" data-label="Outstanding">
                      <span className={shop.outstanding > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>
                        {shop.outstanding > 0 ? `₹${shop.outstanding.toLocaleString()}` : '₹0'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center" data-label="Quality">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-12 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${shop.qualityScore >= 80 ? 'bg-green-500' : shop.qualityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${shop.qualityScore}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold ${getQualityColor(shop.qualityScore).split(' ')[0]}`}>
                          {shop.qualityScore}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell" data-label="Geo">
                      {shop.hasGeo ? (
                        <MapPin className="h-4 w-4 text-green-500 mx-auto" />
                      ) : (
                        <MapPin className="h-4 w-4 text-gray-200 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{filtered.length} shops</p>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 disabled:opacity-30 hover:border-purple-300 hover:text-purple-600 transition-colors"
            >← Prev</button>
            <span className="text-sm text-gray-500">{page + 1} / {totalPages}</span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 disabled:opacity-30 hover:border-purple-300 hover:text-purple-600 transition-colors"
            >Next →</button>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      <ConfirmModal
        open={importModal}
        title="Import Shops from CSV"
        description="This will create a draft import card. You must approve it before shops are committed to the system."
        onConfirm={handleImport}
        onCancel={() => setImportModal(false)}
      />
    </div>
  );
};

export default Shops;
