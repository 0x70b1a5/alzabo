#!/bin/sh
cd ~/urbit-git/pkg
rm -rf globzod
cp -rL bakzod globzod # where bakzod is a copy of a ship with %zig desk mounted
cd ./alzabo
yarn build
rm build/static/js/*.js.map*
rm build/static/css/*.css.map*
cp -rL build/ ~/urbit-git/pkg/globzod/zig
mkdir ~/urbit-git/pkg/globzod/zig/mar
cp ~/urbit-git/pkg/globzod/base/mar/png.hoon ~/urbit-git/pkg/globzod/zig/mar/jpg.hoon
nautilus ~/urbit-git/pkg/globzod/.urb/put
# ~zod:dojo> |commit %zig
# ~zod:dojo> -garden!make-glob %zig /build
# glob will be in ~/urbit/pkg/globzod/.urb/put/0vsomethingsomething.glob