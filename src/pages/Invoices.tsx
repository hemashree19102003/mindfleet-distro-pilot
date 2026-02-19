import { useState, useMemo } from "react";
import { FileText, Search, IndianRupee, CreditCard, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useInvoiceStore, useDraftStore, useUserStore } from "@/store";
import StatusBadge from "@/components/shared/StatusBadge";
import ReasonTagModal from "@/components/shared/ReasonTagModal";
import ConfirmModal from "@/components/shared/ConfirmModal";
import EmptyState from "@/components/shared/EmptyState";
import { toast } from "sonner";
import { createDraftFromAI } from "@/data/generators";
import type { InvoiceStatus } from "@/store/types";

const Invoices = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | InvoiceStatus>("all");
  const [page, setPage] = useState(0);
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; invoiceId: string; shopName: string; outstanding: number } | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [reasonModal, setReasonModal] = useState(false);
  const [confirmFinalize, setConfirmFinalize] = useState<string | null>(null);
  const PAGE_SIZE = 15;

  const { invoices, updateInvoiceStatus } = useInvoiceStore();
  const { addDraft } = useDraftStore();
  const { currentUser } = useUserStore();

  const filtered = useMemo(() => {
    return invoices.filter(inv => {
      const matchSearch = inv.shopName.toLowerCase().includes(search.toLowerCase()) ||
        inv.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || inv.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [invoices, search, statusFilter]);

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  // Summary stats
  const totalRevenue = invoices.reduce((s, i) => s + i.total, 0);
  const totalPaid = invoices.reduce((s, i) => s + i.paid, 0);
  const totalOutstanding = invoices.reduce((s, i) => s + i.outstanding, 0);
  const overdueCount = invoices.filter(i => i.status === 'SENT' || i.status === 'PARTIAL').length;

  const handlePayment = (reason: string) => {
    if (!paymentModal) return;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0 || amount > paymentModal.outstanding) {
      toast.error("Invalid payment amount");
      return;
    }
    const draft = createDraftFromAI('INVOICE_UPDATE', currentUser.name);
    draft.description = `Record payment of ₹${amount.toLocaleString()} for ${paymentModal.shopName}`;
    draft.payload = { invoiceId: paymentModal.invoiceId, payment: amount, reason };
    addDraft(draft);
    toast.success("Payment draft created — approve to record");
    setPaymentModal(null);
    setPaymentAmount("");
    setReasonModal(false);
  };

  const statusColors: Record<InvoiceStatus, string> = {
    DRAFT: 'bg-gray-100 text-gray-600',
    SENT: 'bg-blue-100 text-blue-700',
    PARTIAL: 'bg-yellow-100 text-yellow-700',
    PAID: 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Invoices & Payments</h1>
          <p className="text-sm text-gray-500">{invoices.length} invoices</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Revenue", value: `₹${(totalRevenue / 100000).toFixed(1)}L`, icon: IndianRupee, color: "text-purple-600", bg: "bg-purple-0" },
          { label: "Collected", value: `₹${(totalPaid / 100000).toFixed(1)}L`, icon: CheckCircle, color: "text-purple-600", bg: "bg-purple-0" },
          { label: "Outstanding", value: `₹${(totalOutstanding / 100000).toFixed(1)}L`, icon: Clock, color: "text-purple-600", bg: "bg-purple-0" },
          { label: "Pending", value: overdueCount, icon: AlertTriangle, color: "text-purple-600", bg: "bg-purple-0" },
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

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 flex-1 min-w-[200px] w-full sm:w-auto">
          <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search invoices, shops…"
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
          />
        </div>
        <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden">
          {(['all', 'DRAFT', 'SENT', 'PARTIAL', 'PAID'] as const).map(f => (
            <button
              key={f}
              onClick={() => { setStatusFilter(f); setPage(0); }}
              className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${statusFilter === f ? 'bg-purple-600 text-white' : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {paged.length === 0 ? (
        <EmptyState icon={FileText} title="No invoices found" />
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm responsive-table">
              <thead>
                <tr className="border-b border-gray-100 bg-purple-50/50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Invoice</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Shop</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider hidden md:table-cell">Total</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider hidden md:table-cell">Paid</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Outstanding</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider hidden lg:table-cell">Due Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {paged.map((inv) => (
                  <tr key={inv.id} className="border-b border-gray-50 last:border-0 hover:bg-purple-50/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600" data-label="Invoice">{inv.id}</td>
                    <td className="px-4 py-3" data-label="Shop">
                      <p className="font-medium text-gray-900 text-sm">{inv.shopName}</p>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700 hidden md:table-cell" data-label="Total">
                      ₹{inv.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-green-600 font-medium hidden md:table-cell" data-label="Paid">
                      ₹{inv.paid.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right" data-label="Outstanding">
                      <span className={inv.outstanding > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>
                        ₹{inv.outstanding.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center" data-label="Status">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-gray-400 hidden lg:table-cell" data-label="Due">
                      {inv.dueDate}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {inv.status !== 'PAID' && inv.outstanding > 0 && (
                        <button
                          onClick={() => setPaymentModal({
                            open: true,
                            invoiceId: inv.id,
                            shopName: inv.shopName,
                            outstanding: inv.outstanding,
                          })}
                          className="flex items-center gap-1 rounded-lg bg-purple-100 px-3 py-1.5 text-xs font-semibold text-purple-700 transition-all hover:bg-purple-200 whitespace-nowrap"
                        >
                          <CreditCard className="h-3 w-3" /> Pay
                        </button>
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
          <p className="text-sm text-gray-500">{filtered.length} invoices</p>
          <div className="flex items-center gap-2">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 disabled:opacity-30 hover:border-purple-300 hover:text-purple-600 transition-colors">
              ← Prev
            </button>
            <span className="text-sm text-gray-500">{page + 1} / {totalPages}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 disabled:opacity-30 hover:border-purple-300 hover:text-purple-600 transition-colors">
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPaymentModal(null)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 mb-4">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Record Payment</h3>
              <p className="text-sm text-gray-500 mb-4">{paymentModal.shopName}</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Outstanding: ₹{paymentModal.outstanding.toLocaleString()}</label>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 focus-within:border-purple-400">
                    <span className="text-gray-400 text-sm">₹</span>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={e => setPaymentAmount(e.target.value)}
                      placeholder="Enter amount"
                      max={paymentModal.outstanding}
                      className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {[25, 50, 100].map(pct => (
                    <button
                      key={pct}
                      onClick={() => setPaymentAmount(String(Math.round(paymentModal.outstanding * pct / 100)))}
                      className="flex-1 rounded-lg border border-purple-200 bg-purple-50 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100 transition-colors"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
              <button onClick={() => setPaymentModal(null)}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => setReasonModal(true)}
                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                className="flex-1 rounded-xl purple-gradient py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Draft
              </button>
            </div>
          </div>
        </div>
      )}

      <ReasonTagModal
        open={reasonModal}
        title="Payment Reason"
        onSubmit={handlePayment}
        onCancel={() => setReasonModal(false)}
      />
    </div>
  );
};

export default Invoices;
