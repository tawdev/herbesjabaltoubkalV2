from PIL import Image
import os

def remove_background(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    new_data = []
    # We want to keep the Gold (#C5A059 or similar) and remove the dark background.
    # The background is likely dark/near black.
    # Threshold approach: if R, G, and B are all below a certain value, make it transparent.
    threshold = 60 # Adjust if needed
    
    for item in datas:
        # item is (R, G, B, A)
        # If it's a dark pixel, make it transparent
        if item[0] < threshold and item[1] < threshold and item[2] < threshold:
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Background removed and saved to {output_path}")

if __name__ == "__main__":
    src = r"c:\Users\pc\Desktop\herbesV2\frontend\public\images\logo\luxury_logo.png"
    dest = r"c:\Users\pc\Desktop\herbesV2\frontend\public\images\logo\luxury_logo_transparent.png"
    remove_background(src, dest)
