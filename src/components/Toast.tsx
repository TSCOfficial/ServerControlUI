import styles from "./Toast.module.css"

interface ToastProps {
    title?: string
    message?: string
    type?: string
}
export default function Toast({title, message, type = "default"}: ToastProps) {
    const classes = styles.toast

    return (
        <div className={classes}>
            <h3>{title}</h3>
            <p>{message}</p>
        </div>
    )
}