from sys import argv
from PIL import Image
from pprint import pprint
import numpy as np
import math

# utilFunctions
from utilFunctions import get_commands_from_input, initScene, srgb2lin, lin2srgb, nearest_intersected_object
from utilFunctions2 import load_data
from vectorUtils import normalize, norm, reflected


# global vars
# current_color = [0,0,0]
times = 0

implemented = "implemented.txt"

# f_path = "mpray_sphere.txt"


if __name__=="__main__":
    print("\nMAIN")
    
    global image
    global objects
    global light_bounces
    
    if len(argv)<2:
        pprint("Provide Input file!")
        quit()
    else:
        f_path = argv[1]
        
    commands = get_commands_from_input(f_path)
    
    # stage 1
    image, objects, light_bounces = initScene(commands)
    
    # stage 2
    width, height = image.size
    
    # default sun
    lights = [{
        "type": "sun",
        "position": np.array([1,0,0]),
        "diffuse": np.array([0,0,0])
    }]

    # default up, forward
    eye = np.array([0,0,0])
    up = np.array([0,1,0])
    forward = np.array([0,0,-1])
    right = np.array([1,0,0])
    
    # handle each light - ray emission
    for light_idx, light in enumerate(lights):
        # shoot ray at each pixel
        for i in range(height):
            for j in range(width):
                # print("RAY EMISSION FOR PIXEL :",j,i)
                
                origin = eye
                sx = (2*j - width)/max(width,height)
                sy = (height - 2*i)/max(width,height)
                
                # print("sx,sy",(sx,sy))
                
                ray_direction = normalize(forward+ sx*right + sy*up)
                reflection = np.array([1,1,1]) # temp
                
                # color = np.array(image.getpixel((j, i))).astype(float)[:-1] / 255
                # print("jiji",j,i)
                current_color = (np.array(image.getpixel((j,i)))[:-1])/255
                current_color = srgb2lin(current_color)
                
                # ray collision
                shadow_occur = False
                ray_interaction_occur = True
                ray_interaction_objects = []
                lambert_illumination = np.array([0,0,0])
                
                for bounce_idx in range(light_bounces):
                    first_object, t = nearest_intersected_object(objects, origin, ray_direction)
                    
                    # print("first_obj",first_object, t)
                    
                    # skip further bounce iteration if light doesnt hit anything in the first place
                    if (first_object==None and bounce_idx==0):
                        ray_interaction_occur = False
                    
                    if (first_object==None):
                        break
                    
                    ray_thing_intersection = origin + t * ray_direction
                    
                    print("ray_thing_intersection:", ray_thing_intersection)
                    
                    if first_object["type"] == "sphere":
                        object_surface_normal = normalize(ray_thing_intersection - first_object["center"])
                        print("surf norm ",object_surface_normal)
                    
                    
                    origin_offset = ray_thing_intersection + (1e-5*object_surface_normal)
                    print("origin_offset", origin_offset)
                    
                    if light["type"] == "sun":
                        light_intersection = normalize(light["position"])
                        print("LI", light_intersection)
                    
                    next_object, next_object_t = nearest_intersected_object(objects, origin_offset, light_intersection)
                    
                    print("next_object_t:",next_object_t)
                    
                    light_intersection_dist = norm(light["position"] - ray_thing_intersection)
                    
                    print("light_intersection_dist",light_intersection_dist)
                    
                    # # full light refl
                    if ((next_object_t < light_intersection_dist) and bounce_idx==0):
                        # times +=1
                        shadow_occur = True
                        # prev_color = image.getpixel((j, i))[:-1]
                        image.putpixel((j,i), tuple(np.append(np.array(image.getpixel((j, i)))[:-1], [255])))
                        break
                
                    
                    # illumination
                    if light["type"] == "sun":
                        light_surf_dot = np.dot(light_intersection, object_surface_normal)
                        if light_surf_dot >=0:
                            # times +=1
                            lambert_illumination = first_object["diffuse"] * light["diffuse"] * light_surf_dot
                        else:
                            lambert_illumination = 0
                    
                    ray_interaction_objects += [[np.array(first_object["shine"]),lambert_illumination,first_object["diffuse"]]]
                    
                    print("ray_interaction_objects",ray_interaction_objects)
                    
                    origin = origin_offset
                    
                    print("mew origin", origin)
                    ray_direction = reflected(ray_direction, object_surface_normal)
                    # ray_direction = ray_direction - 2* (np.dot(ray_direction, object_surface_normal) * object_surface_normal )
                    
                    print("ray_direction",ray_direction)
                
                # shadows?
                
                # empty_array = np.zeros(3)
                # ray_interaction_objects += [empty_array,empty_array]
                
                # if shadow_occur == False:
                #     ray_interaction_objects_reversed = ray_interaction_objects[::-1]
                    
                #     final_color = empty_array
                #     for shadow_object in ray_interaction_objects_reversed:
                #         final_color = (np.array([1,1,1]) - np.array(shadow_object[0])) * np.array(shadow_object[1]) + np.array(shadow_object[0]) * final_color
                        
                #     if not ((final_color == np.zeros(3)).all() and ray_interaction_occur==False):
                #         times +=1
                #         output_color = current_color + np.array(final_color)
                #         output_color = np.array(np.clip(output_color,0,1))
                        
                #         output_color = tuple(lin2srgb(output_color)*255)
                #         print("opcol",output_color)
                #         image.putpixel((j,i), tuple(np.append(output_color, [255]).astype(int)))
                        
                if shadow_occur != True:
                    ray_interaction_objects = ray_interaction_objects[::-1]
                    fin_col = np.zeros(3)

                    for ii in ray_interaction_objects:
                        # ii = in_obj[jj]
                        fin_col = ((np.array([1, 1, 1]) - np.array(ii[0])) * np.array(ii[1])) + (
                                    np.array(ii[0]) * fin_col)

                    if not ((fin_col == np.zeros(3)).all() and ray_interaction_occur == False):
                        times +=1
                        
                        # col = np.append(fin_col, [1])
                        col = current_color + np.array(fin_col)
                        col = np.array(np.clip(col, 0, 1))
                        # if v != -1:
                        #     col = expose(col, v)
                        col = tuple(lin2srgb(col) * 255)
                        # print("col:",col)
                        col = np.append(col, [255]).astype(int)
                        print("opcol",col)
                        image.putpixel((j, i), tuple(col))
                
                    
                    
                    
                    
                    
                    
                
                
                
                
                
    print("times",times)
    print("\ncommands: ",commands)
    print("objects: ",objects)
    image.save("./output/op.png")
    # print("load_data", load_data(f_path))
    