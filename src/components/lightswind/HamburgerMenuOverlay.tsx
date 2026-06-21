"use client";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export interface MenuItem {
  label?: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  divider?: boolean;
}

export interface HamburgerMenuOverlayProps {
  items: MenuItem[];
  /** Distance from viewport top for the button center & clip-path origin */
  buttonTop?: string;
  /** Distance from viewport left for the button center & clip-path origin */
  buttonLeft?: string;
  buttonSize?: "sm" | "md" | "lg";
  overlayBackground?: string;
  textColor?: string;
  fontSize?: "sm" | "md" | "lg" | "xl" | "2xl";
  fontFamily?: string;
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  animationDuration?: number;
  staggerDelay?: number;
  menuAlignment?: "left" | "center" | "right";
  className?: string;
  buttonClassName?: string;
  menuItemClassName?: string;
  keepOpenOnItemClick?: boolean;
  customButton?: React.ReactNode;
  ariaLabel?: string;
  onOpen?: () => void;
  onClose?: () => void;
  menuDirection?: "vertical" | "horizontal";
  enableBlur?: boolean;
  zIndex?: number;
  isOpen?: boolean;
  onToggle?: () => void;
  hideToggleButton?: boolean;
}

export const HamburgerMenuOverlay: React.FC<HamburgerMenuOverlayProps> = ({
  items = [],
  buttonTop = "60px",
  buttonLeft = "calc(100% - 60px)",
  buttonSize = "sm",
  overlayBackground = "#6c8cff",
  textColor = "#ffffff",
  fontSize = "md",
  fontFamily = '"Krona One", monospace',
  fontWeight = "bold",
  animationDuration = 1.5,
  staggerDelay = 0.1,
  menuAlignment = "left",
  className,
  buttonClassName,
  menuItemClassName,
  keepOpenOnItemClick = false,
  customButton,
  ariaLabel = "Navigation menu",
  onOpen,
  onClose,
  menuDirection = "vertical",
  enableBlur = false,
  zIndex = 1000,
  isOpen: controlledIsOpen,
  onToggle,
  hideToggleButton = false,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;
  const navRef = useRef<HTMLDivElement>(null);

  const buttonSizes = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const fontSizes = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl",
    xl: "text-5xl md:text-6xl",
    "2xl": "text-6xl md:text-7xl",
  };

  const setOpen = (v: boolean) => {
    if (controlledIsOpen === undefined) {
      setInternalOpen(v);
    }
    if (v) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };

  const toggleMenu = () => {
    if (onToggle) {
      onToggle();
    } else {
      setOpen(!isOpen);
    }
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    if (item.href && !item.onClick) {
      window.location.href = item.href;
    }
    if (!keepOpenOnItemClick) {
      setOpen(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const clipCenter = `${buttonLeft} ${buttonTop}`;

  return (
    <div className={cn("fixed inset-0", className)} style={{ zIndex, pointerEvents: "none" }}>
      <style>
        {`
          .hamburger-overlay-${zIndex} {
            position: absolute;
            inset: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background: ${overlayBackground};
            clip-path: circle(0px at ${clipCenter});
            transition: clip-path ${animationDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            ${enableBlur ? "backdrop-filter: blur(10px);" : ""}
            pointer-events: none;
          }
          
          .hamburger-overlay-${zIndex}.open {
            clip-path: circle(150% at ${clipCenter});
            pointer-events: auto;
          }
          
          .hamburger-button-${zIndex} {
            position: absolute;
            left: ${buttonLeft};
            top: ${buttonTop};
            transform: translate(-50%, -50%);
            border-radius: 9999px;
            z-index: 1;
            border: none;
            cursor: pointer;
            pointer-events: auto;
            transition: all 0.3s ease;
          }
          
          .hamburger-button-${zIndex}:hover {
            transform: translate(-50%, -50%) scale(1.1);
          }
          
          .hamburger-button-${zIndex}:focus {
            outline: 2px solid ${textColor};
            outline-offset: 2px;
          }
          
          .menu-items-${zIndex} {
            ${menuDirection === "horizontal" ? "display: flex; flex-wrap: wrap; gap: 1rem;" : ""}
            ${menuAlignment === "center" ? "text-align: center;" : ""}
            ${menuAlignment === "right" ? "text-align: right;" : ""}
          }
          
          .menu-item-${zIndex} {
            position: relative;
            list-style: none;
            padding: 0.5rem 0;
            cursor: pointer;
            transform: translateX(-200px);
            opacity: 0;
            transition: all 0.3s ease;
            font-weight: ${fontWeight};
            color: ${textColor};
            ${menuDirection === "horizontal" ? "display: inline-block; margin: 0 1rem;" : ""}
          }
          
          .menu-item-${zIndex}.visible {
            transform: translateX(0);
            opacity: 1;
          }
          
          .menu-item-${zIndex} span {
            opacity: 0.7;
            transition: opacity 0.25s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .menu-item-${zIndex}:hover span {
            opacity: 1;
          }
          
          .menu-item-${zIndex}:focus {
            outline: 2px solid ${textColor};
            outline-offset: 2px;
            border-radius: 4px;
          }
          
          .menu-divider-${zIndex} {
            cursor: default;
            pointer-events: none;
            padding: 0.25rem 0;
          }
          
          .welcome-item-${zIndex} {
            cursor: default;
            pointer-events: none;
          }
          
          .welcome-item-${zIndex} .welcome-greeting {
            opacity: 0.7;
            font-size: 0.75em;
            display: block;
          }
          
          .welcome-item-${zIndex} .username {
            font-family: var(--font-accent, 'Georgia', serif);
            font-size: 1.4em;
            color: ${textColor};
            display: block;
            margin-top: 0.15rem;
          }
          
          .menu-icon {
            opacity: 0.25;
            transition: opacity 0.25s ease;
          }
          
          .menu-item-${zIndex}:hover .menu-icon {
            opacity: 0.5;
          }

          @media (max-width: 768px) {
            .menu-items-${zIndex} {
              padding: 1rem 1.5rem;
            }
            .menu-item-${zIndex} {
              padding: 0.6rem 0;
              font-size: 1.625rem !important;
              letter-spacing: 0.02em;
            }
            .menu-item-${zIndex} .welcome-greeting {
              font-size: 0.7em;
            }
            .menu-item-${zIndex} .username {
              font-size: 1.2em;
            }
            .menu-item-${zIndex} .menu-icon svg {
              width: 22px;
              height: 22px;
            }
            .menu-divider-${zIndex} {
              padding: 0.15rem 0;
            }
          }
        `}
      </style>

      <div
        ref={navRef}
        className={cn(
          `flex flex-col items-center justify-center hamburger-overlay-${zIndex}`,
          isOpen && "open"
        )}
        aria-hidden={!isOpen}
      >
        <ul
          className={cn(
            `menu-items-${zIndex}`,
            menuDirection === "horizontal" && "flex flex-wrap"
          )}
        >
          {items.map((item, index) =>
            item.divider ? (
              <li
                key={`divider-${index}`}
                className={cn(
                  `menu-item-${zIndex} menu-divider-${zIndex}`,
                  isOpen && "visible"
                )}
                style={{
                  transitionDelay: isOpen ? `${index * staggerDelay}s` : "0s",
                }}
                aria-hidden="true"
              >
                <hr className="border-t my-2 w-full" style={{ borderColor: textColor, opacity: 0.2 }} />
              </li>
            ) : (
              <li
                key={index}
                className={cn(
                  `menu-item-${zIndex}`,
                  fontSizes[fontSize],
                  isOpen && "visible",
                  index === 0 && `welcome-item-${zIndex}`,
                  menuItemClassName
                )}
                style={{
                  transitionDelay: isOpen ? `${index * staggerDelay}s` : "0s",
                }}
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleItemClick(item);
                  }
                }}
                tabIndex={isOpen ? 0 : -1}
                role="button"
                aria-label={item.label}
              >
                <span>
                  {item.icon && <span className="menu-icon">{item.icon}</span>}
                  {item.label && index === 0 && item.label.startsWith("Welcome home,") ? (
                    <>
                      <span className="welcome-greeting">Welcome home,</span>
                      <span className="username">
                        {item.label.slice("Welcome home,".length)}
                      </span>
                    </>
                  ) : (
                    item.label || ""
                  )}
                </span>
              </li>
            )
          )}
        </ul>
      </div>

      {!hideToggleButton && (
        <button
          className={cn(
            `hamburger-button-${zIndex}`,
            buttonSizes[buttonSize],
            buttonClassName
          )}
          onClick={toggleMenu}
          aria-label={ariaLabel}
          aria-expanded={isOpen}
          aria-controls="navigation-menu"
        >
          {customButton || (
            <div className="relative w-full h-full flex items-center justify-center">
              <Menu
                className={cn(
                  "absolute transition-all duration-300",
                  isOpen
                    ? "opacity-0 rotate-45 scale-0"
                    : "opacity-100 rotate-0 scale-100"
                )}
                size={buttonSize === "sm" ? 16 : buttonSize === "md" ? 20 : 24}
                color={textColor}
              />
              <X
                className={cn(
                  "absolute transition-all duration-300",
                  isOpen
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 -rotate-45 scale-0"
                )}
                size={buttonSize === "sm" ? 16 : buttonSize === "md" ? 20 : 24}
                color={textColor}
              />
            </div>
          )}
        </button>
      )}
    </div>
  );
};

export default HamburgerMenuOverlay;
