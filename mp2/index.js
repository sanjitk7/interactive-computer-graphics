// radio button one - animation
function draw1(milliseconds) {
    gl.clearColor(1, 0.373, 0.02, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    window.pending = requestAnimationFrame(draw1)
}

// radio button two - animation
function draw2() {
    gl.clearColor(0.075, 0.16, 0.292, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    window.pending = requestAnimationFrame(draw2)
}


/** Callback for when the radio button selection changes */
function radioChanged() {
    let chosen = document.querySelector('input[name="example"]:checked').value
    cancelAnimationFrame(window.pending)
    window.pending = requestAnimationFrame(window['draw'+chosen])
}

/** Resizes the canvas to be a square that fits on the screen with at least 20% vertical padding */
function resizeCanvas() {
    let c = document.querySelector('canvas')
    c.width = c.parentElement.clientWidth
    c.height = document.documentElement.clientHeight * 0.8
    console.log(c.width, c.height)
    if (c.width > c.height) c.width = c.height
    else c.height = c.width
}

// wait for all parts of the webpage to load and trigger graphics creation on radio button selection
window.addEventListener('load',(event)=>{
    resizeCanvas()
    window.gl = document.querySelector('canvas').getContext('webgl2')
    document.querySelectorAll('input[name="example"]').forEach(elem => {
        elem.addEventListener('change', radioChanged)
    })
    radioChanged()
})