echo "\n**********Start calculating pixel-wise diff**********n"

python compareImages.py mpray_sphere.png data/img/mpray_sphere.png diffResult/mpray_sphere
python compareImages.py mpray_sun.png data/img/mpray_sun.png diffResult/mpray_sun
python compareImages.py mpray_behind.png data/img/mpray_behind.png diffResult/mpray_behind
python compareImages.py mpray_color.png data/img/mpray_color.png diffResult/mpray_color
python compareImages.py mpray_overlap.png data/img/mpray_overlap.png diffResult/mpray_overlap
python compareImages.py mpray_shadow-basic.png data/img/mpray_shadow-basic.png diffResult/mpray_shadow-basic

python compareImages.py mpray_suns.png data/img/mpray_suns.png diffResult/mpray_suns
python compareImages.py mpray_bulb.png data/img/mpray_bulb.png diffResult/mpray_bulb
python compareImages.py mpray_neglight.png data/img/mpray_neglight.png diffResult/mpray_neglight
python compareImages.py mpray_shadow-bulb.png data/img/mpray_shadow-bulb.png diffResult/mpray_shadow-bulb
python compareImages.py mpray_shadow-suns.png data/img/mpray_shadow-suns.png diffResult/mpray_shadow-suns
# python compareImages.py mpray_inside.png data/img/mpray_inside.png diffResult/mpray_inside
python compareImages.py mpray_plane.png data/img/mpray_plane.png diffResult/mpray_plane
python compareImages.py mpray_shadow-plane.png data/img/mpray_shadow-plane.png diffResult/mpray_shadow-plane
python compareImages.py mpray_trif.png data/img/mpray_trif.png diffResult/mpray_trif
python compareImages.py mpray_shadow-triangle.png data/img/mpray_shadow-triangle.png diffResult/mpray_shadow-triangle

python compareImages.py mpray_expose1.png data/img/mpray_expose1.png diffResult/mpray_expose1
python compareImages.py mpray_expose2.png data/img/mpray_expose2.png diffResult/mpray_expose2

python compareImages.py mpray_eye.png data/img/mpray_eye.png diffResult/mpray_eye
python compareImages.py mpray_forward.png data/img/mpray_forward.png diffResult/mpray_forward
python compareImages.py mpray_up.png data/img/mpray_up.png diffResult/mpray_up
python compareImages.py mpray_fisheye.png data/img/mpray_fisheye.png diffResult/mpray_fisheye

echo "\n**********Finish calculating pixel-wise diff**********n"