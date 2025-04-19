# プロジェクト実行とデプロイ手順

## 1. ローカル環境でのセットアップと実行

### 必要なツールのインストール

```bash
# Node.jsがインストールされていない場合はインストールしてください
# https://nodejs.org/ から最新のLTS版をダウンロードしてインストール

# インストールされているか確認するコマンド
node -v
npm -v
```

### プロジェクトの依存関係をインストール

```bash
# プロジェクトのルートディレクトリで実行
npm install --legacy-peer-deps

# 上記が失敗した場合は、次のコマンドを試してください
npm install --force
```

このプロジェクトは依存パッケージの互換性の問題があるため、特別なフラグを使用してインストールする必要があります。

### 開発サーバーの起動

```bash
# プロジェクトのルートディレクトリで実行
npm start

# ポート3000が既に使用されている場合は、別のポートを指定
PORT=3001 npm start
```

このコマンドを実行すると、http://localhost:3000（または指定した別のポート）でアプリケーションが起動します。
ブラウザが自動的に開かれない場合は、手動でアクセスしてください。

## 2. ビルド（本番用ファイルの生成）

```bash
# プロジェクトのルートディレクトリで実行
npm run build
```

このコマンドを実行すると、`build`ディレクトリに本番環境用のファイルが生成されます。

## 3. Vercel へのデプロイ準備

### Vercel CLI のインストール

```bash
# グローバルにVercel CLIをインストール
npm install -g vercel
```

### Vercel にログイン

```bash
# 初回のみ実行が必要
vercel login
```

ブラウザが開き、Vercel アカウントでの認証が求められます。

## 4. Vercel へのデプロイ

### 初回デプロイ

```bash
# プロジェクトのルートディレクトリで実行
vercel
```

初回実行時は以下の質問に回答します：

- 「Set up and deploy」で「Y」
- 「Which scope do you want to deploy to?」でアカウントを選択
- 「Link to existing project?」で「N」（新規プロジェクトとして作成）
- 「What's your project's name?」でプロジェクト名を入力（例：monitors）
- 「In which directory is your code located?」で「./」（ルートディレクトリ）
- 「Want to override the settings?」で「N」（デフォルト設定を使用）

デプロイが完了すると、プロジェクトの URL が表示されます。

### 更新デプロイ

```bash
# 変更を加えた後、再度デプロイする場合
vercel
```

### 本番環境へのデプロイ

```bash
# 開発環境での確認後、本番環境へデプロイする場合
vercel --prod
```

## トラブルシューティング

### 依存関係のインストールでエラーが発生する場合

```bash
# 依存関係の競合を回避する
npm install --legacy-peer-deps

# または強制的にインストール
npm install --force

# それでも問題が解決しない場合
npm cache clean --force
npm install --legacy-peer-deps

# ajvパッケージに関連するエラーが出る場合
# package.jsonに以下を追加し、node_modulesを削除して再インストール
# "ajv": "8.12.0",
# "ajv-keywords": "5.1.0"
```

### ローカル環境で表示されない場合

- ブラウザのコンソールでエラーを確認
- 依存関係が正しくインストールされているか確認
- WebGL に対応しているブラウザを使用しているか確認

### ポート競合の問題

- ポート 3000 が既に使用されている場合（Docker 等による）:
  ```bash
  # 別のポートで起動
  PORT=3001 npm start
  ```
- 他のポートでも競合が発生する場合は、さらに別のポートを試す:
  ```bash
  PORT=3002 npm start
  ```

### Vercel デプロイ時のエラー

- ビルドログを確認して具体的なエラーを特定
- 環境変数が必要な場合は Vercel プロジェクト設定から追加

### 3D モデルの表示に関する問題

- ブラウザが WebGL をサポートしているか確認
- 古いブラウザでは Three.js アプリケーションが動作しない場合があります
