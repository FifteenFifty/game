.PHONY: all
all:
	ng build --prod --base-href "https://fifteenfifty.github.io/game/"

.PHONY: deploy
deploy:
	ngh --no-silent --dir dist/game/
