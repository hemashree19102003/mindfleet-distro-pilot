import { Store, User, Phone, MapPin, Calendar, Clock, AlertTriangle, CheckCircle, TrendingUp, Search } from "lucide-react";
import StatusBadge from "@/components/shared/StatusBadge";
import { VirtualizedTable } from "@/components/shared/VirtualizedTable";
import { useState } from "react";
import { useShopStore } from "@/store"; // Assuming you have this
import { Shop } from "@/store/types"; // Assuming this type exists

interface Props {
    shops: Shop[];
    onOpenShop: (shopId: string) => void;
    onFixGeo: (shopId: string) => void;
}

const ShopTable = ({ shops, onOpenShop, onFixGeo }: Props) => {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm h-[600px]">
            <VirtualizedTable
                items={shops}
                height={600}
                rowHeight={72}
                header={
                    <div className="flex items-center px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50 border-b border-gray-100">
                        <div className="w-10"></div>
                        <div className="flex-1 min-w-[200px]">Shop Details</div>
                        <div className="w-32">Location</div>
                        <div className="w-32">Geo Status</div>
                        <div className="w-32 text-right">Outstanding</div>
                        <div className="w-24 text-right pr-4">Action</div>
                    </div>
                }
                renderRow={(shop) => (
                    <div
                        onClick={() => onOpenShop(shop.id)}
                        className="flex items-center px-6 h-full border-b border-gray-50 hover:bg-purple-50/30 transition-colors cursor-pointer group"
                    >
                        <div className="w-10">
                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                                <Store className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <p className="font-bold text-sm text-gray-900 group-hover:text-purple-600 transition-colors">{shop.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{shop.id.split('-')[1]} • +91 999 000 0000</p>
                        </div>
                        <div className="w-32 text-xs font-medium text-gray-600">
                            {shop.area}
                        </div>
                        <div className="w-32">
                            {shop.lat ? (
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md inline-block">
                                    <CheckCircle className="h-3 w-3" /> VERIFIED
                                </div>
                            ) : (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onFixGeo(shop.id); }}
                                    className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md hover:bg-red-100 transition-colors animate-pulse"
                                >
                                    <AlertTriangle className="h-3 w-3" /> MISSING
                                </button>
                            )}
                        </div>
                        <div className="w-32 text-right font-mono text-xs font-bold text-gray-700">
                            ₹{shop.balance.toLocaleString()}
                        </div>
                        <div className="w-24 text-right pr-4">
                            <button className="text-[10px] font-bold text-gray-400 hover:text-purple-600 uppercase tracking-widest group-hover:underline">
                                PROFILE
                            </button>
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default ShopTable;
