import React, { useRef, useMemo, useCallback } from 'react'
import { PerspectiveCamera, useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

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

  // Three.jsのステートにアクセス
  const { gl, camera, raycaster, mouse, scene } = useThree()

  // パフォーマンス監視
  const performance = usePerformance()
  const qualitySettings = performance.getQualitySettings()

  // 画像をテクスチャとして読み込み
  const texture = useTexture(imageUrl)

  // テクスチャが読み込まれた際に反転カラーを適用（必要な場合）
  useMemo(() => {
    if (texture && invert) {
      texture.colorSpace = 'srgb'
    }
  }, [texture, invert])

  // 画像のアスペクト比を計算
  const imageAspectRatio = useMemo(() => {
    if (texture && texture.image) {
      return texture.image.width / texture.image.height
    }
    return 1.0 // デフォルト値
  }, [texture])

  // サイズを2/3に縮小
  const sizeScale = 0.66 * scale

  // クリックイベントのハンドラー - 画面全体にイベントを適用
  const handleClick = useCallback(
    (event) => {
      event.stopPropagation()

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

      {/* 画像を表示するための平面 - 画面中央に配置してサイズを2/3に縮小 */}
      <mesh
        ref={planeRef}
        position={[0, 0, 0.001]} // 背景よりわずかに手前に配置
      >
        <planeGeometry
          args={[
            // アスペクト比に応じて幅と高さを調整（サイズを2/3に縮小）
            imageAspectRatio < 1 ? 8 * sizeScale : 8 * sizeScale * imageAspectRatio,
            imageAspectRatio < 1 ? (8 * sizeScale) / imageAspectRatio : 8 * sizeScale
          ]}
        />
        <meshBasicMaterial map={texture} transparent opacity={0.98} />
      </mesh>

      {/* スクリーン全体のクリック領域（透明）- 必要な場合のみ使用 */}
      {/* 注：Screenコンポーネント自体にクリックイベントを設定しているので通常は不要 */}
    </Screen>
  )
})

export default ScreenImage
