import type { DraftStatus, InvoiceStatus } from '../../store/types';

type Status = DraftStatus | InvoiceStatus | 'Active' | 'On Leave' | 'Inactive' | 'Low Stock' | 'In Stock';

const statusConfig: Record<string, { label: string; className: string }> = {
    DRAFT: { label: 'Draft', className: 'bg-gray-100 text-gray-600 border-gray-200' },
    APPROVED: { label: 'Approved', className: 'bg-green-100 text-green-700 border-green-200' },
    IN_PROGRESS: { label: 'In Progress', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    COMPLETED: { label: 'Completed', className: 'bg-purple-100 text-purple-700 border-purple-200' },
    REJECTED: { label: 'Rejected', className: 'bg-red-100 text-red-600 border-red-200' },
    SENT: { label: 'Sent', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    PARTIAL: { label: 'Partial', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    PAID: { label: 'Paid', className: 'bg-green-100 text-green-700 border-green-200' },
    Active: { label: 'Active', className: 'bg-green-100 text-green-700 border-green-200' },
    'On Leave': { label: 'On Leave', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    Inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-500 border-gray-200' },
    'Low Stock': { label: 'Low Stock', className: 'bg-red-100 text-red-600 border-red-200' },
    'In Stock': { label: 'In Stock', className: 'bg-green-100 text-green-700 border-green-200' },
};

interface Props {
    status: Status;
    size?: 'sm' | 'md';
}

const StatusBadge = ({ status, size = 'sm' }: Props) => {
    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-600 border-gray-200' };
    return (
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 font-semibold ${size === 'sm' ? 'text-[10px]' : 'text-xs'
            } ${config.className}`}>
            {config.label}
        </span>
    );
};

export default StatusBadge;
