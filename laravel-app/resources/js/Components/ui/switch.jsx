import * as React from "react";

const Switch = React.forwardRef(({ checked, onCheckedChange, disabled, className = "", ...props }, ref) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={`
        peer
        inline-flex
        h-6
        w-11
        shrink-0
        cursor-pointer
        items-center
        rounded-full
        border-2
        border-transparent
        transition-colors
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-offset-2
        focus-visible:ring-offset-white
        disabled:cursor-not-allowed
        disabled:opacity-50
        data-[state=checked]:bg-blue-600
        data-[state=unchecked]:bg-gray-200
        ${className}
      `}
      {...props}
      ref={ref}
    >
      <span
        data-state={checked ? "checked" : "unchecked"}
        className={`
          pointer-events-none
          block
          h-5
          w-5
          rounded-full
          bg-white
          shadow-lg
          ring-0
          transition-transform
          data-[state=checked]:translate-x-5
          data-[state=unchecked]:translate-x-0
        `}
      />
    </button>
  );
});

Switch.displayName = "Switch";

export { Switch };
