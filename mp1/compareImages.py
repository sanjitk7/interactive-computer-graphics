from PIL import Image, ImageChops
import sys
point_table = ([0] + ([255] * 255))

def black_or_b(a, b):
    diff = ImageChops.difference(a, b)
    diff = diff.convert('L')
    diff = diff.point(point_table)
    new = diff.convert('RGB')
    new.paste(b, mask=diff)
    return new

a = Image.open(sys.argv[1])
b = Image.open(sys.argv[2])
c = black_or_b(a, b)
c.save('check_diff.png')