import BaseService from './BaseService.ts'

export default class ChannelService extends BaseService {

    constructor() {
        super("channels")
    }

    getChannels(guildId: string) {
        console.log("Fetching channels from guildId", guildId);
        return this.fetch(guildId)
    }
}