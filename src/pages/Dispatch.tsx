import { useState } from "react";
import { Sparkles, AlertTriangle, Clock, CheckCircle, MapPin, User } from "lucide-react";
import { staffList, dispatchJournal } from "@/data/mockData";

const tabs = ["Plan", "Assignments", "Map", "Journal"] as const;

const Dispatch = () => {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("Plan");
  const [selectedStaff, setSelectedStaff] = useState(staffList[0].id);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">Date:</span>
        <span className="font-semibold text-foreground">17 Feb 2025</span>
        <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">Approved</span>
        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> 91% Confidence
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Plan" && (
        <div className="rounded-xl border-2 border-ai-border bg-ai-bg p-6 ai-glow animate-fade-in max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-accent" />
            <h3 className="font-semibold text-foreground">Draft Dispatch Plan – 17 Feb</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              { label: "Shops Assigned", value: "428" },
              { label: "Staff Active", value: "12" },
              { label: "Low Stock Risks", value: "4" },
              { label: "Est. Distance", value: "312 km" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-card p-3 border border-border">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-lg font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="text-xs text-foreground">Milk 500ml may stock out in 3 zones</span>
          </div>
        </div>
      )}

      {activeTab === "Assignments" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Staff List */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground mb-3">Staff ({staffList.length})</h4>
            {staffList.map((staff) => (
              <button
                key={staff.id}
                onClick={() => setSelectedStaff(staff.id)}
                className={`w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                  selectedStaff === staff.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-muted/50"
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{staff.name}</p>
                  <p className="text-xs text-muted-foreground">{staff.stops} stops · {staff.distance}</p>
                </div>
                {staff.risk && (
                  <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-semibold text-warning">Risk</span>
                )}
              </button>
            ))}
          </div>

          {/* Assigned Shops */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Assigned Shops – {staffList.find((s) => s.id === selectedStaff)?.name}
            </h4>
            <div className="space-y-2">
              {Array.from({ length: staffList.find((s) => s.id === selectedStaff)?.stops || 0 }, (_, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs cursor-grab hover:bg-muted">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-foreground">Shop #{i + 1} – Zone {(i % 4) + 1}</span>
                </div>
              )).slice(0, 8)}
              <p className="text-xs text-muted-foreground text-center py-1">
                + {(staffList.find((s) => s.id === selectedStaff)?.stops || 0) - 8} more shops
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Map" && (
        <div className="rounded-xl border border-border bg-muted/30 h-96 flex items-center justify-center">
          <div className="text-center space-y-2">
            <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto" />
            <p className="text-sm text-muted-foreground">Map view with route lines and shop pins</p>
            <p className="text-xs text-muted-foreground/60">Interactive map integration placeholder</p>
          </div>
        </div>
      )}

      {activeTab === "Journal" && (
        <div className="max-w-2xl space-y-0">
          {dispatchJournal.map((entry, i) => (
            <div key={i} className="flex gap-4 pb-6 relative animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              {/* Timeline line */}
              {i < dispatchJournal.length - 1 && (
                <div className="absolute left-[18px] top-9 bottom-0 w-px bg-border" />
              )}
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                entry.type === "success" ? "border-success/30 bg-success/10" :
                entry.type === "warning" ? "border-warning/30 bg-warning/10" :
                "border-border bg-muted"
              }`}>
                {entry.type === "success" ? <CheckCircle className="h-4 w-4 text-success" /> :
                 entry.type === "warning" ? <AlertTriangle className="h-4 w-4 text-warning" /> :
                 <Clock className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{entry.event}</span>
                  <span className="text-xs text-muted-foreground">{entry.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{entry.detail}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dispatch;
