function objectToGeom(text) {
    console.log("objectToGeom")
    console.log("text: ",text)


}



async function parseOBJ(text) {

    // let text = await fetch(file).then(res => res.text())

    var data_dict = {"attributes":{"position":[], "normal":[], "texture":[], "objcolor":[]}, "triangles": []};
    var lines = text.split('\n')
    
    var vertex = []
    var normal = []
    var texture = []
    var color = []
    
    var v_c = 0;
    var tex_c = 0;
    var nor_c = 0;
    var f_c = 0;
    var attr_c = 0;
    var min_v = -100;
    var max_v = 100;

    for (var i = 0; i < lines.length; i++) {
        let points = lines[i].split(" ").filter(function(e){return e});
        if (points[0] == "v"){
            if(points.length == 4){
                var v = [parseFloat(points[1]), parseFloat(points[2]), parseFloat(points[3].split("\r")[0])]
                vertex[v_c] = v
                color[v_c] = IlliniOrange
                
            }
            else if(points.length == 7){
                var c = [parseFloat(points[4]), parseFloat(points[5]), parseFloat(points[6].split("\r")[0]), 1]
                var v = [parseFloat(points[1]), parseFloat(points[2]), parseFloat(points[3].split("\r")[0])]
                vertex[v_c] = v
                color[v_c] = c
            }
            v_c = v_c+1;
        }

        else if(points[0] == "vt"){
            var v = [parseFloat(points[1]), parseFloat(points[1].split("\r")[0])]
            texture[tex_c] = v
            tex_c = tex_c+1
        }

        else if(points[0] == "vn"){
            var v = [parseFloat(points[1]), parseFloat(points[2]), parseFloat(points[3].split("\r")[0])]
            normal[nor_c] = v
            nor_c = nor_c+1
        }
    }
    // console.log(vertex.length)

    for (let i = 0; i < vertex.length; i++) {
        data_dict.attributes.position[i] = vertex[i]
        data_dict.attributes.normal[i] = [1, 1, 1]
        data_dict.attributes.texture[i] = [0,0]
        data_dict.attributes.objcolor[i] = color[i]   
    }

    for (var i = 0; i < lines.length; i++) {
        let points = lines[i].split(" ").filter(function(e){return e});

        if(points[0] == "f"){
            if (points.length == 4 || (points.length == 5 && lines[i].includes("  ")))
            {   

                if (lines[i].includes("/")){

                    v_pos = []
                    for (let i = 1; i < 4; i++) {
                        var vv = points[i].split("/")[0]
                        var vt = points[i].split("/")[1]
                        var vn = points[i].split("/")[2]

                        data_dict.attributes.normal[vv-1] = normal[vn-1]
                        data_dict.attributes.texture[vv-1] = texture[vt-1]
                        v_pos[i] = vv-1
                    }
                    data_dict.triangles[f_c] = v_pos.slice(1, 4);
                    f_c = f_c +1
                    attr_c = attr_c+1            


                }
                else{

                    data_dict.triangles[f_c] = [points[1]-1, points[2]-1, points[3]-1]
                    f_c = f_c + 1
                }
            }

            else if (points.length > 4){
                if (points.length == 5)
                    {var tr1 = [[points[1], points[2], points[3]], [points[1], points[3], points[4]]]}
                
                if (points.length == 6)
                    {var tr1 = [[points[1], points[2], points[3]], [points[1], points[3], points[4]], [points[1], points[4], points[5]]]}
                if (lines[i].includes("/")){

                    for (let j = 0; j < tr1.length; j++) {
                        v_pos = []
                        for (let i = 0; i < 3; i++) {
                            var vv = tr1[j][i].split("/")[0]                            
                            var vt = tr1[j][i].split("/")[1]
                            var vn = tr1[j][i].split("/")[2]


                            if (vt == "" && vn != ""){
                                data_dict.attributes.texture[vv-1] = [0,0]
                                data_dict.attributes.normal[vv-1] = normal[vn-1]

                            }
                            else if (vn == "" && vt != ""){
                                data_dict.attributes.normal[vv-1] = [1,1,1]
                                data_dict.attributes.texture[vv-1] = texture[vt-1]
                            }
                            else if (vn == "" && vt == "")
                            {
                                data_dict.attributes.normal[vv-1] = [1,1,1]
                                data_dict.attributes.texture[vv-1] = [0,0]
                            }
                            else if (vn != "" && vt != ""){
                                data_dict.attributes.normal[vv-1] = normal[vn-1]
                                data_dict.attributes.texture[vv-1] = texture[vt-1]
                            }
                            
                            v_pos[i] = vv-1                    
                        }
                        data_dict.triangles[f_c] = v_pos;
                        f_c = f_c + 1
                    }
                    attr_c = attr_c+1            


                }

                else{
                    for (let j = 0; j < tr1.length; j++) {
                        data_dict.triangles[f_c] = [points[1]-1, points[2]-1, points[3]-1]
                        f_c = f_c + 1
                        attr_c = attr_c+1            
                    }
                }
            }
        }
    }
   return data_dict;
}