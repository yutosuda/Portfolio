/**
 * このファイルは3Dのレトロコンピュータモデルを表示するためのコンポーネントをエクスポートします。
 * このファイルは新しいモジュール構造へのエントリーポイントとして機能し、
 * 適切なコンポーネントを再エクスポートします。
 *
 * 主な機能:
 * - 3Dモデルのインスタンス化による効率的な描画
 * - コンピュータのモニター画面へのテキストや3Dオブジェクトの表示
 * - 点滅するLEDなどの効果による臨場感の演出
 *
 * このコードは、単一のGLTFモデルから複数のコンピュータを効率的に描画し、
 * それぞれのモニター画面に異なるコンテンツを表示することで、
 * インタラクティブな3D環境を作成します。
 *
 * 作者: Rafael Rodrigues (https://sketchfab.com/RafaelBR873D)
 * ライセンス: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
 * ソース: https://sketchfab.com/3d-models/old-computers-7bb6e720499a467b8e0427451d180063
 * タイトル: Old Computers
 */

/**
 * ================================================
 * コンポーネント構造と参照関係
 * ================================================
 *
 * アプリケーションで使用するコンポーネントの階層構造と相互依存関係は以下の通りです。
 * 各コンポーネントとその参照場所を示します。
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ Instances （Path: src/components/computers/Instances.js）        │
 * │ ├── 用途: モデルのインスタンス化とコンテキスト提供              │
 * │ ├── 依存: MODEL_PATH（constants/computerConstants.js）         │
 * │ ├── 提供: InstancesContext（React Context）                    │
 * │ └── 使用: useGLTF、useMemo、Merged（@react-three/drei）        │
 * │                                                                 │
 * │ ┌───────────────────────────────────────────────────────────┐   │
 * │ │ Computers （Path: src/components/computers/Computers.js）  │   │
 * │ │ ├── 用途: メインコンポーネント、全サブコンポーネントの統合 │   │
 * │ │ ├── 依存: InstancesContext、MODEL_PATH                    │   │
 * │ │ ├── 子コンポーネント:                                     │   │
 * │ │ │   ├── ComputerObjects                                  │   │
 * │ │ │   ├── StaticMeshes                                    │   │
 * │ │ │   ├── ScreenGroup                                     │   │
 * │ │ │   └── Leds                                            │   │
 * │ │ └── 使用: useGLTF、useContext                           │   │
 * │ └───────────────────────────────────────────────────────────┘   │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ サブコンポーネント詳細                                          │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ ComputerObjects （Path: src/components/computers/ComputerObjects.js）│
 * │ ├── 用途: 各種コンピュータオブジェクトのレンダリング           │
 * │ ├── 依存: COMPUTER_OBJECTS（constants/computerConstants.js）   │
 * │ ├── 引数: {instances} - Instancesから提供されるメッシュインスタンス│
 * │ └── マップするオブジェクトタイプ:                              │
 * │     ├── basic, type1, type3, type23, type24, type36            │
 * │                                                                 │
 * │ StaticMeshes （Path: src/components/computers/StaticMeshes.js） │
 * │ ├── 用途: 静的メッシュ（動かないオブジェクト）のレンダリング    │
 * │ ├── 依存: STATIC_MESHES, OBJECT32_POSITIONS（constants/computerConstants.js）│
 * │ ├── 引数: {nodes, materials, instances}                        │
 * │ └── マップするオブジェクト: 静的メッシュ、Object32インスタンス  │
 * │                                                                 │
 * │ ScreenGroup （Path: src/components/computers/ScreenGroup.js）   │
 * │ ├── 用途: 複数のスクリーンコンポーネントの管理・レンダリング    │
 * │ ├── 依存: SCREEN_DEFINITIONS（constants/computerConstants.js） │
 * │ ├── 子コンポーネント:                                          │
 * │ │   ├── ScreenInteractive - 対話型スクリーン                   │
 * │ │   └── ScreenText - テキスト表示スクリーン                    │
 * │ └── スクリーンタイプ: 'interactive'または'text'                │
 * │                                                                 │
 * │ Leds （Path: src/components/computers/Leds.js）                │
 * │ ├── 用途: 点滅するLEDライトのレンダリング                      │
 * │ ├── 依存: MODEL_PATH, LED_POSITIONS（constants/computerConstants.js）│
 * │ ├── 使用: createLedMaterial（materials/screenMaterials.js）    │
 * │ ├── 引数: {instances} - Instancesから提供されるメッシュインスタンス│
 * │ └── アニメーション: useFrameによるLED色の動的変更              │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ スクリーンコンポーネント詳細                                    │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ Screen （Path: src/components/computers/Screen.js）            │
 * │ ├── 用途: 基本スクリーン機能の提供、他のスクリーンコンポーネントの基盤│
 * │ ├── 依存:                                                      │
 * │ │   ├── MODEL_PATH, COMPUTER_CONSTANTS（constants/computerConstants.js）│
 * │ │   ├── createGlowMaterial, createCornerMaterial（materials/screenMaterials.js）│
 * │ │   ├── calculateScreenParameters（geometry/screenGeometry.js）│
 * │ │   └── createScanlineMaterial, updateScanlineAnimation（shaders/screenShaders.js）│
 * │ ├── 引数: {frame, panel, children, customEffect, ...props}     │
 * │ ├── 主要機能:                                                  │
 * │ │   ├── RenderTextureによるテクスチャ生成                     │
 * │ │   ├── スクリーン全体制御（輝き効果、スキャンライン、コーナー装飾）│
 * │ │   └── childrenを画面コンテンツとして表示                    │
 * │ └── アニメーション: customEffectが有効な場合のスキャンラインアニメーション│
 * │                                                                 │
 * │ ScreenText （Path: src/components/computers/ScreenText.js）    │
 * │ ├── 用途: テキストを表示するスクリーン                          │
 * │ ├── 依存: COMPUTER_CONSTANTS, Screen                          │
 * │ ├── 引数: {invert, x, y, content, fontSize, animated, customEffect, ...props}│
 * │ ├── 主要機能:                                                  │
 * │ │   ├── テキスト表示と配置                                    │
 * │ │   ├── テキスト色反転オプション                              │
 * │ │   └── テキストアニメーション（animated=true時）             │
 * │ └── アニメーション: useFrameによるテキスト位置の動的変更       │
 * │                                                                 │
 * │ ScreenInteractive （Path: src/components/computers/ScreenInteractive.js）│
 * │ ├── 用途: 対話型コンテンツ（回転するボックス）を表示するスクリーン│
 * │ ├── 依存: COMPUTER_CONSTANTS, Screen, SpinningBox             │
 * │ ├── 引数: {backgroundColor, customEffect, ...props}           │
 * │ └── 主要機能: SpinningBoxコンポーネントの表示                  │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │ ユーティリティモジュール詳細                                    │
 * ├─────────────────────────────────────────────────────────────────┤
 * │ constants/computerConstants.js                                 │
 * │ ├── 用途: プロジェクト全体で使用される定数の定義                │
 * │ ├── エクスポート:                                              │
 * │ │   ├── COMPUTER_CONSTANTS - 基本定数（モデルパス、スケール、色など）│
 * │ │   ├── SCREEN_PARAMS - スクリーン表示パラメータ              │
 * │ │   ├── LED_POSITIONS - LED位置座標                           │
 * │ │   ├── SCREEN_DEFINITIONS - スクリーン定義                   │
 * │ │   ├── STATIC_MESHES - 静的メッシュプロパティ                │
 * │ │   ├── OBJECT32_POSITIONS - Object32インスタンス位置         │
 * │ │   ├── COMPUTER_OBJECTS - コンピュータオブジェクト定義       │
 * │ │   ├── COLORS - 色定義                                       │
 * │ │   └── MODEL_PATH - モデルファイルパス                       │
 * │                                                                 │
 * │ materials/screenMaterials.js                                   │
 * │ ├── 用途: スクリーン関連マテリアルの作成関数                    │
 * │ ├── エクスポート:                                              │
 * │ │   ├── createGlowMaterial - 輝き効果用マテリアル作成          │
 * │ │   ├── createCornerMaterial - コーナー装飾用マテリアル作成    │
 * │ │   └── createLedMaterial - LED用マテリアル作成               │
 * │                                                                 │
 * │ shaders/screenShaders.js                                       │
 * │ ├── 用途: スクリーン用シェーダーの作成と更新                    │
 * │ ├── エクスポート:                                              │
 * │ │   ├── createScanlineMaterial - スキャンライン効果シェーダー作成│
 * │ │   └── updateScanlineAnimation - シェーダーアニメーション更新  │
 * │                                                                 │
 * │ geometry/screenGeometry.js                                     │
 * │ ├── 用途: スクリーンジオメトリ計算ユーティリティ                │
 * │ └── エクスポート:                                              │
 * │     └── calculateScreenParameters - スクリーンパラメータ計算    │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * ================================================
 * ファイル参照関係
 * ================================================
 *
 * src/Computers.js
 * └── 再エクスポート: ./components/computers
 *
 * src/components/computers/index.js
 * ├── エクスポート: Computers, Instances, InstancesContext
 * └── その他コンポーネントのエクスポート
 *
 * src/components/computers/Instances.js
 * └── 依存: ../../utils/constants/computerConstants.js
 *
 * src/components/computers/Computers.js
 * ├── 依存: ../../utils/constants/computerConstants.js
 * └── インポート: ./Instances, ./ComputerObjects, ./StaticMeshes, ./ScreenGroup, ./Leds
 *
 * src/components/computers/Screen.js
 * ├── 依存: ../../utils/constants/computerConstants.js
 * ├── 依存: ../../utils/materials/screenMaterials.js
 * ├── 依存: ../../utils/geometry/screenGeometry.js
 * └── 依存: ../../utils/shaders/screenShaders.js
 *
 * src/components/computers/ScreenText.js
 * ├── 依存: ../../utils/constants/computerConstants.js
 * └── インポート: ./Screen
 *
 * src/components/computers/ScreenInteractive.js
 * ├── 依存: ../../utils/constants/computerConstants.js
 * ├── インポート: ../../SpinningBox
 * └── インポート: ./Screen
 *
 * src/components/computers/ScreenGroup.js
 * ├── 依存: ../../utils/constants/computerConstants.js
 * ├── インポート: ./ScreenText
 * └── インポート: ./ScreenInteractive
 *
 * src/components/computers/Leds.js
 * ├── 依存: ../../utils/constants/computerConstants.js
 * └── 依存: ../../utils/materials/screenMaterials.js
 *
 * src/components/computers/StaticMeshes.js
 * └── 依存: ../../utils/constants/computerConstants.js
 *
 * src/components/computers/ComputerObjects.js
 * └── 依存: ../../utils/constants/computerConstants.js
 */

/**
 * ================================================
 * パフォーマンス最適化の概要
 * ================================================
 *
 * このコードベースでは以下の最適化技術を実装しています:
 *
 * 1. 並列処理と計算の最適化
 *    - Web Workersを使用したバックグラウンド計算
 *    - アニメーション計算の優先順位付けと負荷分散
 *    - パフォーマンスモニタリングによる動的なフレームスキップ
 *
 * 2. メモリと描画の最適化
 *    - レンダーテクスチャのキャッシュと再利用
 *    - マテリアルの共有と効率的な管理
 *    - LOD (Level of Detail) による距離に基づく品質調整
 *
 * 3. レンダリングパイプラインの最適化
 *    - フラストラムカリングによる不要なオブジェクトの描画回避
 *    - 効率的なバッチ処理とインスタンス化
 *    - RenderTargetのサイズと解像度の動的調整
 *
 * 4. リアクティブな最適化
 *    - useMemoとReact.memoによる不要な再計算の回避
 *    - コンポーネントの効率的なメモ化
 *    - レンダリングサイクルの最適化
 *
 * 実装されている主要な最適化コンポーネント:
 * - PerformanceProvider: パフォーマンス監視と最適化設定を提供
 * - usePerformanceMonitor: フレームレートとデバイス性能の監視
 * - useRenderTextureCache: テクスチャの効率的な再利用
 * - useWorkerizedComputation: 重い計算の並列処理
 *
 * ================================================
 * 今後の最適化の可能性
 * ================================================
 *
 * 1. インスタンス化の更なる改善
 *    - 類似ジオメトリの自動検出と効率的なマージ
 *    - 動的なインスタンス管理
 *
 * 2. シェーディングの最適化
 *    - カスタムシェーダーの効率化
 *    - ピクセルシェーダーの最適化
 *
 * 3. アセット管理
 *    - テクスチャアトラスの導入
 *    - 動的なアセットロードとアンロード
 */

// 新しいモジュール構造からコンポーネントをエクスポート
export { Computers, Instances } from './components/computers'

// パフォーマンス最適化ユーティリティをエクスポート
export { usePerformance, PerformanceProvider } from './utils/context/PerformanceContext'
export { PerformanceStats } from './utils/hooks/usePerformanceMonitor'
