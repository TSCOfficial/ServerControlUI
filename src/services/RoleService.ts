import type Color from "./Color.ts";
import BaseService from "./BaseService.ts";

export interface Role {
    id: string;
    name: string;
    color: Color | null
}

export default class RoleService extends BaseService {
    constructor() {
        super("roles")
    }

    getRoles(guildId: string) {
        return this.fetch(guildId)
    }
}