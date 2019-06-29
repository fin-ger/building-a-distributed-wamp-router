FILES = paper.md \
		metadata.yaml

OUTPUT = build

FLAGS = --bibliography=bibliography.bib \
		--biblatex \
		-s \
		-f markdown

FLAGS_PDF = --template=template.latex

all: pdf

pdf:
	mkdir -p $(OUTPUT)
	pandoc -o $(OUTPUT)/paper.tex $(FLAGS) $(FLAGS_PDF) $(FILES)
	pdflatex --output-directory $(OUTPUT) $(OUTPUT)/paper.tex
	biber $(OUTPUT)/paper
	pdflatex --output-directory $(OUTPUT) $(OUTPUT)/paper.tex
	pdflatex --output-directory $(OUTPUT) $(OUTPUT)/paper.tex

clean:
	rm build/*

watch:
	ls * | entr $(MAKE) pdf

view:
	evince build/paper.pdf
