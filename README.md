# 3D Interactive Art Gallery

An immersive **WebGL 3D art gallery** built with **Three.js**, featuring walkable navigation, interactive 3D sculptures, artwork modals, ambient sound, and collision detection.

Users can freely explore the virtual gallery, view artworks, and interact with sculptures by clicking on them.

**The Question:** Can you find the secret easter egg hidden somewhere in the gallery? Only the most observant visitors will discover this!

**Hint:** What you are looking for can actually be associated with easter eggs (😉) and can be connected to the second artwork (The First Night).

## Features

- **Fully 3D environment** - Navigate freely in a room-like gallery using `WASD` or arrow keys.
- **Pointer lock controls** - First-person view with mouse look.
- **Dynamic gallery walls** - Artworks and frames loaded as interactive objects.
- **3D sculptures** - Supports loading multiple `.glb` models with collisions.
- **Ambient & footstep sounds** - Immersive audio feedback during movement.
- **Artwork modals** - Click any artwork or sculpture to reveal title, poem, and voice-over.
- **Collision detection** - Prevents walking through walls or 3D models.
- **Modular architecture** - Cleanly separated components for Room, Gallery, Models, Audio, and UI.
- **Easily extendable** - Add new 3D models or gallery images by editing a simple config.

## Controls

| Action            | Key / Mouse |
| ----------------- | ----------- |
| Move Forward      | `W` or `↑`  |
| Move Backward     | `S` or `↓`  |
| Move Left         | `A` or `←`  |
| Move Right        | `D` or `→`  |
| Look Around       | Move mouse  |
| Interact / Click  | Left click  |
| Exit Pointer Lock | `ESC`       |
