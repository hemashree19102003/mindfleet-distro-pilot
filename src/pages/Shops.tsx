import { useState } from "react";
import { Search, Filter, Plus, X, Store, Package, FileText, Activity } from "lucide-react";
import { shopsList } from "@/data/mockData";

const Shops = () => {
  const [search, setSearch] = useState("");
  const [selectedShop, setSelectedShop] = useState<number | null>(null);
  const [drawerTab, setDrawerTab] = useState<"overview" | "deliveries" | "invoices" | "activity">("overview");

  const filtered = shopsList.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.area.toLowerCase().includes(search.toLowerCase())
  );

  const shop = shopsList.find((s) => s.id === selectedShop);

  return (
    <div className="relative">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex-1 min-w-[200px] max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shops..."
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
        <button className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <Filter className="h-4 w-4" /> Filter
        </button>
        <button className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Shop
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Shop Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Owner</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Area</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Cadence</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Last Delivery</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Outstanding</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((shop) => (
                <tr
                  key={shop.id}
                  onClick={() => setSelectedShop(shop.id)}
                  className="border-b border-border last:border-0 cursor-pointer hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-foreground">{shop.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{shop.owner}</td>
                  <td className="px-4 py-3 text-muted-foreground">{shop.area}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">{shop.cadence}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{shop.lastDelivery}</td>
                  <td className={`px-4 py-3 text-right font-medium ${shop.outstanding === "₹0" ? "text-success" : "text-foreground"}`}>
                    {shop.outstanding}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Drawer */}
      {selectedShop && shop && (
        <div className="fixed inset-y-0 right-0 z-50 w-96 border-l border-border bg-card shadow-xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 className="font-semibold text-foreground">{shop.name}</h3>
              <p className="text-xs text-muted-foreground">{shop.area} · {shop.owner}</p>
            </div>
            <button onClick={() => setSelectedShop(null)} className="rounded-lg p-1.5 hover:bg-muted transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Drawer Tabs */}
          <div className="flex border-b border-border">
            {(["overview", "deliveries", "invoices", "activity"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setDrawerTab(tab)}
                className={`flex-1 px-2 py-3 text-xs font-medium capitalize transition-colors ${
                  drawerTab === tab ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-5 space-y-4">
            {drawerTab === "overview" && (
              <>
                <InfoRow icon={Store} label="Cadence" value={shop.cadence} />
                <InfoRow icon={Package} label="Last Delivery" value={shop.lastDelivery} />
                <InfoRow icon={FileText} label="Outstanding" value={shop.outstanding} />
                <InfoRow icon={Activity} label="Status" value="Active" />
              </>
            )}
            {drawerTab === "deliveries" && (
              <div className="space-y-2">
                {["16 Feb", "15 Feb", "14 Feb", "13 Feb"].map((d) => (
                  <div key={d} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                    <span className="text-sm text-foreground">{d}</span>
                    <span className="text-xs text-success font-medium">Delivered</span>
                  </div>
                ))}
              </div>
            )}
            {drawerTab === "invoices" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                  <span className="text-sm text-foreground">INV-2401</span>
                  <span className="text-xs text-foreground font-medium">{shop.outstanding}</span>
                </div>
              </div>
            )}
            {drawerTab === "activity" && (
              <p className="text-sm text-muted-foreground">Recent activity for this shop will appear here.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-center gap-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  </div>
);

export default Shops;
