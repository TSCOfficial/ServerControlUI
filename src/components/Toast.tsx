// src/components/Toast.tsx
import styles from "./Toast.module.css"
import type {ToastType} from "./ToastContext.tsx"

interface ToastProps {
    message: string
    type?: ToastType
    onClose: () => void
}

export default function Toast({message, type = "info", onClose}: ToastProps) {
    return (
        <div className={`${styles.toast} ${styles[type]}`} role="alert">
            <p>{message}</p>
            <button className={styles.closeButton} onClick={onClose} aria-label="Schließen">×</button>
        </div>
    )
}