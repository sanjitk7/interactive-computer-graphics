import numpy as np
from PIL import Image

def get_commands_from_input(f_path):
    
     # get all commands from input file
    legal_command_start = ["png", "sphere","sun"]
    commands = []
    with open(f_path) as f:
        for line in f:
            # print("Line: ",line)
            if line.strip()=="":
                print("Ignored Empty String!")
                continue
            if line.strip().split()[0].strip() in legal_command_start:
                commands.append(line.strip().split())
            else:
                print("Ignored Illegal: ",line)
        # print(commands)
        return commands
    
def initScene(commands):
    objects = []
    light_sources = []
    image = None
    light_bounces = 4
    default_diffuse = np.array([1,1,1])
    default_shine = np.array([0,0,0])
    
    for command in commands:
        
        # polygon_object = {
        #     "type":None,
        #     "center":None,
        #     "radius":None
        # }
        polygon_object = {}
        light_source = {}
        
        if command[0] == "png":
            width, height, recent_open_image = int(command[1]), int(command[2]), command[3]
            image = Image.new("RGBA", (width, height), (0,0,0,0))
        
        if command[0] == "sphere":
            polygon_object["type"] = command[0]
            polygon_object["center"] = np.array([float(command[1]),float(command[2]),float(command[3])])
            polygon_object["radius"] = float(command[4])
            polygon_object["diffuse"] = default_diffuse
            polygon_object["shine"] = default_shine
            
            objects.append(polygon_object)
        
        if command[0] == "sun":
            light_source["type"] = "sun"
            light_source["position"] = np.array([float(command[1]),float(command[2]),float(command[3])])
            light_source["diffuse"] = default_diffuse
        
            light_sources.append(light_source)
    
    return image, objects, light_sources, light_bounces
        


# required
def lin2srgb(lis):
    fin = []
    for lin in lis:
        if lin > 0.0031308:
            s = 1.055 * (pow(lin, (1.0 / 2.4))) - 0.055
        else:
            s = 12.92 * lin
        fin.append(s)
    return np.array(fin)

# required
def srgb2lin(s):
    fin = []
    for c in s:
        if c <= 0.0404482362771082:
            lin = c / 12.92
        else:
            lin = pow(((c + 0.055) / 1.055), 2.4)
        fin.append(lin)
    fin = np.array(fin)

    return fin



def sphere_intersect(center, radius, ray_origin, ray_direction):
    b = 2 * np.dot(ray_direction, ray_origin - center)
    c = np.linalg.norm(ray_origin - center) ** 2 - radius ** 2
    delta = b ** 2 - 4 * c
    if delta > 0:
        t1 = (-b + np.sqrt(delta)) / 2
        t2 = (-b - np.sqrt(delta)) / 2
        if t1 > 0 and t2 > 0:
            return min(t1, t2)
    return None

def nearest_intersected_object(objects, ray_origin, ray_direction):
    distances = []
    for obj in objects:
        if obj['type'] == 'sphere':
            distances.append(sphere_intersect(obj['center'], obj['radius'], ray_origin, ray_direction))
        # elif obj["obj"] == 'plane':
        #     point, normal = plane_eq(obj)
        #     distances.append(plane_intersect(point, normal, ray_origin, ray_direction))
        # elif obj['obj'] == 'triangle':
        #     distances.append(triangle_intersect(obj['vertex'], ray_origin, ray_direction))

    nearest_object = None
    min_distance = np.inf
    for index, distance in enumerate(distances):
        if distance and distance < min_distance:
            min_distance = distance
            nearest_object = objects[index]
    return nearest_object, min_distance