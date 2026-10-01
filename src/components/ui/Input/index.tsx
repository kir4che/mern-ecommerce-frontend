import { ComponentProps, useId } from "react";

import { cn } from "@/utils/cn";

interface InputProps extends ComponentProps<"input"> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  inputClassName?: string;
  invalid?: boolean;
}

const Input = ({
  label,
  error,
  helperText,
  invalid,
  icon: Icon,
  className,
  inputClassName,
  required,
  ref,
  ...props
}: InputProps) => {
  const inputId = useId();
  const hasError = invalid || !!error;
  const errorText = error?.trim();

  return (
    <div className={cn("form-control w-full space-y-1", className)}>
      {label && (
        <label htmlFor={inputId} className="label">
          <span
            className={cn("label-text text-[13px]", hasError && "text-red-600")}
          >
            {label} {required && <span className="ml-0.5 text-red-600">*</span>}
          </span>
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <Icon
            className={cn(
              "pointer-events-none absolute left-3 z-10 size-5 text-gray-500",
              hasError && "text-red-600"
            )}
          />
        )}
        <input
          ref={ref}
          required={required}
          aria-invalid={hasError}
          className={cn(
            "input-bordered input w-full focus:outline-none",
            Icon && "pl-10",
            hasError && "input-error",
            inputClassName
          )}
          {...props}
          id={inputId}
        />
      </div>
      {(errorText || helperText) && (
        <div className="label mt-1 text-[13px]">
          <span
            className={hasError && errorText ? "text-red-600" : "text-gray-500"}
          >
            {errorText || helperText}
          </span>
        </div>
      )}
    </div>
  );
};

export default Input;
