import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  isPassword?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      isPassword = false,
      type = "text",
      id,
      name,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || name || label?.toLowerCase().replace(/\s+/g, "-");
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;

    const actualType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#222C39] mb-1.5"
          >
            {label}
            {props.required && <span className="text-[#D64545] ml-0.5">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#8B9AAF]">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={actualType}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId || helperId}
            className={`w-full h-11 px-3.5 ${
              leftIcon ? "pl-10" : ""
            } ${
              isPassword ? "pr-11" : ""
            } text-sm text-[#222C39] placeholder-[#8B9AAF] bg-white border ${
              error
                ? "border-[#D64545] focus:border-[#D64545] focus:ring-[#D64545]/20"
                : "border-[#E4E9F2] hover:border-[#CBD5E1] focus:border-[#3565B8] focus:ring-[#3565B8]/20"
            } rounded-xl shadow-xs transition-colors focus:outline-none focus:ring-3 disabled:bg-[#F3F7FF] disabled:text-[#8B9AAF] disabled:cursor-not-allowed ${className}`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              className="absolute right-3.5 p-1 rounded-md text-[#8B9AAF] hover:text-[#222C39] focus:outline-none focus:ring-2 focus:ring-[#3565B8] transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#D64545]"
            role="alert"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}

        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-xs text-[#8B9AAF]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
