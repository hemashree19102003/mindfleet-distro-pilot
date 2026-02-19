import { useState } from 'react';
import { CheckCircle, Edit3, XCircle, HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import type { DraftCard as DraftCardType } from '../../store/types';
import { useDraftStore } from '../../store';
import StatusBadge from './StatusBadge';
import ReasonTagModal from './ReasonTagModal';
import ConfirmModal from './ConfirmModal';
import { toast } from 'sonner';

interface Props {
    draft: DraftCardType;
    compact?: boolean;
}

const DraftCard = ({ draft, compact = false }: Props) => {
    const [showPlanModal, setShowPlanModal] = useState(false);
    const { updateDraftStatus } = useDraftStore();

    const handleApprove = () => {
        updateDraftStatus(draft.id, 'APPROVED');
        toast.success(`Draft "${draft.title}" approved`);
    };

    const handleReject = (reason: string) => {
        updateDraftStatus(draft.id, 'REJECTED', reason);
        toast.error(`Draft "${draft.title}" rejected`);
    };

    const isPending = draft.status === 'DRAFT';
    const isApproved = draft.status === 'APPROVED';
    const isRejected = draft.status === 'REJECTED';

    const mockPlanDetails = {
        summary: { stops: 142, revenue: 425000, vehicles: 12, efficiency: 94 },
        routes: [
            { driver: "Karthik V.", stops: 14, area: "Anna Nagar", time: "6h 20m" },
            { driver: "Suresh K.", stops: 12, area: "T. Nagar", time: "5h 45m" },
            { driver: "Ramesh P.", stops: 15, area: "Velachery", time: "7h 10m" },
            { driver: "Priya M.", stops: 11, area: "Adyar", time: "5h 15m" },
            { driver: "Alex J.", stops: 13, area: "Mylapore", time: "6h 00m" },
        ]
    };

    if (compact) {
        return (
            <div className={`rounded-xl border p-4 transition-all duration-200 hover:shadow-sm ${isApproved ? 'border-green-500/20 bg-green-500/5' :
                isRejected ? 'border-red-500/20 bg-red-500/5' :
                    'border-purple-300/30 bg-purple-50/50'
                }`}>
                <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600 shrink-0">
                        <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-gray-900 truncate">{draft.title}</p>
                            <StatusBadge status={draft.status} />
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{draft.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                            {isPending && (
                                <>
                                    <button
                                        onClick={() => setShowConfirmApprove(true)}
                                        className="rounded-lg bg-purple-600 px-3 py-1 text-[10px] font-semibold text-white transition-all hover:bg-purple-700 hover:shadow-sm"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => setShowRejectModal(true)}
                                        className="rounded-lg border border-red-200 px-3 py-1 text-[10px] font-semibold text-red-500 transition-all hover:bg-red-50"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <ConfirmModal
                    open={showConfirmApprove}
                    title="Approve Draft"
                    description={`Are you sure you want to approve "${draft.title}"?`}
                    onConfirm={handleApprove}
                    onCancel={() => setShowConfirmApprove(false)}
                />
                <ReasonTagModal
                    open={showRejectModal}
                    title="Reject Draft"
                    onSubmit={handleReject}
                    onCancel={() => setShowRejectModal(false)}
                />
            </div>
        );
    }

    return (
        <div className={`rounded-2xl border-2 p-6 transition-all duration-300 ${isApproved
            ? 'border-green-500/40 bg-green-50 shadow-[0_0_24px_-6px_rgba(34,197,94,0.2)]'
            : isRejected
                ? 'border-red-300/40 bg-red-50'
                : 'border-purple-300/50 bg-purple-50/80 shadow-[0_0_20px_-4px_rgba(147,51,234,0.15)]'
            }`}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
                <Sparkles className="h-4 w-4 text-purple-600 shrink-0" />
                <h3 className="font-semibold text-gray-900 flex-1">{draft.title}</h3>
                <StatusBadge status={draft.status} />
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">{draft.description}</p>

            {/* Confidence */}
            <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-medium text-gray-500">Confidence</span>
                <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-700 transition-all duration-700"
                        style={{ width: `${draft.confidence}%` }}
                    />
                </div>
                <span className="text-sm font-bold text-purple-600">{draft.confidence}%</span>
            </div>

            {/* Why this? */}
            {draft.explanation && (
                <div className="mb-4">
                    <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className="flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                    >
                        <HelpCircle className="h-3.5 w-3.5" />
                        Why this?
                        {showExplanation ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                    {showExplanation && (
                        <div className="mt-2 rounded-xl bg-white/80 border border-purple-200 p-4 animate-in slide-in-from-top-2 duration-200">
                            <p className="text-xs text-gray-600 leading-relaxed">{draft.explanation}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Diff Viewer */}
            {draft.diff && (
                <div className="mb-4 rounded-xl border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-2 divide-x divide-gray-200">
                        <div className="p-3 bg-red-50">
                            <p className="text-[10px] font-semibold text-red-500 mb-1">BEFORE</p>
                            <pre className="text-xs text-gray-700 whitespace-pre-wrap">{JSON.stringify(draft.diff.before, null, 2)}</pre>
                        </div>
                        <div className="p-3 bg-green-50">
                            <p className="text-[10px] font-semibold text-green-600 mb-1">AFTER</p>
                            <pre className="text-xs text-gray-700 whitespace-pre-wrap">{JSON.stringify(draft.diff.after, null, 2)}</pre>
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            {isPending && (
                <div className="flex flex-wrap gap-2">
                    {draft.type === 'DISPATCH_PLAN' && (
                        <button
                            onClick={() => setShowPlanModal(true)}
                            className="flex items-center gap-1.5 rounded-xl border border-purple-300 bg-white px-5 py-2.5 text-sm font-medium text-purple-700 transition-all hover:bg-purple-50 hover:-translate-y-0.5"
                        >
                            <Edit3 className="h-3.5 w-3.5" /> View Plan
                        </button>
                    )}
                    <button
                        onClick={() => setShowConfirmApprove(true)}
                        className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-purple-700 hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                    </button>
                    <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:-translate-y-0.5">
                        <Edit3 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                        onClick={() => setShowRejectModal(true)}
                        className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:text-red-600 hover:bg-red-50"
                    >
                        <XCircle className="h-3.5 w-3.5" /> Reject
                    </button>
                </div>
            )}

            {/* Plan Preview Modal */}
            {showPlanModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPlanModal(false)} />
                    <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200 max-h-[80vh] flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Generated Dispatch Plan</h3>
                                <p className="text-sm text-gray-500">Draft Preview · 17 Feb 2025</p>
                            </div>
                            <button onClick={() => setShowPlanModal(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-4 gap-4 mb-6">
                                <div className="rounded-xl border border-purple-100 bg-purple-50 p-3 text-center">
                                    <p className="text-xs text-gray-500 uppercase">Stops</p>
                                    <p className="text-xl font-bold text-purple-700">{mockPlanDetails.summary.stops}</p>
                                </div>
                                <div className="rounded-xl border border-purple-100 bg-purple-50 p-3 text-center">
                                    <p className="text-xs text-gray-500 uppercase">Revenue</p>
                                    <p className="text-xl font-bold text-purple-700">₹{(mockPlanDetails.summary.revenue / 1000).toFixed(1)}k</p>
                                </div>
                                <div className="rounded-xl border border-purple-100 bg-purple-50 p-3 text-center">
                                    <p className="text-xs text-gray-500 uppercase">Vehicles</p>
                                    <p className="text-xl font-bold text-purple-700">{mockPlanDetails.summary.vehicles}</p>
                                </div>
                                <div className="rounded-xl border border-purple-100 bg-purple-50 p-3 text-center">
                                    <p className="text-xs text-gray-500 uppercase">Efficiency</p>
                                    <p className="text-xl font-bold text-purple-700">{mockPlanDetails.summary.efficiency}%</p>
                                </div>
                            </div>

                            {/* Routes List */}
                            <h4 className="font-semibold text-gray-900 mb-3">Proposed Routes</h4>
                            <div className="space-y-3">
                                {mockPlanDetails.routes.map((route, i) => (
                                    <div key={i} className="flex items-center justify-between rounded-xl border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold text-xs">
                                                {route.driver[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{route.driver}</p>
                                                <p className="text-xs text-gray-500">{route.area}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">{route.stops} stops</p>
                                            <p className="text-xs text-gray-500">{route.time}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="text-center text-xs text-gray-400 mt-2">
                                    + {mockPlanDetails.summary.vehicles - 5} more routes generated...
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50 rounded-b-2xl">
                            <button
                                onClick={() => setShowPlanModal(false)}
                                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Close Preview
                            </button>
                            <button
                                onClick={() => { setShowPlanModal(false); setShowConfirmApprove(true); }}
                                className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                            >
                                Approve Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                open={showConfirmApprove}
                title="Approve Draft"
                description={`Are you sure you want to approve "${draft.title}"? This action will be logged.`}
                onConfirm={handleApprove}
                onCancel={() => setShowConfirmApprove(false)}
            />
            <ReasonTagModal
                open={showRejectModal}
                title="Reject Draft"
                onSubmit={handleReject}
                onCancel={() => setShowRejectModal(false)}
            />
        </div>
    );
};

export default DraftCard;
