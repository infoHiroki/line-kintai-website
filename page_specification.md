# LINEでカンタン勤怠 - ページ仕様書

## 1. 画面サイズと表示量の制限

### 1.1 ページの基本仕様
- **標準的な表示解像度**: 1366px × 768px（ノートPC）、1920px × 1080px（デスクトップ）
- **最小サポート解像度**: 320px × 568px（モバイル）
- **垂直スクロール制限**: 各セクションは一画面（100vh）以内に収まることを基本とし、最大でも120vh（画面高さの1.2倍）を超えないこと
- **横スクロールの禁止**: すべての解像度でユーザーが横スクロールをする必要がないようにすること

### 1.2 セクションごとの表示量の制限
各セクションの高さは、以下のガイドラインに従って調整する：

1. **ヒーローセクション**:
   - 高さ: 100vh（画面の高さ全体に設定）
   - 内容: ヘッダー、メインメッセージ、CTAボタン、背景画像
   - 特記: 画面全体を活用し、スクロールなしでも主要なメッセージとCTAを表示する

2. **課題セクション**:
   - 高さ: 最大100vh
   - 内容: セクションタイトル、4つの課題ボックス
   - 特記: 内容は簡潔にまとめ、テキスト量は最小限に抑える

3. **解決策セクション**:
   - 高さ: 最大100vh
   - 内容: Before/Afterの比較、メリットチャート
   - 特記: ビジュアルを活用して情報量を削減する

4. **機能紹介セクション**:
   - 高さ: 最大120vh
   - 内容: LINEメッセージデモ、機能一覧
   - 特記: 視覚的要素とテキストのバランスを取り、冗長な説明を避ける

5. **料金プランセクション**:
   - 高さ: 最大100vh
   - 内容: 3つの料金プラン、比較表
   - 特記: プラン詳細は必要最小限に抑え、重要な情報に焦点を当てる

6. **お問い合わせセクション**:
   - 高さ: 最大100vh
   - 内容: QRコード、連絡先情報、問い合わせフォーム
   - 特記: フォームの入力項目は必要最小限（5項目以内）に抑える

### 1.3 コンテンツの最適化ガイドライン
コンテンツの最適化は以下のルールに従う：

- **テキスト量**: 各セクションのテキスト量は最小限に抑え、要点を簡潔に伝える
- **フォントサイズ**:
  - 見出し: 28px〜36px（モバイル）、32px〜48px（デスクトップ）
  - 本文: 14px〜16px（モバイル）、16px〜18px（デスクトップ）
- **余白**: 適切な余白（各要素間16px〜24px）を確保してコンテンツの読みやすさを確保する
- **表示密度**: 一画面あたりの情報量が多すぎないように調整する
  - 一覧表示する場合は4項目以内を基本とする
  - 複数カラムの場合、モバイルでは単一カラムに変更する
- **優先度**: 重要な情報を画面の上部（フォールド上）に配置する

## 2. レスポンシブデザインの仕様

### 2.1 ブレイクポイント
- **大画面（デスクトップ）**: 1200px以上
- **中画面（タブレット）**: 768px〜1199px
- **小画面（モバイル）**: 767px以下

### 2.2 レスポンシブ対応時の注意点
- **モバイル表示**: 各セクションが一画面に収まりきらない場合は、重要度の高いコンテンツを優先的に表示
- **コンテンツ調整**: 画面サイズに応じて、表示する内容を調整
  - 小画面では詳細情報を省略または折りたたみメニューとして表示
  - 大画面では適切な余白を確保し、情報の密度が高すぎないようにする
- **タップ領域**: モバイル表示ではタップ可能な要素（ボタン、リンク）の最小サイズを44px×44pxとする

## 3. パフォーマンス要件

### 3.1 表示速度
- **初期表示**: 初期表示は3秒以内に完了すること
- **スクロール**: スクロールはスムーズに行われ、60FPSを維持すること

### 3.2 最適化施策
- **画像圧縮**: すべての画像は適切にサイズ調整・圧縮を行う
- **レイジーロード**: 画面外のコンテンツは必要に応じてレイジーロードを実装
- **アニメーション**: アニメーションはパフォーマンスに影響しないよう最適化する
  - CSSアニメーションを優先的に使用
  - Javascriptによるアニメーションは必要最小限に留める

## 4. アクセシビリティ要件

### 4.1 基本方針
- WCAG 2.1のレベルAA準拠を目指す
- スクリーンリーダーでの閲覧に配慮する
- キーボード操作のみでもナビゲーションが可能であること

### 4.2 具体的な対応
- **コントラスト比**: テキストと背景のコントラスト比は4.5:1以上を確保
- **代替テキスト**: すべての画像に適切な代替テキストを設定
- **フォーカス**: キーボード操作時のフォーカス状態を視覚的に明示
- **セマンティクス**: 適切なHTML要素を使用し、セマンティックな構造を維持 