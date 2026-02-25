import { AlertTriangle, Clock, MapPin, Search, RefreshCw, Filter } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import { VirtualizedTable } from "@/components/shared/VirtualizedTable";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

// Mock types based on Spec
export interface DeliveryRow {
    id: string;
    shopName: string;
    shopId: string;
    area: string;
    zone: string; // Added zone as per Spec
    staffName: string;
    staffId: string;
    status: 'PENDING' | 'DELIVERED' | 'FAILED' | 'SKIPPED'; // Updated status types
    eta: string;
    slaRisk: boolean;
}

interface DeliveryFilters {
    search: string;
    status: string;
    staffId: string;
    zone?: string;
}

interface Props {
    rows: DeliveryRow[];
    filters: DeliveryFilters;
    onChangeFilters: (filters: DeliveryFilters) => void;
    onOpenStop: (stopId: string) => void;
}

const DeliveryTable = ({ rows, filters, onChangeFilters, onOpenStop }: Props) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            {/* Filters Bar */}
            <div className="flex flex-wrap gap-3 p-1">
                <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 flex-1 min-w-[200px]">
                    <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => onChangeFilters({ ...filters, search: e.target.value })}
                        placeholder={t('searchDeliveriesPlaceholder')}
                        className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
                    />
                </div>

                <select
                    value={filters.status}
                    onChange={(e) => onChangeFilters({ ...filters, status: e.target.value })}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none cursor-pointer hover:border-purple-300 transition-colors"
                >
                    <option value="All">{t('allStatus')}</option>
                    <option value="PENDING">{t('pendingStatus')}</option>
                    <option value="DELIVERED">{t('deliveredStatus')}</option>
                    <option value="FAILED">{t('failedStatus')}</option>
                    <option value="SKIPPED">{t('skippedStatus')}</option>
                </select>

                {/* Additional filters can go here */}
            </div>

            {/* Virtualized Table */}
            <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm h-[600px]">
                <VirtualizedTable
                    items={rows}
                    height={600}
                    rowHeight={64}
                    header={
                        <div className="flex items-center px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 border-b border-gray-100">
                            <div className="w-16">{t('statusLabel')}</div>
                            <div className="flex-1 min-w-[200px]">{t('shopLocationLabel')}</div>
                            <div className="w-40">{t('assignedStaffLabel')}</div>
                            <div className="w-24 text-right">{t('etaLabel')}</div>
                            <div className="w-24 text-center">{t('riskLabel')}</div>
                            <div className="w-24 text-right pr-4">{t('action')}</div>
                        </div>
                    }
                    renderRow={(row) => (
                        <div
                            onClick={() => onOpenStop(row.id)}
                            className="flex items-center px-6 h-full border-b border-gray-50 hover:bg-purple-50/30 transition-colors cursor-pointer group"
                        >
                            <div className="w-16">
                                <StatusBadge status={row.status} size="sm" />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <p className="font-bold text-sm text-gray-900 group-hover:text-purple-600 transition-colors">{row.shopName}</p>
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5">
                                    <MapPin className="h-2.5 w-2.5" />
                                    <span>{row.area} · {row.zone}</span>
                                </div>
                            </div>
                            <div className="w-40">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-black text-purple-600">
                                        {row.staffName[0]}
                                    </div>
                                    <p className="text-xs font-medium text-gray-700">{row.staffName}</p>
                                </div>
                            </div>
                            <div className="w-24 text-right text-xs font-mono text-gray-500">
                                {row.eta}
                            </div>
                            <div className="w-24 text-center flex justify-center">
                                {row.slaRisk && (
                                    <div className="bg-red-50 text-red-500 p-1.5 rounded-lg" title={t('riskLabel')}>
                                        <AlertTriangle className="h-3.5 w-3.5" />
                                    </div>
                                )}
                            </div>
                            <div className="w-24 text-right pr-4">
                                <button className="text-[10px] font-bold text-gray-400 hover:text-purple-600 uppercase tracking-widest">
                                    {t('details')}
                                </button>
                            </div>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default DeliveryTable;

