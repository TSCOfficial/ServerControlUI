import styles from "./Navigation.module.css"
import GuildSelect from "./GuildSelect.tsx";

export default function Navigation() {
    return (
        <nav className={styles.navBar}>
            <GuildSelect/>
            <ul>
                <li><a href={"/"}>
                    <svg className="icon__2ea32" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg"
                         width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path fill="currentColor" fill-rule="evenodd"
                              d="M10.99 3.16A1 1 0 1 0 9 2.84L8.15 8H4a1 1 0 0 0 0 2h3.82l-.67 4H3a1 1 0 1 0 0 2h3.82l-.8 4.84a1 1 0 0 0 1.97.32L8.85 16h4.97l-.8 4.84a1 1 0 0 0 1.97.32l.86-5.16H20a1 1 0 1 0 0-2h-3.82l.67-4H21a1 1 0 1 0 0-2h-3.82l.8-4.84a1 1 0 1 0-1.97-.32L15.15 8h-4.97l.8-4.84ZM14.15 14l.67-4H9.85l-.67 4h4.97Z"
                              clip-rule="evenodd" className=""></path>
                    </svg>
                    Kanäle
                </a></li>
                <li><a href={"/roles"}>
                    <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M20.3 5.41h-.39c-.84 0-1.52-.65-1.52-1.46v-.3c0-.9-.77-1.65-1.71-1.65H7.31c-.94 0-1.71.74-1.71 1.65v.3c0 .81-.68 1.46-1.52 1.46H3.7c-.94 0-1.7.73-1.7 1.64v3.52l.01.49c.05 3.11.94 4.69 2.92 6.63C6.72 19.46 11.58 22 11.99 22c.41 0 5.27-2.54 7.06-4.31 1.98-1.95 2.92-3.53 2.92-6.63L22 7.05c0-.9-.76-1.64-1.7-1.64Zm-8.32.03a3.15 3.15 0 1 1-.01 6.3 3.15 3.15 0 0 1 .01-6.3Zm4.52 11.67c-.97.68-2.86 1.62-3.87 2.11-.42.2-.91.2-1.33 0a40.17 40.17 0 0 1-3.82-2.1.87.87 0 0 1-.37-.85c.42-2.69 2.46-3.21 4.89-3.21 2.43 0 4.4.68 4.87 3.08a.97.97 0 0 1-.38.98l.01-.01Z"></path>
                    </svg>
                    Rollen
                </a></li>
            </ul>
        </nav>
    )
}