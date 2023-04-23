var OBJLoad = false


/** Compile, link, set up geometry */
async function setup_object(event) {
    console.log("Object Setup")
    window.glObj = document.querySelector('canvas').getContext('webgl2',
        // optional configuration object: see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
        {antialias: false, depth:true, preserveDrawingBuffer:true}
    )
    let vs = await fetch('shaders/mp3-obj-vs-1.glsl').then(res => res.text())
    let fs = await fetch('shaders/mp3-obj-fs-1.glsl').then(res => res.text())


    window.programObj = compileAndLinkGLSL(glObj, vs,fs)
    glObj.enable(glObj.DEPTH_TEST)
    glObj.enable(glObj.BLEND)
    glObj.blendFunc(glObj.SRC_ALPHA, glObj.ONE_MINUS_SRC_ALPHA)
    

    // texture
    let img = new Image();
    img.src = "texture.jpeg";
    img.addEventListener("load", (event) => {
        setUpImage(img, 0, glObj);
    });

    // HANDLE OBJECT FILE IF IT EXISTS ELSE DO NOTHING
    
    // object loading and parse text to geom structure
    let textTriangle = await fetch("objectFiles/triangle.obj").then((res) => res.text()).catch((e)=>console.log("object load failed!"));
    let textCube = await fetch("objectFiles/cube.obj").then((res) => res.text()).catch((e)=>console.log("object load failed!"));
    let textCow = await fetch("objectFiles/cow.obj").then((res) => res.text()).catch((e)=>console.log("object load failed!"));
    let textMonkey = await fetch("objectFiles/suzanne.obj").then((res) => res.text()).catch((e)=>console.log("object load failed!"));
    let textTeapot = await fetch("objectFiles/teapot.obj").then((res) => res.text()).catch((e)=>console.log("object load failed!"));

    let textExampleObject = await fetch("objectFiles/example.obj").then((res) => res.text()).catch((e)=>console.log("object load failed!"));

    // let objGeom = objectToGeom(textTriangle)
    window.objGeom = await parseOBJ(textExampleObject)


    // console.log("objGeom: ",objGeom)

    window.geomObj = setupGeomeryObj(objGeom)
    OBJLoad = true
    // console.log("window.geomObj",window.geomObj)






    

    // window.geom = setupGeomery("created new dictionary geometry from text read")
    // window.geom = setupGeomery(land_plane)
    
    fillScreen()
    window.addEventListener('resize', fillScreen)
    requestAnimationFrame(timeStep)
}


// window.addEventListener('load',setup_object)