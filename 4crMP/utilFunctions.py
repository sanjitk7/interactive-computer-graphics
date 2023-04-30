import numpy as np
import math
from PIL import Image
from vectorUtils import norm, magnitude, normalize

def get_commands_from_input(f_path):
    
     # get all commands from input file
    legal_command_start = ["png", "sphere","sun","color"]
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

# STAGE 1: RUN THROUGH ALL OBJECTS AND INITIALIZE THEM
def initScene(commands):
    objects = []
    light_sources = []
    image = None
    light_bounces = 4
    default_diffuse = np.array([1,1,1])
    default_shine = np.array([0,0,0])
    
    for command in commands:
        
        polygon_object = {
            "type":None,
            "center":None,
            "radius":None
        }
        
        # polygon_object = {}
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
            
        if command[0] == "color":
            default_diffuse = np.array([float(command[1]),float(command[2]),float(command[3])])
    
    return image, objects, light_sources, light_bounces, recent_open_image
        


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


def nearest_intersected_object(objects, ray_origin, ray_direction):
    distances = []
    for obj in objects:
        if obj['type'] == 'sphere':
            # distances.append(ray_sphere_intersection(obj['center'], obj['radius'], ray_origin, ray_direction))
            distances.append(ray_sphere_intersection(ray_origin, ray_direction, obj["center"], obj["radius"]))
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


# from ray-sphere intersection
def ray_sphere_intersection(ro, rd, sphere_center, sphere_radius):
    # print("rsph in: ",ro, rd, sphere_center, sphere_radius)
    inside = math.pow(magnitude(sphere_center - ro),2) - math.pow(sphere_radius, 2)
    tc = np.dot(sphere_center - ro, rd) / norm(rd)
    
    if inside > 0 and tc < 0:
        return None

    d_square = math.pow(magnitude(ro + tc*rd - sphere_center),2)
    
    if (d_square <0):
        print("d_sq negative?", d_square)
    
    if (inside > 0) and (math.pow(sphere_radius,2) < d_square):
        return None
    
    try:
        t_offset = math.sqrt(sphere_radius**2 - d_square)/ norm(rd)
    except:
        print("exception:",inside,sphere_radius,d_square)
    
    # sphere has 2 intersection points
    t1 = tc + t_offset
    t2 = tc - t_offset
    if t1 > 0 and t2> 0:
        return min(t1, t2)


# find the first object that a ray intersects in the scene -> t, object
def ray_thing_intersection(objects, ro, rv):
    all_thing_intersections = []
    closest_hit = None
    rd = normalize(rv)
    
    # find object intersections
    for object in objects:
        if object["type"] == "sphere":
            all_thing_intersections += [ray_sphere_intersection(ro, rd, object["center"], object["radius"])]
    
    