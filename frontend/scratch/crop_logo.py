from PIL import Image
import os

path = r'c:\Users\pc\Desktop\herbesV2\frontend\public\images\logo\20251202_105020 (1).png'
img = Image.open(path)

# Convert to RGBA if not already
img = img.convert("RGBA")

# Get bounding box of non-transparent pixels
bbox = img.getbbox()

if bbox:
    # Only crop top and bottom slightly or tightly? 
    # User said "cut in top and bottom"
    # Let's crop to content
    cropped_img = img.crop(bbox)
    
    # Save a copy first
    save_path = r'c:\Users\pc\Desktop\herbesV2\frontend\public\images\logo\logo_cropped.png'
    cropped_img.save(save_path)
    print(f"Success! Cropped image saved at {save_path}")
    print(f"New size: {cropped_img.size}")
else:
    print("Could not find content to crop")
