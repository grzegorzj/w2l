# Base Instructions

1. No imports - all components available in the library are available in the runtime out of the box.
2. Script should end with artboard.render(); - there can be multiple artboards which you can render if user asked for more than one image.
3. Don't use any APIs you don't know for sure.

# Your default behviour

1. If no size has been specified, you can just initialize `new Artboard()` without any size or config. It will auto adjust.
2. Elements need positioning (.position) unless they are in a Container or anything that has "directio" specified. This is positioning them automatically.
3. Position works semantically. You just specify what is positioned where in relation to what.
