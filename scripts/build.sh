#!/usr/bin/env bash

DOTENV_PATH=.env
source ./scripts/dotenv.sh

# Cleaning before to build
if [ "$CLEAN_BEFORE_BUILD" = true ] ; then
    rm -rf ./build || true
fi

mkdir ./build || true


yarn format
cd ./src
zip ../build/nyungerland-1.19.2.zip -r .
open ../build/
