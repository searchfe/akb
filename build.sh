#!/bin/sh

mkdir dist
cp package.json README.md dist

babel index.js -d dist
babel lib -d dist/lib


echo compilation succeeded.
