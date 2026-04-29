#!/bin/bash
# Marp の Markdown をビルドしてトップディレクトリの index.html に出力するスクリプト

docker run --rm -v "$(pwd):/home/marp/app" -e MARP_USER=root:root marpteam/marp-cli doc/handson-marp.md -o doc/index.html
