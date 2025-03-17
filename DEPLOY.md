# GitHub Pagesデプロイ手順

このドキュメントでは、「LINEでカンタン勤怠」WebサイトをGitHub Pagesにデプロイする手順を説明します。

## 前提条件

- GitHubアカウントを持っていること
- Gitの基本的な操作ができること
- カスタムドメインを所有していること（オプション）

## デプロイ手順

### 1. GitHubリポジトリの作成

1. GitHubにログインし、新しいリポジトリを作成します
   - リポジトリ名は任意（例：`line-kintai-website`）
   - 公開設定は「Public」を選択
   - READMEファイルの初期化はチェックしない

### 2. ローカルリポジトリをGitHubにプッシュ

```bash
# リモートリポジトリを追加
git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git

# ローカルリポジトリをプッシュ
git push -u origin master
```

### 3. GitHub Pagesの設定

1. GitHubのリポジトリページで「Settings」タブをクリック
2. 左側のメニューから「Pages」を選択
3. 「Source」セクションで以下を設定:
   - Branch: `master`（または`main`）
   - Folder: `/ (root)`
   - 「Save」ボタンをクリック
4. カスタムドメインを使用する場合:
   - 「Custom domain」欄にドメイン名を入力
   - 「Save」ボタンをクリック
   - 「Enforce HTTPS」にチェックを入れる（DNSの設定が反映された後）

### 4. DNSの設定（カスタムドメインを使用する場合）

ドメインプロバイダーのDNS設定で以下の変更を行います:

#### Apexドメイン（例：example.com）を使用する場合:

以下のAレコードを追加:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

#### サブドメイン（例：www.example.com）を使用する場合:

CNAMEレコードを追加:

```
あなたのユーザー名.github.io
```

### 5. デプロイの確認

設定が完了すると、数分後に以下のURLでサイトにアクセスできるようになります:

- GitHub Pages URL: `https://あなたのユーザー名.github.io/リポジトリ名/`
- カスタムドメイン: `https://あなたのドメイン/`

## 更新方法

サイトを更新する場合は、ローカルで変更を加えた後、以下のコマンドでGitHubにプッシュします:

```bash
git add .
git commit -m "更新内容の説明"
git push origin master
```

変更がプッシュされると、GitHub Pagesは自動的にサイトを再ビルドします（通常1〜3分程度かかります）。

## トラブルシューティング

- サイトが表示されない場合は、GitHub Pagesの設定が正しいか確認してください
- カスタムドメインが機能しない場合は、DNSの設定が正しいか、また反映されるまで待ってください（最大24時間かかる場合があります）
- 404エラーが表示される場合は、ファイルパスが正しいか確認してください

## 参考リンク

- [GitHub Pages公式ドキュメント](https://docs.github.com/ja/pages)
- [カスタムドメインの設定](https://docs.github.com/ja/pages/configuring-a-custom-domain-for-your-github-pages-site) 