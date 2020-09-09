.PHONY: all clean

all: documentation.pdf presentation.pdf

%.pdf : %.tex
	@ mkdir -p build
	latexmk -xelatex -pdf -outdir=build -interaction=batchmode $* ; texfot cat build/$*.log
	cp build/$*.pdf .

clean:
	rm -rf build
