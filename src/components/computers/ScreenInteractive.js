import React from 'react'
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

  const aspectRatio = COMPUTER_CONSTANTS.TEXTURE.width / COMPUTER_CONSTANTS.TEXTURE.height

  return (
    <Screen {...otherProps} customEffect={customEffect}>
      <PerspectiveCamera makeDefault manual aspect={aspectRatio} position={[0, 0, 10]} />
      <color attach="background" args={[backgroundColor]} />
      <ambientLight intensity={COMPUTER_CONSTANTS.FULL_PI / 2} />
      <pointLight decay={0} position={[10, 10, 10]} intensity={COMPUTER_CONSTANTS.FULL_PI} />
      <pointLight decay={0} position={[-10, -10, -10]} />
      <SpinningBox position={[-3.15, 0.75, 0]} scale={0.5} />
    </Screen>
  )
})

export default ScreenInteractive
