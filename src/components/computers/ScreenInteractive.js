import React, { useRef } from 'react'
import { PerspectiveCamera } from '@react-three/drei'

import { COMPUTER_CONSTANTS } from '../../utils/constants/computerConstants'
import { SpinningBox } from '../../SpinningBox'
import Screen from './Screen'

/**
 * 回転するボックスを表示するモニターコンポーネント
 * @param {Object} props - 表示プロパティ
 * @param {string} props.backgroundColor - 背景色（デフォルト：オレンジ色）
 * @param {boolean} props.customEffect - カスタムスキャンラインエフェクトを使用するかどうか（デフォルト：true）
 */
const ScreenInteractive = React.memo((props) => {
  const { backgroundColor = COMPUTER_CONSTANTS.COLORS.orange, customEffect = true, ...otherProps } = props
  const screenRef = useRef()

  const aspectRatio = COMPUTER_CONSTANTS.TEXTURE.width / COMPUTER_CONSTANTS.TEXTURE.height

  return (
    <Screen {...otherProps} customEffect={customEffect} ref={screenRef}>
      <PerspectiveCamera makeDefault manual aspect={aspectRatio} position={[0, 0, 10]} />
      <color attach="background" args={[backgroundColor]} />
      <ambientLight intensity={0.5} />
      <pointLight decay={0} position={[10, 10, 10]} intensity={2} />
      <pointLight decay={0} position={[-10, -10, -10]} intensity={0.5} />
      <SpinningBox position={[0, 0, 0]} scale={1.5} />
    </Screen>
  )
})

export default ScreenInteractive
