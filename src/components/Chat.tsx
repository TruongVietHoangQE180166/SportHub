"use client";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  ReactElement,
} from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useAnimation,
  PanInfo,
  useMotionValue,
  useTransform,
  HTMLMotionProps,
} from "framer-motion";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Send, Bot, User, Settings, Key, Trash2, X, MessageCircle } from "lucide-react";
import { GoogleGenerativeAI } from '@google/generative-ai';

// Utility function
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// AI Chat Types
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// SideSheet Types
type SheetSide = "left" | "right";

interface SideSheetContextValue {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contentProps: {
    width: string;
    className: string;
    closeThreshold: number;
    side: SheetSide;
  };
}

const SideSheetContext = createContext<SideSheetContextValue | null>(null);

const useSideSheetContext = () => {
  const context = useContext(SideSheetContext);
  if (!context) {
    throw new Error(
      "SideSheet compound components must be used within SideSheet"
    );
  }
  return context;
};

interface SideSheetRootProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  className?: string;
  side?: SheetSide;
  width?: string;
  closeThreshold?: number;
}

const SideSheetRoot = ({
  children,
  open,
  onOpenChange,
  defaultOpen,
  className,
  side = "right",
  width = "400px",
  closeThreshold = 0.3,
}: SideSheetRootProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (onOpenChange) {
        onOpenChange(newOpen);
      }
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
    },
    [onOpenChange, isControlled]
  );

  const contentProps = {
    width,
    className: className || "",
    closeThreshold,
    side,
  };

  return (
    <SideSheetContext.Provider
      value={{ isOpen, onOpenChange: handleOpenChange, contentProps }}
    >
      {children}
    </SideSheetContext.Provider>
  );
};

interface SideSheetPortalProps {
  children: React.ReactNode;
  container?: HTMLElement;
  className?: string;
}

const SideSheetPortal = ({
  children,
  container,
  className,
}: SideSheetPortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  const portalContent = className ? (
    <div className={className}>{children}</div>
  ) : (
    children
  );

  return createPortal(portalContent, container || document.body);
};

interface SideSheetOverlayProps extends HTMLMotionProps<"div"> {
  className?: string;
}

const SideSheetOverlay = forwardRef<HTMLDivElement, SideSheetOverlayProps>(
  ({ className, ...props }, ref) => {
    const { isOpen, onOpenChange } = useSideSheetContext();

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
          onOpenChange(false);
        }
      },
      [onOpenChange]
    );

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={handleClick}
        className={cn(
          "absolute inset-0 bg-black/20 backdrop-blur-sm",
          className
        )}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
        {...props}
      />
    );
  }
);
SideSheetOverlay.displayName = "SideSheetOverlay";

interface SideSheetTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}

const SideSheetTrigger = ({
  asChild,
  children,
  className,
}: SideSheetTriggerProps) => {
  const { onOpenChange } = useSideSheetContext();

  const handleClick = () => {
    onOpenChange(true);
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as ReactElement<{
      className?: string;
      onClick?: (e: React.MouseEvent) => void;
    }>;
    return React.cloneElement(child, {
      className: cn(child.props.className, className),
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e);
        handleClick();
      },
    });
  }

  return (
    <div onClick={handleClick} className={cn("cursor-pointer", className)}>
      {children}
    </div>
  );
};

interface SideSheetContentProps {
  children?: React.ReactNode;
  className?: string;
}

const SideSheetContent = ({
  children,
  className = "",
}: SideSheetContentProps) => {
  const { isOpen, onOpenChange, contentProps } = useSideSheetContext();
  const { width, closeThreshold, side } = contentProps;
  const controls = useAnimation();
  const x = useMotionValue(0);
  useTransform(x, [-100, 0], [0, 1]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [sheetWidth, setSheetWidth] = useState(0);

  const onClose = useCallback(() => onOpenChange(false), [onOpenChange]);

  const calculateWidth = useCallback(() => {
    if (typeof window !== "undefined") {
      const vw = window.innerWidth;

      let calculatedWidth;
      if (vw <= 640) {
        calculatedWidth = vw * 0.9;
      } else if (vw <= 1024) {
        calculatedWidth = vw * 0.7;
      } else {
        if (width.includes("px")) {
          calculatedWidth = parseInt(width);
        } else if (width.includes("vw")) {
          calculatedWidth = (parseInt(width) / 100) * vw;
        } else if (width.includes("%")) {
          calculatedWidth = (parseInt(width) / 100) * vw;
        } else {
          calculatedWidth = 400;
        }
      }

      return Math.min(calculatedWidth, vw * 0.95);
    }
    return 400;
  }, [width]);

  useEffect(() => {
    const updateWidth = () => {
      setSheetWidth(calculateWidth());
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, [calculateWidth]);

  const getInitialX = useCallback(() => {
    return side === "left" ? -(sheetWidth + 50) : sheetWidth + 50;
  }, [side, sheetWidth]);

  const getPositionStyles = useCallback(() => {
    if (side === "left") {
      return {
        left: 0,
        top: 0,
        bottom: 0,
      };
    } else {
      return {
        right: 0,
        top: 0,
        bottom: 0,
      };
    }
  }, [side]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      controls.start({
        x: 0,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 40,
          mass: 0.8,
        },
      });
    } else {
      document.body.style.overflow = "";
      controls.start({
        x: getInitialX(),
        transition: {
          type: "tween",
          ease: [0.25, 0.46, 0.45, 0.94],
          duration: 0.3,
        },
      });
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, controls, getInitialX]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const threshold = sheetWidth * closeThreshold;
      let shouldClose = false;

      if (side === "left") {
        shouldClose = info.offset.x < -threshold || info.velocity.x < -800;
      } else {
        shouldClose = info.offset.x > threshold || info.velocity.x > 800;
      }

      if (shouldClose) {
        onClose();
      } else {
        controls.start({
          x: 0,
          transition: {
            type: "spring",
            stiffness: 500,
            damping: 40,
          },
        });
      }
    },
    [controls, onClose, closeThreshold, sheetWidth, side]
  );

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  const getDragConstraints = useCallback(() => {
    if (side === "left") {
      return { left: -sheetWidth, right: 0 };
    } else {
      return { left: 0, right: sheetWidth };
    }
  }, [side, sheetWidth]);

  if (sheetWidth === 0) return null;

  return (
    <SideSheetPortal>
      <div
        className={cn(
          "fixed inset-0 z-[999]",
          !isOpen && "pointer-events-none"
        )}
      >
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={handleOverlayClick}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          style={{ pointerEvents: isOpen ? "auto" : "none" }}
        />
        <motion.div
          drag="x"
          dragConstraints={getDragConstraints()}
          dragElastic={0}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          animate={controls}
          initial={{ x: getInitialX() }}
          className={cn(
            "absolute bg-white dark:bg-[#0A0A0A] shadow-2xl",
            side === "left" ? "rounded-r-lg" : "rounded-l-lg",
            className
          )}
          style={{
            width: sheetWidth,
            ...getPositionStyles(),
          }}
        >
          <div className="h-full overflow-hidden flex flex-col">
            {children}
          </div>

          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 flex items-center",
              side === "left" ? "right-0 pr-2" : "left-0 pl-2"
            )}
          >
            <div className="w-2 h-16 rounded-full bg-gray-300 dark:bg-gray-700 cursor-grab active:cursor-grabbing" />
          </div>
        </motion.div>
      </div>
    </SideSheetPortal>
  );
};

interface SideSheetHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const SideSheetHeader = ({ children, className }: SideSheetHeaderProps) => {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-left pb-4", className)}>
      {children}
    </div>
  );
};

interface SideSheetTitleProps {
  children: React.ReactNode;
  className?: string;
}

const SideSheetTitle = ({ children, className }: SideSheetTitleProps) => {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
};

interface SideSheetDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const SideSheetDescription = ({
  children,
  className,
}: SideSheetDescriptionProps) => {
  return (
    <p className={cn("text-sm text-gray-600 dark:text-gray-400", className)}>
      {children}
    </p>
  );
};

interface SideSheetFooterProps {
  children: React.ReactNode;
  className?: string;
}

const SideSheetFooter = ({ children, className }: SideSheetFooterProps) => {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4",
        className
      )}
    >
      {children}
    </div>
  );
};

interface SideSheetCloseProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}

const SideSheetClose = ({
  asChild,
  children,
  className,
}: SideSheetCloseProps) => {
  const { onOpenChange } = useSideSheetContext();

  const handleClick = () => {
    onOpenChange(false);
  };

  if (asChild && React.isValidElement(children)) {
    const child = children as ReactElement<{
      className?: string;
      onClick?: (e: React.MouseEvent) => void;
    }>;
    return React.cloneElement(child, {
      className: cn(child.props.className, className),
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e);
        handleClick();
      },
    });
  }

  return (
    <button onClick={handleClick} type="button" className={cn("", className)}>
      {children}
    </button>
  );
};

// AI Chat Component integrated with SideSheet
interface AIChatSideSheetProps {
  placeholder?: string;
  side?: SheetSide;
  width?: string;
}

const AIChatSideSheet = ({ 
  placeholder = 'Nhập tin nhắn của bạn...',
  side = "left",
  width = "450px"
}: AIChatSideSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const envApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [apiKey, setApiKey] = useState(envApiKey);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(!envApiKey);
  const [tempApiKey, setTempApiKey] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getGoogleAI = () => {
    if (!apiKey) return null;
    return new GoogleGenerativeAI(apiKey);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!showSettings && isOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showSettings, isOpen]);

  const callGeminiAPI = async (prompt: string): Promise<string> => {
    const genAI = getGoogleAI();
    if (!genAI) {
      throw new Error('API Key chưa được cấu hình');
    }

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash"
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      if (error instanceof Error && error.message.includes('API_KEY')) {
        throw new Error('API key không hợp lệ hoặc đã hết quota. Vui lòng kiểm tra lại.');
      }
      
      throw new Error(`Lỗi: ${error instanceof Error ? error.message : 'Có lỗi xảy ra khi gọi API'}`);
    }
  };

  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;
    
    if (!apiKey) {
      setShowSettings(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: trimmedInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await callGeminiAPI(trimmedInput);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Lỗi: ${error instanceof Error ? error.message : 'Có lỗi xảy ra khi gọi API'}`,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    setApiKey(tempApiKey);
    setShowSettings(false);
    
    if (tempApiKey && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: 'Xin chào! Tôi là AI Assistant được hỗ trợ bởi Gemini. Tôi có thể giúp gì cho bạn hôm nay?',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInputValue('');
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-black text-white rounded-full w-16 h-16 shadow-2xl hover:shadow-gray-500/25 transition-all duration-300 transform hover:scale-110 flex items-center justify-center z-50 border-2 border-green-400"
        aria-label="Open AI Chat"
      >
        <MessageCircle className="w-8 h-8 text-green-400" />
      </button>

      {/* SideSheet with AI Chat */}
      <SideSheetRoot open={isOpen} onOpenChange={setIsOpen} side={side} width={width}>
        <SideSheetContent>
          {showSettings ? (
            // Settings View
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-black">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300">
                    <Settings className="w-4 h-4 text-green-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Cấu hình API</h2>
                </div>
                <div className="flex items-center space-x-2">
                  {apiKey && (
                    <button 
                      onClick={() => setShowSettings(false)}
                      className="text-gray-300 hover:text-white px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors font-medium border border-gray-600"
                    >
                      ← Quay lại
                    </button>
                  )}
                  <SideSheetClose asChild>
                    <button className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </SideSheetClose>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto bg-white">
                <div className="w-full max-w-sm space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-300">
                      <Key className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-2">
                      API Key Required
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {envApiKey ? 
                        'API key từ environment đã được phát hiện nhưng có vấn đề. Vui lòng nhập API key khác:' 
                        : 'Để sử dụng AI Chat, bạn cần cung cấp API key của Google Gemini'
                      }
                    </p>
                  </div>

                  {!envApiKey && (
                    <div className="bg-gray-100 border border-gray-300 rounded-xl p-4">
                      <p className="text-xs text-gray-700 leading-relaxed">
                        <strong className="text-black">Gợi ý:</strong> Bạn có thể đặt API key trong file .env.local:
                        <br />
                        <code className="bg-gray-200 text-black px-2 py-1 rounded text-xs mt-1 inline-block border border-gray-300">
                          NEXT_PUBLIC_GEMINI_API_KEY=your_key
                        </code>
                        <br />
                        <strong className="text-black mt-2 block">Cài đặt SDK:</strong>
                        <code className="bg-gray-200 text-black px-2 py-1 rounded text-xs mt-1 inline-block border border-gray-300">
                          npm install @google/generative-ai
                        </code>
                      </p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Google Gemini API Key
                      </label>
                      <input
                        type="password"
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        placeholder="Nhập API key của bạn..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all bg-white text-black placeholder-gray-500"
                        autoComplete="off"
                        spellCheck={false}
                      />
                    </div>

                    <button
                      onClick={handleSaveApiKey}
                      disabled={!tempApiKey.trim()}
                      className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:cursor-not-allowed transform active:scale-95"
                    >
                      Lưu và Bắt đầu
                    </button>
                  </div>

                  <div className="text-xs text-gray-600 text-center">
                    <p>
                      Lấy API key miễn phí tại{' '}
                      <a 
                        href="https://makersuite.google.com/app/apikey" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-500 font-medium hover:underline"
                      >
                        Google AI Studio
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Chat View
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-black flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300">
                    <Bot className="w-5 h-5 text-green-400" />
                  </div>
                  <h1 className="text-lg font-bold text-white">AI Assistant</h1>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={clearChat}
                    className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center space-x-1 border border-gray-600"
                    title="Xóa cuộc trò chuyện"
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                    <span className="hidden sm:inline text-white">Xóa</span>
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors border border-gray-600"
                    title="Cài đặt"
                  >
                    <Settings className="w-4 h-4 text-white" />
                  </button>
                  <SideSheetClose asChild>
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-white" title="Đóng chat">
                      <X className="w-4 h-4" />
                    </button>
                  </SideSheetClose>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-300">
                      <Bot className="w-8 h-8 text-green-400" />
                    </div>
                    <p className="text-gray-700 font-medium">Chưa có tin nhắn nào</p>
                    <p className="text-gray-500 text-sm mt-1">Hãy bắt đầu cuộc trò chuyện!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-end space-x-2 ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.sender === 'ai' && (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mb-1 border border-gray-300">
                          <Bot className="w-4 h-4 text-green-400" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-lg ${
                          message.sender === 'user'
                            ? 'bg-black text-white rounded-br-sm border border-gray-700'
                            : 'bg-gray-100 text-black border border-gray-300 rounded-bl-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-gray-300' : 'text-gray-500'}`}>
                          {message.timestamp.toLocaleTimeString('vi-VN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>

                      {message.sender === 'user' && (
                        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 mb-1 border border-gray-600">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))
                )}
                
                {isLoading && (
                  <div className="flex items-end space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300">
                      <Bot className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-lg border border-gray-300">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-300 p-4 bg-white flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all bg-white text-black"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white p-3 rounded-xl transition-all duration-200 disabled:cursor-not-allowed transform active:scale-95 shadow-lg hover:shadow-green-400/25 flex-shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </SideSheetContent>
      </SideSheetRoot>
    </>
  );
};

const SideSheet = SideSheetRoot;

export {
  SideSheet,
  SideSheetPortal,
  SideSheetOverlay,
  SideSheetTrigger,
  SideSheetClose,
  SideSheetContent,
  SideSheetHeader,
  SideSheetFooter,
  SideSheetTitle,
  SideSheetDescription,
  AIChatSideSheet,
};

export default AIChatSideSheet;