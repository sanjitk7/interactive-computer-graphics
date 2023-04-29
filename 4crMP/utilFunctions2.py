import numpy as np

def load_data(file):
    file1 = open(file, 'r')
    Lines = file1.readlines()

    coords = []
    objects = []
    lights = []
    diffuse = np.array([1, 1, 1])
    shininess = np.array([0, 0, 0])
    ref = 1
    expose = -1
    bounces = 4
    shiny_flag = 0

    h = 0
    w = 0
    name = ""

    camera = np.array([0, 0, 0])
    forward = np.array([0, 0, -1])
    up = np.array([0, 1, 0])

    fish = 0

    aa = 0

    for ii in Lines:
        i = ii.replace('\n', '')
        tt = i.split(" ")
        tt = list(filter(None, tt))
        obj_temp = {}
        sun_temp = {}

        if len(tt) != 0:
            if tt[0] == "png":
                h = int(tt[2])
                w = int(tt[1])
                name = tt[3]

            elif tt[0] == "xyz":
                coords.append(list(np.array(tt[1:]).astype(float)))

            elif tt[0] == "trif":
                obj_temp["obj"] = "triangle"
                if int(tt[1]) > 0:
                    v1 = int(tt[1]) - 1
                else:
                    v1 = int(tt[1])

                if int(tt[2]) > 0:
                    v2 = int(tt[2]) - 1
                else:
                    v2 = int(tt[2])

                if int(tt[3]) > 0:
                    v3 = int(tt[3]) - 1
                else:
                    v3 = int(tt[3])

                obj_temp["vertex"] = np.array([coords[v1], coords[v2], coords[v3]])
                obj_temp["diffuse"] = diffuse
                obj_temp["shininess"] = shininess

                if (shininess[0] == 0.1 and shininess[1] == 0.1 and shininess[2] == 0.1) or (
                        shininess[0] == 0 and shininess[1] == 0 and shininess[2] == 0):
                    obj_temp["reflection"] = 0
                else:
                    obj_temp["reflection"] = ref

                objects.append(obj_temp)

            elif tt[0] == "sphere":
                obj_temp["obj"] = "sphere"
                obj_temp["center"] = np.array(tt[1:-1]).astype(float)
                obj_temp["radius"] = float(tt[-1])
                obj_temp["diffuse"] = diffuse
                obj_temp["shininess"] = shininess

                if (shininess[0] == 0.1 and shininess[1] == 0.1 and shininess[2] == 0.1) or (
                        shininess[0] == 0 and shininess[1] == 0 and shininess[2] == 0):
                    obj_temp["reflection"] = 0
                else:
                    obj_temp["reflection"] = ref

                objects.append(obj_temp)


            elif tt[0] == "color":
                diffuse = np.array(tt[1:]).astype(float)

            elif tt[0] == "sun":
                sun_temp["obj"] = "sun"
                sun_temp["position"] = np.array(tt[1:]).astype(float)
                sun_temp["diffuse"] = diffuse
                lights.append(sun_temp)

            elif tt[0] == "bulb":
                sun_temp["obj"] = "bulb"
                sun_temp["position"] = np.array(tt[1:]).astype(float)
                sun_temp["diffuse"] = diffuse
                lights.append(sun_temp)

            elif tt[0] == "plane":
                obj_temp["obj"] = "plane"
                obj_temp["eq"] = np.array(tt[1:]).astype(float)
                obj_temp["diffuse"] = diffuse
                obj_temp["shininess"] = shininess

                if (shininess[0] == 0.1 and shininess[1] == 0.1 and shininess[2] == 0.1) or (
                        shininess[0] == 0 and shininess[1] == 0 and shininess[2] == 0):
                    obj_temp["reflection"] = 0
                else:
                    obj_temp["reflection"] = ref
                objects.append(obj_temp)

            elif tt[0] == "shininess":
                if len(tt) == 2:
                    shininess = [float(tt[1]), float(tt[1]), float(tt[1])]
                else:
                    shininess = [float(tt[1]), float(tt[2]), float(tt[3])]

                shiny_flag = 1

            elif tt[0] == "expose":
                expose = float(tt[1])

            elif tt[0] == "bounces":
                bounces = int(tt[1])

            elif tt[0] == "eye":
                camera = np.array(tt[1:]).astype(float)

            elif tt[0] == "forward":
                forward = np.array(tt[1:]).astype(float)

            elif tt[0] == "up":
                up = np.array(tt[1:]).astype(float)

            elif tt[0] == "fisheye":
                fish = 1

            elif tt[0] == "aa":
                aa = int(tt[1])

    return name, h, w, objects, lights, bounces, expose, shiny_flag, camera, forward, up, fish, aa