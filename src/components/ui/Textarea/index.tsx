import { ComponentProps, useId } from "react";

import { cn } from "@/utils/cn";

interface TextareaProps extends ComponentProps<"textarea"> {
  label?: string;
  error?: string;
  helperText?: string;
  textareaClassName?: string;
  invalid?: boolean;
}

const Textarea = ({
  label,
  error,
  helperText,
  invalid,
  required,
  className,
  textareaClassName,
  ref,
  ...props
}: TextareaProps) => {
  const textareaId = useId();
  const hasError = invalid || !!error;
  const errorText = error?.trim();

  return (
    <div className={cn("form-control w-full space-y-1", className)}>
      {label && (
        <label htmlFor={textareaId} className="label">
          <span
            className={cn("label-text text-[13px]", hasError && "text-red-600")}
          >
            {label} {required && <span className="ml-0.5 text-red-600">*</span>}
          </span>
        </label>
      )}
      <textarea
        ref={ref}
        required={required}
        aria-invalid={hasError}
        className={cn(
          "textarea-bordered textarea w-full focus:outline-none",
          hasError && "textarea-error",
          textareaClassName
        )}
        {...props}
        id={textareaId}
      />
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

export default Textarea;
