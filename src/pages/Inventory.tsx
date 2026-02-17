import { useState } from "react";
import { AlertTriangle, ArrowLeft, Package } from "lucide-react";
import { inventoryItems } from "@/data/mockData";

const Inventory = () => {
  const [selectedSku, setSelectedSku] = useState<number | null>(null);
  const item = inventoryItems.find((i) => i.id === selectedSku);

  if (selectedSku && item) {
    return (
      <div className="space-y-5 animate-fade-in">
        <button onClick={() => setSelectedSku(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Inventory
        </button>

        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-foreground">{item.name}</h2>
          {item.lowStock && <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">Low Stock</span>}
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-xl">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Available</p>
            <p className="text-lg font-semibold text-foreground">{item.available}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Threshold</p>
            <p className="text-lg font-semibold text-foreground">{item.threshold}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Avg Daily Usage</p>
            <p className="text-lg font-semibold text-foreground">{item.avgDaily}</p>
          </div>
        </div>

        {/* FIFO Batches */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">FIFO Batches</h3>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Batch</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Received</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Qty</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Expiry</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { batch: "B-001", received: "10 Feb", qty: 50, expiry: "20 Feb" },
                  { batch: "B-002", received: "14 Feb", qty: 70, expiry: "24 Feb" },
                ].map((b) => (
                  <tr key={b.batch} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{b.batch}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.received}</td>
                    <td className="px-4 py-3 text-right text-foreground">{b.qty}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.expiry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Movement History */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Movement History</h3>
          <div className="space-y-2">
            {["Dispatched 40 units – 16 Feb", "Received 70 units – 14 Feb", "Dispatched 45 units – 13 Feb"].map((m) => (
              <div key={m} className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-foreground">{m}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {inventoryItems.map((item) => (
        <div
          key={item.id}
          onClick={() => setSelectedSku(item.id)}
          className="rounded-xl border border-border bg-card p-4 card-hover cursor-pointer animate-fade-in"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-4 w-4 text-primary" />
            </div>
            {item.lowStock && (
              <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                <AlertTriangle className="h-3 w-3" /> Low Stock
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-2">{item.name}</h3>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Available</span>
            <span className={`font-semibold ${item.lowStock ? "text-destructive" : "text-foreground"}`}>{item.available}</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-muted-foreground">Avg Daily</span>
            <span className="text-foreground">{item.avgDaily}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Inventory;
