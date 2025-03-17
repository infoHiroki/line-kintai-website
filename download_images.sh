#!/bin/bash

# 画像ダウンロード用ディレクトリ
DOWNLOAD_DIR="images/free"
mkdir -p $DOWNLOAD_DIR

# Unsplashからの画像ダウンロード
# ヒーローセクション用画像
curl -o $DOWNLOAD_DIR/hero-image.jpg "https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=1200&h=800&auto=format&fit=crop"

# 導入前後の画像
curl -o $DOWNLOAD_DIR/before-image.jpg "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=600&h=400&auto=format&fit=crop"
curl -o $DOWNLOAD_DIR/after-image.jpg "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&h=400&auto=format&fit=crop"

# LINE画面のモックアップ
curl -o $DOWNLOAD_DIR/line-checkin.jpg "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=300&h=600&auto=format&fit=crop"
curl -o $DOWNLOAD_DIR/line-checkout.jpg "https://images.unsplash.com/photo-1611746872915-64382b5c2a98?q=80&w=300&h=600&auto=format&fit=crop"
curl -o $DOWNLOAD_DIR/line-record.jpg "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=300&h=600&auto=format&fit=crop"

# 管理画面
curl -o $DOWNLOAD_DIR/manager-dashboard.jpg "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&h=500&auto=format&fit=crop"
curl -o $DOWNLOAD_DIR/spreadsheet.jpg "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&h=500&auto=format&fit=crop"

# 導入事例
curl -o $DOWNLOAD_DIR/case-study.jpg "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=800&h=500&auto=format&fit=crop"

# QRコード（サンプル）
curl -o $DOWNLOAD_DIR/qr-code.jpg "https://images.unsplash.com/photo-1599032909756-5deb82fea3b0?q=80&w=200&h=200&auto=format&fit=crop"

# 背景パターン
curl -o $DOWNLOAD_DIR/pattern.jpg "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=500&h=500&auto=format&fit=crop"

# SEO・ブランディング用画像
curl -o $DOWNLOAD_DIR/favicon.png "https://images.unsplash.com/photo-1611746872915-64382b5c2a98?q=80&w=32&h=32&auto=format&fit=crop"
curl -o $DOWNLOAD_DIR/apple-touch-icon.png "https://images.unsplash.com/photo-1611746872915-64382b5c2a98?q=80&w=180&h=180&auto=format&fit=crop"
curl -o $DOWNLOAD_DIR/ogp-image.jpg "https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=1200&h=630&auto=format&fit=crop"

echo "画像のダウンロードが完了しました。" 