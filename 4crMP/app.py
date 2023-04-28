from sys import argv
from PIL import Image
from pprint import pprint
import numpy as np
import math

# utilFunctions
from utilFunctions import get_commands_from_input

implemented = "implemented.txt"

# f_path = "mpray_sphere.txt"

if __name__=="__main__":
    print("\nMAIN")
    
    if len(argv)<2:
        pprint("Provide Input file!")
        quit()
    else:
        f_path = argv[1]
        
    commands = get_commands_from_input(f_path)
    
    
    
