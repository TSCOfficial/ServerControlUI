import {useEffect, useState} from "react";
import RoleService, {type Role} from "../services/RoleService.ts";
import RoleDisplay from "../components/RoleDisplay.tsx";

const roleService: RoleService = new RoleService();

export default function RolesRoute() {
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        roleService.getRoles("1004035867679129662").then((roles: Role[]) => {
            setRoles(roles);
        })
    }, [])
    return (
        roles.map((role: Role) => {
            return <RoleDisplay role={role}></RoleDisplay>
        })
    )
}