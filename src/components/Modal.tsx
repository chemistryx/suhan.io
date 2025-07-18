import * as DialogPrimitive from "@radix-ui/react-dialog";
import React, { createContext, useContext } from "react";
import styles from "@/styles/components/Modal.module.scss";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";

const DismissibleContext = createContext(true);
const useDismissible = () => useContext(DismissibleContext);

const Modal = ({ dismissible = true, ...props }: React.ComponentProps<typeof DialogPrimitive.Root> & { dismissible?: boolean }) => {
    return (
        <DismissibleContext.Provider value={dismissible}>
            <DialogPrimitive.Root {...props} />
        </DismissibleContext.Provider>
    );
};

const ModalTrigger = ({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) => {
    return <DialogPrimitive.Trigger {...props} />
};

const ModalPortal = ({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) => {
    return <DialogPrimitive.Portal {...props} />
};

const ModalOverlay = ({ ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) => {
    return <DialogPrimitive.Overlay className={styles.overlay} {...props} />
};

const ModalWrapper = ({ children, ...props }: React.ComponentProps<typeof DialogPrimitive.Content> & { dismissible?: boolean }) => {
    const dismissible = useDismissible();

    return (
        <ModalPortal>
            <ModalOverlay />
            <DialogPrimitive.Content className={styles.wrapper}
                onInteractOutside={(e) => !dismissible && e.preventDefault()}
                onEscapeKeyDown={(e) => !dismissible && e.preventDefault()}
                {...props}
            >
                {children}
                {/* dummy component */}
                <VisuallyHidden asChild><DialogPrimitive.Title /></VisuallyHidden>
                <VisuallyHidden asChild><DialogPrimitive.Description /></VisuallyHidden>
            </DialogPrimitive.Content>
        </ModalPortal>
    );
};

const ModalHeader = ({ children, ...props }: React.ComponentProps<"div">) => {
    const dismissible = useDismissible();

    return (
        <div className={styles.header} {...props}>
            {children}
            {dismissible &&
                <DialogPrimitive.Close className={styles.close}>
                    <X strokeWidth={1.5} />
                </DialogPrimitive.Close>
            }
        </div>
    );
};

const ModalTitle = ({ ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) => {
    return (
        <DialogPrimitive.Title className={styles.title} {...props} />
    );
};

const ModalContent = ({ ...props }: React.ComponentProps<"div">) => {
    return <div className={styles.content} {...props} />
};

export { Modal, ModalTrigger, ModalWrapper, ModalContent, ModalHeader, ModalTitle };
