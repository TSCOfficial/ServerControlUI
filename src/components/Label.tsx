import styles from "./Label.module.css"

interface LabelProps extends React.HTMLAttributes<HTMLSpanElement>{
    type?: "primary" | "secondary" | "danger" | "success",
    size?: "small" | "default" | "large",
    children?: React.ReactNode | String
}

export default function Label({children, type = "primary", size = "default", ...props}: LabelProps) {
    const classes = styles.label +
        (type === "primary" ? " " + styles.primary : "") +
        (type === "secondary" ? " " + styles.secondary : "") +
        (type === "danger" ? " " + styles.danger : "") +
        (type === "success" ? " " + styles.success : "") +
        (size === "small" ? " " + styles.small : "") +
        (size === "default" ? " " + styles.default : "") +
        (size === "large" ? " " + styles.large : "")

    return (
        <span className={classes} {...props}>{children}</span>
    )
}