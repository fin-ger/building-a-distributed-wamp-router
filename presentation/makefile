all: pdf view

pdf:
	mkdir -p build
	reveal-md --css res/ovgu-cs.css slides.md --print build/slides.pdf

view:
	reveal-md --css res/ovgu-cs.css slides.md

watch:
	reveal-md --watch --css res/ovgu-cs.css slides.md
