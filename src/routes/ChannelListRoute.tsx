import styles from "./ChannelList.module.css"
import Button from "../components/Button.tsx";
import {useEffect, useState} from "react";
import ChannelService, {type Channel, type ProgressEvent} from "../services/ChannelService.ts";

const CHANNEL_TYPES = ["TEXT", "VOICE", "CATEGORY", "FORUM", "STAGE", "NEWS"]

const channelService: ChannelService = new ChannelService()

const guildId = "1004035867679129662"
export default function ChannelListRoute() {

    const [channels, setChannels] = useState<Channel[]>([])
    // Index of the channel being dragged, null beeing none draged
    const [dragIndex, setDragIndex] = useState<number | null>(null)

    useEffect(() => {
        channelService.getChannels(guildId).then((channels: Channel[]) => {
            return setChannels(channels || []);
        })
    }, [])

    /**
     * Update channel fields
     * @param id Id of the channel to update
     * @param patch Changed fields
     */
    function updateChannel(id: string | null, patch: Partial<Channel>) {
        setChannels(prev => {
            const updated = prev.map(channel =>
                channel.id === id ? { ...channel, ...patch } : channel
            )
            return recalcPositions(updated)
        })
    }

    /**
     * Append new channel
     */
    function addChannel() {
        setChannels(prev => [
            ...prev,
            {id: null, position: prev.length, name: "", type: "TEXT", topic: "", parentId: null},
        ])
    }

    type ChannelTypeGroup = "CATEGORY" | "TEXT_LIKE" | "VOICE_LIKE"

    /**
     * Discord handles channel types that are similar, as a group, for some functions such as position calculation.
     * @param type
     */
    function getTypeGroup(type: string): ChannelTypeGroup {
        if (type === "CATEGORY") return "CATEGORY"
        if (type === "TEXT" || type === "NEWS" || type === "FORUM") return "TEXT_LIKE"
        // VOICE, STAGE
        return "VOICE_LIKE"
    }

    function recalcPositions(list: Channel[]): Channel[] {
        const counters: Record<ChannelTypeGroup, number> = {
            CATEGORY: 0,
            TEXT_LIKE: 0,
            VOICE_LIKE: 0,
        }

        let currentCategoryId: string | null = null

        const updatedChannels: Channel[] = list.map(channel => {
            const group = getTypeGroup(channel.type)

            if (group === "CATEGORY") {
                currentCategoryId = channel.id
                console.log("Set category id to ", currentCategoryId)
            }
            console.log("Channel's parent is ", channel.parentId)
            const position = counters[group]
            counters[group] = position + 1
            return { ...channel, position, categoryId: currentCategoryId}
        })
        return updatedChannels
    }

    /**
     * Handle channel drop
     * <br/>
     * Pushes the dragged channel to the new position
     * @param dropIndex New popsition (index) of the channel
     */
    function handleDrop(dropIndex: number) {
        if (dragIndex === null) return channels
        const copy = [...channels] // make a copy of the array to prevent chaning the original list
        const [moved] = copy.splice(dragIndex, 1) // remove channel from old position
        if (dropIndex - dragIndex <= 0) dropIndex++
        copy.splice(dropIndex, 0, moved) // paste channel to new position
        setChannels(recalcPositions(copy))
        setDragIndex(null)
    }

    /**
     * Submit channels to discord
     */
    const [progress, setProgress] = useState<ProgressEvent | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    function handleSubmit() {
        setIsSaving(true)
        setProgress(null)
        channelService.updateChannels(
            guildId,
            channels,
            (event) => setProgress(event),
            () => setIsSaving(false),
            (message) => {
                console.error(message)
                setIsSaving(false)
            }
        )
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Position</th>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Topic</th>
                </tr>
            </thead>
            <tbody>
                {
                    channels.map((channel, index) => (
                        <tr
                            key={channel.id}
                            className={channel.type === "CATEGORY" ? styles.category : ""}
                            draggable
                            onDragStart={() => {
                                setDragIndex(index)
                                console.log("Drag started", index)
                                }
                            }
                            onDragOver={e => {
                                e.preventDefault()
                                e.currentTarget.classList.add(styles.dragOver)
                                }
                            }
                            onDragLeave={e => e.currentTarget.classList.remove(styles.dragOver)}

                            onDrop={e => {
                                handleDrop(index)
                                e.currentTarget.classList.remove(styles.dragOver)
                                }
                            }
                        >
                            <td className={styles.channelPosition}>{channel.position}</td>
                            <td>
                                {
                                    channel.id !== null
                                    ? channel.type
                                    : <select
                                            value={channel.type}
                                            onChange={e => updateChannel(channel.id, {type: e.target.value})}
                                        >
                                            {CHANNEL_TYPES.map(t => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                }

                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Kanalname"
                                    value={channel.name}
                                    onChange={e => updateChannel(channel.id, {name: e.target.value})}
                                    required
                                />
                            </td>
                            <td>
                                <textarea
                                    placeholder="Kanalbeschreibung"
                                    value={channel.topic ? channel.topic : ""}
                                    onChange={e => updateChannel(channel.id, {topic: e.target.value})}
                                />
                            </td>
                        </tr>
                    ))
                }
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={4}>
                        <Button onClick={addChannel}>Kanal hinzufügen</Button>
                        <Button onClick={handleSubmit}>Speichern</Button>
                        {isSaving && progress && (
                            <p>{progress.message} ({progress.current}/{progress.total})</p>
                        )}
                    </td>
                </tr>
            </tfoot>
        </table>
    )
}