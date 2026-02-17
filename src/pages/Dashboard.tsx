import { Truck, Package, AlertTriangle, Boxes, Users, IndianRupee } from "lucide-react";

const cards = [
  {
    title: "Dispatch Status",
    icon: Truck,
    items: [
      { label: "Planned", value: "1" },
      { label: "Approved", value: "1" },
      { label: "In Progress", value: "1" },
    ],
  },
  {
    title: "Delivery Progress",
    icon: Package,
    highlight: true,
    items: [{ label: "Delivered", value: "312 / 428" }],
    progress: 73,
  },
  {
    title: "SLA Risk",
    icon: AlertTriangle,
    warn: true,
    items: [{ label: "High Risk Shops", value: "4" }],
  },
  {
    title: "Inventory Alerts",
    icon: Boxes,
    warn: true,
    items: [{ label: "Low Stock SKUs", value: "2" }],
  },
  {
    title: "Staff Utilization",
    icon: Users,
    items: [
      { label: "Avg Stops", value: "36" },
      { label: "Max", value: "42" },
    ],
  },
  {
    title: "Revenue Today",
    icon: IndianRupee,
    items: [{ label: "Collections", value: "₹2,84,000" }],
  },
];

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border border-border bg-card p-5 card-hover cursor-pointer animate-fade-in"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.warn ? "bg-warning/10" : "bg-primary/10"}`}>
              <card.icon className={`h-4 w-4 ${card.warn ? "text-warning" : "text-primary"}`} />
            </div>
            <h3 className="text-sm font-semibold text-foreground">{card.title}</h3>
          </div>

          <div className="space-y-2">
            {card.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className={`text-lg font-bold ${card.warn ? "text-warning" : "text-foreground"}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {card.progress !== undefined && (
            <div className="mt-3">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${card.progress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{card.progress}% complete</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
