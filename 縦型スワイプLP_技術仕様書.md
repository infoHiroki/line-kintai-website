# 縦型スワイプランディングページ技術仕様書

## 1. 概要

この仕様書は、縦型スワイプ式のフルスクリーンセクションデザインを採用したランディングページのテンプレートについて説明しています。本テンプレートはモバイルフレンドリーな設計で、さまざまな業種・サービスに適応可能です。

## 2. 技術スタック

- **フロントエンド**:
  - HTML5
  - CSS3 (Tailwind CSS)
  - JavaScript (ES6+)
  - GSAP (GreenSock Animation Platform)
  - Font Awesome (アイコン)
  - Google Fonts

- **レスポンシブデザイン**:
  - モバイル、タブレット、デスクトップに最適化
  - Tailwind CSSによるユーティリティファーストアプローチ

## 3. ページ構造

サイトは複数のフルスクリーンセクションで構成されています。標準的な構成例：

1. **ヒーローセクション**: サービス概要の紹介
2. **課題セクション**: ターゲットユーザーの課題提示
3. **解決策セクション**: サービス導入前後の比較
4. **機能紹介セクション**: 主要機能の説明
5. **料金プランセクション**: 料金体系の説明
6. **お問い合わせセクション**: コンタクトフォームと連絡先

各セクションは相対配置(position: relative)で、高さは最小100vh、幅100%となっています。セクション数は必要に応じて調整可能です。

## 4. 特殊機能

### 4.1 縦型スワイプナビゲーション

ユーザーは以下の方法でセクション間を移動できます：

- マウスホイールのスクロール
- モバイル端末でのスワイプ操作
- キーボードの矢印キーやPage Up/Down
- 画面右側のナビゲーションドット
- ヘッダーメニューのリンク
- 各セクション下部のスクロールインジケーター

### 4.2 アニメーション

- **フェードインアニメーション**:
  - `.fade-in`: 下から上へのフェードイン
  - `.fade-in-left`: 左からのフェードイン
  - `.fade-in-right`: 右からのフェードイン
  - アニメーション持続時間: 0.8秒
  - 要素ごとの段階的な表示（ディレイ: 150ms）

- **プログレスバー**:
  - データ属性による割合指定（例: `data-percent="80"`）
  - アニメーション持続時間: 2秒

- **スクロールインジケーター**:
  - 緩やかなバウンスアニメーション
  - セクション間の移動を促進

### 4.3 レスポンシブヘッダー

- 固定ヘッダー（画面上部に常に表示）
- モバイルとデスクトップで異なる表示
- スクロール時の表示スタイル変更

## 5. JavaScript実装詳細

### 5.1 初期化プロセス

```javascript
function init() {
  // セクションの初期配置
  setupSections();
  
  // 初期セクションをアクティブに
  activateSection(0);
  
  // イベントリスナーの設定
  setupEventListeners();
  
  // URLハッシュによる初期セクション表示
  handleUrlHash();
  
  // 初期セクションを強制的に表示
  setTimeout(() => {
    scrollToSection(0, false);
  }, 100);
}
```

### 5.2 セクション切り替えの仕組み

```javascript
function scrollToSection(index, useDelay = true) {
  // 範囲外、同じセクション、スクロール中はスキップ
  if (
    index < 0 || 
    index >= elements.sections.length || 
    index === state.currentSection || 
    state.isScrolling
  ) {
    return;
  }
  
  // スクロール状態を更新
  state.isScrolling = true;
  
  // セクション活性化
  activateSection(index);
  
  // 遅延後にスクロール状態をリセット
  if (useDelay) {
    setTimeout(() => {
      state.isScrolling = false;
    }, state.scrollDelay);
  } else {
    state.isScrolling = false;
  }
}
```

### 5.3 アニメーション制御

```javascript
function animateSectionElements(section) {
  // フェードイン要素を検索
  const fadeElements = section.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  
  // 一旦すべてリセット
  fadeElements.forEach(element => {
    element.classList.remove('active');
  });
  
  // 少し遅延を付けて再アニメーション
  setTimeout(() => {
    fadeElements.forEach((element, index) => {
      // データ属性から遅延時間を取得、なければインデックスに基づいて計算
      const delay = element.dataset.delay ? parseInt(element.dataset.delay) : (index * 150);
      
      setTimeout(() => {
        element.classList.add('active');
      }, delay);
    });
    
    // 進捗バーのアニメーション（存在すれば）
    const progressBar = section.querySelector('.efficiency-progress');
    if (progressBar) {
      const percentage = progressBar.dataset.percent || '0';
      progressBar.style.width = `${percentage}%`;
    }
  }, 200);
}
```

### 5.4 タイミング設定

スムーズな遷移とアニメーションのための主要なタイミング設定：

- セクション切り替え時のスクロール遅延: **1000ms**
- 要素アニメーションの基本遅延: **150ms**
- フェードインアニメーション持続時間: **800ms**
- プログレスバーアニメーション持続時間: **2000ms**
- ナビゲーション目印のトランジション時間: **500ms**

## 6. カスタマイズポイント

### 6.1 色彩設計

Tailwind CSSの拡張設定でカスタムカラーを定義することができます：

```javascript
colors: {
  'primary': '#主要色コード',
  'secondary': '#アクセント色コード',
  'accent': '#アクセント色2コード',
  'dark': '#暗色系コード',
  'light': '#明色系コード',
  'gray-custom': '#グレーコード',
  'success': '#成功色コード',
  'warning': '#警告色コード',
  'danger': '#危険色コード',
}
```

### 6.2 フォント

- 主要フォント: **Google Fontsから選択**
- フォントウェイト: 300, 400, 500, 700など必要に応じて

### 6.3 アニメーション

カスタムCSSトランジションとアニメーション：

```css
/* フェードイン要素 */
.fade-in:not(.active) {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

/* 左からのフェードイン */
.fade-in-left:not(.active) {
  opacity: 0;
  transform: translateX(-30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

/* 右からのフェードイン */
.fade-in-right:not(.active) {
  opacity: 0;
  transform: translateX(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

/* アクティブ状態 */
.fade-in.active, .fade-in-left.active, .fade-in-right.active {
  opacity: 1;
  transform: translate(0);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

/* プログレスバー */
.efficiency-progress {
  transition: width 2s ease-in-out;
}

/* ナビゲーション目印 */
.section-navigation li {
  transition: all 0.5s ease;
}

.section-navigation li.active {
  background-color: #プライマリカラー;
  transform: scale(1.5);
  box-shadow: 0 0 0 2px rgba(プライマリカラーのRGB値, 0.3);
}
```

## 7. パフォーマンス最適化

- **アニメーションの最適化**:
  - CSSトランジションを使用（GPUアクセラレーション活用）
  - transform/opacity プロパティのみを変更
  - 重要なアニメーションのみを実装

- **イベント制御**:
  - スロットリングとデバウンス機能の実装
  - 連続スクロール防止（スクロール遅延: 1000ms）

- **画像最適化**:
  - 推奨: 適切なサイズとフォーマットの画像の使用
  - レスポンシブ画像の実装

## 8. ブラウザ互換性

- **対応ブラウザ**:
  - Chrome 最新版
  - Firefox 最新版
  - Safari 最新版
  - Edge 最新版
  - モバイルSafari (iOS 12+)
  - Android Chrome (Android 8+)

## 9. アクセシビリティ

- キーボードナビゲーション対応
- aria属性の適切な使用
- スクリーンリーダー対応のための適切なマークアップ
- 十分なコントラスト比

## 10. SEO最適化

- 適切なmetaタグ
- OGP設定
- 構造化データ (JSON-LD)
- セマンティックHTML
- レスポンシブデザイン

## 11. このテンプレートの使用方法

1. HTML構造を維持しながら、テキストとイメージを変更
2. カラーテーマの調整（Tailwind設定）
3. セクション数の調整（必要に応じて）
4. script.jsのセクション数に応じた調整
5. 各セクションのコンテンツをプロジェクトに合わせて変更
6. ナビゲーションリンクとセクションIDの整合性を確認

## 12. 注意事項

- 縦型スワイプナビゲーションはモバイルデバイスの通常のスクロール体験を変更するため、ユーザーに明確な視覚的ガイダンスを提供することが重要です
- インタラクティブな要素（ボタンやリンク）が適切に機能するようにイベントバブリングを管理しています
- スクロール体験を最適化するため、パフォーマンスに注意を払う必要があります
- 大量のコンテンツを含むセクションでは、スクロール可能なエリアを設けることを検討しましょう
- プロジェクト固有の要件に合わせて、必要なセクションやコンポーネントを追加・削除してください 