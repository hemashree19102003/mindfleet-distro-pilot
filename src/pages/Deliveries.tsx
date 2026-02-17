import { Package } from "lucide-react";

const Deliveries = () => (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <Package className="h-12 w-12 text-muted-foreground/30 mb-3" />
    <h3 className="text-lg font-semibold text-foreground">Deliveries</h3>
    <p className="text-sm text-muted-foreground">Track all delivery statuses and history here.</p>
  </div>
);

export default Deliveries;
