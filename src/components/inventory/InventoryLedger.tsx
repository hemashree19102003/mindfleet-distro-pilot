import { InventoryBatch } from "@/store/types";
import { VirtualizedTable } from "@/components/shared/VirtualizedTable";
import { History } from "lucide-react";

interface Props {
    batches: InventoryBatch[];
}

const InventoryLedger = ({ batches }: Props) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-purple-600" />
                    <h2 className="text-lg font-bold text-gray-900">FIFO Batch Ledger</h2>
                </div>
                <button className="text-[10px] font-black text-purple-600 uppercase tracking-widest hover:underline">Download full ledger</button>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
                <VirtualizedTable
                    items={batches}
                    height={400}
                    rowHeight={60}
                    header={
                        <div className="flex items-center px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 border-b border-gray-100">
                            <div className="w-32">Batch ID</div>
                            <div className="flex-1 text-right pr-10">Quantity</div>
                            <div className="w-40">Expiry Date</div>
                            <div className="w-32 text-right">Unit Price</div>
                        </div>
                    }
                    renderRow={(batch) => {
                        const expiry = new Date(batch.expiryDate);
                        const isExpiring = (expiry.getTime() - new Date(2025, 1, 1).getTime()) < (7 * 86400000); // Mock current date
                        return (
                            <div className="flex items-center px-6 h-full border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <div className="w-32 font-mono text-[10px] font-bold text-gray-500">{batch.batchId}</div>
                                <div className="flex-1 text-right pr-10 font-black text-gray-900">{batch.quantity} <span className="text-[9px] text-gray-400">units</span></div>
                                <div className="w-40 text-xs">
                                    <span className={`font-bold ${isExpiring ? 'text-red-500' : 'text-gray-600'}`}>
                                        {batch.expiryDate}
                                        {isExpiring && <span className="ml-2 text-[9px] bg-red-50 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">SOON</span>}
                                    </span>
                                </div>
                                <div className="w-32 text-right font-bold text-gray-900">₹{batch.unitPrice}</div>
                            </div>
                        );
                    }}
                />
            </div>
        </div>
    );
};

export default InventoryLedger;
