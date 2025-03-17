#!/bin/bash

# 画像ダウンロード用ディレクトリ
DOWNLOAD_DIR="images/free"
mkdir -p $DOWNLOAD_DIR

# 失敗した画像を再ダウンロード（別のURLを使用）
# ヒーローセクション用画像（警備員のイメージ）
curl -L -o $DOWNLOAD_DIR/hero-image.jpg "https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&dpr=1"

# スプレッドシート
curl -L -o $DOWNLOAD_DIR/spreadsheet.jpg "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1"

# QRコード
curl -L -o $DOWNLOAD_DIR/qr-code.jpg "https://images.pexels.com/photos/8473187/pexels-photo-8473187.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1"

# OGP画像
curl -L -o $DOWNLOAD_DIR/ogp-image.jpg "https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&dpr=1"

echo "画像の再ダウンロードが完了しました。" 