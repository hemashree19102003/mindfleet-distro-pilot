import { useRef, useState, useEffect } from "react";
import { Users, Phone, Truck, MapPin } from "lucide-react";
import { Staff, DispatchPlan } from "@/store/types";
import StatusBadge from "@/components/shared/StatusBadge";

interface Props {
    staff: Staff[];
    selectedStaffId: string | null;
    onSelect: (id: string) => void;
    plan: DispatchPlan;
}

const StaffList = ({ staff, selectedStaffId, onSelect, plan }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                setScrollTop(containerRef.current.scrollTop);
            }
        };
        const node = containerRef.current;
        if (node) {
            node.addEventListener('scroll', handleScroll);
            return () => node.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const rowHeight = 145; // Approx card height + gap
    const totalHeight = staff.length * rowHeight;

    // Simple virtualization logic
    const containerHeight = 600;
    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 2);
    const endIndex = Math.min(staff.length - 1, Math.floor((scrollTop + containerHeight) / rowHeight) + 2);

    const visibleItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
        visibleItems.push({ index: i, data: staff[i] });
    }

    return (
        <div
            ref={containerRef}
            className="h-[600px] overflow-y-auto pr-2 scrollbar-hide relative"
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                {visibleItems.map(({ index, data: s }) => {
                    const assignment = plan.assignments.find(a => a.staffId === s.id);
                    const shopCount = assignment?.shopIds.length || 0;
                    const utilization = Math.round((shopCount / s.capacity) * 100);

                    return (
                        <div
                            key={s.id}
                            style={{
                                position: 'absolute',
                                top: index * rowHeight,
                                left: 0,
                                width: '100%',
                                height: '135px',
                            }}
                        >
                            <div
                                onClick={() => onSelect(s.id)}
                                className={`rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md h-full ${selectedStaffId === s.id
                                        ? 'border-purple-400 bg-purple-50 shadow-sm'
                                        : 'border-gray-100 bg-white hover:border-purple-200'
                                    }`}
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 h-full">
                                    <div className="flex items-center gap-4 w-full sm:w-auto h-full">
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-full text-white text-lg font-bold shrink-0 ${s.status !== 'Active' ? 'bg-gray-300' : 'purple-gradient'}`}>
                                            {s.name[0]}
                                        </div>
                                        {/* Mobile header */}
                                        <div className="flex-1 min-w-0 sm:hidden">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-semibold text-gray-900">{s.name}</p>
                                                <StatusBadge status={s.status} size="sm" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Desktop Info */}
                                    <div className="flex-1 min-w-0 w-full hidden sm:block">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <p className="font-bold text-gray-900 text-sm">{s.name}</p>
                                            <StatusBadge status={s.status} size="xs" />
                                            {s.risk && <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700 uppercase tracking-wide">Risk</span>}
                                        </div>

                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 font-medium">
                                            <span className="flex items-center gap-1"><Truck className="h-3 w-3 text-purple-400" />{s.vehicle}</span>
                                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-purple-400" />{s.zone}</span>
                                            <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-purple-400" />{s.phone}</span>
                                        </div>

                                        <div className="mt-2 flex items-center gap-2 w-full max-w-[200px]">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase w-12">Perf.</span>
                                            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full purple-gradient"
                                                    style={{ width: `${s.performance}%` }}
                                                />
                                            </div>
                                            <span className="text-[9px] font-bold text-purple-600">{s.performance}%</span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex w-full sm:w-auto sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-1 shrink-0 mt-auto sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100 h-full">
                                        <p className="text-sm font-black text-gray-900">{shopCount} <span className="text-[10px] text-gray-400 font-bold uppercase">Shops</span></p>
                                        <p className="text-[10px] font-bold text-gray-400">{s.distance}</p>
                                        <div className="flex items-center gap-2 mt-auto sm:mt-1">
                                            <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${utilization > 90 ? 'bg-red-500' : utilization > 70 ? 'bg-orange-400' : 'bg-green-500'}`}
                                                    style={{ width: `${Math.min(100, utilization)}%` }}
                                                />
                                            </div>
                                            <span className="text-[9px] font-bold text-gray-400">{utilization}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StaffList;
