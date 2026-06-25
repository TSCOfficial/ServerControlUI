import type {ButtonHTMLAttributes, ReactNode} from "react"
import styles from "./Button.module.css"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: any | ReactNode[]
    secondary?: boolean
    danger?: boolean
}

/**
 * Represents a button
 * @param param0
 * @param param0.children React nodes inside the Button
 * @param param0.secondary Whether the button is secondary
 * @param param0.danger Whether the button is marked as dangerous
 * @param param0.onClick Function to call when the button is clicked
 * @param param0.props Additional properties
 */
export default function Button({ children, secondary, danger, onClick, ...props }: ButtonProps) {
    const classes =
        styles.button +
        (secondary ? ` ${styles.secondary}` : "") +
        (danger ? ` ${styles.danger}` : "")

    return (
        <button className={classes} onClick={onClick} {...props}>
            {children}
        </button>
    )
}
