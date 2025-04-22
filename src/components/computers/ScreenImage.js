import React, { useRef, useMemo, useCallback, useState, useEffect } from 'react'
import { PerspectiveCamera, useTexture, Text } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

import { COMPUTER_CONSTANTS } from '../../utils/constants/computerConstants'
import Screen from './Screen'
import { usePerformance } from '../../utils/context/PerformanceContext'

/**
 * 画像を表示するモニターコンポーネント
 * @param {Object} props - 表示プロパティ
 * @param {string} props.imageUrl - 表示する画像のURL
 * @param {string} props.linkUrl - クリック時に遷移するURL
 * @param {boolean} props.invert - 配色を反転するかどうか
 * @param {boolean} props.customEffect - カスタムスキャンラインエフェクトを使用するかどうか（デフォルト：false）
 * @param {number} props.scale - 画像のスケール（デフォルト：1.0）
 * @param {string} props.backgroundColor - 背景色（デフォルト：glow）
 */
const ScreenImage = React.memo((props) => {
  const {
    imageUrl = '/demo-image.jpg',
    linkUrl = 'https://example.com',
    invert = false,
    customEffect = false,
    scale = 1.0,
    backgroundColor = COMPUTER_CONSTANTS.COLORS.glow,
    ...otherProps
  } = props

  const planeRef = useRef()
  const screenRef = useRef()
  const [texture, setTexture] = useState(null)
  const [textureStatus, setTextureStatus] = useState('loading')
  const [imageAspectRatio, setImageAspectRatio] = useState(1.0)
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Three.jsのステートにアクセス
  const { gl } = useThree()

  // パフォーマンス監視
  const performance = usePerformance()
  const qualitySettings = performance.getQualitySettings()

  // パス解決のヘルパー関数
  const resolveImagePath = (path) => {
    // パスが絶対パスかどうか確認
    if (path.startsWith('http') || path.startsWith('/')) {
      return path
    }

    // 相対パスの場合、baseUrlを追加
    const baseUrl = process.env.PUBLIC_URL || ''
    return `${baseUrl}/${path.replace(/^\.\//, '')}`
  }

  // コンポーネントマウント時にデバッグログを出力
  useEffect(() => {
    // 解決されたパスの生成
    const resolvedPath = resolveImagePath(imageUrl)
    console.log(`[ScreenImage] Initializing with imageUrl: ${imageUrl}`)
    console.log(`[ScreenImage] Resolved path: ${resolvedPath}`)

    // テクスチャローダーの作成
    const textureLoader = new THREE.TextureLoader()
    textureLoader.setCrossOrigin('anonymous')

    // 画像の読み込み処理
    textureLoader.load(
      // 解決された画像URL
      resolvedPath,

      // 成功時のコールバック
      (loadedTexture) => {
        console.log(`[ScreenImage] Manual texture loading successful: ${resolvedPath}`)

        // テクスチャの設定
        loadedTexture.flipY = true
        loadedTexture.colorSpace = THREE.SRGBColorSpace
        loadedTexture.needsUpdate = true

        // アスペクト比の計算
        if (loadedTexture.image) {
          const ratio = loadedTexture.image.width / loadedTexture.image.height
          console.log(`[ScreenImage] Calculated aspect ratio: ${ratio} for ${resolvedPath}`)
          console.log(`[ScreenImage] Image dimensions: ${loadedTexture.image.width}x${loadedTexture.image.height}`)
          setImageAspectRatio(ratio)
        }

        // テクスチャ設定完了
        setTexture(loadedTexture)
        setTextureStatus('loaded')
        setLoadingProgress(100)
      },

      // 読み込み進捗のコールバック
      (xhr) => {
        if (xhr.total === 0) {
          console.log(`[ScreenImage] Loading texture (size unknown): ${xhr.loaded} bytes - ${resolvedPath}`)
        } else {
          const percentComplete = (xhr.loaded / xhr.total) * 100
          setLoadingProgress(percentComplete)
          console.log(`[ScreenImage] Loading texture: ${percentComplete.toFixed(1)}% - ${resolvedPath}`)
        }
      },

      // エラー時のコールバック
      (error) => {
        console.error(`[ScreenImage] Error loading texture: ${resolvedPath}`, error)
        // エラーの詳細をより詳しく記録
        console.error(`[ScreenImage] Error details: ${error.message || 'Unknown error'}`)

        // 代替画像の試行
        console.log(`[ScreenImage] Attempting to load fallback image: /demo-image.jpg`)
        setTextureStatus('error')
      }
    )

    // クリーンアップ関数
    return () => {
      console.log(`[ScreenImage] Unmounting component with imageUrl: ${resolvedPath}`)
      if (texture) {
        console.log(`[ScreenImage] Disposing texture: ${resolvedPath}`)
        texture.dispose()
      }
    }
  }, [imageUrl]) // imageUrlが変わった時だけ再実行

  // サイズを適切に調整
  const sizeScale = 0.5 * scale

  // クリックイベントのハンドラー - 画面全体にイベントを適用
  const handleClick = useCallback(
    (event) => {
      event.stopPropagation()
      console.log(`[ScreenImage] Click event, opening: ${linkUrl}`)
      // 新しいウィンドウでリンクを開く
      window.open(linkUrl, '_blank', 'noopener,noreferrer')
    },
    [linkUrl]
  )

  // マウスホバー時のスタイル変更 - 画面全体に適用
  const handlePointerOver = useCallback((event) => {
    event.stopPropagation()
    document.body.style.cursor = 'pointer'
  }, [])

  // マウスアウト時のスタイル変更
  const handlePointerOut = useCallback(() => {
    document.body.style.cursor = 'auto'
  }, [])

  // レンダリング品質に応じたアスペクト比設定
  const aspectRatio = qualitySettings.textureSize.width / qualitySettings.textureSize.height

  return (
    <Screen {...otherProps} customEffect={customEffect} ref={screenRef} onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
      <PerspectiveCamera makeDefault manual aspect={aspectRatio} position={[0, 0, 15]} />
      <color attach="background" args={[backgroundColor]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />

      {/* 読み込み中の表示 */}
      {textureStatus === 'loading' && (
        <>
          <Text position={[0, 0, 1]} color="white" fontSize={1.2} anchorX="center" anchorY="middle" font="/Inter-Medium.woff">
            Loading... {loadingProgress.toFixed(0)}%
          </Text>
          <Text position={[0, -1.5, 1]} color="white" fontSize={0.6} anchorX="center" anchorY="middle" font="/Inter-Medium.woff">
            {resolveImagePath(imageUrl)}
          </Text>
        </>
      )}

      {/* エラー表示 */}
      {textureStatus === 'error' && (
        <>
          <Text position={[0, 0, 1]} color="red" fontSize={1} anchorX="center" anchorY="middle" font="/Inter-Medium.woff">
            Error loading image
          </Text>
          <Text position={[0, -1.5, 1]} color="red" fontSize={0.6} anchorX="center" anchorY="middle" font="/Inter-Medium.woff">
            {resolveImagePath(imageUrl)}
          </Text>
        </>
      )}

      {/* 画像を表示するための平面 */}
      {texture && textureStatus === 'loaded' && (
        <mesh
          ref={planeRef}
          position={[0, 0.5, 0.001]} // 背景よりわずかに手前に配置し、Y軸方向に0.5単位上へ移動
        >
          <planeGeometry
            args={[
              // アスペクト比に応じて幅と高さを調整
              imageAspectRatio < 1 ? 8 * sizeScale : 8 * sizeScale * imageAspectRatio,
              imageAspectRatio < 1 ? (8 * sizeScale) / imageAspectRatio : 8 * sizeScale
            ]}
          />
          <meshBasicMaterial map={texture} transparent opacity={0.98} />
        </mesh>
      )}
    </Screen>
  )
})

export default ScreenImage
