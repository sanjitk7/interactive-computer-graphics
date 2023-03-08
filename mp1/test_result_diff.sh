echo "\n**********Start calculating pixel-wise diff**********n"
python compareImages.py mp1indexing.png data/img/mp1indexing.png diffResult/diffindexing
python compareImages.py mp1req1.png data/img/mp1req1.png diffResult/diffreq1
python compareImages.py mp1req2.png data/img/mp1req2.png diffResult/diffreq2
python compareImages.py mp1depth.png data/img/mp1depth.png diffResult/diffdepth
python compareImages.py mp1srgb.png data/img/mp1srgb.png diffResult/diffsrgb
python compareImages.py mp1rgba.png data/img/mp1rgba.png diffResult/diffrgba
python compareImages.py mp1cull.png data/img/mp1cull.png diffResult/diffcull
python compareImages.py mp1line.png data/img/mp1line.png diffResult/diffline

echo "\n**********Finish calculating pixel-wise diff**********n"