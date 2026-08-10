import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import styles from "@/styles/components/Tooltip.module.scss";

interface Props {
    content: string;
    children: React.ReactNode;
    className?: string;
}

const Tooltip = ({ content, children, className }: Props) => {
    return (
        <TooltipPrimitive.Provider delayDuration={150}>
            <TooltipPrimitive.Root>
                <TooltipPrimitive.Trigger asChild>
                    <span className={className}>{children}</span>
                </TooltipPrimitive.Trigger>
                <TooltipPrimitive.Portal>
                    <TooltipPrimitive.Content
                        className={styles.content}
                        side="top"
                        sideOffset={6}
                        collisionPadding={8}
                    >
                        {content}
                    </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
            </TooltipPrimitive.Root>
        </TooltipPrimitive.Provider>
    );
};

export default Tooltip;
