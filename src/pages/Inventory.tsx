import { useState, useMemo } from "react";
import { AlertTriangle, Package, Plus, Minus, TrendingUp, Clock, History, LayoutGrid, List, FileDown } from "lucide-react";
import { useInventoryStore, useDraftStore, useUserStore } from "@/store";
import StatusBadge from "@/components/shared/StatusBadge";
import FilterBar from "@/components/shared/FilterBar";
import RiskBanner from "@/components/shared/RiskBanner";
import { VirtualizedTable } from "@/components/shared/VirtualizedTable";
import { toast } from "sonner";
import { createDraftFromAI } from "@/data/generators";

import BatchForm from "@/components/inventory/BatchForm";
import StockAdjustModal from "@/components/inventory/StockAdjustModal";
import InventoryLedger from "@/components/inventory/InventoryLedger";

const Inventory = () => {
  const { skus: allSkus } = useInventoryStore();
  const { addDraft } = useDraftStore();
  const { currentUser } = useUserStore();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSkuId, setSelectedSkuId] = useState<string | null>(null);

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  // Mock dairy category as primary
  const skus = useMemo(() => allSkus.filter(s => s.category === 'Dairy'), [allSkus]);

  const filtered = useMemo(() => {
    return skus.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const matchFilter = activeFilter === 'all' || (activeFilter === 'low' && s.lowStock) || (activeFilter === 'ok' && !s.lowStock);
      return matchSearch && matchFilter;
    });
  }, [skus, search, activeFilter]);

  const selectedSku = useMemo(() => skus.find(s => s.id === selectedSkuId), [skus, selectedSkuId]);

  const handleAdjustStock = (adjustment: number, reason: string, note: string) => {
    if (!selectedSku) return;
    const draft = createDraftFromAI('INVENTORY_ADJUSTMENT', currentUser.name);
    draft.payload = { skuId: selectedSku.id, delta: adjustment, reason, note };
    draft.description = `${adjustment > 0 ? 'Add' : 'Remove'} ${Math.abs(adjustment)} units of ${selectedSku.name}`;
    addDraft(draft);
    toast.success(`Draft adjustment created: ${reason}`);
    setIsAdjustModalOpen(false);
  };

  const handleCreateBatch = (batchPayload: any) => {
    toast.success(`Batch draft created: ${batchPayload.quantity} units for SKU ${selectedSkuId || batchPayload.skuId}`);
    setIsBatchModalOpen(false);
  };

  if (selectedSku) {
    return (
      <div className="space-y-6 animate-fade-in pb-10">
        <button
          onClick={() => setSelectedSkuId(null)}
          className="flex items-center gap-1.5 text-xs font-black text-purple-600 uppercase tracking-widest hover:translate-x-[-4px] transition-all"
        >
          ← Back to Inventory
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-3xl purple-gradient flex items-center justify-center text-white shadow-lg shadow-purple-200">
              <Package className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">{selectedSku.name}</h1>
                <StatusBadge status={selectedSku.lowStock ? 'Low Stock' : 'In Stock'} />
              </div>
              <p className="text-sm font-medium text-gray-400">Category: {selectedSku.category} · System ID: {selectedSku.id.split('-')[1]}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAdjustModalOpen(true)}
              className="h-11 rounded-xl bg-purple-600 px-6 text-xs font-bold text-white shadow-lg shadow-purple-200 active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> ADJUST STOCK
            </button>
          </div>
        </div>

        {selectedSku.lowStock && (
          <RiskBanner
            severity="destructive"
            title="Stock Below Threshold"
            description={`Current inventory (${selectedSku.available}) is below the safety threshold of ${selectedSku.threshold}. Expected stockout in 2.5 days.`}
            actionLabel="ORDER FROM VENDOR"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SummaryStat label="AVAILABLE" value={String(selectedSku.available)} icon={Package} />
          <SummaryStat label="THRESHOLD" value={String(selectedSku.threshold)} icon={AlertTriangle} />
          <SummaryStat label="AVG DAILY" value={String(selectedSku.avgDaily)} unit="u/day" icon={TrendingUp} />
          <SummaryStat label="RUNWAY" value={String(Math.floor(selectedSku.available / selectedSku.avgDaily))} unit="days" icon={Clock} />
        </div>

        <InventoryLedger batches={selectedSku.batches} />

        {isAdjustModalOpen && (
          <StockAdjustModal
            sku={selectedSku}
            onClose={() => setIsAdjustModalOpen(false)}
            onConfirm={handleAdjustStock}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Inventory Control</h1>
          <p className="text-sm text-gray-500">Manage {skus.length} Dairy SKUs and batch logistics</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBatchModalOpen(true)}
            className="flex h-10 items-center gap-2 rounded-xl border border-purple-100 bg-white px-4 text-xs font-bold text-purple-600 hover:bg-purple-50 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" /> ADD BATCH
          </button>
          <button className="flex h-10 items-center gap-2 rounded-xl purple-gradient px-4 text-xs font-bold text-white shadow-lg active:scale-95 transition-all">
            <FileDown className="h-4 w-4" /> RECONCILE
          </button>
        </div>
      </div>

      {isBatchModalOpen && (
        <BatchForm
          skuId={selectedSkuId || ''}
          onClose={() => setIsBatchModalOpen(false)}
          onSubmit={handleCreateBatch}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <FilterBar
          searchPlaceholder="Filter SKUs..."
          onSearch={setSearch}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          options={[
            { id: 'all', label: 'All Items', count: skus.length },
            { id: 'low', label: 'Low Stock', count: skus.filter(s => s.lowStock).length },
            { id: 'ok', label: 'Healthy', count: skus.filter(s => !s.lowStock).length },
          ]}
        />

        <div className="flex bg-gray-100 p-1 rounded-xl shrink-0 self-start md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(sku => (
            <div
              key={sku.id}
              onClick={() => setSelectedSkuId(sku.id)}
              className="group relative bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:border-purple-200 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${sku.lowStock ? 'bg-red-50 text-red-500' : 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white'
                  }`}>
                  <Package className="h-6 w-6" />
                </div>
                {sku.lowStock && <AlertTriangle className="h-5 w-5 text-red-400 animate-pulse" />}
              </div>

              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">{sku.name}</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">{sku.category}</p>

              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">STOCK LEVEL</span>
                <span className={`text-xs font-black ${sku.lowStock ? 'text-red-500' : 'text-gray-900'}`}>{sku.available} / {sku.threshold * 2}</span>
              </div>

              <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${sku.lowStock ? 'bg-red-500' : 'bg-purple-600'}`}
                  style={{ width: `${Math.min(100, (sku.available / (sku.threshold * 2)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm h-[600px]">
          <VirtualizedTable
            items={filtered}
            height={600}
            rowHeight={64}
            header={
              <div className="flex items-center px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 border-b border-gray-100">
                <div className="w-16">Status</div>
                <div className="w-20">SKU ID</div>
                <div className="flex-1">Product Name</div>
                <div className="w-32">Category</div>
                <div className="w-32 text-right">Available</div>
                <div className="w-32 text-right">Threshold</div>
                <div className="w-24 text-right pr-4">Action</div>
              </div>
            }
            renderRow={(sku) => (
              <div
                onClick={() => setSelectedSkuId(sku.id)}
                className="flex items-center px-6 h-full border-b border-gray-50 hover:bg-purple-50/30 transition-colors cursor-pointer group"
              >
                <div className="w-16">
                  <StatusBadge status={sku.lowStock ? 'Low Stock' : 'In Stock'} size="sm" />
                </div>
                <div className="w-20 font-mono text-[10px] text-gray-400">{sku.id.split('-')[1]}</div>
                <div className="flex-1 font-bold text-sm text-gray-900 group-hover:text-purple-600 transition-colors">{sku.name}</div>
                <div className="w-32 text-xs text-gray-500">{sku.category}</div>
                <div className={`w-32 text-right font-black text-sm ${sku.lowStock ? 'text-red-500' : 'text-gray-900'}`}>
                  {sku.available} <span className="text-[9px] text-gray-400 font-normal">units</span>
                </div>
                <div className="w-32 text-right text-xs text-gray-400">{sku.threshold}</div>
                <div className="w-24 text-right pr-4">
                  <button className="text-[10px] font-bold text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest hover:underline">
                    VIEW
                  </button>
                </div>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
};

const SummaryStat = ({ label, value, unit, icon: Icon }: { label: string, value: string, unit?: string, icon: any }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
    <div className="flex items-center gap-2 mb-3">
      <Icon className="h-3.5 w-3.5 text-purple-400" />
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-black text-gray-900 leading-none">{value}</span>
      {unit && <span className="text-xs font-bold text-gray-400 uppercase">{unit}</span>}
    </div>
  </div>
);

export default Inventory;
