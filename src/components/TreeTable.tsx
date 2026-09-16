import styles from "./TreeTable.module.css";
import {useState} from "react";

/**
 * This interface defines an axis with either direcly list of values, or axis-children, which result in grouping
 */
export class Axis {
    key: string = "";
    value?: string;
    children?: Axis[] = []

    setAxis(key: string, value?: string, children?: Axis[]): Axis {
        this.key = key;
        this.value = value
        this.children = children;
        return this;
    }

    addChild(key: string, value?: string, children?: Axis[]) {
        const childAxis = new Axis().setAxis(key, value, children);
        this.children?.push(childAxis);
    }
}

class TableData {
    x1: number = 0;
    y1: number = 0;
    x2: number = 0;
    y2: number = 0;
    data: any;

    TableData(x1: number, y1: number, x2: number, y2: number, data: any) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.data = data
    }
}

interface TreeTableProps {
    x: Axis
    y: Axis
}

/**
 * The tree-table allows to create a table, that has multiple grouped layers on the X & Y Axis
 * <p>
 *     The x-Axis defines all headers of the table where as the y-Axis only adds more context for the data rows
 * </p>
 * @param x x-Axis
 * @param y y-Axis
 * @constructor
 */
export default function TreeTable({ x, y }: TreeTableProps) {
    let currentY: number = 2; // 2 bc of the header
    console.log("Y Axis: ", y)
    return (
        <div className={styles.treeTable}>
            {
                // X-Axis
                x.children?.map((category: Axis) => {
                    let childrenCount = 0;
                    const children = category.children?.map((child: Axis) => {
                        childrenCount++;
                        return <span style={{gridRow: "2", padding: "2px 8px 2px 4px"}} data-row={2} className={styles.cell} id={child.key}>{child.value}</span>
                    })
                    return <>
                        <span style={{gridColumn: "auto / " + childrenCount + " span", gridRow: "1", padding: "2px 8px 2px 4px"}} data-row={1} className={styles.cell}>{category.value}</span>
                        {children}
                    </>
                })
            }
            {
                // y-Axis
                y.children?.map((category: Axis) => {
                    console.log("category: ", category);

                    const group = {
                        currentY++;
                    <span style={{
                        gridColumn: "1",
                        gridRow: currentY + " / " + category.children?.length + " span",
                        padding: "2px 8px 2px 4px"
                    }} data-row={1} className={styles.cell}>{category.value}</span>
                }

                    const children = category.children?.map((child: Axis) => {
                        currentY++;
                        console.log("child: ", child);
                        return <span style={{gridRow: currentY, gridColumn: "2", padding: "2px 8px 2px 4px"}} data-row={2} className={styles.cell} id={child.key}>{child.value}</span>
                    })

                    console.log("y: ", headerRowCount + currentY)
                    return <>
                        {group}
                        {children}
                    </>
                })
            }
        </div>
    )
}