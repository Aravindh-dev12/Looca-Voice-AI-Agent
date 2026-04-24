import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  labelStart?: string;
  labelEnd?: string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, labelStart, labelEnd, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
          <span>{labelStart}</span>
          <span>{labelEnd}</span>
        </div>
        <input
          type="range"
          ref={ref}
          className={cn(
            "w-full h-[3px] bg-zinc-100 rounded-full appearance-none cursor-pointer accent-black",
            "accent-zinc-900 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-900 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-sm",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
