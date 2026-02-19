import { ChevronRight, ArrowRight } from "lucide-react";

interface Props {
    before: any;
    after: any;
    mode: 'INLINE' | 'SIDE_BY_SIDE';
}

const DiffViewer = ({ before, after, mode }: Props) => {
    if (mode === 'SIDE_BY_SIDE') {
        return (
            <div className="grid grid-cols-2 gap-4 rounded-3xl border border-gray-100 overflow-hidden bg-white shadow-sm">
                <div className="p-6 bg-red-50/50">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest">Original Plan</h4>
                        <span className="text-[9px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">BEFORE</span>
                    </div>
                    <pre className="text-[11px] font-mono text-gray-600 whitespace-pre-wrap leading-relaxed">
                        {JSON.stringify(before, null, 2)}
                    </pre>
                </div>
                <div className="p-6 bg-green-50/50">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] font-black text-green-600 uppercase tracking-widest">Optimized Plan</h4>
                        <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">AFTER</span>
                    </div>
                    <pre className="text-[11px] font-mono text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {JSON.stringify(after, null, 2)}
                    </pre>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Changes Summary</h4>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                    <span className="text-red-500 line-through">Before</span>
                    <ChevronRight className="h-3 w-3 text-gray-400" />
                    <span className="text-green-600">After</span>
                </div>
            </div>
            <div className="space-y-3">
                {/* Mocked summary logic */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <p className="text-xs text-gray-700 flex-1">
                        Moved <span className="font-bold">Sri Lakshmi Store</span> from <span className="text-red-500">Ravi</span> to <span className="text-green-600 font-bold">Suresh</span>
                    </p>
                    <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    <p className="text-xs text-gray-700 flex-1">
                        Stops count for <span className="font-bold">Karthik V.</span>: <span className="text-red-500">48</span> → <span className="text-green-600 font-bold">42</span>
                    </p>
                    <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                </div>
            </div>
        </div>
    );
};

export default DiffViewer;
