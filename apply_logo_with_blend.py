
from PIL import Image, ImageDraw

def composite_logo(source_path, dest_path, output_path):
    with Image.open(source_path) as src, Image.open(dest_path) as dst:
        src = src.convert("RGBA")
        dst = dst.convert("RGBA")
        
        # We will take the bottom right corner. Let's make it 250x70
        box_width = 250
        box_height = 80
        x0 = src.width - box_width
        y0 = src.height - box_height
        box = (x0, y0, src.width, src.height)
        
        # Crop the logo area from reggaeton
        logo_crop = src.crop(box)
        
        # Create a mask for smooth blending
        # The mask will be white (255) in the bottom-right, fading to 0 at the top and left
        mask = Image.new("L", (box_width, box_height), 0)
        draw = ImageDraw.Draw(mask)
        
        fade_width = 50
        fade_height = 30
        
        for y in range(box_height):
            for x in range(box_width):
                # Calculate alpha based on distance from top/left edge
                alpha_x = min(255, int((x / fade_width) * 255)) if x < fade_width else 255
                alpha_y = min(255, int((y / fade_height) * 255)) if y < fade_height else 255
                
                # Multiply alphas to get corner fade
                alpha = int((alpha_x * alpha_y) / 255)
                draw.point((x, y), fill=alpha)
                
        # Paste the crop into the destination image using the mask
        dst.paste(logo_crop, box, mask)
        
        # Save keeping the original format (PNG)
        dst.convert("RGB").save(output_path, "PNG")
        print(f"Successfully added logo and saved to {output_path}")

try:
    reggaeton_path = "/home/master-hanasi/Documents/apex-music-latino/assetts/reggaeton_cubo_frm.png"
    tango_path = "/home/master-hanasi/Documents/apex-music-latino/assetts/tango_cubo_frm.png"
    temp_output_path = "/home/master-hanasi/Documents/apex-music-latino/assetts/tango_cubo_frm_with_logo.png"
    composite_logo(reggaeton_path, tango_path, temp_output_path)
except Exception as e:
    print(f"Error: {e}")
