import styles from "./ChannelList.module.css"
import Button from "../components/Button.tsx"
import TextInput from "../components/TextInput.tsx"
import {useEffect, useState} from "react";
import ChannelService, {type Channel, type ProgressEvent} from "../services/ChannelService.ts";
import {useToast} from "../components/ToastContext.tsx";

const CHANNEL_TYPES = ["TEXT", "VOICE", "CATEGORY", "FORUM", "STAGE", "NEWS"]

const channelService: ChannelService = new ChannelService()

const guildId = "1004035867679129662"

export default function ChannelListRoute() {
    const {showToast} = useToast()

    const [channels, setChannels] = useState<Channel[]>([])
// Index of the channel being dragged, null beeing none draged
    const [dragIndex, setDragIndex] = useState<number | null>(null)

    /** The progress of the current save operation */
    const [progress, setProgress] = useState<ProgressEvent | null>(null)
    /** Whether the channels are being saved currently */
    const [isSaving, setIsSaving] = useState(false)

    const [collapsedCategories, setCollapsedCategories] = useState<Channel[]>([])

    useEffect(() => {
        channelService.getChannels(guildId).then((channels: Channel[]) => {
            if (channels === undefined || channels.length === 0) {
                showToast("Keine Kanäle gefunden", "warning")
            }
            return setChannels(channels || [])
        })
    }, [])

    /**
     * Append new channel
     */
    function addChannel() {
        setChannels((prev: Channel[]) => [
            ...prev,
            {id: (Math.random() * 100).toString(), position: prev.length, name: "", type: "TEXT", topic: "", parentId: null, isNew: true},
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
     * @param dragIndex
     * @param setDragIndex
     * @param setChannels
     * @param channels
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
                showToast(message ?? "Speichern fehlgeschlagen", "error")
                setIsSaving(false)
                navigation.reload()
            }
        )
    }

    function displayChannel(channels: Channel[]) {
        if (channels.length == 0) {
            return (
                <tr>
                    <td>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" stroke="currentColor" strokeWidth="0" className={styles.icon} viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708"/>
                        </svg>
                    </td>
                    <td colSpan={2} className={styles.noChannels}>
                        <p>Keine Kanäle gefunden</p>
                    </td>
                </tr>
            )
        }
        let currentCategory: Channel | null = null;

        return channels.filter(channel => !collapsedCategories.includes(channel) || channel.type === "CATEGORY").map((channel: Channel, index: number) => {
            let isCategory = false;
            if (channel.type === "CATEGORY") {
                isCategory = true;
                currentCategory = channel;
            }
            const rowClasses = isCategory ? styles.category + " " : "" +
                (currentCategory != null ? currentCategory.id + " " : "")

            return (
                <tr
                    key={channel.id}
                    className={rowClasses}
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
                    <td className={styles.channelTypeIcon}>
                        {
                            channel.isNew
                                ? <select
                                    value={channel.type}
                                    onChange={e => updateChannel(channel.id, {type: e.target.value})}
                                >
                                    {CHANNEL_TYPES.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                                : resolveChannelIcon(channel.type)
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
                        {
                            isCategory ? displayCategoryActionRow(channel) : displayChannelTopic(channel)
                        }
                    </td>
                </tr>
            )
        })
    }

    function displayChannelTopic(channel: Channel) {
        return (
            <TextInput
                type="paragraph"
                placeholder="Kanalbeschreibung hinzufügen"
                value={channel.topic ? channel.topic : ""}
                onChange={e => updateChannel(channel.id, {topic: e.target.value})}
                inputAtHover
            />
        )
    }

    function displayCategoryActionRow(channel: Channel) {
        onclick = () => {
            if (channel.id != null) {
                setCollapsedCategories(prev => prev.includes(channel) ? prev.filter(c => c.id != channel.id) : [...prev, channel])
                console.log(collapsedCategories)
                setChannels(channels)
            }

        }
        return (
            <div>
                <Button secondary onClick={() => onclick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-up" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
                    </svg>
                </Button>
            </div>
        )
    }

    function resolveChannelIcon(type: string) {
        type = type.toLowerCase()
        switch (type) {
            case "text":
                return (
                    <svg className="icon__2ea32" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg"
                         width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path fill="currentColor" fill-rule="evenodd"
                              d="M10.99 3.16A1 1 0 1 0 9 2.84L8.15 8H4a1 1 0 0 0 0 2h3.82l-.67 4H3a1 1 0 1 0 0 2h3.82l-.8 4.84a1 1 0 0 0 1.97.32L8.85 16h4.97l-.8 4.84a1 1 0 0 0 1.97.32l.86-5.16H20a1 1 0 1 0 0-2h-3.82l.67-4H21a1 1 0 1 0 0-2h-3.82l.8-4.84a1 1 0 1 0-1.97-.32L15.15 8h-4.97l.8-4.84ZM14.15 14l.67-4H9.85l-.67 4h4.97Z"
                              clip-rule="evenodd" className=""></path>
                    </svg>
                );
            case "forum":
                return (
                    <svg className="icon__2ea32" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg"
                         width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path fill="currentColor"
                              d="M18.91 12.98a5.45 5.45 0 0 1 2.18 6.2c-.1.33-.09.68.1.96l.83 1.32a1 1 0 0 1-.84 1.54h-5.5A5.6 5.6 0 0 1 10 17.5a5.6 5.6 0 0 1 5.68-5.5c1.2 0 2.32.36 3.23.98Z"
                              className=""></path>
                        <path fill="currentColor"
                              d="M19.24 10.86c.32.16.72-.02.74-.38L20 10c0-4.42-4.03-8-9-8s-9 3.58-9 8c0 1.5.47 2.91 1.28 4.11.14.21.12.49-.06.67l-1.51 1.51A1 1 0 0 0 2.4 18h5.1a.5.5 0 0 0 .49-.5c0-4.2 3.5-7.5 7.68-7.5 1.28 0 2.5.3 3.56.86Z"
                              className=""></path>
                    </svg>
                )
            case "voice":
                return (
                    <svg className="icon__2ea32" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg"
                         width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path fill="currentColor"
                              d="M12 3a1 1 0 0 0-1-1h-.06a1 1 0 0 0-.74.32L5.92 7H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.92l4.28 4.68a1 1 0 0 0 .74.32H11a1 1 0 0 0 1-1V3ZM15.1 20.75c-.58.14-1.1-.33-1.1-.92v-.03c0-.5.37-.92.85-1.05a7 7 0 0 0 0-13.5A1.11 1.11 0 0 1 14 4.2v-.03c0-.6.52-1.06 1.1-.92a9 9 0 0 1 0 17.5Z"
                              className=""></path>
                        <path fill="currentColor"
                              d="M15.16 16.51c-.57.28-1.16-.2-1.16-.83v-.14c0-.43.28-.8.63-1.02a3 3 0 0 0 0-5.04c-.35-.23-.63-.6-.63-1.02v-.14c0-.63.59-1.1 1.16-.83a5 5 0 0 1 0 9.02Z"
                              className=""></path>
                    </svg>
                )
            case "stage":
                return (
                    <svg className="icon__2ea32" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg"
                             width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path fill="currentColor"
                          d="M19.61 18.25a1.08 1.08 0 0 1-.07-1.33 9 9 0 1 0-15.07 0c.26.42.25.97-.08 1.33l-.02.02c-.41.44-1.12.43-1.46-.07a11 11 0 1 1 18.17 0c-.33.5-1.04.51-1.45.07l-.02-.02Z"
                          className=""></path>
                        <path fill="currentColor"
                          d="M16.83 15.23c.43.47 1.18.42 1.45-.14a7 7 0 1 0-12.57 0c.28.56 1.03.6 1.46.14l.05-.06c.3-.33.35-.81.17-1.23A4.98 4.98 0 0 1 12 7a5 5 0 0 1 4.6 6.94c-.17.42-.13.9.18 1.23l.05.06Z"
                          className=""></path>
                        <path fill="currentColor"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.33 20.03c-.25.72.12 1.5.8 1.84a10.96 10.96 0 0 0 9.73 0 1.52 1.52 0 0 0 .8-1.84 6 6 0 0 0-11.33 0Z"
                          className=""></path>
                    </svg>
                )
            case "news":
                return (
                    <svg className="icon__2ea32" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg"
                         width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path fill="currentColor" fill-rule="evenodd"
                              d="M19.56 2a3 3 0 0 0-2.46 1.28 3.85 3.85 0 0 1-1.86 1.42l-8.9 3.18a.5.5 0 0 0-.34.47v10.09a3 3 0 0 0 2.27 2.9l.62.16c1.57.4 3.15-.56 3.55-2.12a.92.92 0 0 1 1.23-.63l2.36.94c.42.27.79.62 1.07 1.03A3 3 0 0 0 19.56 22h.94c.83 0 1.5-.67 1.5-1.5v-17c0-.83-.67-1.5-1.5-1.5h-.94Zm-8.53 15.8L8 16.7v1.73a1 1 0 0 0 .76.97l.62.15c.5.13 1-.17 1.12-.67.1-.41.29-.78.53-1.1Z"
                              clip-rule="evenodd" className=""></path>
                        <path fill="currentColor"
                              d="M2 10c0-1.1.9-2 2-2h.5c.28 0 .5.22.5.5v7a.5.5 0 0 1-.5.5H4a2 2 0 0 1-2-2v-4Z"
                              className=""></path>
                    </svg>
                )
            case "category":
                return (
                    <svg className="channelIcon__6ae25" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg"
                         width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path fill="currentColor"
                              d="M2 5a3 3 0 0 1 3-3h3.93a2 2 0 0 1 1.66.9L12 5h7a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5Z"
                              className=""></path>
                    </svg>
                )
            default:
                return type;
        }
    }

    /**
     * Update channel fields
     * @param id Id of the channel to update
     * @param setChannels
     * @param patch Changed fields
     */
    function updateChannel(internal_id: string, patch: Partial<Channel>) {
        setChannels((prev: Channel[]) => {
            const updated = prev.map((channel: Channel) =>
                channel.id === internal_id ? {...channel, ...patch} : channel
            )
            return recalcPositions(updated)
        })
    }

    return (
        <table>
            <thead>
            <tr>
                <th></th>
                <th>Name</th>
                <th>Topic</th>
            </tr>
            </thead>
            <tbody>
            {
                displayChannel(channels)
            }
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={3} className={styles.actionrow}>
                        <Button onClick={handleSubmit} disabled={isSaving || channels.length == 0}>Speichern</Button>
                        <Button onClick={addChannel} secondary disabled={channels.length == 0}>Kanal hinzufügen</Button>

                        {isSaving && progress && (
                            <p>{progress.message} ({progress.current}/{progress.total})</p>
                        )}
                    </td>
                </tr>
            </tfoot>
        </table>
    )
}

