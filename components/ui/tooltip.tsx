"use client";
import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export interface TooltipContentProps extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  sideOffset?: number;
}

export const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>, TooltipContentProps>(
  ({ className, sideOffset = 6, ...props }, ref) => (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={
        'z-50 overflow-hidden rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] text-slate-200 shadow-md animate-in fade-in-0 zoom-in-95 ' +
        (className || '')
      }
      {...props}
    />
  )
);
TooltipContent.displayName = 'TooltipContent';
