// Setup the vertex geometry but make keep track of the buffer created and the array created as global variables AND change the gl.bufferData for dynamic draw (to be called for each vertex each time)
// also we only need the positions of the vertices to be affected by the cpu computation so we only track the position array buffers globally (not the color)
function cpuSetupGeometry(geom) {

    var triangleArray = gl.createVertexArray()
    gl.bindVertexArray(triangleArray)

    Object.entries(geom.attributes).forEach(([name,data]) => {

        if (name=="position"){
            console.log("data name:",name)
            window.buf_position = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buf_position)
            
            window.f32_position = new Float32Array(data.flat())
            gl.bufferData(gl.ARRAY_BUFFER, f32_position, gl.DYNAMIC_DRAW)
            
            let loc = gl.getAttribLocation(program, name)
            gl.vertexAttribPointer(loc, data[0].length, gl.FLOAT, false, 0, 0)
            gl.enableVertexAttribArray(loc)

        } else {
            console.log("data name:",name)
            buf = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buf)
            
            f32 = new Float32Array(data.flat())
            gl.bufferData(gl.ARRAY_BUFFER, f32, gl.DYNAMIC_DRAW)
            
            let loc = gl.getAttribLocation(program, name)
            gl.vertexAttribPointer(loc, data[0].length, gl.FLOAT, false, 0, 0)
            gl.enableVertexAttribArray(loc)
        }
        
    })


    var indices = new Uint16Array(geom.triangles.flat())

    var indexBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    return {
        mode:gl.TRIANGLES,
        count:indices.length,
        type:gl.UNSIGNED_SHORT,
        vao:triangleArray
    }
}

function draw3(milliseconds) {

    gl.clear(gl.COLOR_BUFFER_BIT) 
    gl.useProgram(program)
    let initMatrixBindingPoint = gl.getUniformLocation(program, 'initMatrix')
    gl.uniformMatrix4fv(initMatrixBindingPoint, false, initMatrix)

    gl.bindVertexArray(geom.vao)

    
    // HERE VERTEX POSITION IS UPDATED IN CPU MEMORY BY RANDOMLY CHANGING THE VALUE OF EACH INDIVIDUAL VERTEX BY A RANDOM OFFSET TO THE LEFT OR RIGHT WITH 50-50 ODDS

    //change the vertex positions here in the f32 array before binding them again
    
    for (let i = 0; i < f32_position.length; i++){

        if (milliseconds%2 == 0){
            newPosition = f32_position[i] + getRandomArbitrary(-0.009,0.009)
        } else {
            newPosition = f32_position[i] - getRandomArbitrary(-0.009,0.009)
        }

        f32_position[i] = newPosition
    }

    // this is where we call the new position bw bindVertexArray and draw elements as instructed in the optional cpu movement description
    gl.bindBuffer(gl.ARRAY_BUFFER, window.buf_position)
    gl.bufferData(gl.ARRAY_BUFFER, window.f32_position, gl.DYNAMIC_DRAW)

    gl.drawElements(geom.mode, geom.count, geom.type, 0) // then draw things

    // requestAnimationFrame calls its callback at as close to your screen's refresh rate as it can manage; its argument is a number of milliseconds that have elapsed since the page was first loaded.
    requestAnimationFrame(draw3)
}


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// initialize and setup logo draw
async function setup_cpu(event) {
    window.gl = document.querySelector('canvas').getContext('webgl2')
    let vs = await fetch('CPU/mp2-cpu-opt-vs.glsl').then(res => res.text())
    let fs = await fetch('CPU/mp2-cpu-opt-fs.glsl').then(res => res.text())
    compileAndLinkGLSL(vs,fs)
    let data = await fetch('required/logo.json').then(r=>r.json())
    
    window.geom = cpuSetupGeometry(data)
    
    console.log("cpu setup is called and data is : ",data)
    draw3()
}

// window.addEventListener('load',setup)