import { Map as MapIcon, MapPin, Truck } from "lucide-react";

interface MapStop { stop_id: string; lat: number; lng: number; label: string; status: string; }
interface RoutePolyline { staff_id: string; points: { lat: number; lng: number }[]; }

interface Props {
    routes: RoutePolyline[];
    stops: MapStop[];
    selectedStaffId?: string;
    onSelectStaff: (staff_id: string) => void;
    onSelectStop: (stop_id: string) => void;
}

const RouteMap = ({ routes, stops, selectedStaffId, onSelectStaff, onSelectStop }: Props) => {
    return (
        <div className="h-full w-full bg-gray-50 rounded-3xl border border-gray-100 relative overflow-hidden flex items-center justify-center">
            {/* Mock Map Background */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]" />

            {/* Mock Stops/Routes */}
            <div className="relative w-full h-full p-10">
                {stops.slice(0, 50).map((stop, i) => (
                    <button
                        key={stop.stop_id}
                        onClick={() => onSelectStop(stop.stop_id)}
                        className={`absolute h-3 w-3 rounded-full border border-white shadow-sm transition-transform hover:scale-150 z-10 ${stop.status === 'DELIVERED' ? 'bg-green-500' : 'bg-purple-500'
                            }`}
                        style={{
                            left: `${10 + (i * 7) % 80}%`,
                            top: `${15 + (i * i * 3) % 70}%`
                        }}
                        title={stop.label}
                    />
                ))}

                {/* Dummy Route Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                    <polyline
                        points="100,100 200,150 300,100 400,200 500,150"
                        fill="none"
                        stroke="url(#grad1)"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                    />
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#9333ea', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div className="absolute top-6 left-6 z-20 space-y-2">
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-purple-100 shadow-xl">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Map Controls</h4>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                            <div className="h-2.5 w-2.5 rounded-full bg-purple-500" /> Pending Shops
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                            <div className="h-2.5 w-2.5 rounded-full bg-green-500" /> Delivered
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                            <div className="h-2.5 w-2.5 rounded-full bg-red-500" /> Sla Risk
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-purple-100 shadow-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-purple-600" />
                        <div>
                            <p className="text-xs font-black text-gray-900">12 Staff Active</p>
                            <p className="text-[10px] text-gray-500">Live GPS tracking active</p>
                        </div>
                    </div>
                    <button className="px-5 py-2 rounded-xl bg-purple-600 text-white text-[10px] font-black hover:bg-purple-700 transition-colors">
                        CENTER ON FLEET
                    </button>
                </div>
            </div>

            {/* Role restriction layer if needed could be added here */}
        </div>
    );
};

export default RouteMap;
