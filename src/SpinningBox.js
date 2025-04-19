import { useRef, useState } from 'react'
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

export function SpinningBox({ scale, ...props }) {
  // このリファレンスはTHREE.Meshオブジェクトに直接アクセスするためのものです
  const ref = useRef()
  // ホバーとクリックのイベント状態を保持します
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  useCursor(hovered)
  // このコンポーネントをレンダーループに登録し、毎フレームメッシュを回転させます
  useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += delta))
  // ビューを返します。これらは通常のThreejsの要素をJSXで表現したものです
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? scale * 1.4 : scale * 1.2}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'indianred'} />
    </mesh>
  )
}
