# Comment

The state of transforms is complicated to work with

# Prompt

Let's investigate the .rotate method of Element. It is ignoring completely the relativeTo (it should get .angle, and relativeTo should be optional).

Also, storing just rotation is a wrong way of doing this - we may want to rotate something multiple times, we may aswell rotate it along multiple axis (default should be center, but we may aswell want to rotate it against a relative point, e.g. relativeFrom) so there should be an array of transforms, and a default implementation of rotate for all shapes (they can override it if needed).

By default we shouldn't really want to rotate along anything that isn't the object itself (it creates positioning problems later down the road), but let's keep this as an available option.
