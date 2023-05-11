
// From Lecture Examples of Tetrahedron
/** Resizes the canvas to completely fill the screen */
function fillScreen() {
    let canvas = document.querySelector('canvas')
    document.body.style.margin = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    canvas.style.width = ''
    canvas.style.height = ''
    if (window.gl) {
        gl.viewport(0,0, canvas.width, canvas.height)
        window.p = m4perspNegZ(1, 70, 1.5, canvas.width, canvas.height)
    }
}

// input keys handling
window.keysBeingPressed = {}
window.addEventListener('keydown', event => keysBeingPressed[event.key] = true)
window.addEventListener('keyup', event => keysBeingPressed[event.key] = false)

window.use_fog = false

// fog mode enable/disable
window.addEventListener('keydown', (event) => {
    // console.log("keyd", event.key)
    if (event.key == "f"){
        window.use_fog = (!use_fog)
        console.log("fog mode is: ",use_fog)
    }
})