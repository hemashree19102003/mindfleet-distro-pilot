import type {
    Staff, Shop, InventorySKU, InventoryBatch, Invoice, InvoiceItem,
    DispatchPlan, DraftCard, ChatMessage, User
} from '../store/types';
import { SHOPS_LIST } from './shops_data';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[] | readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
const uid = () => Math.random().toString(36).slice(2, 10);
const dateStr = (daysAgo: number) => {
    const d = new Date(2025, 1, 17);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
};
const futureDate = (daysAhead: number) => {
    const d = new Date(2025, 1, 17);
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const USERS: User[] = [
    { id: 'u1', name: 'Arjun Sharma', role: 'ADMIN' },
    { id: 'u3', name: 'Ravi Kumar', role: 'STAFF' },
];

// ─── Staff (15) ───────────────────────────────────────────────────────────────
const staffNames = [
    'Ravi Kumar', 'Suresh Babu', 'Venkat Reddy', 'Ganesh M.', 'Prakash S.',
    'Arun D.', 'Karthik V.', 'Manoj P.', 'Srinivas R.', 'Deepak K.',
    'Rajesh N.', 'Vijay S.', 'Anand T.', 'Balu K.', 'Senthil P.'
];
const phones = () => `+91 ${rand(70000, 99999)}${rand(10000, 99999)}`;

export const STAFF_LIST: Staff[] = staffNames.map((name, i) => ({
    id: `s${i + 1}`,
    name,
    phone: phones(),
    capacity: rand(35, 50),
    stops: rand(25, 48),
    distance: `${rand(18, 38)} km`,
    performance: rand(78, 98),
    risk: i === 3 || i === 6 || i === 11,
    status: i === 13 ? 'On Leave' : i === 14 ? 'Inactive' : 'Active',
}));

// ─── Shops ────────────────────────────────────────────────────────────────────
export { SHOPS_LIST };

// ─── Inventory SKUs + Batches (300 batches) ───────────────────────────────────
const skuDefs = [
    { name: 'Milk 500ml', category: 'Dairy', avgDaily: 85, threshold: 200, unitPrice: 25 },
    { name: 'Milk 1L', category: 'Dairy', avgDaily: 60, threshold: 150, unitPrice: 48 },
    { name: 'Aavin Curd 200g', category: 'Dairy', avgDaily: 62, threshold: 150, unitPrice: 22 },
    { name: 'Aavin Curd 500g', category: 'Dairy', avgDaily: 40, threshold: 100, unitPrice: 50 },
    { name: 'Butter 100g', category: 'Dairy', avgDaily: 30, threshold: 80, unitPrice: 55 },
    { name: 'Paneer 200g', category: 'Dairy', avgDaily: 25, threshold: 60, unitPrice: 90 },
    { name: 'Ghee 500ml', category: 'Dairy', avgDaily: 20, threshold: 50, unitPrice: 320 },
    { name: 'Lassi 200ml', category: 'Dairy', avgDaily: 45, threshold: 100, unitPrice: 18 },
    { name: 'Flavoured Milk 200ml', category: 'Dairy', avgDaily: 55, threshold: 120, unitPrice: 20 },
    { name: 'Cheese Slice 200g', category: 'Dairy', avgDaily: 15, threshold: 40, unitPrice: 120 },
    { name: 'Bread White 400g', category: 'Bakery', avgDaily: 45, threshold: 100, unitPrice: 35 },
    { name: 'Bread Brown 400g', category: 'Bakery', avgDaily: 20, threshold: 50, unitPrice: 42 },
    { name: 'Rice 5kg', category: 'Staples', avgDaily: 38, threshold: 100, unitPrice: 280 },
    { name: 'Toor Dal 1kg', category: 'Staples', avgDaily: 25, threshold: 80, unitPrice: 140 },
    { name: 'Sugar 1kg', category: 'Staples', avgDaily: 42, threshold: 100, unitPrice: 45 },
    { name: 'Oil Sunflower 1L', category: 'Staples', avgDaily: 30, threshold: 80, unitPrice: 145 },
    { name: 'Tea Powder 250g', category: 'Beverages', avgDaily: 35, threshold: 80, unitPrice: 85 },
    { name: 'Coffee Powder 100g', category: 'Beverages', avgDaily: 18, threshold: 50, unitPrice: 95 },
    { name: 'Biscuit Variety Pack', category: 'Snacks', avgDaily: 55, threshold: 120, unitPrice: 30 },
    { name: 'Soap Bar', category: 'FMCG', avgDaily: 40, threshold: 100, unitPrice: 35 },
];

let batchCounter = 1;

export const INVENTORY_SKUS: InventorySKU[] = skuDefs.map((sku, i) => {
    const batchCount = rand(10, 20); // ~300 total across 20 SKUs
    const batches: InventoryBatch[] = Array.from({ length: batchCount }, (_, j) => {
        const qty = rand(20, 120);
        return {
            id: `batch${batchCounter++}`,
            skuId: `sku${i + 1}`,
            skuName: sku.name,
            batchId: `B-${String(batchCounter).padStart(3, '0')}`, // Legacy
            batch_code: `B-${String(batchCounter).padStart(3, '0')}`,
            receivedDate: dateStr(rand(1, 30)), // Legacy
            received_at: dateStr(rand(1, 30)),
            expiryDate: futureDate(rand(3, 60)), // Legacy
            expiry_at: futureDate(rand(3, 60)),
            quantity: qty, // Legacy
            qty_received: qty,
            qty_available: qty,
            unitPrice: sku.unitPrice, // Legacy
            unit_price: sku.unitPrice,
            category: sku.category,
        };
    });
    const available = batches.reduce((s, b) => s + b.qty_available, 0);
    return {
        id: `sku${i + 1}`,
        name: sku.name,
        category: sku.category,
        unit: 'unit',
        active: true,
        pricing: { cost_price: sku.unitPrice * 0.8, sell_price: sku.unitPrice },
        stock: { available_qty: available, low_stock: available < sku.threshold },
        batches,

        // Legacy
        available,
        threshold: sku.threshold,
        avgDaily: sku.avgDaily,
        lowStock: available < sku.threshold
    };
});

// ─── Invoices (200) ───────────────────────────────────────────────────────────
const invoiceStatuses = ['DRAFT', 'SENT', 'PARTIAL', 'PAID'] as const;

export const INVOICES_LIST: Invoice[] = Array.from({ length: 200 }, (_, i) => {
    const shop = SHOPS_LIST[i % SHOPS_LIST.length];
    const total = rand(2000, 50000);
    const statusIdx = rand(0, 3);
    const status = invoiceStatuses[statusIdx];
    const paid = status === 'PAID' ? total : status === 'PARTIAL' ? rand(500, total - 100) : 0;
    const items: InvoiceItem[] = Array.from({ length: rand(2, 6) }, () => {
        const sku = pick(INVENTORY_SKUS);
        const qty = rand(5, 50);
        const price = sku.batches[0]?.unit_price || 50;
        return {
            skuName: sku.name,
            qty,
            unitPrice: price, // Legacy
            unit_price: price,
            total: qty * price, // Legacy
            line_total: qty * price,
        };
    });
    return {
        id: `INV-${2400 + i + 1}`,
        shopId: shop.id, // Legacy
        shopName: shop.name, // Legacy
        shop: { id: shop.id, name: shop.name },
        invoice_date: dateStr(rand(0, 30)),
        total_amount: total,
        outstanding_amount: total - paid,
        total, // Legacy
        paid, // Legacy
        outstanding: total - paid, // Legacy
        status,
        createdAt: dateStr(rand(0, 30)),
        dueDate: futureDate(rand(0, 15)),
        items,
    };
});

// ─── Dispatch Plan (uses geo-clustering + TSP route optimization) ─────────────
import { generateOptimizedPlan } from '../utils/routeOptimizer';

const _activeStaff = STAFF_LIST.filter(s => s.status === 'Active');
const _optimizedPlan = generateOptimizedPlan(SHOPS_LIST, _activeStaff);

export const INITIAL_DISPATCH_PLAN: DispatchPlan = {
    id: 'dp1',
    date: '2025-02-17',
    dispatch_date: '2025-02-17',
    status: 'APPROVED',
    confidence: _optimizedPlan.optimizationScore,
    confidence_score: _optimizedPlan.optimizationScore,
    assignments: _optimizedPlan.assignments.map(a => ({
        staffId: a.staffId,
        shopIds: a.shopIds,   // Already in optimized delivery order
        stops: [],
    })),
    inputs_hash: 'sha256:a3f8c2d1e4b7f9a2c5d8e1f4a7b0c3d6',
    objectiveWeights: {
        distance: 0.35,
        workload: 0.30,
        sla: 0.25,
        creditRisk: 0.10,
    },
    constraints: [
        'Max 50 stops per staff',
        'SLA window: 6AM–2PM',
        'Avoid credit-blocked shops',
        'FIFO inventory dispatch',
        'Geo-clustered assignments',
        'TSP-optimized stop order',
    ],
    overrideHistory: [
        {
            id: 'ov1',
            timestamp: '2025-02-17T09:15:00',
            action: 'Shop Reassigned',
            reason: 'Proximity optimization',
            performedBy: 'Arjun Sharma',
            before: { shopId: 'shop4', staffId: 's1' },
            after: { shopId: 'shop4', staffId: 's2' },
        },
    ],
};

// ─── Initial Drafts ───────────────────────────────────────────────────────────
export const INITIAL_DRAFTS: DraftCard[] = [
    {
        id: 'draft1',
        type: 'DISPATCH_PLAN',
        title: 'Draft Dispatch Plan – 17 Feb',
        description: 'AI-generated plan for 100 shops across 13 active staff',
        summary: [
            '100 shops assigned to 13 staff members',
            'Estimated revenue: ₹4.8L',
            'Distance optimization: -18% vs manual',
            'SLA coverage: 100%'
        ],
        confidence: 91,
        status: 'APPROVED',
        createdAt: '2025-02-17T08:00:00',
        updatedAt: '2025-02-17T08:02:00',
        createdBy: 'AI',
        payload: { planId: 'dp1' },
        explanation: 'Historical demand patterns show 17 Feb as a high-demand day (+12% vs average). Staff allocation weighted by zone density and delivery SLA windows. Route optimization reduced total distance by 18% vs manual planning.',
        risks: [
            { level: 'WARN', text: 'Karthik V. route exceeds 6h limit' },
            { level: 'INFO', text: '2 shops using approximated locations' }
        ]
    },
    {
        id: 'draft2',
        type: 'INVENTORY_ADJUSTMENT',
        title: 'Inventory Adjustment – Milk 500ml',
        description: 'Adjust stock level for Milk 500ml in Zone A',
        summary: [
            'Increase Milk 500ml by 50 units',
            'Warehouse: WH-CHENNAI-1',
            'Priority: High'
        ],
        confidence: 85,
        status: 'DRAFT',
        createdAt: '2025-02-17T10:00:00',
        updatedAt: '2025-02-17T10:00:00',
        createdBy: 'Priya Menon',
        payload: { skuId: 'sku1', adjustment: 50 },
        explanation: 'Stock below threshold. Recommend adding 50 units from warehouse.',
        risks: [
            { level: 'CRITICAL', text: 'Stockout imminent (4h)' }
        ]
    },
    {
        id: 'draft3',
        type: 'INVOICE_UPDATE',
        title: 'Invoice Batch – 62 Invoices',
        description: 'Generate invoices for all delivered stops today',
        summary: [
            '62 invoices to be generated',
            'Total value: ₹3.25L',
            'Eligible shops only'
        ],
        confidence: 98,
        status: 'DRAFT',
        createdAt: '2025-02-17T14:00:00',
        updatedAt: '2025-02-17T14:00:00',
        createdBy: 'AI',
        payload: { count: 62 },
        explanation: 'All delivered stops eligible for invoicing. No credit-blocked shops included.',
        risks: [
            { level: 'INFO', text: 'All shops verified for credit limits' }
        ]
    },
];

// ─── Initial Chat Messages ─────────────────────────────────────────────────────
export const INITIAL_CHAT: ChatMessage[] = [];


// ─── AI Response Generator ────────────────────────────────────────────────────
const aiResponses: Record<string, { content: string; draftType?: DraftCard['type'] }> = {
    dispatch: {
        content: 'I\'ve analyzed today\'s demand patterns and generated an optimized dispatch plan. 13 active staff will cover 100 shops.',
        draftType: 'DISPATCH_PLAN',
    },
    inventory: {
        content: 'I\'ve reviewed inventory levels. Milk 500ml and Bread White are below threshold. Recommend immediate stock adjustment.',
        draftType: 'INVENTORY_ADJUSTMENT',
    },
    invoice: {
        content: 'I\'ve identified 62 delivered stops eligible for invoicing. Total value: ₹4,82,000. Shall I generate the invoice batch?',
        draftType: 'INVOICE_UPDATE',
    },
    risk: {
        content: 'Current risks: 4 shops at SLA risk, 2 low-stock SKUs, 1 staff over capacity. Recommend immediate rebalancing.',
    },
    default: {
        content: 'I\'ve analyzed the request. Here\'s what I recommend based on current operational data and historical patterns.',
    },
};

export function generateAIResponse(userMessage: string): { content: string; draftType?: DraftCard['type'] } {
    const lower = userMessage.toLowerCase();
    if (lower.includes('dispatch') || lower.includes('plan') || lower.includes('route')) return aiResponses.dispatch;
    if (lower.includes('inventory') || lower.includes('stock')) return aiResponses.inventory;
    if (lower.includes('invoice') || lower.includes('payment')) return aiResponses.invoice;
    if (lower.includes('risk') || lower.includes('warning') || lower.includes('alert')) return aiResponses.risk;
    if (lower.includes('add profile') || lower.includes('add person') || lower.includes('onboard')) {
        return {
            content: 'I\'ve prepared a new staff profile template. Please fill in the details below:',
            draftType: 'ADD_STAFF'
        };
    }
    return aiResponses.default;
}

export function createDraftFromAI(type: DraftCard['type'], createdBy: string): DraftCard {
    const templates: Record<DraftCard['type'], Partial<DraftCard>> = {
        DISPATCH_PLAN: {
            title: `Draft Dispatch Plan – ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`,
            description: 'AI-generated optimized dispatch plan',
            summary: ['Optimized delivery routes', 'Workload-balanced staff', 'SLA window priority'],
            explanation: 'Routes optimized for distance and workload balance using historical demand data.',
        },
        INVENTORY_ADJUSTMENT: {
            title: 'Inventory Adjustment Request',
            description: 'Stock level adjustment for low-inventory SKUs',
            summary: ['Replenish safety stock', 'Inventory ledger update'],
            explanation: 'Stock below safety threshold. Adjustment required to prevent stockout.',
        },
        SHOP_IMPORT: {
            title: 'New Shop Onboarding – AI Analysis',
            description: 'AI-analyzed shop import from pending registrations',
            summary: ['Batch import 42 new accounts', 'GPS coordinates verified for 38 shops', 'Credit risk assessment completed'],
            explanation: 'Validated new shop entries against regional demographics. Optimized initial credit limits based on shop area and projected demand.',
        },
        INVOICE_GENERATION: {
            title: 'Invoice Batch Generation',
            description: 'Generate invoices for all delivered stops',
            summary: ['Bulk invoice run', 'Digital signing ready'],
            explanation: 'Only delivered stops included. Credit-blocked shops excluded.',
        },
        INVENTORY_UPDATE: {
            title: 'Inventory Update',
            description: 'Bulk update SKU attributes',
            summary: ['Price update', 'Category shift'],
            explanation: 'Updating price lists based on revised procurement costs.',
        },
        OVERRIDE_PLAN: {
            title: 'Override Dispatch Plan',
            description: 'Manual adjustment to active plan',
            summary: ['Human override tags', 'Rebalancing committed'],
            explanation: 'Adjusting assignments based on emergency staff unavailability.',
        },
        INVOICE_UPDATE: {
            title: 'Invoice Batch Generation',
            description: 'Generate invoices for all delivered stops',
            summary: ['Bulk invoice run', 'Digital signing ready'],
            explanation: 'Only delivered stops included. Credit-blocked shops excluded.',
        },
        SHOP_REASSIGN: {
            title: 'Shop Reassignment',
            description: 'Reassign shop to different staff member',
            summary: ['Proximity move', 'Balanced staff workload'],
            explanation: 'Proximity optimization triggered reassignment.',
        },
        ROUTE_REORDER: {
            title: 'Route Reorder',
            description: 'Reorder delivery stops for optimal routing',
            summary: ['Distance reduction', 'Reduced traffic wait-time'],
            explanation: 'Traffic and distance analysis suggests reordering.',
        },
        STOP_SKIP: {
            title: 'Stop Skip Request',
            description: 'Skip delivery stop for today',
            summary: ['Store closed override', 'Rescheduled for tomorrow'],
            explanation: 'Shop requested skip or is temporarily closed.',
        },
        REBALANCE: {
            title: 'Workload Rebalance',
            description: 'Rebalance shop assignments across staff',
            summary: ['Over-capacity mitigation', 'Staff fatigue reduction'],
            explanation: 'Detected uneven workload distribution. Rebalancing recommended.',
        },
        SHOP_UPDATE: {
            title: 'Shop Detail Update',
            description: 'Update shop metadata or location',
            summary: ['Data enrichment', 'GPS verification'],
            explanation: 'Manual or AI-triggered shop update.',
        },
        STAFF_UPDATE: {
            title: 'Staff Record Update',
            description: 'Update staff capacity or status',
            summary: ['Quota adjustment', 'Shift change'],
            explanation: 'Administrative update to staff record or roster.',
        },
        CADENCE_CHANGE: {
            title: 'Delivery Cadence Update',
            description: 'Update preferred delivery days for shop',
            summary: ['Route optimization impact', 'Customer preference update'],
            explanation: 'Adjusting delivery days based on customer request or route efficiency.',
        },
        ADD_STAFF: {
            title: 'New Staff Onboarding',
            description: 'Manual addition of a delivery partner to the fleet',
            summary: ['Awaiting personal details', 'Onboarding phase verification'],
            explanation: 'Enter the details in the form below to register a new staff member.',
        },
    };

    const template = templates[type];
    return {
        id: `draft_${uid()}`,
        type,
        title: template.title || 'New Draft',
        description: template.description || '',
        summary: template.summary || [],
        confidence: rand(70, 98),
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy,
        payload: type === 'DISPATCH_PLAN' ? { staffCount: rand(10, 15), shopCount: rand(80, 150) } : {},
        explanation: template.explanation,
        reasoning: [
            "Optimized stop sequences to reduce backtracking by 14%",
            "Prioritized premium shops with pending large outstanding collections",
            "Allocated routes based on vehicle capacity utilization (avg 92%)"
        ],
        risks: [
            { level: 'WARN', text: "2 shops have missing GPS coordinates (approximated)" },
            { level: 'CRITICAL', text: "Milk 500ml stock may run out if demand exceeds 8% variance" },
            { level: 'INFO', text: "Suresh Babu has a high-stop route (48 stops)" }
        ],
        confidenceBreakdown: {
            dataQuality: rand(85, 95),
            historicalReliability: rand(75, 98),
            inventoryRisk: rand(80, 92)
        },
        shortages: type === 'DISPATCH_PLAN' ? [
            { skuName: "Milk 500ml", missing: 42 },
            { skuName: "Bread White", missing: 12 }
        ] : undefined
    };
}
