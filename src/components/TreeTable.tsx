import styles from "./TreeTable.module.css";
import  {type ReactNode} from "react";
import * as React from "react";

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

/**
 * table data structure for the tree table
 * @param x x-Axis identifier
 * @param y y-Axis identifier
 * @param data the data to display (as {@link ReactNode}) if the data is null, the cell is marked as disabled
 */
export class TableData {
    x: string = "";
    y: string = "";
    data: ReactNode = null;

    constructor(x: string, y: string, data: ReactNode) {
        this.x = x;
        this.y = y;
        this.data = data
    }
}

interface TreeTableProps {
    x: Axis
    y: Axis
    data: TableData[]
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
export default function TreeTable({ x, y, data}: TreeTableProps) {
    let currentX: number = 1;
    let currentY: number = x.children?.length || 0;
    return (
        <div className={styles.treeTable}>
            {
                // X-Axis
                generateXAxis(x)
            }
            {
                // y-Axis
                generateYAxis(y)
            }
            {
                generateDataCells(data)
            }
        </div>
    )

    function fillEmptySpace() {
        const table = document.getElementsByClassName(styles.treeTable).item(0)
        // todo count maximum cells on each axis
        // todo save the set positions of existing cells
        // todo remove occupied cells from cell-grid
        // todo go through cell-grid and set default cell element
    }

    function generateDataCells(data: TableData[]) {
        if (data == null) return;
        return data.map((cellData) => {
            const columnPosition = getXAxisPosition(cellData);
            const rowPosition = getYAxisPosition(cellData);

            if (cellData?.data != null) {
                return (
                    <span style={{gridColumn: columnPosition, gridRow: rowPosition}} className={styles.cell}>
                        {cellData?.data}
                    </span>
                )
            } else {
                return (
                    <span style={{gridColumn: columnPosition, gridRow: rowPosition}} className={styles.cell + " " + styles.disabled}>
                    disabled
                </span>
                )
            }

        })

    }

    /**
     * Get the position for the datacell based by its x-identifier
     * @param x x-Axis-identifier
     * @param data
     */
    function getXAxisPosition(data?: TableData) {
        const xAxisAnchor = document.getElementById(data.x);
        const columnPosition = xAxisAnchor?.style.gridColumn;
        return columnPosition
    }

    function getYAxisPosition(data?: TableData) {
        const yAxisAnchor = document.getElementById(data.y);
        const rowPosition = yAxisAnchor?.style.gridRow;
        return rowPosition;
    }

    function generateXAxis(x: Axis) {
        return x.children?.map((category: Axis) => {
            const group = (
                <span style={{gridColumnStart: currentX, gridColumnEnd: currentX + category.children?.length, gridRow: "1"}} data-col={currentX} data-row={1} className={styles.cell}>
                            {category.value}
                        </span>
            )

            const children = category.children?.map((child: Axis) => {
                const cell = (
                    <span style={{gridRow: "2", gridColumn: currentX}} data-col={currentX} data-row={2} className={styles.cell} id={child.key}>{child.value}</span>
                )
                currentX++;
                return cell;
            })
            return <>
                {group}
                {children}
            </>
        })
    }

    function generateYAxis(y: Axis) {
        return y.children?.map((category: Axis) => {
            const group = (
                <span style={{
                    gridColumn: "1",
                    gridRow: currentY + " / " + category.children?.length + " span",
                }} className={styles.cell} data-col={1} data-row={currentY}>{category.value}</span>
            )

            const children = category.children?.map((child: Axis) => {
                const cell = (
                    <span style={{gridRow: currentY, gridColumn: "2"}} className={styles.cell} data-col={2} data-row={currentY} id={child.key}>{child.value}</span>
                )
                currentY++;
                return cell
            })

            return <>
                {group}
                {children}
            </>
        })
    }
}