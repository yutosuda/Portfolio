import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'

/*
このファイルは3D空間でインタラクティブに回転するボックスを表示するコンポーネントを提供します。
主な機能:
- マウスホバーとクリックイベントに反応する立方体
- ユーザーがホバーすると色が変わり、ポインターのスタイルが変更される
- クリックすると大きさが変わる
- 常に自動回転する3Dボックス

このコンポーネントは、モニター画面に表示されるインタラクティブなコンテンツや、
3D空間内のインタラクティブな要素として使用されます。
*/

export function SpinningBox({ scale = 1.2, ...props }) {
  // このリファレンスはTHREE.Meshオブジェクトに直接アクセスするためのものです
  const ref = useRef()
  // ホバーとクリックのイベント状態を保持します
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  // 初期化時にデバッグ情報をコンソールに出力
  useEffect(() => {
    console.log('SpinningBox initialized', { scale, props })
    return () => {
      console.log('SpinningBox unmounted')
    }
  }, [])

  // ポインターのカーソルスタイルを変更
  useCursor(hovered)

  // このコンポーネントをレンダーループに登録し、毎フレームメッシュを回転させます
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.5
      ref.current.rotation.y += delta * 0.5
    }
  })

  // ビューを返します。これらは通常のThreejsの要素をJSXで表現したものです
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? scale * 1.4 : scale}
      onClick={(event) => {
        event.stopPropagation()
        click(!clicked)
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        hover(true)
      }}
      onPointerOut={(event) => {
        event.stopPropagation()
        hover(false)
      }}>
      <boxGeometry />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'indianred'} />
    </mesh>
  )
}
