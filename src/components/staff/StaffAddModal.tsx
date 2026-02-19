import { useState } from "react";
import { X, UserPlus, Phone, MapPin, Truck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useDraftStore, useUserStore } from "@/store";
import { createDraftFromAI } from "@/data/generators";

interface Props {
    onClose: () => void;
}

const ZONES = ['Zone A (Anna Nagar)', 'Zone B (Adyar)', 'Zone C (T. Nagar)', 'Zone D (Velachery)', 'Zone E (Mylapore)'];
const VEHICLES = ['Bike', 'Auto', 'Mini-Van', 'Tempo'] as const;

const StaffAddModal = ({ onClose }: Props) => {
    const { addDraft } = useDraftStore();
    const { currentUser } = useUserStore();

    const [form, setForm] = useState({
        name: '',
        phone: '',
        zone: ZONES[0],
        vehicle: VEHICLES[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name || !form.phone) {
            toast.error("Please fill in all required fields");
            return;
        }

        // Create the draft for internal decision tracking
        const draft = createDraftFromAI('ADD_STAFF', currentUser.name);
        draft.title = `Onboard: ${form.name}`;
        draft.description = `Pending onboarding for ${form.name} (${form.vehicle}) in ${form.zone}`;
        draft.payload = { ...form };

        addDraft(draft);

        toast.success(`Onboarding draft created for ${form.name}`, {
            description: "Approve in Decision Journal to commit to fleet"
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <form
                onSubmit={handleSubmit}
                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            >
                {/* Header */}
                <div className="purple-gradient p-6 text-white relative">
                    <Sparkles className="absolute top-4 right-4 h-12 w-12 opacity-10" />
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight">Add New Staff</h2>
                            <p className="text-purple-100 text-sm mt-1 opacity-90 font-medium">Register a new delivery partner</p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 pl-1">
                            <UserPlus className="h-3 w-3 text-purple-500" /> Full Name
                        </label>
                        <input
                            autoFocus
                            type="text"
                            required
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 outline-none transition-all placeholder:text-gray-300"
                            placeholder="Full name of delivery partner"
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 pl-1">
                            <Phone className="h-3 w-3 text-purple-500" /> WhatsApp / Phone
                        </label>
                        <input
                            type="tel"
                            required
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 outline-none transition-all placeholder:text-gray-300"
                            placeholder="+91 XXXXX XXXXX"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Zone */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 pl-1">
                                <MapPin className="h-3 w-3 text-purple-500" /> Zone
                            </label>
                            <select
                                value={form.zone}
                                onChange={e => setForm({ ...form, zone: e.target.value })}
                                className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 outline-none transition-all bg-white cursor-pointer"
                            >
                                {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                            </select>
                        </div>

                        {/* Vehicle */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 pl-1">
                                <Truck className="h-3 w-3 text-purple-500" /> Vehicle
                            </label>
                            <select
                                value={form.vehicle}
                                onChange={e => setForm({ ...form, vehicle: e.target.value as any })}
                                className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-4 py-3 text-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 outline-none transition-all bg-white cursor-pointer"
                            >
                                {VEHICLES.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all border border-transparent"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-4 rounded-2xl purple-gradient font-black text-[10px] uppercase tracking-widest text-white shadow-xl shadow-purple-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            Create Onboarding Draft
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default StaffAddModal;
