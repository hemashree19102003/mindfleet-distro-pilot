import type { DraftStatus, InvoiceStatus, DispatchPlanStatus } from '../../store/types';

type Status = DraftStatus | InvoiceStatus | DispatchPlanStatus | 'Active' | 'On Leave' | 'Inactive' | 'Low Stock' | 'In Stock' | 'PENDING' | 'DELIVERED' | 'FAILED' | 'SKIPPED';

const statusConfig: Record<string, { label: string; className: string }> = {
    DRAFT: { label: 'Draft', className: 'bg-gray-100 text-gray-600 border-gray-200' },
    APPROVED: { label: 'Approved', className: 'bg-green-100 text-green-700 border-green-200' },
    PLANNED: { label: 'Planned', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    IN_PROGRESS: { label: 'In Progress', className: 'bg-purple-100 text-purple-700 border-purple-200' },
    COMPLETED: { label: 'Completed', className: 'bg-green-100 text-green-700 border-green-200' },
    REJECTED: { label: 'Rejected', className: 'bg-red-100 text-red-600 border-red-200' },
    EXECUTED: { label: 'Executed', className: 'bg-gray-100 text-gray-500 border-gray-200' },
    SENT: { label: 'Sent', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    PARTIAL: { label: 'Partial', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    PAID: { label: 'Paid', className: 'bg-green-100 text-green-700 border-green-200' },
    Active: { label: 'Active', className: 'bg-green-100 text-green-700 border-green-200' },
    'On Leave': { label: 'On Leave', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    Inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-500 border-gray-200' },
    'Low Stock': { label: 'Low Stock', className: 'bg-red-100 text-red-600 border-red-200' },
    'In Stock': { label: 'In Stock', className: 'bg-green-100 text-green-700 border-green-200' },
    PENDING: { label: 'Pending', className: 'bg-gray-100 text-gray-500 border-gray-200' },
    DELIVERED: { label: 'Delivered', className: 'bg-green-100 text-green-700 border-green-200' },
    FAILED: { label: 'Failed', className: 'bg-red-100 text-red-600 border-red-200' },
    SKIPPED: { label: 'Skipped', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
};

interface Props {
    status: string; // Relaxed type to allow any string
    size?: 'xs' | 'sm' | 'md' | 'lg';
}

const StatusBadge = ({ status, size = 'sm' }: Props) => {
    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-600 border-gray-200' };

    let textSize = 'text-[10px]';
    if (size === 'xs') textSize = 'text-[9px] px-1.5 py-0';
    if (size === 'md') textSize = 'text-xs px-2.5 py-0.5';
    if (size === 'lg') textSize = 'text-sm px-3 py-1';

    return (
        <span className={`inline-flex items-center rounded-full border font-semibold ${textSize} ${config.className}`}>
            {config.label}
        </span>
    );
};

export default StatusBadge;
