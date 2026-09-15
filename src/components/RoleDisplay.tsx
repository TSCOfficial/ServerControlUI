import type {Role} from "../services/RoleService.ts";
import styles from "./RoleDisplay.module.css"

interface RoleDisplayProps {
    role: Role
}

export default function RoleDisplay({role}: RoleDisplayProps) {
    return (
        <div className={styles.roleDisplay} key={role.id}>
            {
                role.color
                    ? <div className={styles.colorIndicator} style={{backgroundColor: "rgb(" + role.color?.r + ", " + role.color?.g + ", " + role.color?.b + ")"}}/>
                    : <div className={styles.colorIndicator} style={{backgroundColor: "rgb(189, 195, 199)"}}/>
            }

            <span>{role.name}</span>
        </div>
    )
}