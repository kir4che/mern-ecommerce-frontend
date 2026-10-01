import { type FocusEventHandler, type Ref, useId, useState } from "react";

import { cn } from "@/utils/cn";

interface SelectProps {
  name?: string;
  label?: string;
  value?: string;
  options: { label: string; value: string }[];
  defaultText?: string;
  required?: boolean;
  className?: string;
  onChange?: (name: string, value: string) => void;
  onBlur?: FocusEventHandler<HTMLSelectElement>;
  ref?: Ref<HTMLSelectElement>;
}

const Select = ({
  name,
  label,
  value: controlledValue,
  options = [],
  defaultText,
  required = false,
  className,
  onChange,
  onBlur,
  ref,
}: SelectProps) => {
  const selectId = useId();
  const isControlled = controlledValue !== undefined;
  const [value, setValue] = useState(controlledValue ?? "");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextValue = e.target.value;
    if (!isControlled) setValue(nextValue);
    onChange?.(name ?? "", nextValue);
  };

  return (
    <div className={cn("form-control w-full space-y-1", className)}>
      {label && (
        <label htmlFor={selectId} className="label pb-0">
          <span className="label-text text-[13px]">{label}</span>
        </label>
      )}
      <select
        id={selectId}
        ref={ref}
        name={name}
        value={isControlled ? controlledValue : value}
        data-testid={selectId}
        onChange={handleChange}
        onBlur={onBlur}
        className="select-bordered select w-full cursor-pointer outline-none focus:outline-none"
        aria-label={label ?? "Select"}
        required={required}
      >
        {defaultText && (
          <option value="" disabled={required} hidden={required}>
            {defaultText}
          </option>
        )}
        {options.map(({ label: optionLabel, value: optionValue }) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
