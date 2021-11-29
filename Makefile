BUNDLE=docs/
DST=$(shell readlink -f $(BUNDLE))

.PHONY: all clean

all: $(BUNDLE)
	#$(MAKE) -C src DST=$(DST)
	#$(MAKE) -C articles DST=$(DST)
	$(MAKE) -C src
	$(MAKE) -C articles

$(BUNDLE):
	mkdir -p $@

clean:
	$(RM) -r $(BUNDLE)
