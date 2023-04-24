// creating webgl parseable js object form the OBJ file text
function objectToGeom(text) {

    // console.log("OBJECT text: ",text)
    // init all possible attributes possible from OBJ examples
    let objGeom = {
        attributes: {
            position: [],
            normal: [],
            texture:[],
            objcolor: []
        },
        triangles: []
    }

    var vertex = [];
    var normal = [];
    var texture = [];
    var color = [];

    let vertex_idx = 0
    let normal_idx = 0
    let texture_idx = 0
    let face_idx = 0
    let attribute_idx = 0

    let read_lines = text.split("\n")

    for (let i = 0; i<read_lines.length; i++){
        let read_words = read_lines[i].split(" ").filter((e)=>e)

        // handle vertices (both with and without colors)
        if (read_words[0]=="v") {
            // without colors - define color to be some random value
            if ((read_words.length-1) == 3){
                vertex[vertex_idx] = [parseFloat(points[1]),parseFloat(points[2]),parseFloat(points[3].split("\r")[0])]
                color[vertex_idx] = SomeGray
            } 
            // with colors
            else if ((read_words-1)==6) {
                vertex[vertex_idx] = [parseFloat(points[1]),parseFloat(points[2]),parseFloat(points[3].split("\r")[0])]
                color[vertex_idx] = [parseFloat(points[4]),parseFloat(points[5]),parseFloat(points[6].split("\r")[0])]
            }

            vertex_idx += 1
        }

        // handle normals
        if (read_words[0]=="vn") {
            normal[normal_idx] = [parseFloat(points[1]),parseFloat(points[2]),parseFloat(points[3].split("\r")[0])]
            normal_idx += 1
        }

        // handle texture coordinates
        if (read_words[0]=="vt") {
            texture[texture_idx] = [parseFloat(points[1]),parseFloat(points[2].split("\r")[0])]
            texture_idx += 1
        }


    }

    // set the normals and texture to default values for each vertex
    for (let i=0; i<vertex.length; i++){
        objGeom.attributes.position[i] = vertex[i]
        objGeom.attributes.objcolor[i] = color[i]
        objGeom.attributes.normal[i] = [1,1,1]
        objGeom.attributes.texture[i] = [0,0]
    }

    // handle textures and normals defined in OBJ file
    for (let i = 0; i < read_lines.length; i++){
        current_line = read_lines[i]
        let read_words = current_line.split(" ").filter((e)=>e)

        // f has 3 - 5 following indices in suzanne
        if (read_words[0]=="f"){
            // if 3
            if ((read_words.length-1)==3){
                // for normal and tex coord case
                if (current_line.includes("/")){

                    gl_vertex_position = []

                    for (let j=1; j<=3; j++){
                        split_arr = read_words[j].split("/")
                        objGeom.attributes.normal[parseFloat(split_arr[0]) - 1] = normal[parseFloat(split_arr[2]) - 1]
                        objGeom.attributes.texture[parseFloat(split_arr[0]) - 1] = normal[parseFloat(split_arr[1]) - 1]
                        gl_vertex_position[j] = parseFloat(split_arr[0]) - 1
                    }

                    objGeom.triangles[face_idx] = gl_vertex_position.slice(1,4)
                    face_idx +=1
                    attribute_idx +=1
                } else {
                    objGeom.triangles[face_idx] = [read_words[1] - 1,read_words[2] - 1,read_words[3] - 1]
                    face_idx +=1
                }
            } 
            // if 4 or 5 we need to find combinations of indices to create adjacent triangles -- from ex: https://cs418.cs.illinois.edu/website/text/obj.html
            else if ((points.length-1) > 3 ) {
                // if 4 -> 2 triangles and if 5-> 3 triangles
                if ((points.length-1) == 4) combination_triangles = [[read_words[1], read_words[2], read_words[3]], [read_words[1], read_words[3], read_words[4]]]
                if ((points.length-1) == 5) combination_triangles = [[read_words[1], read_words[2], read_words[3]], [read_words[1], read_words[3], read_words[4]], [read_words[1], read_words[4], read_words[5]]]
                
                // for normal and tex coord case
                if (current_line.includes("/")){
                    for (let j=0; j<combination_triangles.length; j++){
                        gl_vertex_position = []

                        for (let x=0; x<3 ; x++){
                            temp_vertex = parseFloat(combination_triangles[j][i].split("/")[0])
                            temp_texture = parseFloat(combination_triangles[j][i].split("/")[0])
                            temp_normal = parseFloat(combination_triangles[j][i].split("/")[0])

                            if (temp_normal !== "") objGeom.attributes.normal[temp_vertex - 1] = normal[temp_normal - 1]
                            if (temp_texture!=="") objGeom.attributes.texture[temp_vertex - 1] = texture[temp_normal - 1]

                            gl_vertex_position[x] = temp_vertex - 1
                        }
                        
                        objGeom.triangles[face_idx] = gl_vertex_position
                        face_idx +=1
                        
                    }

                    attribute_idx +=1
                } else {
                    for (let j=0 ; j< combination_triangles; j++){
                        objGeom.triangles[face_idx] = [parseFloat(read_words[1])-1,parseFloat(read_words[2])-1,parseFloat(read_words[3])-1]
                        face_idx +=1
                        attribute_idx +=1
                    }
                }
            }
        }

    }

    return objGeom

}