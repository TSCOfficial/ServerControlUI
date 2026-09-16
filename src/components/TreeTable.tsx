import styles from "./TreeTable.module.css";

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
    let currentX: number = 1;
    let currentY: number = x.children?.length || 0;
    console.log("Y Axis: ", y)
    return (
        <div className={styles.treeTable}>
            {
                // X-Axis
                x.children?.map((category: Axis) => {
                    const group = (
                        <span style={{gridColumnStart: currentX, gridColumnEnd: currentX + category.children?.length, gridRow: "1"}} data-row={1} className={styles.cell}>
                            {category.value}
                        </span>
                    )

                    const children = category.children?.map((child: Axis) => {
                        const cell = (
                            <span style={{gridRow: "2", gridColumn: currentX}} data-row={2} className={styles.cell} id={child.key}>{child.value}</span>
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
            {
                // y-Axis
                y.children?.map((category: Axis) => {
                    console.log("category: ", category);

                    console.log(category.children?.length);
                    const group = (
                    <span style={{
                        gridColumn: "1",
                        gridRow: currentY + " / " + category.children?.length + " span",
                    }} className={styles.cell}>{category.value}</span>
                )

                    const children = category.children?.map((child: Axis) => {
                        const cell = (
                            <span style={{gridRow: currentY, gridColumn: "2"}} className={styles.cell} id={child.key}>{child.value}</span>
                        )
                        currentY++;
                        console.log("child: ", child);
                        return cell
                    })

                    console.log("y: ", currentY)
                    return <>
                        {group}
                        {children}
                    </>
                })
            }
        </div>
    )
}