import { useState } from "react";
import {
  Sparkles, Send, CheckCircle, Edit3, XCircle, HelpCircle,
  AlertTriangle, Clock, FileText, Activity, Zap, Package,
  TrendingUp, ChevronDown, ChevronUp, IndianRupee, Users, MapPin
} from "lucide-react";

const CommandCenter = () => {
  const [activeTab, setActiveTab] = useState<"today" | "drafts" | "warnings" | "recent">("today");
  const [planApproved, setPlanApproved] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="flex gap-5 h-[calc(100vh-7rem)]">
      {/* Chat Section - 70% */}
      <div className="flex flex-1 flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm" style={{ flex: "7" }}>
        {/* Chat Header */}
        <div className="flex items-center gap-3 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
            <Sparkles className="h-4.5 w-4.5 text-accent" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Command Center</h2>
            <p className="text-[11px] text-muted-foreground">AI-assisted operational control</p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-semibold text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" />
            AI Active
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="max-w-md rounded-2xl rounded-br-md bg-primary px-5 py-3 text-sm text-primary-foreground shadow-sm">
              Plan today's dispatch for 17 Feb
            </div>
          </div>

          {/* AI Response */}
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 mt-1">
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            <div className="space-y-3 max-w-2xl flex-1">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Here's the draft dispatch plan based on today's demand forecast, staff availability, and inventory levels:
              </p>

              {/* Draft Card — Hero */}
              <div className={`rounded-2xl border-2 p-6 animate-fade-in transition-all duration-300 ${
                planApproved
                  ? "border-success/40 bg-success/5 shadow-[0_0_24px_-6px_hsl(152_60%_40%/0.2)]"
                  : "border-ai-border bg-ai-bg ai-glow"
              }`}>
                <div className="flex items-center gap-2 mb-5">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <h3 className="font-semibold text-foreground">Draft Dispatch Plan – 17 Feb</h3>
                  {planApproved && (
                    <span className="ml-auto flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-[10px] font-semibold text-success">
                      <CheckCircle className="h-3 w-3" /> Approved
                    </span>
                  )}
                </div>

                {/* Summary Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                  {[
                    { label: "Shops Assigned", value: "428", icon: MapPin },
                    { label: "Staff Active", value: "12", icon: Users },
                    { label: "Est. Distance", value: "312 km", icon: TrendingUp },
                    { label: "SLA Risks", value: "4", icon: AlertTriangle, warn: true },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-card p-3 border border-border">
                      <div className="flex items-center gap-1.5 mb-1">
                        <item.icon className={`h-3 w-3 ${item.warn ? "text-warning" : "text-muted-foreground"}`} />
                        <p className="text-[11px] text-muted-foreground">{item.label}</p>
                      </div>
                      <p className={`text-lg font-bold ${item.warn ? "text-warning" : "text-foreground"}`}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Confidence */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-medium text-muted-foreground">Confidence</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-accent to-primary transition-all duration-700" style={{ width: "91%" }} />
                  </div>
                  <span className="text-sm font-bold ai-glow-text">91%</span>
                </div>

                {/* Inventory Risks */}
                <div className="rounded-xl bg-warning/5 border border-warning/20 p-3 mb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                    <span className="text-xs font-semibold text-foreground">Inventory Risks</span>
                  </div>
                  <div className="space-y-1 pl-5.5">
                    <p className="text-xs text-muted-foreground">• Milk 500ml low stock in Zone 3</p>
                    <p className="text-xs text-muted-foreground">• Curd 1kg nearing threshold</p>
                  </div>
                </div>

                {/* Optimization Insight */}
                <div className="rounded-xl bg-accent/5 border border-ai-border p-3 mb-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-3.5 w-3.5 text-accent" />
                    <span className="text-xs font-semibold text-accent">Optimization Insight</span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-5.5">
                    Routes optimized for distance and workload balance. Two staff near capacity limit.
                  </p>
                </div>

                {/* Why this? Explanation */}
                {showExplanation && (
                  <div className="rounded-xl bg-muted/60 border border-border p-4 mb-5 animate-fade-in">
                    <p className="text-xs font-semibold text-foreground mb-2">Why this plan?</p>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      <li>• Historical demand patterns show 17 Feb as a high-demand day (+12% vs average)</li>
                      <li>• Staff allocation weighted by zone density and delivery SLA windows</li>
                      <li>• Route optimization reduced total distance by 18% vs manual planning</li>
                      <li>• 4 SLA risks flagged due to high-density zones with limited staff coverage</li>
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setPlanApproved(true)}
                    disabled={planApproved}
                    className={`flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                      planApproved
                        ? "bg-success/15 text-success cursor-default"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    {planApproved ? "Approved" : "Approve Plan"}
                  </button>
                  {!planApproved && (
                    <button className="flex items-center gap-1.5 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted hover:-translate-y-0.5 hover:shadow-sm">
                      <Edit3 className="h-3.5 w-3.5" /> Edit Plan
                    </button>
                  )}
                  {!planApproved && (
                    <button className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-destructive/70 transition-colors hover:text-destructive hover:bg-destructive/5">
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </button>
                  )}
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-accent transition-all duration-200 hover:bg-accent/5"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    Why this?
                    {showExplanation ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Chips + Input */}
        <div className="border-t border-border px-6 pb-5 pt-4 space-y-3">
          {/* Quick Chips */}
          <div className="flex gap-2 overflow-x-auto">
            {["Plan Dispatch", "Show Risks", "Update Inventory", "Generate Invoices"].map((chip) => (
              <button
                key={chip}
                className="shrink-0 rounded-full border border-border bg-muted/50 px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-accent/10 hover:text-accent hover:border-ai-border"
              >
                {chip}
              </button>
            ))}
          </div>
          {/* Input */}
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/30 px-5 py-3 transition-all duration-200 focus-within:border-accent/40 focus-within:shadow-[0_0_16px_-4px_hsl(262_60%_65%/0.15)]">
            <input
              type="text"
              placeholder="Ask me to plan dispatch, adjust stock, or analyze performance…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Context Panel - 30% */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm" style={{ flex: "3" }}>
        {/* Header */}
        <div className="px-5 pt-5 pb-2">
          <h3 className="text-sm font-semibold text-foreground">Context Intelligence</h3>
          <p className="text-[11px] text-muted-foreground">Real-time operational overview</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mx-4">
          {(["today", "drafts", "warnings", "recent"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-2 py-2.5 text-[11px] font-medium capitalize transition-all duration-200 ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "recent" ? "Activity" : tab}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: "calc(100% - 120px)" }}>
          {activeTab === "today" && (
            <div className="space-y-3 animate-fade-in">
              <ContextCard icon={Sparkles} label="Active Dispatch" value="1" color="text-accent" />
              <ContextCard icon={FileText} label="Pending Drafts" value="2" color="text-warning" />
              <ContextCard icon={Activity} label="Deliveries" value="312 / 428" color="text-success" subtitle="72.9% complete" />
              <ContextCard icon={IndianRupee} label="Revenue Today" value="₹2,84,000" color="text-primary" />
            </div>
          )}

          {activeTab === "drafts" && (
            <div className="space-y-3 animate-fade-in">
              <DraftCard
                title="Inventory Adjustment"
                detail="3 SKUs modified"
                status="Awaiting approval"
                icon={Package}
              />
              <DraftCard
                title="Invoice Batch"
                detail="62 invoices generated"
                status="Ready for review"
                icon={FileText}
              />
            </div>
          )}

          {activeTab === "warnings" && (
            <div className="space-y-3 animate-fade-in">
              <WarningCard
                icon={AlertTriangle}
                title="4 Shops at SLA Risk"
                description="Delivery window may be missed"
                severity="warning"
              />
              <WarningCard
                icon={Package}
                title="2 Low Stock SKUs"
                description="Below threshold in multiple zones"
                severity="warning"
              />
              <WarningCard
                icon={Users}
                title="1 Staff Over Capacity"
                description="Karthik V. exceeding stop limit"
                severity="destructive"
              />
            </div>
          )}

          {activeTab === "recent" && (
            <div className="space-y-0.5 animate-fade-in">
              {[
                { action: "Draft Created", time: "08:02", icon: FileText },
                { action: "Approved by Admin", time: "08:05", icon: CheckCircle },
                { action: "Shop reassigned", time: "09:15", icon: MapPin },
                { action: "Inventory adjusted", time: "10:22", icon: Package },
              ].map((a, i) => (
                <div key={a.time} className="flex items-start gap-3 py-2.5 group">
                  <div className="flex flex-col items-center">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                      <a.icon className="h-3.5 w-3.5" />
                    </div>
                    {i < 3 && <div className="w-px h-full bg-border mt-1 min-h-[12px]" />}
                  </div>
                  <div className="pt-0.5">
                    <p className="text-xs font-medium text-foreground">{a.action}</p>
                    <p className="text-[10px] text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ContextCard = ({ icon: Icon, label, value, color, subtitle }: { icon: any; label: string; value: string; color: string; subtitle?: string }) => (
  <div className="flex items-center gap-3 rounded-xl border border-border p-3.5 transition-all duration-200 hover:shadow-sm hover:border-border/80 cursor-default">
    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted ${color}`}>
      <Icon className="h-4.5 w-4.5" />
    </div>
    <div className="flex-1">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
      {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
    </div>
  </div>
);

const DraftCard = ({ title, detail, status, icon: Icon }: { title: string; detail: string; status: string; icon: any }) => {
  const [approved, setApproved] = useState(false);

  return (
    <div className="rounded-xl border border-border p-4 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-[11px] text-muted-foreground">{detail}</p>
          <div className="flex items-center gap-2 mt-2">
            {approved ? (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-success">
                <CheckCircle className="h-3 w-3" /> Approved
              </span>
            ) : (
              <>
                <span className="text-[10px] text-muted-foreground">{status}</span>
                <button
                  onClick={() => setApproved(true)}
                  className="ml-auto rounded-lg bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-sm"
                >
                  Approve
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const WarningCard = ({ icon: Icon, title, description, severity }: { icon: any; title: string; description: string; severity: "warning" | "destructive" }) => (
  <div className={`rounded-xl border p-3.5 transition-all duration-200 hover:shadow-sm ${
    severity === "destructive"
      ? "border-destructive/20 bg-destructive/5"
      : "border-warning/20 bg-warning/5"
  }`}>
    <div className="flex items-center gap-2 mb-1">
      <Icon className={`h-3.5 w-3.5 ${severity === "destructive" ? "text-destructive" : "text-warning"}`} />
      <span className="text-xs font-semibold text-foreground">{title}</span>
    </div>
    <p className="text-[11px] text-muted-foreground pl-5.5">{description}</p>
  </div>
);

export default CommandCenter;
