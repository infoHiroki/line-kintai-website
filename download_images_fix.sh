#!/bin/bash

# 画像ダウンロード用ディレクトリ
DOWNLOAD_DIR="images/free"
mkdir -p $DOWNLOAD_DIR

# 失敗した画像を再ダウンロード
# ヒーローセクション用画像（警備員のイメージ）
curl -L -o $DOWNLOAD_DIR/hero-image.jpg "https://cdn.pixabay.com/photo/2019/04/13/00/47/security-4123725_1280.jpg"

# スプレッドシート
curl -L -o $DOWNLOAD_DIR/spreadsheet.jpg "https://cdn.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg"

# QRコード
curl -L -o $DOWNLOAD_DIR/qr-code.jpg "https://cdn.pixabay.com/photo/2020/08/05/08/00/qr-code-5464586_1280.jpg"

# OGP画像
curl -L -o $DOWNLOAD_DIR/ogp-image.jpg "https://cdn.pixabay.com/photo/2019/04/13/00/47/security-4123725_1280.jpg"

echo "画像の再ダウンロードが完了しました。" 