DST := ../docs/
OBJ=theme.css script.js

.PHONY: all

all: $(addprefix $(DST),$(OBJ))

$(DST)%.css: %.css
	cp $< $@

$(DST)%.js: %.ts
	pnpx esbuild $< --bundle --outfile=$@
