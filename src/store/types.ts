// ─── Draft Lifecycle ─────────────────────────────────────────────────────────
export type DraftStatus = 'DRAFT' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
export type DraftType =
  | 'DISPATCH_PLAN'
  | 'INVENTORY_ADJUSTMENT'
  | 'SHOP_IMPORT'
  | 'INVOICE_UPDATE'
  | 'SHOP_REASSIGN'
  | 'ROUTE_REORDER'
  | 'STOP_SKIP'
  | 'REBALANCE';

export interface DraftCard {
  id: string;
  type: DraftType;
  title: string;
  description: string;
  confidence: number; // 70–98
  status: DraftStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  reasonTag?: string;
  payload: Record<string, unknown>;
  explanation?: string;
  diff?: { before: unknown; after: unknown };
}

// ─── User / Role ──────────────────────────────────────────────────────────────
export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

// ─── Staff ────────────────────────────────────────────────────────────────────
export type VehicleType = 'Bike' | 'Auto' | 'Mini-Van' | 'Tempo';

export interface Staff {
  id: string;
  name: string;
  phone: string;
  vehicle: VehicleType;
  zone: string;
  capacity: number;
  stops: number;
  distance: string;
  performance: number;
  risk: boolean;
  status: 'Active' | 'On Leave' | 'Inactive';
}

// ─── Shop ─────────────────────────────────────────────────────────────────────
export interface Shop {
  id: string;
  name: string;
  owner: string;
  phone: string;
  area: string;
  zone: string;
  cadence: 'Daily' | 'Alternate' | 'Weekly';
  lastDelivery: string;
  outstanding: number;
  creditLimit: number;
  hasGeo: boolean;
  hasContact: boolean;
  hasCreditLimit: boolean;
  qualityScore: number;
  lat: number;
  lng: number;
  assignedStaffId?: string;
}

// ─── Inventory ────────────────────────────────────────────────────────────────
export interface InventoryBatch {
  id: string;
  skuId: string;
  skuName: string;
  batchId: string;
  receivedDate: string;
  expiryDate: string;
  quantity: number;
  unitPrice: number;
  category: string;
}

export interface InventorySKU {
  id: string;
  name: string;
  category: string;
  available: number;
  threshold: number;
  avgDaily: number;
  lowStock: boolean;
  batches: InventoryBatch[];
}

// ─── Invoice ──────────────────────────────────────────────────────────────────
export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PARTIAL' | 'PAID';

export interface Invoice {
  id: string;
  shopId: string;
  shopName: string;
  total: number;
  paid: number;
  outstanding: number;
  status: InvoiceStatus;
  createdAt: string;
  dueDate: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  skuName: string;
  qty: number;
  unitPrice: number;
  total: number;
}

// ─── Dispatch ─────────────────────────────────────────────────────────────────
export interface DispatchPlan {
  id: string;
  date: string;
  status: DraftStatus;
  confidence: number;
  assignments: DispatchAssignment[];
  inputsHash: string;
  objectiveWeights: Record<string, number>;
  constraints: string[];
  overrideHistory: OverrideEvent[];
}

export interface DispatchAssignment {
  staffId: string;
  shopIds: string[];
}

export interface OverrideEvent {
  id: string;
  timestamp: string;
  action: string;
  reason: string;
  performedBy: string;
  before: unknown;
  after: unknown;
}

// ─── Chat Message ─────────────────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  draftId?: string;
}
