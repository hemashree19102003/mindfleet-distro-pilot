import { useState, useMemo } from "react";
import { AlertTriangle, Package, Search, Filter, ChevronDown, ChevronUp, Plus, Minus } from "lucide-react";
import { useInventoryStore, useDraftStore, useUserStore } from "@/store";
import StatusBadge from "@/components/shared/StatusBadge";
import ReasonTagModal from "@/components/shared/ReasonTagModal";
import ConfirmModal from "@/components/shared/ConfirmModal";
import EmptyState from "@/components/shared/EmptyState";
import { toast } from "sonner";
import { createDraftFromAI } from "@/data/generators";

const Inventory = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "ok">("all");
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [adjustModal, setAdjustModal] = useState<{ open: boolean; skuId: string; skuName: string; delta: number }>({
    open: false, skuId: '', skuName: '', delta: 0
  });
  const [reasonModal, setReasonModal] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 12;

  const { skus: allSkus, adjustStock } = useInventoryStore();
  const skus = allSkus.filter(s => s.category === 'Dairy');
  const { addDraft } = useDraftStore();
  const { currentUser } = useUserStore();

  const categories = ["All", ...Array.from(new Set(skus.map(s => s.category)))];

  const filtered = useMemo(() => {
    return skus.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === "All" || s.category === categoryFilter;
      const matchStock = stockFilter === "all" || (stockFilter === "low" ? s.lowStock : !s.lowStock);
      return matchSearch && matchCat && matchStock;
    });
  }, [skus, search, categoryFilter, stockFilter]);

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const selectedSkuData = selectedSku ? skus.find(s => s.id === selectedSku) : null;

  const handleAdjust = (reason: string) => {
    const draft = createDraftFromAI('INVENTORY_ADJUSTMENT', currentUser.name);
    draft.payload = { skuId: adjustModal.skuId, delta: adjustModal.delta, reason };
    draft.description = `${adjustModal.delta > 0 ? 'Add' : 'Remove'} ${Math.abs(adjustModal.delta)} units of ${adjustModal.skuName}`;
    addDraft(draft);
    toast.success(`Draft adjustment created for ${adjustModal.skuName}`);
    setReasonModal(false);
  };

  if (selectedSkuData) {
    return (
      <div className="space-y-5 animate-fade-in">
        <button
          onClick={() => setSelectedSku(null)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 transition-colors"
        >
          ← Back to Inventory
        </button>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl purple-gradient">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selectedSkuData.name}</h2>
            <p className="text-sm text-gray-500">{selectedSkuData.category}</p>
          </div>
          <StatusBadge status={selectedSkuData.lowStock ? 'Low Stock' : 'In Stock'} size="md" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Available", value: selectedSkuData.available, warn: selectedSkuData.lowStock },
            { label: "Threshold", value: selectedSkuData.threshold },
            { label: "Avg Daily Usage", value: selectedSkuData.avgDaily },
            { label: "Days Remaining", value: Math.floor(selectedSkuData.available / selectedSkuData.avgDaily) },
          ].map(item => (
            <div key={item.label} className={`rounded-xl border p-4 ${item.warn ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-white'}`}>
              <p className="text-xs text-gray-500">{item.label}</p>
              <p className={`text-2xl font-bold ${item.warn ? 'text-red-600' : 'text-gray-900'}`}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Adjust Stock */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => { setAdjustModal({ open: true, skuId: selectedSkuData.id, skuName: selectedSkuData.name, delta: 50 }); setReasonModal(true); }}
            className="flex items-center gap-2 rounded-xl purple-gradient px-5 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-md"
          >
            <Plus className="h-4 w-4" /> Add Stock (Draft)
          </button>
          <button
            onClick={() => { setAdjustModal({ open: true, skuId: selectedSkuData.id, skuName: selectedSkuData.name, delta: -20 }); setReasonModal(true); }}
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-medium text-red-600 transition-all hover:bg-red-100"
          >
            <Minus className="h-4 w-4" /> Remove Stock (Draft)
          </button>
        </div>

        {/* Stock bar */}
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">Stock Level</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${selectedSkuData.lowStock ? 'bg-red-500' : 'bg-green-500'
                  }`}
                style={{ width: `${Math.min(100, (selectedSkuData.available / (selectedSkuData.threshold * 2)) * 100)}%` }}
              />
            </div>
            <span className="text-sm font-bold text-gray-700">{selectedSkuData.available} / {selectedSkuData.threshold * 2}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-400">0</span>
            <span className="text-[10px] text-red-400">Threshold: {selectedSkuData.threshold}</span>
            <span className="text-[10px] text-gray-400">{selectedSkuData.threshold * 2}</span>
          </div>
        </div>

        {/* FIFO Batches */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            FIFO Batches ({selectedSkuData.batches.length})
          </h3>
          <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm responsive-table">
                <thead>
                  <tr className="border-b border-gray-100 bg-purple-50/50">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Batch ID</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Received</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Qty</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Expiry</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Unit Price</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSkuData.batches.slice(0, 15).map((batch) => {
                    const expiry = new Date(batch.expiryDate);
                    const today = new Date(2025, 1, 17);
                    const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                    const isExpiringSoon = daysLeft <= 7;
                    return (
                      <tr key={batch.id} className="border-b border-gray-50 last:border-0 hover:bg-purple-50/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-gray-700" data-label="Batch">{batch.batchId}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs" data-label="Received">{batch.receivedDate}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900" data-label="Qty">{batch.quantity}</td>
                        <td className="px-4 py-3 text-xs" data-label="Expiry">
                          <span className={isExpiringSoon ? 'text-red-600 font-semibold' : 'text-gray-500'}>
                            {batch.expiryDate}
                            {isExpiringSoon && <span className="ml-1 text-[10px]">({daysLeft}d)</span>}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700 text-xs" data-label="Price">₹{batch.unitPrice}</td>
                        <td className="px-4 py-3" data-label="Status">
                          {isExpiringSoon ? (
                            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">Expiring Soon</span>
                          ) : (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">OK</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <ReasonTagModal
          open={reasonModal}
          title="Stock Adjustment Reason"
          onSubmit={handleAdjust}
          onCancel={() => setReasonModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500">{skus.length} SKUs · {skus.reduce((s, k) => s + k.batches.length, 0)} batches</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
            {skus.filter(s => s.lowStock).length} Low Stock
          </span>
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
            placeholder="Search Dairy products…"
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => { setCategoryFilter(e.target.value); setPage(0); }}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-purple-400"
        >
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden">
          {(['all', 'low', 'ok'] as const).map(f => (
            <button
              key={f}
              onClick={() => { setStockFilter(f); setPage(0); }}
              className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${stockFilter === f ? 'bg-purple-600 text-white' : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              {f === 'all' ? 'All' : f === 'low' ? 'Low Stock' : 'In Stock'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {paged.length === 0 ? (
        <EmptyState icon={Package} title="No SKUs found" description="Try adjusting your search or filters." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paged.map((sku) => {
            const fillPct = Math.min(100, (sku.available / (sku.threshold * 2)) * 100);
            return (
              <div
                key={sku.id}
                onClick={() => setSelectedSku(sku.id)}
                className="rounded-xl border border-gray-100 bg-white p-4 card-hover cursor-pointer animate-fade-in hover:border-purple-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${sku.lowStock ? 'bg-red-100' : 'bg-purple-100'}`}>
                    <Package className={`h-4 w-4 ${sku.lowStock ? 'text-red-600' : 'text-purple-600'}`} />
                  </div>
                  {sku.lowStock && (
                    <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                      <AlertTriangle className="h-3 w-3" /> Low
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-0.5 leading-tight">{sku.name}</h3>
                <p className="text-[11px] text-gray-400 mb-3">{sku.category} · {sku.batches.length} batches</p>

                {/* Stock bar */}
                <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${sku.lowStock ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${fillPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Available</span>
                  <span className={`font-bold ${sku.lowStock ? 'text-red-600' : 'text-gray-900'}`}>{sku.available}</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-0.5">
                  <span className="text-gray-400">Threshold</span>
                  <span className="text-gray-600">{sku.threshold}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
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
      )}
    </div>
  );
};

export default Inventory;
