import { useState, useMemo } from "react";
import {
  FileText, Search, Filter, IndianRupee, Download,
  CreditCard, Clock, CheckCircle, AlertTriangle, Sparkles,
  Calendar, MoreVertical, ChevronRight
} from "lucide-react";
import { useInvoiceStore, useUserStore } from "@/store";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";

const Invoices = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [paymentModal, setPaymentModal] = useState({ open: false, invoiceId: "" });

  const { invoices } = useInvoiceStore();
  const { currentUser } = useUserStore();
  const { t } = useTranslation();

  const filtered = useMemo(() => {
    return invoices.filter(i => {
      const matchSearch = i.id.toLowerCase().includes(search.toLowerCase()) ||
        i.shopName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || i.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [invoices, search, statusFilter]);

  const selectedInvoiceData = selectedInvoice ? invoices.find(i => i.id === selectedInvoice) : null;

  if (selectedInvoiceData) {
    return (
      <div className="space-y-6 animate-fade-in pb-10">
        <button
          onClick={() => setSelectedInvoice(null)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-purple-600 transition-colors"
        >
          ← {t('backToInvoiceList')}
        </button>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
              <FileText className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t('invoice')} {selectedInvoiceData.id}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium text-purple-600">{selectedInvoiceData.shopName}</span>
                <span>•</span>
                <span>{t('issued')}: {selectedInvoiceData.createdAt}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <StatusBadge status={selectedInvoiceData.status} size="md" />
            <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
              <Download className="h-4 w-4" /> {t('downloadPdf')}
            </button>
            {selectedInvoiceData.status !== 'PAID' && (
              <button
                onClick={() => {
                  setPaymentModal({ open: true, invoiceId: selectedInvoiceData.id });
                }}
                className="rounded-xl purple-gradient px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90"
              >
                {t('recordPayment')}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
              <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('itemizedBreakdown')}</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-600">{t('skuName')}</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-center">{t('qty')}</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-right">{t('unitPrice')}</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-right">{t('total')}</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoiceData.items.map((item, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0">
                      <td className="px-4 py-3 text-gray-900 font-medium">{item.skuName}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{item.qty}</td>
                      <td className="px-4 py-3 text-right text-gray-600">₹{item.unit_price}</td>
                      <td className="px-4 py-3 text-right text-gray-900 font-bold">₹{item.line_total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-purple-50/50 font-bold text-lg">
                    <td colSpan={3} className="px-4 py-4 text-right text-gray-600">{t('grandTotal')}</td>
                    <td className="px-4 py-4 text-right text-purple-700">₹{selectedInvoiceData.total.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="rounded-xl border border-purple-100 bg-purple-50/30 p-4 ai-glow">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <h4 className="text-sm font-bold text-purple-900">{t('invoiceInsights')}</h4>
              </div>
              <p className="text-xs text-purple-800 leading-relaxed">
                {t('invoiceAutoGenerated')}
                {" "}{t('ownerPrefersDigital')}
                <span className="block mt-1 font-semibold underline cursor-pointer">{t('viewDispatchEvidence')} →</span>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('paymentSummary')}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">{t('totalAmount')}</span>
                  <span className="font-semibold text-gray-900">₹{selectedInvoiceData.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">{t('paidAmount')}</span>
                  <span className="font-semibold text-green-600">₹{selectedInvoiceData.paid.toLocaleString()}</span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900">{t('outstanding')}</span>
                  <span className="text-sm font-bold text-red-600">₹{selectedInvoiceData.outstanding.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {paymentModal.open && (
          <PaymentModal
            invoice={selectedInvoiceData}
            onClose={() => setPaymentModal({ open: false, invoiceId: "" })}
            t={t}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-10">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">{t('invoicesAndPayments')}</h1>
          <p className="text-sm text-gray-500">Managing {invoices.length} invoices · ₹8.2L outstanding</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button className="flex h-10 items-center gap-2 rounded-xl border border-purple-100 bg-white px-4 text-xs font-bold text-gray-600 hover:bg-purple-50 transition-all">
            <Download className="h-4 w-4" /> {t('reports')}
          </button>
          <button className="flex h-10 items-center gap-2 rounded-xl purple-gradient px-4 text-xs font-bold text-white shadow-lg shadow-purple-200 hover:opacity-90 transition-all">
            <Sparkles className="h-4 w-4" /> {t('generateBatch')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: t('totalRevenue'), value: "₹24.5L", icon: IndianRupee, color: "text-purple-600", bg: "bg-purple-50" },
          { label: t('paid'), value: "₹16.3L", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
          { label: t('outstanding'), value: "₹8.2L", icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: t('overdue'), value: "14", icon: Clock, color: "text-red-500", bg: "bg-red-50" },
        ].map(item => (
          <div key={item.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg} ${item.color} mb-3`}>
              <item.icon className="h-5 w-5" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</p>
            <p className="text-2xl font-black text-gray-900 leading-none mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 flex-1 min-w-[200px] hover:border-purple-300 transition-all focus-within:border-purple-400 focus-within:shadow-lg focus-within:shadow-purple-50">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('searchInvoice')}
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
          />
        </div>
        <div className="flex rounded-2xl border border-gray-200 bg-white overflow-hidden p-1">
          {["All", "DRAFT", "SENT", "PARTIAL", "PAID"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === s ? 'purple-gradient text-white shadow-md shadow-purple-100' : 'text-gray-400 hover:text-gray-700'}`}
            >
              {s === 'All' ? t('allInvoices') : s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-left">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('invoiceId')}</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('shopDetails')}</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('total')}</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('paid')}</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('outstanding')}</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('status')}</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest w-16"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv.id)}
                  className="border-b border-gray-50 last:border-0 hover:bg-purple-50/30 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 text-purple-600 font-black">#{inv.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{inv.shopName}</p>
                    <p className="text-[10px] text-gray-400">ID: {inv.shopId}</p>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">₹{inv.total.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-bold text-green-600">₹{inv.paid.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-black text-red-500">₹{inv.outstanding.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-purple-400 group-hover:translate-x-1 transition-all mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <EmptyState icon={FileText} title={t('noInvoicesFound')} />
          </div>
        )}
      </div>

      {paymentModal.open && (
        <PaymentModal
          invoice={invoices.find(i => i.id === paymentModal.invoiceId)!}
          onClose={() => setPaymentModal({ open: false, invoiceId: "" })}
          t={t}
        />
      )}
    </div>
  );
};

const PaymentModal = ({ invoice, onClose, t }: { invoice: any, onClose: () => void, t: any }) => {
  const [amount, setAmount] = useState(invoice.outstanding);
  const [method, setMethod] = useState("Cash");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > invoice.outstanding) {
      toast.error("Amount cannot exceed outstanding balance!");
      return;
    }
    toast.success(`Payment of ₹${amount} recorded via ${method} for ${invoice.shopName}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">{t('recordPayment')}</h2>
            <p className="text-xs text-gray-500">Inv #{invoice.id} · {invoice.shopName}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">{t('paymentMethod')}</label>
            <div className="grid grid-cols-3 gap-2">
              {["Cash", "UPI", "Bank"].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`py-3 rounded-xl border text-xs font-bold transition-all ${method === m ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">{t('amount')} ({t('outstanding')} ₹{invoice.outstanding.toLocaleString()})</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-400 font-bold">₹</span>
              <input
                type="number"
                max={invoice.outstanding}
                className="w-full h-12 rounded-xl border border-gray-100 bg-gray-50 pl-8 pr-4 text-sm font-bold outline-none focus:border-purple-400 focus:bg-white"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl border border-gray-100 text-sm font-bold text-gray-400 hover:bg-gray-50 transition-all font-black uppercase tracking-widest"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="flex-1 h-12 rounded-xl purple-gradient text-sm font-bold text-white shadow-lg shadow-purple-200 transition-all hover:opacity-90 active:scale-95 font-black uppercase tracking-widest"
          >
            {t('confirm')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Invoices;
