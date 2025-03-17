# LINEでカンタン勤怠 - Webサイト

警備業界に特化した、LINEで完結する勤怠管理システム「LINEでカンタン勤怠」のWebサイトです。

## 概要

このプロジェクトは、「LINEでカンタン勤怠」サービスの紹介Webサイトを構築するためのものです。警備業界の現場管理者、経理担当者、経営者それぞれにメリットを訴求し、サービスの導入を促進することを目的としています。

## 特徴

- レスポンシブデザイン（PC、タブレット、スマートフォンに対応）
- アニメーションを活用した視覚的に魅力的なUI
- 直感的な操作性
- 高速な読み込み
- SEO対策済み

## 技術スタック

- HTML5
- CSS3
- JavaScript (ES6+)
- Font Awesome (アイコン)
- Animate.css (アニメーション)
- Google Fonts (Noto Sans JP)

## ディレクトリ構造

```
/
├── index.html        # メインHTMLファイル
├── styles.css        # スタイルシート
├── script.js         # JavaScriptファイル
└── images/           # 画像ディレクトリ
    ├── hero-image.png
    ├── before-image.png
    ├── after-image.png
    ├── line-checkin.png
    ├── line-checkout.png
    ├── line-record.png
    ├── manager-dashboard.png
    ├── spreadsheet.png
    ├── case-study.png
    ├── qr-code.png
    └── pattern.png
```

## 使い方

1. リポジトリをクローン
   ```
   git clone https://github.com/yourusername/line-kintai-website.git
   ```

2. ローカルサーバーで実行
   ```
   cd line-kintai-website
   # 任意のローカルサーバーで実行
   # 例: Python 3の場合
   python -m http.server
   ```

3. ブラウザで `http://localhost:8000` にアクセス

## 画像について

`images` ディレクトリには以下の画像が必要です：

- `hero-image.png` - ヒーローセクションのメイン画像
- `before-image.png` - 導入前の勤怠管理の様子
- `after-image.png` - 導入後の勤怠管理の様子
- `line-checkin.png` - LINEでの出勤報告画面
- `line-checkout.png` - LINEでの退勤報告画面
- `line-record.png` - LINEでの勤務記録確認画面
- `manager-dashboard.png` - 管理者ダッシュボード画面
- `spreadsheet.png` - スプレッドシート連携画面
- `case-study.png` - 導入事例の画像
- `qr-code.png` - デモ用QRコード
- `pattern.png` - 背景パターン

## カスタマイズ

- `styles.css` の `:root` セクションで色やフォントなどの基本設定を変更できます
- 各セクションのコンテンツは `index.html` で編集できます
- アニメーションや対話性は `script.js` で調整できます

## ライセンス

このプロジェクトは [MIT License](LICENSE) のもとで公開されています。

## 連絡先

質問や提案がある場合は、以下の連絡先までお問い合わせください：

- Email: info@keibi-line.co.jp
- 担当: 警備太郎 