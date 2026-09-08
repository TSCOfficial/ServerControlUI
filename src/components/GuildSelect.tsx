import styles from "./GuildSelect.module.css"

export default function GuildSelect() { /* custom single select needed for images and co */
    return (
        <select className={styles.select} name="guildSelect" id="guildSelect">
            <option value="1004035867679129662">
                <img src={"https://cdn.discordapp.com/icons/1045025807065698314/d3f8368efe6b527fe08b20eb72037f6a.webp?size=240&quality=lossless"}></img>
                Testserver
        </option>
            <option value="0" disabled>Other server</option>
        </select>
    )
}