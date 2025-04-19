import React from 'react'
import { COMPUTER_OBJECTS } from '../../utils/constants/computerConstants'

/**
 * コンピュータオブジェクトをレンダリングするコンポーネント
 * @param {Object} props - プロパティ
 * @param {Object} props.instances - インスタンス化されたメッシュオブジェクト
 */
const ComputerObjects = React.memo(({ instances }) => {
  return (
    <>
      {/* 基本オブジェクト */}
      {COMPUTER_OBJECTS.basic.map((props, i) => (
        <instances.Object key={`obj-${i}`} {...props} />
      ))}

      {/* タイプ1オブジェクト */}
      {COMPUTER_OBJECTS.type1.map((props, i) => (
        <instances.Object1 key={`obj1-${i}`} {...props} />
      ))}

      {/* タイプ3オブジェクト */}
      {COMPUTER_OBJECTS.type3.map((props, i) => (
        <instances.Object3 key={`obj3-${i}`} {...props} />
      ))}

      {/* タイプ23オブジェクト */}
      {COMPUTER_OBJECTS.type23.map((props, i) => (
        <instances.Object23 key={`obj23-${i}`} {...props} />
      ))}

      {/* タイプ24オブジェクト */}
      {COMPUTER_OBJECTS.type24.map((props, i) => (
        <instances.Object24 key={`obj24-${i}`} {...props} />
      ))}

      {/* タイプ36オブジェクト */}
      {COMPUTER_OBJECTS.type36.map((props, i) => (
        <instances.Object36 key={`obj36-${i}`} {...props} />
      ))}
    </>
  )
})

export default ComputerObjects
