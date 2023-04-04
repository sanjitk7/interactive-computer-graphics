<!DOCTYPE html>
<html>
<head>
<title>Matrix Demo</title>



<script id="frag" type="glsl">
#version 300 es
precision highp float;

uniform vec4 color;
out vec4 fragColor;

void main() {
    fragColor = color;
}
</script>



<script id="vert" type="glsl">
#version 300 es

in vec4 position;
uniform mat4 m0;

void main() {
    gl_Position = m0 * position;
}
</script>



<script>
const IlliniBlue = new Float32Array([0.075, 0.16, 0.292, 1])
const IlliniOrange = new Float32Array([1, 0.373, 0.02, 1])
const IdentityMatrix = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1])

function compileAndLinkGLSL(vs_source, fs_source) {
    let vs = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vs, vs_source)
    gl.compileShader(vs)
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(vs))
        throw Error("Vertex shader compilation failed")
    }

    let fs = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fs, fs_source)
    gl.compileShader(fs)
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(fs))
        throw Error("Fragment shader compilation failed")
    }

    window.program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program))
        throw Error("Linking failed")
    }
}

function setupGeomery(geom) {
    var triangleArray = gl.createVertexArray()
    gl.bindVertexArray(triangleArray)

    let buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    let f32 = new Float32Array(geom.position.flat())
    gl.bufferData(gl.ARRAY_BUFFER, f32, gl.STATIC_DRAW)
    let loc = gl.getAttribLocation(program, 'position')
    gl.vertexAttribPointer(loc, geom.position[0].length, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(loc)

    var indices = new Uint16Array(geom.triangles.flat())
    var indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    return {
        mode:gl.TRIANGLES,      // grab 3 indices per triangle
        count:indices.length,   // out of this many indices overall
        type:gl.UNSIGNED_SHORT, // each index is stored as a Uint16
        vao:triangleArray       // and this VAO knows which buffers to use
    }
}

function readInputs(i) {
    let ans = new Float32Array(16)
    for(let row=0; row<4; row+=1) {
        for(let col=0; col<4; col+=1) {
            let num = document.querySelector('#m'+i+'_'+row+col).value
            ans[row+col*4] = num
        }
    }
    return ans
}

function draw() {
    gl.clearColor(0,0,0, 0) // transparent
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(program)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    let matrixBindPoints = [0,].map(i => gl.getUniformLocation(program, 'm'+i))
    let colorBindPoint = gl.getUniformLocation(program, 'color')

    gl.bindVertexArray(geom.vao)

    gl.uniform4fv(colorBindPoint, IlliniOrange)
    matrixBindPoints.forEach((bp,i) => gl.uniformMatrix4fv(bp, false, readInputs(i)))
    gl.drawElements(geom.mode, geom.count, geom.type, 0)

    gl.uniform4fv(colorBindPoint, IlliniBlue)
    matrixBindPoints.forEach(bp => gl.uniformMatrix4fv(bp, false, IdentityMatrix))
    gl.drawElements(geom.mode, geom.count, geom.type, 0)

}

async function setup(event) {
    window.gl = document.querySelector('canvas').getContext('webgl2')
    let vs = document.querySelector('#vert').textContent.trim()
    let fs = document.querySelector('#frag').textContent.trim()
    compileAndLinkGLSL(vs,fs)
    gl.enable(gl.DEPTH_TEST)
    let data = await fetch('illinois.json').then(r=>r.json())
    window.geom = setupGeomery(data)
    requestAnimationFrame(draw)
    document.querySelectorAll('table input').forEach(elem => elem.addEventListener('input', event => requestAnimationFrame(draw)))
}

window.addEventListener('load',setup)
</script>


<style>
    input[type="number"] { width: 4em; font-size:1rem; font-weight: bold; text-align: center; }
    table, canvas { border: thin solid black; margin:1ex; display: inline-block; vertical-align: top; }
</style>
</head>
<body>
<table><tbody>
<tr>
    <td><input id="m0_00" type="number" step="any" value="1"></td>
    <td><input id="m0_01" type="number" step="any" value="0"></td>
    <td><input id="m0_02" type="number" step="any" value="0"></td>
    <td><input id="m0_03" type="number" step="any" value="0"></td>
</tr><tr>
    <td><input id="m0_10" type="number" step="any" value="0"></td>
    <td><input id="m0_11" type="number" step="any" value="1"></td>
    <td><input id="m0_12" type="number" step="any" value="0"></td>
    <td><input id="m0_13" type="number" step="any" value="0"></td>
</tr><tr>
    <td><input id="m0_20" type="number" step="any" value="0"></td>
    <td><input id="m0_21" type="number" step="any" value="0"></td>
    <td><input id="m0_22" type="number" step="any" value="1"></td>
    <td><input id="m0_23" type="number" step="any" value="0"></td>
</tr><tr>
    <td><input id="m0_30" type="number" step="any" value="0"></td>
    <td><input id="m0_31" type="number" step="any" value="0"></td>
    <td><input id="m0_32" type="number" step="any" value="0"></td>
    <td><input id="m0_33" type="number" step="any" value="1"></td>
</tr>
</tbody></table>
<canvas width="500" height="500"></canvas>
<div><form method="GET">
    <label>How many matrices should we show? <input type="number" min="1" max="9" name="n" value="1">
    </label>
</form></div>
</body>
</html>
