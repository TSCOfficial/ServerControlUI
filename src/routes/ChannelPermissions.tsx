import TreeTable, {Axis, TableData} from "../components/TreeTable.tsx";
import {useEffect, useState} from "react";
import ChannelService, {type Channel} from "../services/ChannelService.ts";
import {useToast} from "../components/ToastContext.tsx";

const channelService: ChannelService = new ChannelService()

const guildId = "1004035867679129662"

export default function ChannelPermissions() {
    const {showToast} = useToast()

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
            if (prev != undefined) {
                groupedChannels.set(uncategorizedKey, [...prev, channel])
            } else {
                groupedChannels.set(uncategorizedKey, [channel])
            }

            return;
        } else if (channel.type === "CATEGORY") {
            groupedChannels.set(channel.id, [])
            return;
        } else {
            const prev :Channel[] = groupedChannels.get(channel.parent?.id) || []
            groupedChannels.set(channel.parent?.id, [...prev, channel])
            return;
        }
    })
    const xAxis: Axis = new Axis();

    xAxis.addChild("", "Berechtigung / Kategorie", [
        new Axis().setAxis("permission-category", "Berechtigungsgruppe"),
        new Axis().setAxis("permission", "Berechtigung / Kanal")
    ])

    groupedChannels.forEach((channels: Channel[]) => {
        const category = channels.at(0)?.parent
        // @ts-ignore
        xAxis.addChild(category?.id, category ? category.name : "Unkategoirisiert",
            channels.map((channel: Channel) => {
                return new Axis().setAxis(channel.id, channel.name);
            })
        )
    })

    const yAxis: Axis = new Axis();
    yAxis.addChild("PermGr1", "PermissionGr 1", [
        new Axis().setAxis("Permission1", "Permission1"),
        new Axis().setAxis("Permission2", "Permission2"),
        new Axis().setAxis("Permission3", "Permission3"),
        new Axis().setAxis("Permission4", "Permission4"),
    ])
    yAxis.addChild("PermGr2", "PermissionGr 2", [
        new Axis().setAxis("Permission2.1", "Permission5"),
        new Axis().setAxis("Permission2.2", "Permission6"),
        new Axis().setAxis("Permission2.3", "Permission7"),
        new Axis().setAxis("Permission2.4", "Permission8"),
    ])

    const data: TableData[] = []
    data.push(
        new TableData("1050898590857445417", "Permission2", <span>Data</span>),
        new TableData("1149358621692547182", "Permission2.2", <input type={"radio"}/>),
        new TableData("1518910137870454805", "Permission2.2", null)
    )

    return (
        <>
            <h1>Berechtigungen</h1>

            <TreeTable x={xAxis} y={yAxis} data={data} />
        </>
    )
}