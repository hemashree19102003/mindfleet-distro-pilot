import { useState } from "react";
import { Sparkles, Send, CheckCircle, Edit3, XCircle, HelpCircle, AlertTriangle, Clock, FileText, Bell, Activity } from "lucide-react";

const CommandCenter = () => {
  const [activeTab, setActiveTab] = useState<"today" | "drafts" | "warnings" | "recent">("today");

  return (
    <div className="flex gap-6 h-[calc(100vh-7rem)]">
      {/* Chat Section - 70% */}
      <div className="flex flex-1 flex-col rounded-xl border border-border bg-card overflow-hidden" style={{ flex: "7" }}>
        {/* Chat Header */}
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-sm font-semibold text-foreground">AI Assistant</span>
          <span className="ml-auto rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">Online</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="max-w-md rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm text-primary-foreground">
              Plan today's dispatch for 17 Feb
            </div>
          </div>

          {/* AI Response */}
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15">
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            <div className="space-y-3 max-w-lg">
              <p className="text-sm text-muted-foreground">Here's the draft dispatch plan based on today's demand forecast, staff availability, and inventory levels:</p>

              {/* Draft Card */}
              <div className="rounded-xl border-2 border-ai-border bg-ai-bg p-5 ai-glow animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <h3 className="font-semibold text-foreground">Draft Dispatch Plan – 17 Feb</h3>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: "Shops Assigned", value: "428" },
                    { label: "Staff Active", value: "12" },
                    { label: "Low Stock Risks", value: "4", warn: true },
                    { label: "Est. Distance", value: "312 km" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg bg-card p-3 border border-border">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className={`text-lg font-semibold ${item.warn ? "text-warning" : "text-foreground"}`}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Confidence */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-accent" style={{ width: "91%" }} />
                  </div>
                  <span className="text-sm font-semibold text-accent">91%</span>
                  <span className="text-xs text-muted-foreground">confidence</span>
                </div>

                {/* Risk */}
                <div className="flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-2 mb-4">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-xs text-foreground">Milk 500ml may stock out in 3 zones</span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                    <CheckCircle className="h-3.5 w-3.5" /> Approve Plan
                  </button>
                  <button className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                    <Edit3 className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </button>
                  <button className="flex items-center gap-1.5 rounded-lg border border-ai-border px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-ai-bg">
                    <HelpCircle className="h-3.5 w-3.5" /> Why this?
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3">
            <input
              type="text"
              placeholder="Ask MindFleet AI anything..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Context Panel - 30% */}
      <div className="rounded-xl border border-border bg-card overflow-hidden" style={{ flex: "3" }}>
        {/* Tabs */}
        <div className="flex border-b border-border">
          {(["today", "drafts", "warnings", "recent"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-3 py-3 text-xs font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "recent" ? "Recent" : tab}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-3">
          {activeTab === "today" && (
            <>
              <ContextCard icon={Sparkles} label="Active Dispatch" value="1" color="text-accent" />
              <ContextCard icon={FileText} label="Pending Drafts" value="2" color="text-warning" />
              <ContextCard icon={Activity} label="Deliveries Completed" value="312 / 428" color="text-success" />
            </>
          )}
          {activeTab === "warnings" && (
            <>
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium text-foreground">4 Shops SLA Risk</span>
                </div>
                <p className="text-xs text-muted-foreground">These shops may miss their delivery window</p>
              </div>
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium text-foreground">1 SKU Low Stock</span>
                </div>
                <p className="text-xs text-muted-foreground">Milk 500ml below threshold in 3 zones</p>
              </div>
            </>
          )}
          {activeTab === "drafts" && (
            <>
              <div className="rounded-lg border border-border p-3">
                <p className="text-sm font-medium text-foreground">17 Feb Dispatch</p>
                <p className="text-xs text-muted-foreground">428 shops · 91% confidence</p>
                <span className="mt-1 inline-block rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">Active</span>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-sm font-medium text-foreground">18 Feb Pre-plan</p>
                <p className="text-xs text-muted-foreground">Estimated 415 shops</p>
                <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">Draft</span>
              </div>
            </>
          )}
          {activeTab === "recent" && (
            <div className="space-y-2">
              {[
                { action: "Plan approved", time: "08:02" },
                { action: "Override applied", time: "09:15" },
                { action: "Stock alert sent", time: "14:20" },
              ].map((a) => (
                <div key={a.time} className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-foreground">{a.action}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">{a.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ContextCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) => (
  <div className="flex items-center gap-3 rounded-lg border border-border p-3 card-hover">
    <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-muted ${color}`}>
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  </div>
);

export default CommandCenter;
