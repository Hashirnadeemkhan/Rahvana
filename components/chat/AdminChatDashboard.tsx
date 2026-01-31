// "use client";

// import { useEffect, useState, useRef } from "react";
// import { createClient } from "@/lib/supabase/client";
// import {
//   getAllChats,
//   getChatMessages,
//   sendMessage,
// } from "@/actions/chat-actions";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Send, User, MessageSquare, Loader2 } from "lucide-react";

// // Initialize Supabase Client
// const supabase = createClient();

// interface Message {
//   id: string;
//   sender_id: string;
//   message: string;
//   created_at: string;
//   is_admin: boolean;
// }

// interface ChatSession {
//   id: string;
//   user_id: string;
//   status: string;
//   created_at: string;
//   msg: { message: string; created_at: string }[];
//   user?: {
//     full_name: string;
//     email: string;
//   };
// }

// export default function AdminChatDashboard() {
//   const [chats, setChats] = useState<ChatSession[]>([]);
//   const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loadingChats, setLoadingChats] = useState(true);
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [sending, setSending] = useState(false);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   // Load Chats
//   useEffect(() => {
//     async function fetchChats() {
//       const data = await getAllChats();
//       setChats(data as unknown as ChatSession[]);
//       setLoadingChats(false);
//     }
//     fetchChats();

//     // Subscribe to NEW chats
//     const channel = supabase
//       .channel("admin-chats")
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "support_chats" },
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         async (payload) => {
//           // Reload all chats to get the new user profile, or standard fetch
//           // Ideally we fetch just this user, but for now re-fetching all is safest to get the profile.
//           // Optimization: Fetch single profile.
//           const data = await getAllChats();
//           setChats(data as unknown as ChatSession[]);
//         },
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, []);

//   // Load Messages for Selected Chat & Subscribe
//   useEffect(() => {
//     if (!selectedChatId) return;

//     setLoadingMessages(true);
//     getChatMessages(selectedChatId).then((msgs) => {
//       setMessages(msgs as Message[]);
//       setLoadingMessages(false);
//     });

//     const channel = supabase
//       .channel(`admin-chat:${selectedChatId}`)
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "support_messages",
//           filter: `chat_id=eq.${selectedChatId}`,
//         },
//         (payload) => {
//           setMessages((prev) => [...prev, payload.new as Message]);
//         },
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [selectedChatId]);

//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const handleSend = async () => {
//     if (!newMessage.trim() || !selectedChatId) return;
//     setSending(true);
//     const msg = newMessage;
//     setNewMessage("");
//     await sendMessage(selectedChatId, msg, true);
//     setSending(false);
//   };

//   const selectedChat = chats.find((c) => c.id === selectedChatId);

//   return (
//     <div className="grid grid-cols-3 gap-4 h-[calc(100vh-10rem)]">
//       {/* Sidebar: Chat List */}
//       <Card className="col-span-1 border-r flex flex-col h-full shadow-md">
//         <CardHeader className="py-4 border-b bg-gray-50/50">
//           <CardTitle className="text-lg">Inbox</CardTitle>
//           <CardDescription>{chats.length} Active Conversations</CardDescription>
//         </CardHeader>
//         <ScrollArea className="flex-1">
//           {loadingChats ? (
//             <div className="flex justify-center p-8">
//               <Loader2 className="animate-spin" />
//             </div>
//           ) : (
//             <div className="flex flex-col">
//               {chats.map((chat) => (
//                 <button
//                   key={chat.id}
//                   onClick={() => setSelectedChatId(chat.id)}
//                   className={`flex flex-col items-start gap-1 p-4 text-left transition-colors hover:bg-muted/50 border-b ${
//                     selectedChatId === chat.id ? "bg-muted" : ""
//                   }`}
//                 >
//                   <div className="flex w-full items-center justify-between">
//                     <span className="font-semibold text-sm truncate">
//                       {chat.user?.full_name || "Anonymous User"}
//                     </span>
//                     <span className="text-xs text-muted-foreground">
//                       {new Date(chat.created_at).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <div className="text-xs text-muted-foreground w-full truncate">
//                     {chat.user?.email || "No email"}
//                   </div>
//                 </button>
//               ))}
//               {chats.length === 0 && (
//                 <div className="p-8 text-center text-muted-foreground text-sm">
//                   No active chats found.
//                 </div>
//               )}
//             </div>
//           )}
//         </ScrollArea>
//       </Card>

//       {/* Main: Chat Window */}
//       <Card className="col-span-2 flex flex-col h-full shadow-md border-l-0">
//         {!selectedChatId ? (
//           <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
//             <MessageSquare className="mb-4 h-12 w-12 opacity-20" />
//             <p>Select a conversation to start chatting</p>
//           </div>
//         ) : (
//           <>
//             <CardHeader className="py-4 border-b bg-gray-50/50">
//               <CardTitle className="text-base flex items-center gap-2">
//                 <User className="h-4 w-4" />
//                 {selectedChat?.user?.full_name || "Anonymous User"}
//               </CardTitle>
//             </CardHeader>

//             <CardContent className="flex-1 overflow-hidden p-0 flex flex-col bg-slate-50/30">
//               <ScrollArea className="flex-1 p-4" ref={scrollRef}>
//                 {loadingMessages ? (
//                   <div className="flex justify-center p-8">
//                     <Loader2 className="animate-spin" />
//                   </div>
//                 ) : (
//                   <div className="flex flex-col gap-4 min-h-[400px]">
//                     {messages.map((msg) => {
//                       const isMe = msg.is_admin; // In Dashboard, "Me" is Admin
//                       return (
//                         <div
//                           key={msg.id}
//                           className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
//                         >
//                           <div
//                             className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
//                               isMe
//                                 ? "bg-primary text-primary-foreground rounded-br-none"
//                                 : "bg-white text-foreground border rounded-bl-none"
//                             }`}
//                           >
//                             <div className="text-[10px] opacity-70 mb-1 font-semibold">
//                               {isMe ? "You (Admin)" : "User"}
//                             </div>
//                             {msg.message}
//                             <div
//                               className={`text-[10px] mt-1 text-right ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}
//                             >
//                               {new Date(msg.created_at).toLocaleTimeString([], {
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                               })}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                     {/* Invisible anchor */}
//                     <div ref={scrollRef} />
//                   </div>
//                 )}
//               </ScrollArea>

//               <div className="p-4 bg-background border-t">
//                 <form
//                   onSubmit={(e) => {
//                     e.preventDefault();
//                     handleSend();
//                   }}
//                   className="flex gap-2"
//                 >
//                   <Input
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     placeholder="Type a reply..."
//                     disabled={sending}
//                     className="rounded-full"
//                   />
//                   <Button
//                     type="submit"
//                     size="icon"
//                     disabled={sending || !newMessage.trim()}
//                     className="rounded-full shrink-0"
//                   >
//                     {sending ? (
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                     ) : (
//                       <Send className="h-4 w-4" />
//                     )}
//                   </Button>
//                 </form>
//               </div>
//             </CardContent>
//           </>
//         )}
//       </Card>
//     </div>
//   );
// }
