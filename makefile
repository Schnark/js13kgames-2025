JS = res/curve.js res/block.js res/level.js res/cat.js res/keys.js res/game.js
GLOBAL = Curve, Block, Level, Cat, keys

.PHONY: check
check: min/game.zip
	@echo
	@stat --printf="Current size: %s B (" min/game.zip && (echo "scale=2;" && stat --printf="%s" min/game.zip && echo "*100/(13*1024)") | bc -l | tr -d '\n' && echo " %)"

min/all.js: $(JS)
	(echo "(function(){var $(GLOBAL);" && cat $(JS) && echo "})()") > min/all.js

min/min.js: min/all.js
	minify-js min/all.js > min/min.js

#based on xem's mini minifier
min/min.css: res/game.css
	tr '\t\n\r' ' ' < res/game.css | sed -e's/\(\/\*[^*]\+\*\/\| \)\+/ /g' | sed -e's/^ \|\([ ;]*\)\([^a-zA-Z0-9:*.#"()% -]\)\([ ;]*\)\|\*\?\(:\) */\2\4/g' > min/min.css

min/index.html: min/min.js min/min.css index.html
	sed -f modify.sed index.html > min/index.html

min/game.zip: min/index.html
	cd min && zip -9 game.zip index.html

.PHONY: clean
clean:
	find . -name '*~' -delete
	rm min/all.js min/min.js min/min.css min/game.zip

.PHONY: lint
lint:
	jshint -a $(JS)
	jscs -a $(JS)