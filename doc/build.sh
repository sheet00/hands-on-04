#!/bin/bash
# Mermaid の Markdown から PNG を生成し、Marp をビルドするスクリプト

# 1. Mermaid 図の生成 (architecture.md -> architecture.png)
# 一時的な設定ファイルを作成
echo '{"args": ["--no-sandbox", "--disable-setuid-sandbox"]}' > doc/puppeteer-config.json

echo "Generating Mermaid image..."
# mmd-dc は Markdown 内に複数の図がある場合「ファイル名-1.png」のように出力するため、出力を明示的にリネームするか
# あるいは直接 architecture.png になるように調整します。
npx -y @mermaid-js/mermaid-cli \
  -i doc/architecture.md \
  -o doc/architecture.png \
  -p doc/puppeteer-config.json

# Markdown入力の場合、出力名が architecture-1.png になることがあるため補正
if [ -f doc/architecture-1.png ]; then
  mv doc/architecture-1.png doc/architecture.png
fi

# 一時ファイルを削除
rm doc/puppeteer-config.json

# 2. Marp のビルド
echo "Building Marp slide..."
docker run --rm -v "$(pwd):/home/marp/app" -e MARP_USER=root:root marpteam/marp-cli --html doc/handson-marp.md -o doc/index.html

echo "Done."
