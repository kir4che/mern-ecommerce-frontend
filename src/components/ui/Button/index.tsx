import { cn } from "@/utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "link" | "icon";
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconPosition?: "start" | "end";
  iconStyle?: string;
}

const variantClasses = {
  primary: "btn-primary",
  secondary: "btn-outline",
  link: "btn-link",
  icon: "p-0 bg-transparent border-transparent",
} satisfies Record<NonNullable<ButtonProps["variant"]>, string>;

const Button = ({
  type = "button",
  variant = "primary",
  icon: Icon,
  iconPosition = "start",
  iconStyle = "stroke-current",
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled}
    className={cn("btn", variantClasses[variant], className)}
    {...props}
  >
    {Icon && iconPosition === "start" && (
      <Icon className={cn("size-5 shrink-0", iconStyle)} />
    )}
    {children && <span>{children}</span>}
    {Icon && iconPosition === "end" && (
      <Icon className={cn("size-5 shrink-0", iconStyle)} />
    )}
  </button>
);

export default Button;
