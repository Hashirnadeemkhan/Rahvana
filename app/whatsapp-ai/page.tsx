import { ChatInterface } from "../components/chat/chat-interface"

export const metadata = {
  title: "WhatsApp AI Assistant",
  description: "Search and analyze your WhatsApp conversations with AI",
}

export default function WhatsAppAIPage() {
  return (
    <main className="h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
      <ChatInterface />
    </main>
  )
}
