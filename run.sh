#!/bin/bash

# 色の定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ヘルプメッセージの表示
show_help() {
  echo -e "${BLUE}3Dモニターアプリケーション 実行スクリプト${NC}"
  echo ""
  echo "使用方法:"
  echo "  ./run.sh [コマンド]"
  echo ""
  echo "コマンド:"
  echo "  install   - 依存パッケージをインストール"
  echo "  start     - 開発サーバーを起動"
  echo "  build     - 本番用ビルドを作成"
  echo "  deploy    - Vercelにデプロイ"
  echo "  prod      - Vercelに本番環境としてデプロイ"
  echo "  help      - このヘルプメッセージを表示"
  echo ""
  echo "例:"
  echo "  ./run.sh install    # 依存パッケージをインストール"
  echo "  ./run.sh start      # 開発サーバーを起動"
  echo ""
}

# スクリプトに実行権限を付与
chmod_self() {
  if [ ! -x "$0" ]; then
    echo -e "${YELLOW}スクリプトに実行権限を付与します...${NC}"
    chmod +x "$0"
    echo -e "${GREEN}実行権限を付与しました。もう一度コマンドを実行してください。${NC}"
    exit 0
  fi
}

# 依存パッケージのインストール
install_deps() {
  echo -e "${YELLOW}依存パッケージをインストールしています...${NC}"
  echo -e "${BLUE}依存関係の競合を回避するために --legacy-peer-deps フラグを使用します${NC}"
  npm install --legacy-peer-deps
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}インストールが完了しました！${NC}"
  else
    echo -e "${RED}インストール中にエラーが発生しました。${NC}"
    echo -e "${YELLOW}別の方法を試します: npm install --force${NC}"
    npm install --force
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}インストールが完了しました！${NC}"
    else
      echo -e "${RED}インストールに失敗しました。手動での対応が必要かもしれません。${NC}"
      exit 1
    fi
  fi
}

# 開発サーバーの起動
start_dev_server() {
  echo -e "${YELLOW}開発サーバーを起動しています...${NC}"
  echo -e "${BLUE}アプリケーションは http://localhost:3001 で実行されます${NC}"
  echo -e "${YELLOW}ポート3000が既に使用されている場合、自動的に別のポートが選択されます${NC}"
  PORT=3001 npm start
}

# 本番用ビルドの作成
build_prod() {
  echo -e "${YELLOW}本番用ビルドを作成しています...${NC}"
  npm run build
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}ビルドが完了しました！${NC}"
    echo -e "ビルドファイルは ${BLUE}build/${NC} ディレクトリに生成されました"
  else
    echo -e "${RED}ビルド中にエラーが発生しました。${NC}"
    exit 1
  fi
}

# Vercelへのデプロイ
deploy_to_vercel() {
  echo -e "${YELLOW}Vercelにデプロイしています...${NC}"
  if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLIがインストールされていません。インストールしています...${NC}"
    npm install -g vercel
  fi
  
  echo -e "${BLUE}Vercelへのデプロイを開始します...${NC}"
  vercel
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}デプロイが完了しました！${NC}"
  else
    echo -e "${RED}デプロイ中にエラーが発生しました。${NC}"
    exit 1
  fi
}

# Vercelへの本番デプロイ
deploy_to_prod() {
  echo -e "${YELLOW}Vercelに本番環境としてデプロイしています...${NC}"
  if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLIがインストールされていません。インストールしています...${NC}"
    npm install -g vercel
  fi
  
  echo -e "${BLUE}Vercelへの本番デプロイを開始します...${NC}"
  vercel --prod
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}本番デプロイが完了しました！${NC}"
  else
    echo -e "${RED}デプロイ中にエラーが発生しました。${NC}"
    exit 1
  fi
}

# メイン処理
chmod_self

# コマンドライン引数がない場合はヘルプを表示
if [ $# -eq 0 ]; then
  show_help
  exit 0
fi

# コマンドの処理
case "$1" in
  install)
    install_deps
    ;;
  start)
    start_dev_server
    ;;
  build)
    build_prod
    ;;
  deploy)
    deploy_to_vercel
    ;;
  prod)
    deploy_to_prod
    ;;
  help)
    show_help
    ;;
  *)
    echo -e "${RED}不明なコマンド: $1${NC}"
    show_help
    exit 1
    ;;
esac

exit 0 