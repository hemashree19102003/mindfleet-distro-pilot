import { BarChart3 } from "lucide-react";

const Insights = () => (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <BarChart3 className="h-12 w-12 text-muted-foreground/30 mb-3" />
    <h3 className="text-lg font-semibold text-foreground">Insights</h3>
    <p className="text-sm text-muted-foreground">Analytics and reporting dashboard coming soon.</p>
  </div>
);

export default Insights;
