export default interface Color {
    r: number,
    g: number,
    b: number,
    getRGB: () => string,
}

const color: Partial<Color> = {
    getRGB: () => {
        return "rgb(" + color.r + ", " + color.g + ", " + color.b + ")"
    }
}