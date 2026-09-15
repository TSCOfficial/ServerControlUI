import BaseService from './BaseService.ts'
import type {ProgressEvent} from "./BaseService.ts";

/**
 * Represents the structure of a channel
 * <p>
 * Needs to be the same as the DTO in the backend
 */
export interface Channel {
    id: string
    position: number
    name: string
    type: string
    topic: string | null
    parent: Channel | null
    isNew: boolean
}

export default class ChannelService extends BaseService {

    constructor() {
        super("channels")
    }

    getChannels(guildId: string) {
        return this.fetch(guildId)
    }

    updateChannels(
        guildId: string,
        channels: Channel[],
        onProgress: (event: ProgressEvent) => void,
        onDone: () => void,
        onError: (message: string) => void
    ) {
        return this.fetchStream(guildId, BaseService.Method.PATCH, channels, (eventName, data) => {
            if (eventName === "progress") onProgress(data as ProgressEvent)
            else if (eventName === "done") onDone()
            else if (eventName === "error") onError(data)
        })
    }
}