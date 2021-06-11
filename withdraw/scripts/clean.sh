#!/bin/bash

# source: https://stackoverflow.com/questions/7714900/remove-only-files-in-directory-on-linux-not-directories

cd "$(dirname "$0")"

cd ..

find . -maxdepth 1 -type f -exec rm -fv {} \;
