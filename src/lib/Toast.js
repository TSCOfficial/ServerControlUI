export function Toast() {
    const toastElement = document.getElementById("toast")

    window.alert = (e) => {
        e.preventDefault()
        toastElement.classList.add("show")
        setTimeout(() => {
            toastElement.classList.remove("show")
        }, 3000)
    }
}