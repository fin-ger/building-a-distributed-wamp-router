all: pdf view

pdf:
	mkdir -p build
	reveal-md --css css/fork-awesome.min.css,css/ovgu-cs.css slides.md --print build/slides.pdf

view:
	reveal-md --css css/fork-awesome.min.css,css/ovgu-cs.css slides.md

watch:
	reveal-md --watch --css css/fork-awesome.min.css,css/ovgu-cs.css slides.md
