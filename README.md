# wallhaus

A dark wallpaper gallery for phones and desktops. Browse by category, preview wallpapers full screen (with arrows, keyboard, or swipe), pick a random one, or set one as your background.

**Live site:** https://ghostpacket0x.github.io/wallhaus/

## Files

| File | What it does |
| --- | --- |
| `index.html` | Page structure: header, gallery, preview, footer |
| `style.css` | All the looks: colors, layout, animations |
| `script.js` | The wallpaper list, filters, preview, random button, and card reveal |
| `about.html` | About page |
| `privacy.html` | Privacy policy |
| `wallpapers/` | Full-size images (`00.jpg` to `24.jpg`) |
| `wallpapers/thumbs/` | Small grid previews, same numbering |

## Common edits

- **Change colors:** edit the `:root` section at the top of `style.css`.
- **Change the look of cards, buttons, or the title:** edit `style.css`.
- **Add a wallpaper:**
  1. Save a full-size JPG as `wallpapers/25.jpg` and a small one (about 640 px wide) as `wallpapers/thumbs/25.jpg`.
  2. In `script.js`, add an entry to the `WALLPAPERS` list:
     `{"name": "My Wallpaper", "cats": ["desktop"], "res": "Desktop", "thumb": "wallpapers/thumbs/25.jpg", "full": "wallpapers/25.jpg"}`
  3. Use `"cats": ["phone"]` with `"res": "Phone"` for portrait images, or add `"4k"` to `cats` (and `"4K · Desktop"` to `res`) for 4K images.
- **Update the About or Privacy text:** edit `about.html` or `privacy.html`. Replace the `[your name]` and `[your email address]` placeholders.

## Local preview

Open `index.html` in a browser. Some browsers block local scripts, so if the gallery is empty, use a simple local server (for example, `python -m http.server` in this folder) and open `http://localhost:8000`.

## Notes

- Wallpaper artwork belongs to its creators. Only use images you have the rights to.
- Before running ads, replace any copyrighted artwork and update the privacy policy.

## License

No license yet. All rights reserved by the author until one is added.
