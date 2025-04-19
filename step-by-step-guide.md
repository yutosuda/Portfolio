# 3D モニターアプリケーション セットアップと公開の詳細ガイド

このガイドでは、3D モニターアプリケーションをローカル環境で実行し、Vercel にデプロイする手順を段階的に説明します。

## 1. 前提条件

以下のツールが必要です：

- **Node.js**: JavaScript 実行環境（バージョン 14 以上推奨）
- **npm**: Node.js パッケージマネージャー（Node.js と一緒にインストール）
- **ブラウザ**: Chrome, Firefox, Edge などの最新バージョン（WebGL 対応が必要）
- **Vercel アカウント**: デプロイのために必要（無料登録可能）

### Node.js と npm のインストール

1. **Node.js のインストール**:

   - [Node.js 公式サイト](https://nodejs.org/)から LTS 版をダウンロード
   - インストーラーの指示に従ってインストール

2. **インストールの確認**:
   ```bash
   node -v
   npm -v
   ```
   バージョン番号が表示されればインストール成功です

## 2. ローカル環境での実行

### 手順 1: プロジェクトのセットアップ

1. **プロジェクトディレクトリに移動**:

   ```bash
   cd /path/to/your/project
   ```

2. **依存パッケージのインストール**:

   ```bash
   # 依存関係の互換性の問題を回避するためのフラグを使用
   npm install --legacy-peer-deps
   ```

   上記コマンドが失敗した場合は、次のコマンドを試してください：

   ```bash
   npm install --force
   ```

   これにより、package.json に記載されたすべてのライブラリがインストールされます。

   _注意_: インストール中に以下のようなメッセージが表示されることがありますが、警告は無視して構いません:

   ```
   npm WARN deprecated [パッケージ名]: [メッセージ]
   ```

   **依存関係の互換性について**:  
   このプロジェクトでは、ThreeJS (バージョン 0.162.0) と postprocessing パッケージ (バージョン 6.34.3) の間に互換性の問題があります。postprocessing は「three@>= 0.138.0 < 0.162.0」を要求しますが、プロジェクトはthree@0.162.0を使用しています。これを解決するために`--legacy-peer-deps`または`--force`フラグを使用します。

   **ajv パッケージの問題**:  
   インストール後に「Cannot find module 'ajv/dist/compile/codegen'」というエラーが発生する場合は、package.json に特定のバージョンの ajv を追加する必要があります：

   ```json
   "dependencies": {
     // 他の依存関係...
     "ajv": "8.12.0",
     "ajv-keywords": "5.1.0"
   },
   "resolutions": {
     "ajv": "8.12.0",
     "ajv-keywords": "5.1.0"
   }
   ```

   その後、node_modules フォルダと package-lock.json を削除して再インストールしてください：

   ```bash
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

3. **インストール完了の確認**:
   `node_modules`フォルダが作成され、中に多数のファイルが含まれていれば成功です。

### 手順 2: 開発サーバーの起動

1. **開発サーバーの起動**:

   ```bash
   npm start
   ```

   **ポート 3000 が既に使用されている場合**:  
   Docker 等の他のサービスがポート 3000 を使用している場合は、別のポートを指定して起動します：

   ```bash
   PORT=3001 npm start
   ```

2. **アプリケーションへのアクセス**:

   - ブラウザが自動的に開かない場合は、以下の URL にアクセスしてください:
     ```
     http://localhost:3000
     # または指定した別のポート
     http://localhost:3001
     ```

3. **動作確認**:

   - 黒い背景に 3D コンピューターモデルが表示されるはずです
   - マウスを動かすとカメラの視点が変わります
   - モニター画面には「Poimandres.」と表示されています

4. **開発サーバーの停止**:
   - ターミナルで`Ctrl+C`を押す
   - 「終了しますか？(Y/n)」と表示されたら`Y`を入力

## 3. 本番用ビルドの作成

1. **ビルドコマンドの実行**:

   ```bash
   npm run build
   ```

2. **ビルド完了の確認**:

   - ターミナルに「The build folder is ready to be deployed.」と表示されます
   - `build`フォルダが作成され、その中に最適化されたファイルが含まれています

3. **ビルドファイルの確認** (任意):
   ```bash
   ls -la build
   ```
   静的ファイル（HTML, CSS, JavaScript, アセットなど）が含まれています

## 4. Vercel へのデプロイ準備

### 手順 1: Vercel アカウントの準備

1. **Vercel アカウントの作成**:
   - [Vercel 公式サイト](https://vercel.com/signup)にアクセス
   - GitHub や Google などのアカウントでサインアップ、または E メールで新規登録

### 手順 2: Vercel CLI のインストールとログイン

1. **Vercel CLI のインストール**:

   ```bash
   npm install -g vercel
   ```

2. **Vercel にログイン**:

   ```bash
   vercel login
   ```

3. **認証プロセス**:
   - ブラウザが開き、Vercel アカウントへのログインが求められます
   - ログイン後、ターミナルに「Logged in」と表示されれば成功です

## 5. Vercel へのデプロイ

### 手順 1: 初回デプロイ

1. **デプロイコマンドの実行**:

   ```bash
   vercel
   ```

2. **プロジェクト設定**:
   以下の質問に回答します:

   - `? Set up and deploy "[プロジェクトパス]"?` → `y`（はい）

   - `? Which scope do you want to deploy to?` → あなたのアカウント名を選択

   - `? Link to existing project?` → `n`（新規プロジェクト）

   - `? What's your project's name?` → プロジェクト名（例: `monitors-3d`）

   - `? In which directory is your code located?` → `.`（カレントディレクトリ）

   - `? Want to override the settings?` → `n`（デフォルト設定を使用）

3. **デプロイの完了**:

   - デプロイが開始され、進行状況がターミナルに表示されます
   - 完了すると、デプロイされた URL が表示されます（例: `https://monitors-3d.vercel.app`）

4. **デプロイ結果の確認**:
   - 表示された URL をブラウザで開き、アプリケーションが正しく表示されることを確認します

### 手順 2: 更新デプロイ（コード変更後）

1. **コード変更後のデプロイ**:

   ```bash
   vercel
   ```

   既存のプロジェクトが検出され、自動的に更新デプロイが行われます

2. **本番環境へのデプロイ**:
   プレビュー確認後、本番環境に反映させたい場合:
   ```bash
   vercel --prod
   ```

## 6. カスタマイズと最適化（オプション）

### パフォーマンス最適化

1. **3D モデルの最適化**:

   - モデルが重い場合は、圧縮・軽量化されたバージョンに置き換え
   - `public/computers_1-transformed.glb`を最適化されたファイルに置き換え

2. **レンダリング設定の調整**:
   - `src/App.js`の`Canvas`コンポーネントの`dpr`プロパティを調整
   - モバイル端末の場合、より低い値（例: `[0.5, 1]`）に変更

### デザインカスタマイズ

1. **テキスト変更**:

   - `src/Computers.js`の`ScreenText`コンポーネントを編集
   - 現在の「Poimandres.」を別のテキストに変更

2. **背景色の変更**:
   - `src/App.js`の`<color attach="background" args={['black']} />`を編集
   - または`src/styles.css`の`body { background: black; }`を変更

## 7. トラブルシューティング

### 依存関係のインストールの問題

1. **「npm install」でエラーが発生する場合**:

   依存関係の互換性の問題が発生した場合（ThreeJS と postprocessing の競合など）は以下の方法を試してください：

   ```bash
   # 方法1: 依存関係の警告を無視してインストール
   npm install --legacy-peer-deps

   # 方法2: 依存関係を強制的にインストール
   npm install --force

   # 方法3: npmキャッシュをクリアしてから再インストール
   npm cache clean --force
   npm install --legacy-peer-deps
   ```

2. **ajv に関するエラーが発生する場合**:

   「Cannot find module 'ajv/dist/compile/codegen'」などのエラーが発生する場合：

   ```bash
   # 1. node_modulesとpackage-lock.jsonを削除
   rm -rf node_modules package-lock.json

   # 2. package.jsonを編集して特定のバージョンのajvを追加
   # "ajv": "8.12.0"と"ajv-keywords": "5.1.0"を依存関係に追加

   # 3. 再インストール
   npm install --legacy-peer-deps
   ```

3. **「npm start」でエラーが発生する場合**:

   - ポート 3000 が既に使用されている可能性:
     ```bash
     # 別のポートで起動
     PORT=3001 npm start
     ```
   - それでも問題が解決しない場合:
     ```bash
     # さらに別のポートを試す
     PORT=3002 npm start
     ```

4. **3D モデルが表示されない場合**:
   - ブラウザが WebGL をサポートしているか確認
   - デベロッパーツール（F12）を開いてコンソールエラーを確認

### Vercel デプロイの問題

1. **デプロイに失敗する場合**:

   - Vercel ダッシュボードでビルドログを確認
   - 依存関係が正しくインストールされているか確認
   - package.json に記載されているビルドスクリプトが正しいか確認

2. **3D モデルがデプロイ後に表示されない場合**:
   - Vercel の環境変数で NODE_ENV=production を設定
   - 大きなアセットファイルが正しくアップロードされているか確認

## 8. 学習リソース

さらに学習を深めるためのリソース:

- [React 公式ドキュメント](https://reactjs.org/)
- [Three.js 公式ドキュメント](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [Vercel デプロイドキュメント](https://vercel.com/docs)
