#!/bin/bash

# 画像ダウンロード用ディレクトリ
DOWNLOAD_DIR="images/free"
mkdir -p $DOWNLOAD_DIR

# Pixabayなどのフリー素材サイトからの画像ダウンロード
# ヒーローセクション用画像（警備員のイメージ）
curl -o $DOWNLOAD_DIR/hero-image.jpg "https://cdn.pixabay.com/photo/2017/07/11/15/08/security-2493896_1280.jpg"

# 導入前後の画像（書類作業と効率化されたデジタル作業）
curl -o $DOWNLOAD_DIR/before-image.jpg "https://cdn.pixabay.com/photo/2015/11/19/21/10/glasses-1052010_1280.jpg"
curl -o $DOWNLOAD_DIR/after-image.jpg "https://cdn.pixabay.com/photo/2018/03/01/09/33/business-3190209_1280.jpg"

# LINE画面のモックアップ（スマホ画面）
curl -o $DOWNLOAD_DIR/line-checkin.jpg "https://cdn.pixabay.com/photo/2017/01/13/04/56/blank-1976334_1280.png"
curl -o $DOWNLOAD_DIR/line-checkout.jpg "https://cdn.pixabay.com/photo/2016/11/29/12/30/phone-1869510_1280.jpg"
curl -o $DOWNLOAD_DIR/line-record.jpg "https://cdn.pixabay.com/photo/2016/03/27/19/43/smartphone-1283938_1280.jpg"

# 管理画面（ダッシュボードやスプレッドシート）
curl -o $DOWNLOAD_DIR/manager-dashboard.jpg "https://cdn.pixabay.com/photo/2018/05/04/20/01/website-3374825_1280.jpg"
curl -o $DOWNLOAD_DIR/spreadsheet.jpg "https://cdn.pixabay.com/photo/2015/07/02/10/40/writing-828911_1280.jpg"

# 導入事例（ビジネスミーティング）
curl -o $DOWNLOAD_DIR/case-study.jpg "https://cdn.pixabay.com/photo/2015/01/09/11/08/startup-594090_1280.jpg"

# QRコード
curl -o $DOWNLOAD_DIR/qr-code.jpg "https://cdn.pixabay.com/photo/2013/07/12/19/18/qr-code-154925_1280.png"

# 背景パターン
curl -o $DOWNLOAD_DIR/pattern.jpg "https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_1280.jpg"

# SEO・ブランディング用画像
curl -o $DOWNLOAD_DIR/favicon.png "https://cdn.pixabay.com/photo/2016/01/03/11/24/gear-1119298_1280.png"
curl -o $DOWNLOAD_DIR/apple-touch-icon.png "https://cdn.pixabay.com/photo/2016/01/03/11/24/gear-1119298_1280.png"
curl -o $DOWNLOAD_DIR/ogp-image.jpg "https://cdn.pixabay.com/photo/2017/07/11/15/08/security-2493896_1280.jpg"

echo "画像のダウンロードが完了しました。" 