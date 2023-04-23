const SomeGray = new Float32Array([0.09, 0.09, 0.09, 1])
// our initial plane shape
var land_plane =
    {"triangles":
        [[0,1,2]
        ,[2,3,0]
        ]
    ,"attributes":
        {"position":
            [[-4.5,4.5,0.0]
            ,[ 4.5, 4.5,0.0]
            ,[4.5, -4.5, 0.0]
            ,[ -4.5,-4.5, 0.0]
            ],

        
              
        }
    }


    
// movement directions
window.x = 0.0
window.y = 0.0
window.z = 0.0

// camera directions
window.pitch = 0.0
window.yaw = 0.0

/** Draw one frame */
function draw() {
    gl.clearColor(...IlliniBlue) // f(...[1,2,3]) means f(1,2,3)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    
    // set up stuff for terrain
    gl.useProgram(program)

    gl.bindVertexArray(geom.vao)
    // do diffuse lighting by default and specular if chosen

    let lightdir =  normalize([1,1,-2])
    let halfway = normalize(add(lightdir, [1,1,1]))

    gl.uniform3fv(gl.getUniformLocation(program, 'lightdir'), lightdir) // light dir
    gl.uniform3fv(gl.getUniformLocation(program, 'halfway'), halfway)
    gl.uniform3fv(gl.getUniformLocation(program, 'lightcolor'), [1,1,1]) // white light
    gl.uniform4fv(gl.getUniformLocation(program, 'color'), SomeGray)

    gl.uniform1i(gl.getUniformLocation(program, 'image'), 0)

    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'mv'), false, m4mul(v,m))
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'p'), false, p)
    gl.drawElements(geom.mode, geom.count, geom.type, 0)

    // console.log("objLoad",OBJLoad)

    if (OBJLoad) {
        glObj.useProgram(programObj)
        glObj.bindVertexArray(geomObj.vao)

        glObj.uniform3fv(glObj.getUniformLocation(programObj, 'lightdir'), lightdir) // light dir
        glObj.uniform3fv(glObj.getUniformLocation(programObj, 'halfway'), halfway)
        glObj.uniform3fv(glObj.getUniformLocation(programObj, 'lightcolor'), [1,1,1]) // white light
        glObj.uniform4fv(glObj.getUniformLocation(programObj, 'color'), SomeGray)

        glObj.uniform1i(glObj.getUniformLocation(programObj, 'image'), 0)

        glObj.uniformMatrix4fv(glObj.getUniformLocation(programObj, 'mv'), false, m4mul(v,m))
        glObj.uniformMatrix4fv(glObj.getUniformLocation(programObj, 'p'), false, p)
        glObj.drawElements(geomObj.mode, geomObj.count, geomObj.type, 0)
    }
    // console.log("geomObj from draw:",geomObj)
    // console.log("geomObj from draw:",program)
    // console.log("geom from draw:",geom)

    // // set up stuff for OBJ

    // glObj.useProgram(programObj)
    // glObj.bindVertexArray(geomObj.vao)
    // // do diffuse lighting by default and specular if chosen


    
    

}

/** Compute any time-varying or animated aspects of the scene */
function timeStep(milliseconds) {
    seconds = milliseconds/100
    // console.log("KEY PRESS:", keysBeingPressed)

    if (keysBeingPressed["w"]){
        console.log("move one step forward!")
        window.z += 0.1
    } else if (keysBeingPressed["s"]){
        console.log("move one step backward!")
        window.z -= 0.1
    } else if (keysBeingPressed["a"]){
        window.x += 0.1
        console.log("move one step to the left!")
    } else if (keysBeingPressed["d"]){
        window.x -= 0.1
        console.log("move one step to the right!")
    } else if (keysBeingPressed["ArrowUp"]){
        window.pitch -= 0.01
        console.log("turn camera up!")
    } else if (keysBeingPressed["ArrowDown"]){
        window.pitch += 0.01
        console.log("turn camera down!")
    } else if (keysBeingPressed["ArrowLeft"]){
        window.yaw += 0.01
        console.log("turn camera left!")
    } else if (keysBeingPressed["ArrowRight"]){
        window.yaw -= 0.01
        console.log("turn camera right!")
    }

    // change by translating view coordinates on the left to move camera
    // window.v = m4view([2,-5,5], [0,0,0], [0,1,0])
    
    window.v = m4mul(
        m4trans(window.x, window.y, window.z),
        // m4view([2,-5,5], [yaw,0,pitch], [0,1,0])
        m4rotX(pitch),
        m4rotY(yaw),
        // m4rotZ(seconds/20),
        // m4rotX(seconds/20),
        window.initial_view
    )

    window.m = m4rotY(seconds/10)

    draw()
    requestAnimationFrame(timeStep)
}

/** Compile, link, set up geometry */
async function setup(event) {
    window.gl = document.querySelector('canvas').getContext('webgl2',
        // optional configuration object: see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
        {antialias: false, depth:true, preserveDrawingBuffer:true}
    )
    let vs = await fetch('shaders/mp3-vs.glsl').then(res => res.text())
    let fs = await fetch('shaders/mp3-fs.glsl').then(res => res.text())

    window.program = compileAndLinkGLSL(gl, vs,fs)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    
    
    // inital matrix on render
    window.m = m4rotY(0.4)
    window.initial_view = m4mul(
        m4rotX(-0.4),
        m4view([2,-5,5], [0,0,0], [0,1,0])
    )
    
    // do terrain setup

    slices = 100
    resolution = 50

    land_plane_with_grid = computeTerrainGridTriangles(5, resolution)
    land_plane_with_faults = createRandomFaults(5, slices, land_plane_with_grid)
    addNormals(land_plane_with_faults)


    // texture
    let img = new Image();
    img.src = "texture.jpeg";
    img.addEventListener("load", (event) => {
        setUpImage(img, 0, gl);
    });


    // add texture coordinates
    addTexture(land_plane_with_faults)
    console.log(land_plane_with_faults)

    window.geom = setupGeomery(land_plane_with_faults)

    fillScreen()
    window.addEventListener('resize', fillScreen)
    requestAnimationFrame(timeStep)
}


window.addEventListener('load',setup_object)
window.addEventListener('load',setup)