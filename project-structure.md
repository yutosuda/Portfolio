# 3D モニターアプリケーション プロジェクト構造

このドキュメントでは、3D モニターアプリケーションのプロジェクト構造を説明します。

## ディレクトリ構造

```
monitors/                     # プロジェクトルートディレクトリ
│
├── public/                   # 静的ファイル (ビルド時に直接コピーされる)
│   ├── computers_1-transformed.glb  # 3Dコンピューターモデルファイル
│   ├── index.html            # メインのHTMLファイル
│   └── Inter-Medium.woff     # フォントファイル
│
├── src/                      # ソースコード
│   ├── index.js              # アプリケーションのエントリーポイント
│   ├── App.js                # メインのアプリケーションコンポーネント
│   ├── Computers.js          # 3Dコンピューターモデルコンポーネント
│   ├── SpinningBox.js        # 回転するボックスコンポーネント
│   └── styles.css            # グローバルスタイル
│
├── node_modules/             # npmパッケージ (gitignoreに含まれる)
│
├── .git/                     # Gitリポジトリ情報
├── .vscode/                  # VSCode設定
├── .cursor/                  # Cursor設定 (gitignoreに含まれる)
│
├── commands.md               # コマンド実行手順書
├── step-by-step-guide.md     # 詳細なセットアップガイド
├── project-structure.md      # このファイル (プロジェクト構造の説明)
├── run.sh                    # 実行用シェルスクリプト
│
├── package.json              # プロジェクト依存関係と設定
├── package-lock.json         # 依存関係のロックファイル (gitignoreに含まれる)
├── vercel.json               # Vercelデプロイ設定
│
├── .gitignore                # Gitで無視するファイル設定
├── .prettierrc               # コードフォーマット設定
├── README.md                 # プロジェクト概要
└── thumbnail.png             # プロジェクトサムネイル画像
```

## 主要ファイルの説明

### 1. Web アプリケーションのコア

- **`public/index.html`**: Web アプリケーションの骨組みとなる HTML ファイル
- **`src/index.js`**: JavaScript のエントリーポイント、React アプリケーションの起点
- **`src/App.js`**: 3D 表示のためのメインコンポーネント（カメラ、ライト、背景など）
- **`src/Computers.js`**: 3D コンピューターモデルの読み込みと配置を行うコンポーネント
- **`src/SpinningBox.js`**: インタラクティブな回転ボックスコンポーネント
- **`src/styles.css`**: アプリケーション全体のスタイルシート

### 2. 3D アセット

- **`public/computers_1-transformed.glb`**: 3D コンピューターモデルのバイナリファイル
- **`public/Inter-Medium.woff`**: 画面表示に使用されるフォントファイル

### 3. 設定ファイル

- **`package.json`**: プロジェクトの依存関係と実行スクリプトの定義
- **`vercel.json`**: Vercel へのデプロイ設定
- **`.gitignore`**: Git で無視するファイル・ディレクトリの設定
- **`.prettierrc`**: コードフォーマットの設定

### 4. ユーティリティ・ドキュメント

- **`commands.md`**: 基本的なコマンド実行手順
- **`step-by-step-guide.md`**: 詳細なセットアップと実行手順
- **`run.sh`**: ワンコマンドで操作できる便利なシェルスクリプト
- **`README.md`**: プロジェクトの概要説明

## 実行方法

開発環境でプロジェクトを実行するには：

```bash
# 依存パッケージのインストール
./run.sh install

# 開発サーバーの起動
./run.sh start
```

詳細な手順については、`commands.md`または`step-by-step-guide.md`を参照してください。

## デプロイ方法

Vercel にデプロイするには：

```bash
# 初回デプロイ
./run.sh deploy

# 本番環境へのデプロイ
./run.sh prod
```

## アプリケーションの動作

このアプリケーションは、WebGL を使用して 3D コンピューターモデルをブラウザに表示します。ユーザーはマウスを動かしてカメラアングルを変更でき、モニター画面にはカスタムテキスト「Poimandres.」が表示されます。

## 技術スタック

- React：UI フレームワーク
- Three.js：3D グラフィックスライブラリ
- React Three Fiber：React で Three.js を使用するためのライブラリ
- React Three Drei：Three.js の便利なヘルパーコンポーネント
- Vercel：デプロイメントプラットフォーム
