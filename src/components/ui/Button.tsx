import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router";

type Variant = "primary" | "accent" | "secondary" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-60 whitespace-nowrap active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-mirage text-sand hover:bg-blaze hover:text-white",
  accent: "bg-blaze text-white hover:bg-mirage",
  secondary: "border border-mirage/25 text-mirage hover:border-mirage hover:bg-mirage hover:text-sand",
  light: "bg-sand text-mirage hover:bg-blaze hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[15px]",
};

type CommonProps = { variant?: Variant; size?: Size; children: ReactNode; className?: string };

/** Paths starting with "/" are site pages and navigate client-side; anything else is a plain link. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href = "",
  ...props
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if (href.startsWith("/"))
    return (
      <Link to={href} className={cls} {...props}>
        {children}
      </Link>
    );
  return (
    <a href={href} className={cls} {...props}>
      {children}
    </a>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
