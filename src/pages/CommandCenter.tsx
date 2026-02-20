import { useChatStore, useDraftStore, useUserStore } from "@/store";
import { useSearchParams } from "react-router-dom";
import ChatThread from "@/components/command-center/ChatThread";
import ChatInput from "@/components/command-center/ChatInput";
import ContextPanel from "@/components/command-center/ContextPanel";
import { Sparkles } from "lucide-react";

// Global UI event logging helper
const ui_event = (name: string, payload: any) => {
  console.log(`[UI_EVENT] ${name}`, payload);
};

const CommandCenter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") as "today" | "drafts" | "dispatch" | "warnings" | "recent") || "today";

  const { messages, isTyping, sendMessage } = useChatStore();
  const { drafts, updateDraftStatus } = useDraftStore();
  const { currentUser } = useUserStore();

  const handleSendMessage = (text: string, attachments?: File[]) => {
    ui_event("SEND_MESSAGE", { user_id: currentUser.id, role: currentUser.role, text });
    sendMessage(text, currentUser);
  };

  const setTab = (tab: string) => {
    ui_event("NAV_CHANGE", { route: "/command-center", tab });
    setSearchParams({ tab });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-8.5rem)] lg:h-[calc(100vh-7rem)]">
      {/* ── Chat Section ── */}
      <div className="flex flex-col rounded-2xl border border-purple-100 bg-white overflow-hidden shadow-sm flex-1 min-w-0">
        {/* Chat Header */}
        <div className="flex items-center gap-3 border-b border-purple-100 px-4 md:px-6 py-3 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100">
            <Sparkles className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-gray-900">Command Center</h2>
            <p className="text-[10px] text-gray-500">AI-assisted operational control</p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-pulse-soft" />
            AI Active
          </span>
        </div>

        <ChatThread
          messages={messages}
          drafts={drafts}
          isTyping={isTyping}
        />

        <ChatInput
          onSend={handleSendMessage}
          disabled={isTyping}
        />
      </div>

      {/* ── Context Panel ── */}
      <ContextPanel
        activeTab={activeTab}
        onTabChange={setTab}
        drafts={drafts}
      />
    </div>
  );
};

export default CommandCenter;
