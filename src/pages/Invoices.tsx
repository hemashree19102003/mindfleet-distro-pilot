import { invoicesList } from "@/data/mockData";

const statusStyles = {
  Paid: "bg-success/10 text-success",
  Partial: "bg-warning/10 text-warning",
  Overdue: "bg-destructive/10 text-destructive",
};

const Invoices = () => {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Invoice #</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Shop</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Total</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Outstanding</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoicesList.map((inv) => (
              <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                <td className="px-4 py-3 font-medium text-foreground">{inv.id}</td>
                <td className="px-4 py-3 text-muted-foreground">{inv.shop}</td>
                <td className="px-4 py-3 text-right text-foreground">{inv.total}</td>
                <td className="px-4 py-3 text-right text-foreground">{inv.outstanding}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[inv.status]}`}>
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;
