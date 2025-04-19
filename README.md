# 3D モニターズ・ディスプレイ

React と Three.js を使用した、インタラクティブな 3D コンピューターモニターの展示アプリケーションです。

![サムネイル](thumbnail.png)

## 概要

このプロジェクトは、WebGL を活用して古いスタイルのコンピューターモニターを 3D で表示する Web 体験を提供します。ユーザーはマウスを動かすことでカメラアングルを変更でき、モニター画面にはカスタムテキストが表示されます。

## 特徴

- リアルな 3D コンピューターモデルの表示
- マウス操作によるインタラクティブなカメラ移動
- モニター画面へのカスタムコンテンツ表示
- 美しいライティングとポストプロセッシング効果

## 利用方法

### ローカル環境で実行

```bash
# 依存パッケージをインストール
./run.sh install

# 開発サーバーを起動
./run.sh start
```

詳細な手順については、以下のドキュメントを参照してください：

- `commands.md` - 基本的なコマンド一覧
- `step-by-step-guide.md` - 詳細な実行手順
- `project-structure.md` - プロジェクト構造の説明

## 技術スタック

- React 18
- Three.js 0.162.0
- React Three Fiber
- React Three Drei
- Postprocessing

## デプロイ

Vercel へのデプロイ方法は、`step-by-step-guide.md`を参照してください。

## ライセンス

このプロジェクトに使用されている 3D モデルは以下のライセンスに基づいています：

- 作者: Rafael Rodrigues (https://sketchfab.com/RafaelBR873D)
- ライセンス: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
- 出典: https://sketchfab.com/3d-models/old-computers-7bb6e720499a467b8e0427451d180063

コードベースは MIT ライセンスの下で提供されています。
