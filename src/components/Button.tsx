import { Slot } from "@radix-ui/react-slot";
import React, { ButtonHTMLAttributes } from "react";
import styles from "@/styles/components/Button.module.scss";

export const ButtonStyle = {
    outline: styles.outline
} as const;

export const ButtonSize = {
    small: styles.sm,
    medium: styles.md,
    large: styles.lg,
    xlarge: styles.xl
} as const;

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
    style?: typeof ButtonStyle[keyof typeof ButtonStyle];
    size?: typeof ButtonSize[keyof typeof ButtonSize];
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, Props>(({ className, asChild, children, size = ButtonSize.medium, style, ...props }, ref) => {
    const Component = asChild ? Slot : "button";
    return (
        <Component ref={ref} className={[styles.base, className, size, style].join(" ")} {...props}>{children}</Component>
    );
});

Button.displayName = "Button";

export default Button;
