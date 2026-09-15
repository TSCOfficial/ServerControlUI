import styles from "./TreeTable.module.css";
import {useState} from "react";

/**
 * This interface defines an axis with either direcly list of values, or axis-children, which result in grouping
 */
export class Axis {
    value?: string[] = []
    children?: Axis[] = []

    setAxis(value?: string[], children?: Axis[]): Axis {
        this.value = value
        this.children = children;
        return this;
    }

    addChild(value: string[], children: Axis[]) {
        const childAxis = new Axis().setAxis(value, children);
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
 * @constructor
 */
export default function TreeTable({ x, y }: TreeTableProps) {
    let currentY: number = 0;
    return (
        <div className={styles.treeTable}>
            {
                x.children?.map((category: Axis) => {
                    let childrenCount = 0;
                    const children = category.children?.map((child: Axis) => {
                        currentY++;
                        return child.value?.map((value: string) => {
                            childrenCount++;
                            return <span style={{gridRow: "1 / 1"}}>{value}</span>
                        })
                    })

                    return <>
                        <span style={{gridColumn: currentY + " / " + childrenCount}}>{category.value?.join(", ")}</span>
                        {children}
                    </>
                })
            }
        </div>
    )
}