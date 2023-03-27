
// trigger on radio button change
function radioChanged() {
    let chosen = document.querySelector('input[name="example"]:checked').value
    cancelAnimationFrame(window.pending)
    window.pending = requestAnimationFrame(window['draw'+chosen])
}

// wait for all parts of the webpage to load and trigger graphics creation on radio button selection
window.addEventListener('load',(event)=>{
    document.querySelectorAll('input[name="example"]').forEach(elem => {
        elem.addEventListener('change', radioChanged)
    })
    setup_logo()
    radioChanged()
})