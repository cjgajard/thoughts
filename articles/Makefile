DST := ../docs/
ARTICLES=index.html 001.html 002.html

.PHONY: all clean
.INTERMEDIATE: index.yml
.PRECIOUS: %.mo

all: $(addprefix $(DST),$(ARTICLES))

$(DST)%.html: layout.html %.yml $(DST)%.mo
	mustache --layout $^ >$@

$(DST)%.mo: %.md
	mdtohtml $< >$@

%.yml:
	touch $@
