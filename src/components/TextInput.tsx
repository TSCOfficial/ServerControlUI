import type {InputHTMLAttributes, ReactNode} from "react"
import styles from "./TextInput.module.css"

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    value?: string
    placeholder?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    inputAtHover?: boolean
}

export default function TextInput({value, placeholder, onChange, inputAtHover}: TextInputProps) {
    const classes = styles.textInput +
        (inputAtHover ? ` ${styles.inputAtHover}` : "")

    return (
        <input
            className={classes}
            value={value}
            placeholder={placeholder}
            onChange={onChange}
        />
    )
}
