import { create } from 'zustand';
import type {
    DraftCard, DraftStatus, User, Staff, Shop, InventorySKU,
    Invoice, InvoiceStatus, DispatchPlan, ChatMessage
} from './types';
import {
    USERS, STAFF_LIST, SHOPS_LIST, INVENTORY_SKUS, INVOICES_LIST,
    INITIAL_DISPATCH_PLAN, INITIAL_DRAFTS, INITIAL_CHAT,
    generateAIResponse, createDraftFromAI
} from '../data/generators';

// ─── Draft Store ──────────────────────────────────────────────────────────────
interface DraftStore {
    drafts: DraftCard[];
    addDraft: (draft: DraftCard) => void;
    updateDraftStatus: (id: string, status: DraftStatus, reasonTag?: string) => void;
    getDraft: (id: string) => DraftCard | undefined;
}

export const useDraftStore = create<DraftStore>((set, get) => ({
    drafts: INITIAL_DRAFTS,
    addDraft: (draft) => set(s => ({ drafts: [draft, ...s.drafts] })),
    updateDraftStatus: (id, status, reasonTag) =>
        set(s => ({
            drafts: s.drafts.map(d =>
                d.id === id ? { ...d, status, reasonTag, updatedAt: new Date().toISOString() } : d
            ),
        })),
    getDraft: (id) => get().drafts.find(d => d.id === id),
}));

// ─── User Store ───────────────────────────────────────────────────────────────
interface UserStore {
    currentUser: User;
    setCurrentUser: (user: User) => void;
    users: User[];
}

export const useUserStore = create<UserStore>(() => ({
    currentUser: USERS[0],
    setCurrentUser: (user) => useUserStore.setState({ currentUser: user }),
    users: USERS,
}));

// ─── Staff Store ──────────────────────────────────────────────────────────────
interface StaffStore {
    staff: Staff[];
    updateStaff: (id: string, updates: Partial<Staff>) => void;
}

export const useStaffStore = create<StaffStore>((set) => ({
    staff: STAFF_LIST,
    updateStaff: (id, updates) =>
        set(s => ({ staff: s.staff.map(st => st.id === id ? { ...st, ...updates } : st) })),
}));

// ─── Shop Store ───────────────────────────────────────────────────────────────
interface ShopStore {
    shops: Shop[];
    addShops: (shops: Shop[]) => void;
    updateShop: (id: string, updates: Partial<Shop>) => void;
    reassignShop: (shopId: string, newStaffId: string) => void;
}

export const useShopStore = create<ShopStore>((set) => ({
    shops: SHOPS_LIST,
    addShops: (newShops) => set(s => ({ shops: [...s.shops, ...newShops] })),
    updateShop: (id, updates) =>
        set(s => ({ shops: s.shops.map(sh => sh.id === id ? { ...sh, ...updates } : sh) })),
    reassignShop: (shopId, newStaffId) =>
        set(s => ({
            shops: s.shops.map(sh => sh.id === shopId ? { ...sh, assignedStaffId: newStaffId } : sh),
        })),
}));

// ─── Inventory Store ──────────────────────────────────────────────────────────
interface InventoryStore {
    skus: InventorySKU[];
    adjustStock: (skuId: string, delta: number) => void;
}

export const useInventoryStore = create<InventoryStore>((set) => ({
    skus: INVENTORY_SKUS,
    adjustStock: (skuId, delta) =>
        set(s => ({
            skus: s.skus.map(sku => {
                if (sku.id !== skuId) return sku;
                const newAvailable = Math.max(0, sku.available + delta);
                return { ...sku, available: newAvailable, lowStock: newAvailable < sku.threshold };
            }),
        })),
}));

// ─── Invoice Store ────────────────────────────────────────────────────────────
interface InvoiceStore {
    invoices: Invoice[];
    updateInvoiceStatus: (id: string, status: InvoiceStatus, payment?: number) => void;
    addInvoice: (invoice: Invoice) => void;
}

export const useInvoiceStore = create<InvoiceStore>((set) => ({
    invoices: INVOICES_LIST,
    updateInvoiceStatus: (id, status, payment = 0) =>
        set(s => ({
            invoices: s.invoices.map(inv => {
                if (inv.id !== id) return inv;
                const newPaid = Math.min(inv.total, inv.paid + payment);
                return {
                    ...inv,
                    status,
                    paid: newPaid,
                    outstanding: inv.total - newPaid,
                };
            }),
        })),
    addInvoice: (invoice) => set(s => ({ invoices: [invoice, ...s.invoices] })),
}));

// ─── Dispatch Store ───────────────────────────────────────────────────────────
interface DispatchStore {
    plan: DispatchPlan;
    reassignShop: (shopId: string, fromStaffId: string, toStaffId: string, reason: string, performedBy: string) => void;
    reorderStops: (staffId: string, newOrder: string[], reason: string, performedBy: string) => void;
    skipStop: (staffId: string, shopId: string, reason: string, performedBy: string) => void;
}

export const useDispatchStore = create<DispatchStore>((set) => ({
    plan: INITIAL_DISPATCH_PLAN,
    reassignShop: (shopId, fromStaffId, toStaffId, reason, performedBy) =>
        set(s => {
            const before = { shopId, staffId: fromStaffId };
            const after = { shopId, staffId: toStaffId };
            return {
                plan: {
                    ...s.plan,
                    assignments: s.plan.assignments.map(a => {
                        if (a.staffId === fromStaffId) return { ...a, shopIds: a.shopIds.filter(id => id !== shopId) };
                        if (a.staffId === toStaffId) return { ...a, shopIds: [...a.shopIds, shopId] };
                        return a;
                    }),
                    overrideHistory: [
                        ...s.plan.overrideHistory,
                        {
                            id: `ov_${Date.now()}`,
                            timestamp: new Date().toISOString(),
                            action: 'Shop Reassigned',
                            reason,
                            performedBy,
                            before,
                            after,
                        },
                    ],
                },
            };
        }),
    reorderStops: (staffId, newOrder, reason, performedBy) =>
        set(s => ({
            plan: {
                ...s.plan,
                assignments: s.plan.assignments.map(a =>
                    a.staffId === staffId ? { ...a, shopIds: newOrder } : a
                ),
                overrideHistory: [
                    ...s.plan.overrideHistory,
                    {
                        id: `ov_${Date.now()}`,
                        timestamp: new Date().toISOString(),
                        action: 'Route Reordered',
                        reason,
                        performedBy,
                        before: s.plan.assignments.find(a => a.staffId === staffId)?.shopIds,
                        after: newOrder,
                    },
                ],
            },
        })),
    skipStop: (staffId, shopId, reason, performedBy) =>
        set(s => ({
            plan: {
                ...s.plan,
                assignments: s.plan.assignments.map(a =>
                    a.staffId === staffId ? { ...a, shopIds: a.shopIds.filter(id => id !== shopId) } : a
                ),
                overrideHistory: [
                    ...s.plan.overrideHistory,
                    {
                        id: `ov_${Date.now()}`,
                        timestamp: new Date().toISOString(),
                        action: 'Stop Skipped',
                        reason,
                        performedBy,
                        before: { shopId, staffId },
                        after: null,
                    },
                ],
            },
        })),
}));

// ─── Chat Store ───────────────────────────────────────────────────────────────
interface ChatStore {
    messages: ChatMessage[];
    isTyping: boolean;
    sendMessage: (content: string, currentUser: User) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    messages: INITIAL_CHAT,
    isTyping: false,
    sendMessage: (content, currentUser) => {
        const userMsg: ChatMessage = {
            id: `msg_${Date.now()}`,
            role: 'user',
            content,
            timestamp: new Date().toISOString(),
        };
        set(s => ({ messages: [...s.messages, userMsg], isTyping: true }));

        setTimeout(() => {
            const aiResp = generateAIResponse(content);
            let draftId: string | undefined;

            if (aiResp.draftType) {
                const draft = createDraftFromAI(aiResp.draftType, 'AI');
                useDraftStore.getState().addDraft(draft);
                draftId = draft.id;
            }

            const aiMsg: ChatMessage = {
                id: `msg_${Date.now() + 1}`,
                role: 'ai',
                content: aiResp.content,
                timestamp: new Date().toISOString(),
                draftId,
            };
            set(s => ({ messages: [...s.messages, aiMsg], isTyping: false }));
        }, 1200 + Math.random() * 800);
    },
}));
