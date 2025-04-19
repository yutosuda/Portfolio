import React, { useMemo, createContext } from 'react'
import { useGLTF, Merged } from '@react-three/drei'
import { MODEL_PATH } from '../../utils/constants/computerConstants'

// コンテキスト設定
export const InstancesContext = createContext()

// GLTFモデルをプリロード
useGLTF.preload(MODEL_PATH)

/**
 * インスタンス管理コンポーネント
 * 類似のジオメトリを検出してインスタンス化し、描画コールを最小限に抑えます
 * @param {Object} props - プロパティとchildren
 */
const Instances = React.memo(({ children, ...props }) => {
  const { nodes } = useGLTF(MODEL_PATH)

  // インスタンス定義 - メモ化してパフォーマンスを最適化
  const instances = useMemo(
    () => ({
      Object: nodes.Object_4,
      Object1: nodes.Object_16,
      Object3: nodes.Object_52,
      Object13: nodes.Object_172,
      Object14: nodes.Object_174,
      Object23: nodes.Object_22,
      Object24: nodes.Object_26,
      Object32: nodes.Object_178,
      Object36: nodes.Object_28,
      Object45: nodes.Object_206,
      Object46: nodes.Object_207,
      Object47: nodes.Object_215,
      Object48: nodes.Object_216,
      Sphere: nodes.Sphere
    }),
    [nodes]
  )

  return (
    <Merged castShadow receiveShadow meshes={instances} {...props}>
      {(instances) => <InstancesContext.Provider value={instances} children={children} />}
    </Merged>
  )
})

export default Instances
