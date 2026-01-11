import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Footer from "@/components/Footer";
import logo from "@/assets/logo_open.png";
import { 
  Send, 
  MessageCircle, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Menu,
  X,
  LogOut,
  Sparkles,
  Heart
} from "lucide-react";
// IMPORT YOUR API SERVICE HERE
import api from "@/services/api";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isTyping?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// Typing animation component
const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    <div className="flex gap-1">
      <span className="w-2 h-2 bg-mochi-pink rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-mochi-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-mochi-pink rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
);

// Cute decorative dots component
const CuteDots = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-10 left-8 w-2 h-2 rounded-full bg-mochi-pink opacity-50 animate-pulse" />
    <div className="absolute top-20 right-16 w-3 h-3 rounded-full bg-mochi-green opacity-40 float-animation" />
    <div className="absolute bottom-32 left-1/4 w-2 h-2 rounded-full bg-mochi-pink opacity-30" />
    <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-mochi-green opacity-50" />
    <div className="absolute bottom-1/4 right-20 w-2 h-2 rounded-full bg-mochi-pink opacity-40 float-animation" style={{ animationDelay: '1s' }} />
    <div className="absolute top-1/2 left-12 w-1.5 h-1.5 rounded-full bg-mochi-green opacity-35" />
    <Sparkles className="absolute top-16 right-1/4 w-4 h-4 text-mochi-pink opacity-30 float-animation" style={{ animationDelay: '0.5s' }} />
    <Sparkles className="absolute bottom-1/3 left-16 w-3 h-3 text-mochi-green opacity-25 float-animation" style={{ animationDelay: '1.5s' }} />
    <Heart className="absolute top-1/4 left-1/3 w-3 h-3 text-mochi-pink opacity-20 bounce-soft" />
  </div>
);

const Chat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Hello conversation",
      messages: [
        { id: "m1", content: "Hii! Welcome to Oh, Mochi! I'm so happy you're here! How can I help you today?", role: "assistant", timestamp: new Date() }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "2",
      title: "Recipe ideas",
      messages: [],
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000)
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeConversation, setActiveConversation] = useState<string>("1");
  const [inputMessage, setInputMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);

  const currentConversation = conversations.find(c => c.id === activeConversation);

  // --- THIS IS THE FIXED FUNCTION ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentConversation || isTyping) return;

    // 1. Create the User Message
    const userMessageContent = inputMessage;
    const newMessage: Message = {
      id: `m-${Date.now()}`,
      content: userMessageContent,
      role: "user",
      timestamp: new Date()
    };

    // 2. Add to UI immediately
    setConversations(prev => prev.map(c => {
      if (c.id === activeConversation) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          updatedAt: new Date(),
          title: c.messages.length === 0 ? userMessageContent.slice(0, 25) : c.title
        };
      }
      return c;
    }));
    
    setInputMessage("");
    setIsTyping(true);

    try {
      // 3. CALL THE BACKEND
      const data = await api.sendMessage(userMessageContent, activeConversation);
      
      // 4. Handle the response
      // We check multiple fields in case your backend DTO structure varies
      const botResponseText = data.response || data.message || data.content || "I didn't get a text response.";

      const assistantMessage: Message = {
        id: `m-${Date.now() + 1}`,
        content: botResponseText,
        role: "assistant",
        timestamp: new Date()
      };

      setConversations(prev => prev.map(c => {
        if (c.id === activeConversation) {
          return {
            ...c,
            messages: [...c.messages, assistantMessage],
            updatedAt: new Date()
          };
        }
        return c;
      }));

    } catch (error) {
      console.error("Chat error:", error);
      
      // Show error in chat bubble
      const errorMessage: Message = {
        id: `m-error-${Date.now()}`,
        content: "⚠️ I couldn't reach the backend server. Please make sure the Java app is running!",
        role: "assistant",
        timestamp: new Date()
      };
      
      setConversations(prev => prev.map(c => {
        if (c.id === activeConversation) {
          return {
            ...c,
            messages: [...c.messages, errorMessage],
            updatedAt: new Date()
          };
        }
        return c;
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewConversation = () => {
    const newConvo: Conversation = {
      id: `c-${Date.now()}`,
      title: "New chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setConversations(prev => [newConvo, ...prev]);
    setActiveConversation(newConvo.id);
    setSidebarOpen(false);
  };

  const handleEditConversation = (id: string, newTitle: string) => {
    setConversations(prev => prev.map(c => 
      c.id === id ? { ...c, title: newTitle } : c
    ));
    setEditingId(null);
  };

  const handleDeleteConversation = () => {
    if (!conversationToDelete) return;
    setConversations(prev => prev.filter(c => c.id !== conversationToDelete));
    if (activeConversation === conversationToDelete) {
      const remaining = conversations.filter(c => c.id !== conversationToDelete);
      setActiveConversation(remaining[0]?.id || "");
    }
    setDeleteDialogOpen(false);
    setConversationToDelete(null);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-mochi-pink-light via-mochi-cream to-mochi-green-light cursor-mochi">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-card/80 backdrop-blur-sm mochi-shadow"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-72 bg-card/95 backdrop-blur-md border-r-2 border-mochi-pink-light
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        flex flex-col mochi-shadow
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-mochi-pink-light bg-gradient-to-r from-mochi-pink-light/50 to-mochi-green-light/50">
          <Link to="/" className="flex items-center justify-center">
            <img src={logo} alt="Oh, Mochi" className="h-14 w-auto drop-shadow-md hover:scale-105 transition-transform" />
          </Link>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <Button 
            variant="mochi" 
            className="w-full gap-2 group"
            onClick={handleNewConversation}
          >
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            New Chat
          </Button>
        </div>

        {/* Conversation List */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-2 py-2">
            {conversations.map(conversation => (
              <div 
                key={conversation.id}
                className={`
                  group flex items-center gap-2 p-3 rounded-2xl cursor-pointer
                  transition-all duration-300 border-2
                  ${activeConversation === conversation.id 
                    ? "bg-gradient-to-r from-mochi-pink-light to-mochi-green-light border-mochi-pink shadow-md scale-[1.02]" 
                    : "hover:bg-mochi-cream border-transparent hover:border-mochi-green-light hover:scale-[1.01]"
                  }
                `}
                onClick={() => {
                  setActiveConversation(conversation.id);
                  setSidebarOpen(false);
                }}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${activeConversation === conversation.id 
                    ? "bg-primary/20" 
                    : "bg-mochi-green-light"
                  }
                `}>
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                </div>
                
                {editingId === conversation.id ? (
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleEditConversation(conversation.id, editTitle)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEditConversation(conversation.id, editTitle);
                      }
                    }}
                    className="h-7 text-sm rounded-xl"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="flex-1 text-sm truncate text-foreground font-medium">
                    {conversation.title}
                  </span>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 rounded-xl">
                    <DropdownMenuItem 
                      className="rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(conversation.id);
                        setEditTitle(conversation.title);
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConversationToDelete(conversation.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* User Section */}
        <div className="p-3 border-t border-mochi-pink-light bg-gradient-to-r from-mochi-cream/50 to-mochi-green-light/30">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground rounded-xl">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-h-screen relative">
        <CuteDots />
        
        {/* Chat Header */}
        <header className="h-16 border-b-2 border-mochi-pink-light bg-card/80 backdrop-blur-md flex items-center justify-center px-4 gap-2">
          <Sparkles className="w-4 h-4 text-mochi-pink" />
          <h1 className="text-lg font-semibold text-foreground">
            {currentConversation?.title || "Select a conversation"}
          </h1>
          <Heart className="w-4 h-4 text-mochi-green" />
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {currentConversation?.messages.length === 0 && !isTyping && (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <div className="relative">
                  <div className="float-animation mb-6">
                    <img src={logo} alt="Oh, Mochi" className="w-36 h-auto drop-shadow-lg" />
                  </div>
                  <Heart className="absolute -top-2 -right-2 w-6 h-6 text-mochi-pink bounce-soft" />
                  <Sparkles className="absolute -bottom-1 -left-3 w-5 h-5 text-mochi-green float-animation" style={{ animationDelay: '0.5s' }} />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Hii! I'm Oh, Mochi!
                </h2>
                <p className="text-muted-foreground max-w-md text-lg">
                  Your super friendly AI buddy!<br/>
                  <span className="text-sm">Ask me anything and let's have fun together!</span>
                </p>
                <div className="flex gap-2 mt-4">
                  <span className="px-3 py-1 bg-mochi-pink-light rounded-full text-sm text-muted-foreground">Chat</span>
                  <span className="px-3 py-1 bg-mochi-green-light rounded-full text-sm text-muted-foreground">Create</span>
                  <span className="px-3 py-1 bg-mochi-cream-dark rounded-full text-sm text-muted-foreground">Learn</span>
                </div>
              </div>
            )}

            {currentConversation?.messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`
                    max-w-[80%] md:max-w-[70%] p-4 
                    ${message.role === "user"
                      ? "bg-gradient-to-br from-primary to-mochi-pink-dark text-primary-foreground rounded-3xl rounded-br-lg mochi-shadow"
                      : "bg-gradient-to-br from-mochi-green-light to-accent text-foreground rounded-3xl rounded-bl-lg border-2 border-mochi-green/30"
                    }
                  `}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-1 mb-1 text-xs text-muted-foreground">
                      <span className="font-semibold">Mochi</span>
                    </div>
                  )}
                  <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-gradient-to-br from-mochi-green-light to-accent text-foreground rounded-3xl rounded-bl-lg border-2 border-mochi-green/30">
                  <div className="flex items-center gap-1 px-4 pt-3 text-xs text-muted-foreground">
                    <span className="font-semibold">Mochi</span>
                  </div>
                  <TypingIndicator />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t-2 border-mochi-pink-light bg-card/80 backdrop-blur-md p-4">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type something sweet..."
                  className="flex-1 h-14 rounded-3xl border-2 border-mochi-pink-light focus:border-primary text-base pl-5 pr-12 bg-card cursor-mochi-text"
                  disabled={isTyping}
                />
                <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mochi-green opacity-50" />
              </div>
              <Button 
                type="submit" 
                variant="mochi" 
                size="icon" 
                className="h-14 w-14 shrink-0 rounded-full group"
                disabled={isTyping}
              >
                <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </div>
          </form>
          <div className="max-w-3xl mx-auto mt-2">
            <Footer />
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-3xl border-2 border-mochi-pink-light">
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This cannot be undone!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="rounded-xl">
              Keep it
            </Button>
            <Button variant="destructive" onClick={handleDeleteConversation} className="rounded-xl">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;