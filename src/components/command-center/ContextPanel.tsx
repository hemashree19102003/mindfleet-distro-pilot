import { ComponentType } from "react";
import {
    Sparkles, FileText, Activity, IndianRupee, Users,
    MapPin, AlertTriangle, CheckCircle, TrendingUp, Package
} from "lucide-react";
import { DraftCard as DraftCardType } from "@/store/types";
import StatusBadge from "@/components/shared/StatusBadge";



interface Props {
    activeTab: 'today' | 'drafts' | 'dispatch' | 'warnings' | 'recent' | 'history';
    onTabChange: (tab: any) => void;
    drafts: DraftCardType[];
}

const ContextPanel = ({ activeTab, onTabChange, drafts }: Props) => {
    const pendingDrafts = drafts.filter(d => d.status === 'DRAFT');

    return (
        <div className="flex bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-sm w-full lg:w-72 xl:w-80 shrink-0 flex-col h-64 lg:h-auto lg:min-h-0">
            {/* Header */}
            <div className="px-5 pt-5 pb-2 shrink-0">
                <h3 className="text-sm font-semibold text-gray-900">Context Intelligence</h3>
                <p className="text-[11px] text-gray-500">Real-time operational overview</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-purple-100 mx-4 shrink-0 overflow-x-auto scrollbar-hide">
                {(["today", "drafts", "dispatch", "warnings", "history"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={`flex-1 px-3 py-2.5 text-[11px] font-medium whitespace-nowrap transition-all relative ${activeTab === tab
                            ? "text-purple-600"
                            : "text-gray-400 hover:text-gray-600"
                            }`}
                    >
                        {tab === "dispatch" ? "Active Dispatch" : tab === "history" ? "Chat History" : tab === "warnings" ? "Alerts" : tab}
                        {tab === "drafts" && pendingDrafts.length > 0 && (
                            <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[9px] font-bold text-white">
                                {pendingDrafts.length}
                            </span>
                        )}
                        {activeTab === tab && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeTab === "today" && (
                    <div className="space-y-3 animate-fade-in">
                        <ContextCard icon={Sparkles} label="Active Dispatch" value="1" color="text-purple-600" bg="bg-purple-0" />
                        <ContextCard icon={FileText} label="Pending Drafts" value={String(pendingDrafts.length)} color="text-purple-600" bg="bg-yellow-0" />
                        <ContextCard icon={Activity} label="Deliveries" value="312 / 428" color="text-green-600" bg="bg-green-0" subtitle="72.9% complete" />
                        <ContextCard icon={IndianRupee} label="Revenue Today" value="₹2,84,000" color="text-purple-700" bg="bg-purple-0" />
                        <ContextCard icon={Users} label="Staff Active" value="13 / 15" color="text-blue-600" bg="bg-blue-0" />
                        <ContextCard icon={MapPin} label="Shops Covered" value="100" color="text-green-600" bg="bg-green-0" />
                    </div>
                )}

                {/* ... Other tabs logic moved from CommandCenter.tsx ... */}
                {activeTab === "dispatch" && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-purple-600 uppercase">Current Run</span>
                                <StatusBadge status="IN_PROGRESS" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500">Stops Covered</span>
                                    <span className="font-semibold text-gray-900">312 / 428</span>
                                </div>
                                <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '72%' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "drafts" && (
                    <div className="space-y-3 animate-fade-in">
                        {drafts.slice(0, 5).map(draft => (
                            <div key={draft.id} className="rounded-xl border border-purple-100 p-3 hover:border-purple-200 transition-colors cursor-pointer" onClick={() => { }}>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-xs font-semibold text-gray-800 flex-1 truncate">{draft.title}</p>
                                    <StatusBadge status={draft.status} />
                                </div>
                                <p className="text-[11px] text-gray-500 truncate">{draft.description}</p>
                                <p className="text-[10px] text-purple-500 mt-1">{draft.confidence}% confidence</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "warnings" && (
                    <div className="space-y-3 animate-fade-in">
                        <WarningCard icon={AlertTriangle} title="4 Shops at SLA Risk" description="Delivery window may be missed" severity="warning" />
                        <WarningCard icon={Package} title="2 Low Stock SKUs" description="Milk 500ml & Bread below threshold" severity="warning" />
                        <WarningCard icon={Users} title="1 Staff Over Capacity" description="Karthik V. exceeding stop limit" severity="destructive" />
                    </div>
                )}

                {activeTab === "recent" && (
                    <div className="space-y-0.5 animate-fade-in">
                        {[
                            { action: "Draft Created", time: "08:02", icon: FileText },
                            { action: "Approved by Admin", time: "08:05", icon: CheckCircle },
                            { action: "Shop reassigned", time: "09:15", icon: MapPin },
                        ].map((a, i, arr) => (
                            <div key={a.time} className="flex items-start gap-3 py-2.5 group">
                                <div className="flex flex-col items-center">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-500 group-hover:bg-purple-100 transition-colors">
                                        <a.icon className="h-3.5 w-3.5" />
                                    </div>
                                    {i < arr.length - 1 && <div className="w-px h-full bg-purple-100 mt-1 min-h-[12px]" />}
                                </div>
                                <div className="pt-0.5">
                                    <p className="text-xs font-medium text-gray-800">{a.action}</p>
                                    <p className="text-[10px] text-gray-400">{a.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "history" && (
                    <div className="space-y-3 animate-fade-in">
                        {[
                            { title: "New Staff Onboarding", time: "Just now", items: "1 action" },
                            { title: "Inventory Adjustment", time: "2h ago", items: "3 updates" },
                            { title: "Dispatch Plan Approval", time: "Yesterday", items: "142 stops" },
                        ].map((h, i) => (
                            <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors cursor-pointer group">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-900">{h.title}</p>
                                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                        <span>{h.time}</span>
                                        <span>•</span>
                                        <span>{h.items}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const ContextCard = ({ icon: Icon, label, value, color, bg, subtitle }: {
    icon: any; label: string; value: string; color: string; bg: string; subtitle?: string;
}) => (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-3.5 transition-all hover:shadow-sm hover:border-purple-100 cursor-default">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color} shrink-0`}>
            <Icon className="h-4.5 w-4.5" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[11px] text-gray-500">{label}</p>
            <p className="text-sm font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-[10px] text-gray-400">{subtitle}</p>}
        </div>
    </div>
);

const WarningCard = ({ icon: Icon, title, description, severity }: {
    icon: any; title: string; description: string; severity: "warning" | "destructive";
}) => (
    <div className={`rounded-xl border p-3.5 transition-all hover:shadow-sm ${severity === "destructive" ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50"
        }`}>
        <div className="flex items-center gap-2 mb-1">
            <Icon className={`h-3.5 w-3.5 shrink-0 ${severity === "destructive" ? "text-red-500" : "text-yellow-600"}`} />
            <span className="text-xs font-semibold text-gray-800">{title}</span>
        </div>
        <p className="text-[11px] text-gray-500 pl-5.5">{description}</p>
    </div>
);

export default ContextPanel;
