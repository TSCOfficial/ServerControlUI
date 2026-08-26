import type {InputHTMLAttributes} from "react"
import styles from "./TextInput.module.css"

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    value?: string
    type?: "short" | "paragraph"
    placeholder?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    inputAtHover?: boolean
    disabled?: boolean
}

export default function TextInput({value, type = "short", placeholder, onChange, inputAtHover, disabled = false}: TextInputProps) {
    const classes = styles.textInput +
        (inputAtHover ? ` ${styles.inputAtHover}` : "") +
        (type === "paragraph" ? ` ${styles.textarea}` : "")

    if (type === "paragraph") return (
            <textarea
            className={classes}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled}
        />
    )
    return (
        <input
            type="text"
            className={classes}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled}
        />
    )
}
