import styles from "./ChannelList.module.css"
import Button from "./Button.tsx";
import {useEffect, useState} from "react";
import ChannelService from "../services/ChannelService.ts";

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

const CHANNEL_TYPES = ["TEXT", "VOICE", "CATEGORY", "FORUM", "STAGE", "NEWS"]

export default function ChannelList() {

    const [channels, setChannels] = useState<Channel[]>([])
    // Index of the channel being dragged, null beeing none draged
    const [dragIndex, setDragIndex] = useState<number | null>(null)

    useEffect(() => {
        const channelService = new ChannelService()
        channelService.getChannels("1004035867679129662").then((channels: Channel[]) => {
            return setChannels(channels || []);
        })
    }, [])

    /**
     * Update channel fields
     * @param id Id of the channel to update
     * @param patch Changed fields
     */
    function updateChannel(id: string | null, patch: Partial<Channel>) {
        setChannels(prev => prev.map(channel => (channel.id === id ? {...channel, ...patch} : channel)))
    }

    /**
     * Append new channel
     */
    function addChannel() {
        setChannels(prev => [
            ...prev,
            {id: null, position: prev.length, name: "", type: "TEXT", topic: ""},
        ])
    }

    /**
     * Handle channel drop
     * <br/>
     * Pushes the dragged channel to the new position
     * @param dropIndex New popsition (index) of the channel
     */
    function handleDrop(dropIndex: number) {
        console.log("New index (before check)", dropIndex)
        setChannels(prev => {
            if (dragIndex === null) return prev
            const copy = [...prev] // make a copy of the array to prevent chaning the original list
            const [moved] = copy.splice(dragIndex, 1) // remove channel from old position
            if (dropIndex - dragIndex <= 0) dropIndex++
            console.log("Original index", dragIndex)
            console.log("rechnung ", dropIndex - dragIndex)
            console.log("New index after check", dropIndex)
            copy.splice(dropIndex, 0, moved) // paste channel to new position
            return copy.map((c, i) => ({...c, position: i})) // redistribute positions
        })
        setDragIndex(null)
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
                    </td>
                </tr>
            </tfoot>
        </table>
    )
}
