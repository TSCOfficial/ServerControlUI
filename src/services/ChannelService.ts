import BaseService from './BaseService.ts'

/**
 * Represents the structure of a channel
 * <p>
 * Should be the same as the DTO in the backend
 */
export interface Channel {
    id: string | null
    position: number
    name: string
    type: string
    topic: string | null
}

export default class ChannelService extends BaseService {

    constructor() {
        super("channels")
    }

    getChannels(guildId: string) {
        console.log("Fetching channels from guildId", guildId);
        return this.fetch(guildId)
    }

    updateChannels(guildId: string, channels: Channel[]) {
        return this.fetch(guildId, BaseService.Method.PATCH, channels)
    }
}