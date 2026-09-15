import styles from "./GuildSelect.module.css"

export default function GuildSelect() { /* custom single select needed for images and co */
    return (
        <select className={styles.select} name="guildSelect" id="guildSelect">
            <option value="1004035867679129662">
                Testserver
        </option>
            <option value="0" disabled>Other server</option>
        </select>
    )
}