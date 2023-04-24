



async function parseOBJ(text) {
    // let text = await fetch(file).then(res => res.text())
  
    var objGeom = {
      attributes: { position: [], normal: [], texture: [], objcolor: [] },
      triangles: [],
    };
    var read_lines = text.split("\n");
  
    var vertex = [];
    var normal = [];
    var texture = [];
    var color = [];
  
    var vertex_idx = 0;
    var texture_idx = 0;
    var normal_idx = 0;
    var face_idx = 0;
    var attribute_idx = 0;
  
    for (var i = 0; i < read_lines.length; i++) {
      let read_words = read_lines[i].split(" ").filter((e) => e);
      if (read_words[0] == "v") {
        if ((read_words.length-1) == 3) {
          vertex[vertex_idx] = [parseFloat(read_words[1]),parseFloat(read_words[2]),parseFloat(read_words[3].split("\r")[0])]
          color[vertex_idx] = SomeGray;
        } else if (read_words.length-1 == 6) {
          vertex[vertex_idx] = [parseFloat(read_words[1]),parseFloat(read_words[2]),parseFloat(read_words[3].split("\r")[0])]
          color[vertex_idx] = [parseFloat(read_words[4]),parseFloat(read_words[5]),parseFloat(read_words[6].split("\r")[0])]
        }
        vertex_idx += 1;
      }
       if (read_words[0] == "vt") {
        texture[texture_idx] = [parseFloat(read_words[1]),parseFloat(read_words[2].split("\r")[0])]
        texture_idx += 1;
      }
       if (read_words[0] == "vn") {
        normal[normal_idx] = [parseFloat(read_words[1]),parseFloat(read_words[2]),parseFloat(read_words[3].split("\r")[0])]
        normal_idx += 1;
      }
    }
    // console.log(vertex.length)
  
    for (let i = 0; i < vertex.length; i++) {
      objGeom.attributes.position[i] = vertex[i];
      objGeom.attributes.normal[i] = [1, 1, 1];
      objGeom.attributes.texture[i] = [0, 0];
      objGeom.attributes.objcolor[i] = color[i];
    }
  
  
    for (var i = 0; i < read_lines.length; i++) {
      current_line = read_lines[i]
      let read_words = current_line.split(" ").filter(function (e) {
        return e;
      });
  
      if (read_words[0] == "f") {
        
          if ( (read_words.length-1) == 3 ) {
          if (current_line.includes("/")) {
            gl_vertex_position = [];
            for (let j = 1; j <= 3; j++) {
              split_arr = read_words[j].split("/")
              objGeom.attributes.normal[parseFloat(split_arr[0]) - 1] = normal[parseFloat(split_arr[2]) - 1]
              objGeom.attributes.texture[parseFloat(split_arr[0]) - 1] = texture[parseFloat(split_arr[1]) - 1]
              gl_vertex_position[j] = parseFloat(split_arr[0]) - 1
            }
            objGeom.triangles[face_idx] = gl_vertex_position.slice(1, 4);
            face_idx = face_idx + 1;
            attribute_idx = attribute_idx + 1;
          } else {
              objGeom.triangles[face_idx] = [read_words[1] - 1,read_words[2] - 1,read_words[3] - 1]
              face_idx +=1
          }
        } else if (read_words.length-1 > 3) {
          if ((read_words.length-1) == 4) combination_triangles = [[read_words[1], read_words[2], read_words[3]], [read_words[1], read_words[3], read_words[4]]]
          if ((read_words.length-1) == 5) combination_triangles = [[read_words[1], read_words[2], read_words[3]], [read_words[1], read_words[3], read_words[4]], [read_words[1], read_words[4], read_words[5]]]
  
  
          if (current_line.includes("/")) {
            for (let j = 0; j < combination_triangles.length; j++) {
              gl_vertex_position = [];
              for (let x = 0; x < 3; x++) {
                var vv = parseFloat(combination_triangles[j][x].split("/")[0]);
                var vt = parseFloat(combination_triangles[j][x].split("/")[1]);
                var vn = parseFloat(combination_triangles[j][x].split("/")[2]);
  
                if (vn !== "") objGeom.attributes.normal[vv - 1] = normal[vn - 1]
                if (vt !== "") objGeom.attributes.texture[vv - 1] = texture[vt - 1];
              //   else if (vn != "" && vt != "") {
              //     objGeom.attributes.normal[vv - 1] = normal[vn - 1];
              //     objGeom.attributes.texture[vv - 1] = texture[vt - 1];
              //   }
  
                gl_vertex_position[x] = vv - 1;
              }
              objGeom.triangles[face_idx] = gl_vertex_position;
              face_idx = face_idx + 1;
            }
            attribute_idx = attribute_idx + 1;
          } else {
            for (let j = 0; j < combination_triangles.length; j++) {
              objGeom.triangles[face_idx] = [
                parseFloat(read_words[1] - 1),
                parseFloat(read_words[2] - 1),
                parseFloat(read_words[3] - 1),
              ];
              face_idx = face_idx + 1;
              attribute_idx = attribute_idx + 1;
            }
          }
        }
      }
    }
    return objGeom;
  }
  