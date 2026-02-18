import type {
    Staff, Shop, InventorySKU, InventoryBatch, Invoice, InvoiceItem,
    DispatchPlan, DraftCard, ChatMessage, User
} from '../store/types';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
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
    { id: 'u2', name: 'Priya Menon', role: 'MANAGER' },
    { id: 'u3', name: 'Ravi Kumar', role: 'STAFF' },
];

// ─── Staff (15) ───────────────────────────────────────────────────────────────
const staffNames = [
    'Ravi Kumar', 'Suresh Babu', 'Venkat Reddy', 'Ganesh M.', 'Prakash S.',
    'Arun D.', 'Karthik V.', 'Manoj P.', 'Srinivas R.', 'Deepak K.',
    'Rajesh N.', 'Vijay S.', 'Anand T.', 'Balu K.', 'Senthil P.'
];
const zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'];
const vehicles = ['Bike', 'Auto', 'Mini-Van', 'Tempo'] as const;
const phones = () => `+91 ${rand(70000, 99999)}${rand(10000, 99999)}`;

export const STAFF_LIST: Staff[] = staffNames.map((name, i) => ({
    id: `s${i + 1}`,
    name,
    phone: phones(),
    vehicle: pick(vehicles),
    zone: zones[i % zones.length],
    capacity: rand(35, 50),
    stops: rand(25, 48),
    distance: `${rand(18, 38)} km`,
    performance: rand(78, 98),
    risk: i === 3 || i === 6 || i === 11,
    status: i === 13 ? 'On Leave' : i === 14 ? 'Inactive' : 'Active',
}));

// ─── Shops (100) ──────────────────────────────────────────────────────────────
const shopPrefixes = [
    'Sri', 'New', 'Shri', 'Sai', 'Om', 'Jai', 'Maa', 'Royal', 'Super', 'Star',
    'Annapoorna', 'Saravana', 'Murugan', 'Ganesh', 'Balaji', 'Lakshmi', 'Durga',
    'Venkat', 'Ravi', 'Kumar', 'Suresh', 'Arun', 'Vijay', 'Deepak', 'Rajesh'
];
const shopSuffixes = [
    'Store', 'Mart', 'Provisions', 'Shop', 'Traders', 'Agencies', 'Depot',
    'Enterprises', 'Distributors', 'Wholesale'
];
const areas = [
    'T. Nagar', 'Mylapore', 'Anna Nagar', 'Adyar', 'Velachery', 'Chromepet',
    'Tambaram', 'KK Nagar', 'Porur', 'Guindy', 'Perungudi', 'Sholinganallur',
    'Thoraipakkam', 'OMR', 'Pallavaram', 'Ambattur', 'Avadi', 'Poonamallee',
    'Madipakkam', 'Nanganallur'
];
const ownerFirstNames = [
    'P.', 'R.', 'S.', 'V.', 'M.', 'G.', 'K.', 'T.', 'N.', 'D.',
    'A.', 'B.', 'C.', 'L.', 'J.'
];
const ownerLastNames = [
    'Lakshmi', 'Kumar', 'Devi', 'Balaji', 'Vasanth', 'Maha', 'Ganesh',
    'Ravi', 'Murugan', 'Sakthi', 'Ayyappan', 'Venkat', 'Padma', 'Raja', 'Selvi'
];

export const SHOPS_LIST: Shop[] = Array.from({ length: 100 }, (_, i) => {
    const hasGeo = Math.random() > 0.15;
    const hasContact = Math.random() > 0.1;
    const hasCreditLimit = Math.random() > 0.2;
    const missingCount = [!hasGeo, !hasContact, !hasCreditLimit].filter(Boolean).length;
    const qualityScore = Math.max(40, 100 - missingCount * 25 - rand(0, 10));
    const outstanding = rand(0, 50000);
    const creditLimit = hasCreditLimit ? rand(10000, 100000) : 0;
    const area = areas[i % areas.length];
    const zone = zones[Math.floor(i / 20)];
    const staffIdx = Math.floor(i / 7);

    return {
        id: `shop${i + 1}`,
        name: `${pick(shopPrefixes)} ${pick(shopSuffixes)}`,
        owner: `${pick(ownerFirstNames)} ${pick(ownerLastNames)}`,
        phone: hasContact ? phones() : '',
        area,
        zone,
        cadence: pick(['Daily', 'Alternate', 'Weekly']),
        lastDelivery: dateStr(rand(0, 5)),
        outstanding,
        creditLimit,
        hasGeo,
        hasContact,
        hasCreditLimit,
        qualityScore,
        lat: 13.0827 + (Math.random() - 0.5) * 0.5,
        lng: 80.2707 + (Math.random() - 0.5) * 0.5,
        assignedStaffId: STAFF_LIST[staffIdx % STAFF_LIST.length].id,
    };
});

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
            batchId: `B-${String(batchCounter).padStart(3, '0')}`,
            receivedDate: dateStr(rand(1, 30)),
            expiryDate: futureDate(rand(3, 60)),
            quantity: qty,
            unitPrice: sku.unitPrice,
            category: sku.category,
        };
    });
    const available = batches.reduce((s, b) => s + b.quantity, 0);
    return {
        id: `sku${i + 1}`,
        name: sku.name,
        category: sku.category,
        available,
        threshold: sku.threshold,
        avgDaily: sku.avgDaily,
        lowStock: available < sku.threshold,
        batches,
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
        return {
            skuName: sku.name,
            qty,
            unitPrice: sku.batches[0]?.unitPrice || 50,
            total: qty * (sku.batches[0]?.unitPrice || 50),
        };
    });
    return {
        id: `INV-${2400 + i + 1}`,
        shopId: shop.id,
        shopName: shop.name,
        total,
        paid,
        outstanding: total - paid,
        status,
        createdAt: dateStr(rand(0, 30)),
        dueDate: futureDate(rand(0, 15)),
        items,
    };
});

// ─── Dispatch Plan ────────────────────────────────────────────────────────────
export const INITIAL_DISPATCH_PLAN: DispatchPlan = {
    id: 'dp1',
    date: '2025-02-17',
    status: 'APPROVED',
    confidence: 91,
    assignments: STAFF_LIST.filter(s => s.status === 'Active').map((staff, i) => ({
        staffId: staff.id,
        shopIds: SHOPS_LIST
            .filter(s => s.assignedStaffId === staff.id)
            .map(s => s.id),
    })),
    inputsHash: 'sha256:a3f8c2d1e4b7f9a2c5d8e1f4a7b0c3d6',
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
        confidence: 91,
        status: 'APPROVED',
        createdAt: '2025-02-17T08:00:00',
        updatedAt: '2025-02-17T08:02:00',
        createdBy: 'AI',
        payload: { planId: 'dp1' },
        explanation: 'Historical demand patterns show 17 Feb as a high-demand day (+12% vs average). Staff allocation weighted by zone density and delivery SLA windows. Route optimization reduced total distance by 18% vs manual planning.',
    },
    {
        id: 'draft2',
        type: 'INVENTORY_ADJUSTMENT',
        title: 'Inventory Adjustment – Milk 500ml',
        description: 'Adjust stock level for Milk 500ml in Zone A',
        confidence: 85,
        status: 'DRAFT',
        createdAt: '2025-02-17T10:00:00',
        updatedAt: '2025-02-17T10:00:00',
        createdBy: 'Priya Menon',
        payload: { skuId: 'sku1', adjustment: 50 },
        explanation: 'Stock below threshold. Recommend adding 50 units from warehouse.',
    },
    {
        id: 'draft3',
        type: 'INVOICE_UPDATE',
        title: 'Invoice Batch – 62 Invoices',
        description: 'Generate invoices for all delivered stops today',
        confidence: 98,
        status: 'DRAFT',
        createdAt: '2025-02-17T14:00:00',
        updatedAt: '2025-02-17T14:00:00',
        createdBy: 'AI',
        payload: { count: 62 },
        explanation: 'All delivered stops eligible for invoicing. No credit-blocked shops included.',
    },
];

// ─── Initial Chat Messages ─────────────────────────────────────────────────────
export const INITIAL_CHAT: ChatMessage[] = [
    {
        id: 'msg1',
        role: 'user',
        content: 'Plan today\'s dispatch for 17 Feb',
        timestamp: '2025-02-17T08:00:00',
    },
    {
        id: 'msg2',
        role: 'ai',
        content: 'Here\'s the draft dispatch plan based on today\'s demand forecast, staff availability, and inventory levels:',
        timestamp: '2025-02-17T08:00:05',
        draftId: 'draft1',
    },
];

// ─── AI Response Generator ────────────────────────────────────────────────────
const aiResponses: Record<string, { content: string; draftType?: DraftCard['type'] }> = {
    dispatch: {
        content: 'I\'ve analyzed today\'s demand patterns and generated an optimized dispatch plan. 13 active staff will cover 100 shops across 5 zones.',
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
    return aiResponses.default;
}

export function createDraftFromAI(type: DraftCard['type'], createdBy: string): DraftCard {
    const templates: Record<DraftCard['type'], Partial<DraftCard>> = {
        DISPATCH_PLAN: {
            title: `Draft Dispatch Plan – ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`,
            description: 'AI-generated optimized dispatch plan',
            explanation: 'Routes optimized for distance and workload balance using historical demand data.',
        },
        INVENTORY_ADJUSTMENT: {
            title: 'Inventory Adjustment Request',
            description: 'Stock level adjustment for low-inventory SKUs',
            explanation: 'Stock below safety threshold. Adjustment required to prevent stockout.',
        },
        SHOP_IMPORT: {
            title: 'Shop Import – CSV Upload',
            description: 'Import new shops from uploaded CSV file',
            explanation: 'Validates geo, contact, and credit data before committing.',
        },
        INVOICE_UPDATE: {
            title: 'Invoice Batch Generation',
            description: 'Generate invoices for all delivered stops',
            explanation: 'Only delivered stops included. Credit-blocked shops excluded.',
        },
        SHOP_REASSIGN: {
            title: 'Shop Reassignment',
            description: 'Reassign shop to different staff member',
            explanation: 'Proximity optimization triggered reassignment.',
        },
        ROUTE_REORDER: {
            title: 'Route Reorder',
            description: 'Reorder delivery stops for optimal routing',
            explanation: 'Traffic and distance analysis suggests reordering.',
        },
        STOP_SKIP: {
            title: 'Stop Skip Request',
            description: 'Skip delivery stop for today',
            explanation: 'Shop requested skip or is temporarily closed.',
        },
        REBALANCE: {
            title: 'Workload Rebalance',
            description: 'Rebalance shop assignments across staff',
            explanation: 'Detected uneven workload distribution. Rebalancing recommended.',
        },
    };

    const template = templates[type];
    return {
        id: `draft_${uid()}`,
        type,
        title: template.title || 'New Draft',
        description: template.description || '',
        confidence: rand(70, 98),
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy,
        payload: {},
        explanation: template.explanation,
    };
}
