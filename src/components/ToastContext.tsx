// src/context/ToastContext.tsx
import {createContext, useCallback, useContext, useRef, useState, type ReactNode} from "react"
import Toast from "./Toast.tsx"
import styles from "./Toast.module.css"

export type ToastType = "info" | "success" | "error" | "warning"

interface ToastItem {
    id: number
    message: string
    type: ToastType
}

interface ToastContextValue {
    showToast: (message: string, type?: ToastType, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)
const DEFAULT_DURATION = 4000

export function ToastProvider({children}: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([])
    const nextId = useRef(0)

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const showToast = useCallback((message: string, type: ToastType = "info", duration = DEFAULT_DURATION) => {
        const id = nextId.current++
        setToasts(prev => [...prev, {id, message, type}])
        setTimeout(() => removeToast(id), duration)
    }, [removeToast])

    return (
        <ToastContext.Provider value={{showToast}}>
            {children}
            <div className={styles.toastContainer}>
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error("useToast muss innerhalb eines ToastProvider verwendet werden")
    return ctx
}