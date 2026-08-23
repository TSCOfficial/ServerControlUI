import styles from "./Header.module.css"
import icon from "../assets/icon.png"

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <img src={icon} alt="Logo" className={styles.logo}/>
                <h1>Server<span className={styles.headerSpan}>Control</span></h1>
            </div>

        </header>
    )
}