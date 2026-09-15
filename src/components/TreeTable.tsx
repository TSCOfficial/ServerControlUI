/**
 * This interface defines an axis with either direcly list of values, or axis-children, which result in grouping
 */
export class Axis implements Axis {
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
interface TreeTableProps {
    x: Axis
    y: Axis
}

/**
 * The tree-table allows to create a table, that has multiple grouped layers on the X & Y Axis
 * @constructor
 */
export default function TreeTable({ x, y }: TreeTableProps) {
    console.log("xAxis: ", x);

    return (
        x.children?.map((category: Axis) => {
            console.log("category: ", category);
            const children = category.children?.map((child: Axis) => {
                console.log("child: ", child);
                return <li>{child.value?.join(", ")}</li>
            })

            return <ul>
                {category.value?.join(", ")}
                {children}
            </ul>
        })
    )
}