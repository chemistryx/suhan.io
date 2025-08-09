import { Slot } from "@radix-ui/react-slot";
import React, { ButtonHTMLAttributes } from "react";
import styles from "@/styles/components/Button.module.scss";

export const ButtonStyle = {
    solid: styles.solid,
    outline: styles.outline
} as const;

export const ButtonSize = {
    small: styles.sm,
    medium: styles.md,
    large: styles.lg,
    xlarge: styles.xl
} as const;

export const ButtonColor = {
    primary: styles.primary,
    secondary: styles.secondary
} as const;

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
    style?: typeof ButtonStyle[keyof typeof ButtonStyle];
    size?: typeof ButtonSize[keyof typeof ButtonSize];
    color?: typeof ButtonColor[keyof typeof ButtonColor];
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, Props>(({ className, asChild, children, size = ButtonSize.medium, style = ButtonStyle.solid, color = ButtonColor.primary, ...props }, ref) => {
    const Component = asChild ? Slot : "button";
    return (
        <Component ref={ref} className={[styles.base, className, size, style, color].join(" ")} {...props}>{children}</Component>
    );
});

Button.displayName = "Button";

export default Button;
