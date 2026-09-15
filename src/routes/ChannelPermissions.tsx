import TreeTable, {Axis} from "../components/TreeTable.tsx";
import {useEffect, useState} from "react";
import ChannelService, {type Channel} from "../services/ChannelService.ts";
import {useToast} from "../components/ToastContext.tsx";

const channelService: ChannelService = new ChannelService()

const guildId = "1004035867679129662"

export default function ChannelPermissions() {
    const {showToast} = useToast()

    const xAxis = new Axis().setAxis(undefined, [
        new Axis().setAxis(["Cat1"], [
            new Axis().setAxis(["Channel1", "Channel2"]),
        ]),
        new Axis().setAxis(["Cat2"], [
            new Axis().setAxis(["Channel3", "Channel4", "Channel5"]),
        ])
    ])

    const [channels, setChannels] = useState<Channel[]>([])

    useEffect(() => {
        channelService.getChannels(guildId).then((channels: Channel[]) => {
            if (channels === undefined || channels.length === 0) {
                showToast("Keine Kanäle gefunden", "warning")
            }
            return setChannels(channels || [])
        })
    }, [])

    const groupedChannels = new Map();
    const uncategorizedKey = "!{ChannelUncategorized}"
    channels.forEach(channel => {
        if (channel.parent === null && channel.type != "CATEGORY") {
            // Fallback for uncategorized channels
            const prev :Channel[] = groupedChannels.get(uncategorizedKey)
            console.log(prev)
            console.log("parent = null, type != category:", channel)
            if (prev !== undefined) {
                groupedChannels.set(uncategorizedKey, [...prev, channel])
            } else {
                groupedChannels.set(uncategorizedKey, [channel])
            }

            return;
        } else if (channel.type === "CATEGORY") {
            groupedChannels.set(channel.id, [])
            return;
        } else {
            const prev :Channel[] = groupedChannels.get(channel.parent?.id)
            groupedChannels.set(channel.parent?.id, [...prev, channel])
            return;
        }
    })
    const XAxis: Axis = new Axis();

    groupedChannels.forEach((channels: Channel[], category: Channel) => {
        console.log("categories: ", category)
        console.log("channels: ", channels)
        // @ts-ignore
        XAxis.addChild([channels?.at(0)?.parent ? channels?.at(0)?.parent?.name : "Unkategoirisiert"], [
            new Axis().setAxis(
                channels.map((channel: Channel) => {
                    return channel.name
                })
            )
        ])
    })

    return (
        <>
            <h1>Berechtigungen</h1>

            <TreeTable x={XAxis} y={new Axis()}/>
        </>
    )
}