import { useEffect, useState } from "react";
import ChatHistory from "@/@core/components/dashboard/student/ChatHistory";
import ChatContent from "@/@core/components/dashboard/student/ChatContent";
import ChatInput from "@/@core/components/dashboard/student/ChatInput";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useChatBotStore } from "@/utility/stores/chatStore";
import { toast } from "sonner";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { FileClock } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  image?: string;
  attachments?: {
    type: "image" | "document";
    url: string;
    name: string;
  }[];
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

const StudentAITutors = () => {
  const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);

      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return isMobile;
  };

  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    createSession,
    sendMessage,
    getSessions,
    getHistory,
    sessions: storeSessions,
    currentSessionId,
    messages: storeMessages,
    isLoading,
    isSending,
    setCurrentSessionId,
    clearCurrentSession,
    deleteSession,
  } = useChatBotStore();

  // Map store sessions → ChatSession[] cho ChatHistory component
  const sessions: ChatSession[] = storeSessions.map((s) => ({
    id: s.session_id,
    title: `Session ${s.session_id}`,
    lastMessage: "",
    timestamp: new Date(s.created_at),
    messageCount: s.message_count || 0,
  }));

  // Map store messages → Message[] cho ChatContent component
  const messages: Message[] = storeMessages.map((msg, index) => ({
    id: `${msg.role}-${index}`,
    role: msg.role,
    content: msg.content,
    timestamp: new Date(msg.timestamp),
  }));

  // Load sessions khi component mount
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      await getSessions();
    } catch (error) {
      toast.error("Không thể tải lịch sử chat");
      console.error("Error loading sessions:", error);
    }
  };

  // Tạo chat mới
  const handleNewChat = async () => {
    try {
      await createSession();
      await loadSessions();
      toast.success("Đã tạo cuộc trò chuyện mới");
    } catch (error) {
      toast.error("Không thể tạo cuộc trò chuyện mới");
      console.error("Error creating session:", error);
    }
  };

  // Chọn session
  const handleSelectSession = async (sessionId: string) => {
    try {
      if (sessionId === currentSessionId) return;

      setCurrentSessionId(sessionId);
      await getHistory(sessionId);
    } catch (error) {
      toast.error("Không thể tải cuộc trò chuyện");
      console.error("Error loading session:", error);
    }
  };

  // Gửi tin nhắn
  const handleSendMessage = async (content: string) => {
    try {
      if (!currentSessionId) {
        toast.error("Vui lòng tạo cuộc trò chuyện mới");
        return;
      }

      await sendMessage(currentSessionId, content);
      await loadSessions();
    } catch (error) {
      toast.error("Không thể gửi tin nhắn");
      console.error("Error sending message:", error);
    }
  };

  // Xóa session
  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);

      if (currentSessionId === sessionId) {
        clearCurrentSession();
      }

      await loadSessions();
      toast.success("Đã xóa cuộc trò chuyện");
    } catch (error) {
      toast.error("Không thể xóa cuộc trò chuyện");
      console.error("Error deleting session:", error);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[var(--bg-light-start)] to-[var(--bg-light-end)] overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Chat History Panel */}
        {!isMobile ? (
          <ResizablePanel
            defaultSize={15}
            minSize={15}
            maxSize={30}
            className="bg-white"
          >
              <div className="h-full overflow-hidden">
                <ChatHistory
                  sessions={sessions}
                  currentSessionId={currentSessionId}
                  onSelectSession={handleSelectSession}
                  onNewChat={handleNewChat}
                  onDeleteSession={handleDeleteSession}
                  isLoading={isLoading}
                />
              </div>
          </ResizablePanel>
        ) : (
          <div>
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    size="default"
                    className="fixed rounded-t-none top-21 left-3 z-30 md:hidden"
                  >
                    <FileClock className="h-5 w-5" /> lịch sử chát
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Lịch sử chat</DrawerTitle>
                    <DrawerDescription>
                      Chọn một phiên chat để tiếp tục
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="h-[60vh] overflow-y-auto px-4">
                    <ChatHistory
                      sessions={sessions}
                      currentSessionId={currentSessionId}
                      onSelectSession={(id) => {
                        handleSelectSession(id);
                        setDrawerOpen(false);
                      }}
                      onNewChat={() => {
                        handleNewChat();
                        setDrawerOpen(false);
                      }}
                      onDeleteSession={handleDeleteSession}
                      isLoading={isLoading}
                    />
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline">Đóng</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
          </div>
        )}

        {/* Resizable Handle */}
        <ResizableHandle
          withHandle
          className="bg-gray-200 hover:bg-[var(--color-primary-light)] transition-colors"
        />

        {/* Main Chat Panel */}
        <ResizablePanel defaultSize={75} minSize={50}>
          <div className="h-full flex flex-col overflow-hidden">
            {currentSessionId ? (
              <>
                {/* Chat Content */}
                <div className="flex-1 overflow-hidden min-h-0">
                  <ChatContent messages={messages} isLoading={isSending} />
                </div>

                {/* Fixed Input at Bottom */}
                <div className="flex-shrink-0 bg-white border-t shadow-lg">
                  <ChatInput
                    onSendMessage={handleSendMessage}
                    isLoading={isSending}
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-primary-light)]/20 to-[var(--color-secondary)]/20">
                      <svg
                        className="w-10 h-10 text-[var(--color-primary-dark)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">
                    Chọn hoặc tạo cuộc trò chuyện mới
                  </h2>
                  <p className="text-gray-500">
                    Bắt đầu chat với AI Tutor của bạn
                  </p>
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default StudentAITutors;
