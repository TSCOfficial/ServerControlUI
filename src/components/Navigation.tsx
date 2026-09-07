import styles from "./Navigation.module.css"

export default function Navigation() {
    return (
        <nav className={styles.navBar}>
            <ul>
                <li>Kanäle</li>
                <li>Rollen</li>
            </ul>
        </nav>
    )
}