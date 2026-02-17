import { useState } from "react";
import { ArrowLeft, User, MapPin, TrendingUp } from "lucide-react";
import { staffList } from "@/data/mockData";

const Staff = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const staff = staffList.find((s) => s.id === selectedId);

  if (selectedId && staff) {
    return (
      <div className="space-y-5 animate-fade-in">
        <button onClick={() => setSelectedId(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Staff
        </button>

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{staff.name}</h2>
            <p className="text-sm text-muted-foreground">Performance: {staff.performance}%</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-lg">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Capacity</p>
            <p className="text-lg font-semibold text-foreground">{staff.capacity}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Stops Today</p>
            <p className="text-lg font-semibold text-foreground">{staff.stops}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Distance</p>
            <p className="text-lg font-semibold text-foreground">{staff.distance}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Today's Route Summary</h3>
          <div className="space-y-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-foreground">Stop {i + 1} – Zone {(i % 4) + 1}</span>
                <span className="ml-auto text-success font-medium">Delivered</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Capacity</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Stops Today</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Performance</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((s) => (
              <tr
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">{s.capacity}</td>
                <td className="px-4 py-3 text-right text-foreground">{s.stops}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${s.performance}%` }} />
                    </div>
                    <span className="text-foreground font-medium">{s.performance}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Staff;
