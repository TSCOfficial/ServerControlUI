import styles from "./ChannelList.module.css"
import Button from "../components/Button.tsx"
import TextInput from "../components/TextInput.tsx"
import {useEffect, useState} from "react";
import ChannelService, {type Channel, type ProgressEvent} from "../services/ChannelService.ts";
import Label from "../components/Label.tsx";

const CHANNEL_TYPES = ["TEXT", "VOICE", "CATEGORY", "FORUM", "STAGE", "NEWS"]

const channelService: ChannelService = new ChannelService()

const guildId = "1004035867679129662"
export default function ChannelListRoute() {

    const [channels, setChannels] = useState<Channel[]>([])
    // Index of the channel being dragged, null beeing none draged
    const [dragIndex, setDragIndex] = useState<number | null>(null)

    /** The progress of the current save operation */
    const [progress, setProgress] = useState<ProgressEvent | null>(null)
    /** Whether the channels are being saved currently */
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        channelService.getChannels(guildId).then((channels: Channel[]) => {
            if (channels === undefined || channels.length === 0){
                window.alert("No channels found");
            }
            console.log("Channels", channels.length)
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
            const position = counters[group]
            counters[group] = position + 1

            if (group === "CATEGORY") {
                currentCategoryId = channel.id
                return { ...channel, position, parentId: null } // Kategorien haben nie einen Parent
            }

            return { ...channel, position, parentId: currentCategoryId}
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

    function handleSubmit() {
        const normalized = recalcPositions(channels)
        setChannels(normalized)
        setIsSaving(true)
        setProgress(null)
        channelService.updateChannels(
            guildId,
            normalized,
            (event) => setProgress(event),
            () => {
                setIsSaving(false)
                navigation.reload()
            },
            (message) => {
                console.error(message)
                setIsSaving(false)
                navigation.reload()
            }
        )
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Topic</th>
                </tr>
            </thead>
            <tbody>
                {
                    channels.map((channel, index) => {
                        const isCategory = channel.type === "CATEGORY";
                        return (
                        <tr
                            key={channel.id}
                            className={isCategory ? styles.category : ""}
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
                            <td>
                                {
                                    channel.id !== null
                                    ? <Label type={isCategory ? "primary" : "secondary"}>{channel.type}</Label>
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
                                <TextInput
                                    type="short"
                                    placeholder="Kanalname"
                                    value={channel.name}
                                    onChange={e => updateChannel(channel.id, {name: e.target.value})}
                                    required
                                    inputAtHover
                                />
                            </td>
                            <td>
                                <TextInput
                                    type="paragraph"
                                    placeholder={!isCategory ? "Kanalbeschreibung hinzufügen" : ""}
                                    value={channel.topic ? channel.topic : ""}
                                    onChange={e => updateChannel(channel.id, {topic: e.target.value})}
                                    inputAtHover
                                    disabled={isCategory}
                                />
                            </td>
                        </tr>
                    )})
                }
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={4} className={styles.actionrow}>
                        <Button onClick={addChannel}>Kanal hinzufügen</Button>
                        <Button onClick={handleSubmit} disabled={isSaving}>Speichern</Button>
                        {isSaving && progress && (
                            <p>{progress.message} ({progress.current}/{progress.total})</p>
                        )}
                    </td>
                </tr>
            </tfoot>
        </table>
    )
}