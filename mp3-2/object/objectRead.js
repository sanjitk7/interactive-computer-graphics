function objectToGeom(text) {
  console.log("objectToGeom");
  console.log("text: ", text);
}

function checkObjHasColor(text) {
  let lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let words = lines[i].split(" ").filter(function (e) {
      return e;
    });
    if (words[0] == "v") {
      console.log("hihi", words);
      if (words.length == 7) {
        console.log("hihi", words);
        return true;
      } else {
        return false;
      }
    }
  }
}

async function parseOBJ(text) {
  // let text = await fetch(file).then(res => res.text())

  var data_dict = {
    attributes: { position: [], normal: [], texture: [], objcolor: [] },
    triangles: [],
  };
  var lines = text.split("\n");

  var vertex = [];
  var normal = [];
  var texture = [];
  var color = [];

  var v_c = 0;
  var tex_c = 0;
  var nor_c = 0;
  var f_c = 0;
  var attr_c = 0;

  for (var i = 0; i < lines.length; i++) {
    let points = lines[i].split(" ").filter((e) => e);
    if (points[0] == "v") {
      if (points.length-1 == 3) {
        var v = [
          parseFloat(points[1]),
          parseFloat(points[2]),
          parseFloat(points[3].split("\r")[0]),
        ];
        vertex[v_c] = v;
        color[v_c] = IlliniOrange;
      } else if (points.length == 7) {
        var c = [
          parseFloat(points[4]),
          parseFloat(points[5]),
          parseFloat(points[6].split("\r")[0]),
          1,
        ];
        var v = [
          parseFloat(points[1]),
          parseFloat(points[2]),
          parseFloat(points[3].split("\r")[0]),
        ];
        vertex[v_c] = v;
        color[v_c] = c;
      }
      v_c = v_c + 1;
    }
     if (points[0] == "vt") {
      var v = [parseFloat(points[1]), parseFloat(points[2].split("\r")[0])];
      texture[tex_c] = v;
      tex_c = tex_c + 1;
    }
     if (points[0] == "vn") {
      var v = [
        parseFloat(points[1]),
        parseFloat(points[2]),
        parseFloat(points[3].split("\r")[0]),
      ];
      normal[nor_c] = v;
      nor_c = nor_c + 1;
    }
  }
  // console.log(vertex.length)

  for (let i = 0; i < vertex.length; i++) {
    data_dict.attributes.position[i] = vertex[i];
    data_dict.attributes.normal[i] = [1, 1, 1];
    data_dict.attributes.texture[i] = [0, 0];
    data_dict.attributes.objcolor[i] = color[i];
  }








  for (var i = 0; i < lines.length; i++) {
    let points = lines[i].split(" ").filter(function (e) {
      return e;
    });

    if (points[0] == "f") {
      
        if ( points.length == 4 ) {
        if (lines[i].includes("/")) {
          v_pos = [];
          for (let j = 1; j < 4; j++) {
            data_dict.attributes.normal[parseFloat(points[j].split("/")[0]) - 1] = normal[parseFloat(points[j].split("/")[2]) - 1];
            data_dict.attributes.texture[parseFloat(points[j].split("/")[0]) - 1] = texture[parseFloat(points[j].split("/")[1]) - 1];
            v_pos[j] = parseFloat(points[j].split("/")[0]) - 1;
          }
          data_dict.triangles[f_c] = v_pos.slice(1, 4);
          f_c = f_c + 1;
          attr_c = attr_c + 1;
        } else {
          data_dict.triangles[f_c] = [
            points[1] - 1,
            points[2] - 1,
            points[3] - 1,
          ];
          f_c = f_c + 1;
        }
      } else if (points.length > 4) {
        if (points.length == 5) {
          var tr1 = [
            [points[1], points[2], points[3]],
            [points[1], points[3], points[4]],
          ];
        }

        if (points.length == 6) {
          var tr1 = [
            [points[1], points[2], points[3]],
            [points[1], points[3], points[4]],
            [points[1], points[4], points[5]],
          ];
        }


        if (lines[i].includes("/")) {
          for (let j = 0; j < tr1.length; j++) {
            v_pos = [];
            for (let x = 0; x < 3; x++) {
              var vv = parseFloat(tr1[j][x].split("/")[0]);
              var vt = parseFloat(tr1[j][x].split("/")[1]);
              var vn = parseFloat(tr1[j][x].split("/")[2]);

              if (vn !== "") data_dict.attributes.normal[vv - 1] = normal[vn - 1]
              if (vt != "") data_dict.attributes.texture[vv - 1] = texture[vt - 1];
            //   else if (vn != "" && vt != "") {
            //     data_dict.attributes.normal[vv - 1] = normal[vn - 1];
            //     data_dict.attributes.texture[vv - 1] = texture[vt - 1];
            //   }

              v_pos[x] = vv - 1;
            }
            data_dict.triangles[f_c] = v_pos;
            f_c = f_c + 1;
          }
          attr_c = attr_c + 1;
        } else {
          for (let j = 0; j < tr1.length; j++) {
            data_dict.triangles[f_c] = [
              parseFloat(points[1] - 1),
              parseFloat(points[2] - 1),
              parseFloat(points[3] - 1),
            ];
            f_c = f_c + 1;
            attr_c = attr_c + 1;
          }
        }
      }
    }
  }
  return data_dict;
}
