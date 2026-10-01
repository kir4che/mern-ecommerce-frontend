import { cn } from "@/utils/cn";
import { ChangeEvent } from "react";

type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>;

interface CheckboxProps extends Omit<NativeInputProps, "type" | "onChange"> {
  id: string;
  label?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  labelStyle?: string;
  indeterminate?: boolean; // 是否為半選中（部分選取）
}

const Checkbox = ({
  id,
  label,
  onChange = () => {},
  className = "",
  labelStyle = "",
  indeterminate,
  ...props
}: CheckboxProps) => {
  const input = (
    <input
      type="checkbox"
      id={id}
      ref={(node) => {
        if (node) node.indeterminate = indeterminate === true;
      }}
      onChange={onChange}
      className={cn("checkbox size-5 rounded-full", !label && "m-0")}
      {...props}
    />
  );

  if (!label) return input;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {input}
      <label htmlFor={id} className={cn("text-sm", labelStyle)}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
