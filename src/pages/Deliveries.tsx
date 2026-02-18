import { MapPin, CheckCircle, Package, Navigation } from "lucide-react";
import { useStaffStore, useDispatchStore, useShopStore, useUserStore } from "@/store";
import RoleGuard from "@/components/shared/RoleGuard";
import { toast } from "sonner";

const Deliveries = () => {
  const { currentUser } = useUserStore();
  const { staff } = useStaffStore();
  const { plan } = useDispatchStore();
  const { shops } = useShopStore();

  // For STAFF role, find their own assignment
  const myStaff = staff.find(s => s.name === currentUser.name) || staff[0];
  const myAssignment = plan.assignments.find(a => a.staffId === myStaff.id);
  const myShops = myAssignment ? shops.filter(sh => myAssignment.shopIds.includes(sh.id)) : shops.slice(0, 8);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Route</h1>
        <p className="text-sm text-gray-500">{myShops.length} stops today</p>
      </div>

      {/* Route stops */}
      <div className="space-y-3">
        {myShops.slice(0, 15).map((shop, i) => (
          <div key={shop.id} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 hover:border-purple-200 transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-full purple-gradient text-white text-sm font-bold shrink-0">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{shop.name}</p>
              <p className="text-xs text-gray-500">{shop.area} · {shop.cadence}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toast.success(`Navigating to ${shop.name}`)}
                className="flex items-center gap-1 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100 transition-colors"
              >
                <Navigation className="h-3 w-3" /> Navigate
              </button>
              <button
                onClick={() => toast.success(`${shop.name} marked as delivered`)}
                className="flex items-center gap-1 rounded-lg purple-gradient px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-all"
              >
                <CheckCircle className="h-3 w-3" /> Delivered
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Deliveries;
