"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";

type SpringOptions = {
  stiffness?: number;
  damping?: number;
  mass?: number;
  velocity?: number;
  restSpeed?: number;
  restDelta?: number;
};

const cn = (...classes: (string | undefined | false | null)[]) => {
  return classes.filter(Boolean).join(" ");
};

export type DockItemData = {
  id: number;
  icon: React.ReactNode;
  label: string;
  description?: string;
  image?: string;
  onClick: () => void;
  className?: string;
  isActive?: boolean;
};

export type MagicDockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
  variant?: "default" | "gradient" | "tooltip";
  responsive?: boolean;
};

type DockItemProps = {
  item: DockItemData;
  mouseX: React.RefObject<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
  variant: "default" | "gradient" | "tooltip";
  setHoveredIndex: React.Dispatch<React.SetStateAction<number | null>>;
  hoveredIndex: number | null;
  isTouchDevice: boolean;
};

function DockItem({
  item,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  variant,
  setHoveredIndex,
  hoveredIndex,
  isTouchDevice,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseXMotion = useMotionValue(0);
  const isHovered = useMotionValue(0);
  const x = useMotionValue(0);
  const tooltipSpringConfig = { stiffness: 100, damping: 5 };

  const rotate = useSpring(
    useTransform(x, [-100, 100], [-15, 15]),
    tooltipSpringConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-20, 20]),
    tooltipSpringConfig
  );

  useEffect(() => {
    if (hoveredIndex === item.id) {
      isHovered.set(1);
    } else {
      isHovered.set(0);
    }
  }, [hoveredIndex, item.id, isHovered]);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const distance = e.clientX - (rect.x + rect.width / 2);
      mouseXMotion.set(distance);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseXMotion, isTouchDevice]);

  const handleItemMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (isTouchDevice) return;
    const halfWidth = event.currentTarget.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  const targetSize = useTransform(
    mouseXMotion,
    [-distance, 0, distance],
    [baseItemSize, isTouchDevice ? baseItemSize : magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  const getBorderStyles = () => {
    switch (variant) {
      case "gradient":
        return "border-white group-hover:border-white dark:border-white/20";
      case "tooltip":
        return "border-white group-hover:border-white";
      default:
        return "border-white";
    }
  };

  // Determine background color based on active state
  const getBackgroundColor = () => {
    if (item.isActive) {
      return "bg-green-400"; // Green-400 background for active item
    }
    return "bg-black"; // Default black background
  };

  return (
    <motion.div
      ref={ref}
      className={`group relative ${item.className || ""}`}
      style={{
        width: size,
        height: size,
      }}
      onMouseEnter={() => !isTouchDevice && setHoveredIndex(item.id)}
      onMouseLeave={() => !isTouchDevice && setHoveredIndex(null)}
      onMouseMove={handleItemMouseMove}
      onClick={item.onClick}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      <motion.div
        className={cn(
          `relative flex h-full w-full items-center justify-center rounded-full border-2 shadow-md transition-colors duration-300 ${getBackgroundColor()}`,
          getBorderStyles()
        )}
        initial={{}}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.label}
            className="h-full w-full rounded-full object-cover object-center p-1"
          />
        ) : (
          <div className="flex items-center justify-center">{item.icon}</div>
        )}
      </motion.div>

      {!isTouchDevice && (
        <AnimatePresence>
          {hoveredIndex === item.id && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.8 }}
              animate={{
                opacity: 1,
                y: -20,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 10,
                },
              }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              style={
                variant === "tooltip"
                  ? {
                      translateX: translateX,
                      rotate: rotate,
                      whiteSpace: "nowrap",
                    }
                  : { whiteSpace: "nowrap" }
              }
              className={cn(
                "absolute z-50 -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl",
                variant === "tooltip" ? "-top-16" : "-top-12"
              )}
            >
              {variant === "tooltip" && (
                <>
                  <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                  <div className="absolute -bottom-px z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                </>
              )}
              <div className="relative z-30 text-base font-bold text-white">
                {item.label}
              </div>
              {item.description && (
                <div className="text-xs text-white/70">{item.description}</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

export default function MagicDock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 150,
  panelHeight = 64,
  dockHeight = 256,
  baseItemSize = 50,
  variant = "default",
  responsive = false,
}: MagicDockProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const mouseX = useRef<number>(Infinity as number);
  const isHovered = useMotionValue(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");

    const handleChange = (e: MediaQueryListEvent) => {
      setIsTouchDevice(e.matches);
    };

    setIsTouchDevice(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const maxHeight = Math.max(dockHeight, magnification + magnification / 2 + 4);
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  const getBgStyles = () => {
    switch (variant) {
      case "gradient":
        return "bg-black/85 backdrop-blur-md";
      case "tooltip":
        return "bg-black/70 backdrop-blur-lg";
      default:
        return "bg-black/90";
    }
  };

  // Split items into rows for mobile responsiveness with 4-5 split for 9 items
  const getItemsRows = () => {
    if (!responsive || !isTouchDevice || items.length <= 5) {
      return [items];
    }
    
    const rows = [];
    
    // Special case for 9 items: 4 on top row, 5 on bottom row
    if (items.length === 9) {
      rows.push(items.slice(0, 4));  // First 4 items
      rows.push(items.slice(4));     // Remaining 5 items
    } else {
      // Default behavior: 5 items per row
      for (let i = 0; i < items.length; i += 5) {
        rows.push(items.slice(i, i + 5));
      }
    }
    
    return rows;
  };

  const itemsRows = getItemsRows();

  return (
    <motion.div
      style={{ height, scrollbarWidth: "none" }}
      className="mx-2 flex max-w-full items-center"
    >
      {responsive && isTouchDevice && items.length > 5 ? (
        // Render multiple rows for mobile when responsive is enabled
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex flex-col gap-2">
          {itemsRows.map((row, rowIndex) => (
            <div 
              key={rowIndex} 
              className={cn(
                "flex items-end gap-4 rounded-2xl border-white border-2 pb-2 px-4",
                getBgStyles(),
                className,
                row.length === 4 ? "justify-center" : "" // Center the 4-item row
              )}
              style={{ height: panelHeight }}
            >
              {row.map((item) => (
                <DockItem
                  key={item.id}
                  item={item}
                  mouseX={mouseX}
                  spring={spring}
                  distance={distance}
                  magnification={magnification}
                  baseItemSize={baseItemSize}
                  variant={variant}
                  setHoveredIndex={setHoveredIndex}
                  hoveredIndex={hoveredIndex}
                  isTouchDevice={isTouchDevice}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        // Render single row for desktop or when responsive is disabled
        <motion.div
          onMouseMove={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (!isTouchDevice) {
              isHovered.set(1);
              mouseX.current = e.pageX;
            }
          }}
          onMouseLeave={() => {
            if (!isTouchDevice) {
              isHovered.set(0);
              mouseX.current = Infinity;
            }
          }}
          className={cn(
            `absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-end w-fit gap-4 rounded-2xl border-white border-2 pb-2 px-4 ${getBgStyles()}`,
            className
          )}
          style={{ height: panelHeight }}
          role="toolbar"
          aria-label="Application dock"
        >
          {items.map((item) => (
            <DockItem
              key={item.id}
              item={item}
              mouseX={mouseX}
              spring={spring}
              distance={distance}
              magnification={magnification}
              baseItemSize={baseItemSize}
              variant={variant}
              setHoveredIndex={setHoveredIndex}
              hoveredIndex={hoveredIndex}
              isTouchDevice={isTouchDevice}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
