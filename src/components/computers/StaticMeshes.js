import React from 'react'
import { STATIC_MESHES, OBJECT32_POSITIONS } from '../../utils/constants/computerConstants'

/**
 * 静的メッシュをレンダリングするコンポーネント
 * @param {Object} props - プロパティ
 * @param {Object} props.nodes - GLTFモデルのノード
 * @param {Object} props.materials - GLTFモデルのマテリアル
 * @param {Object} props.instances - インスタンス化されたメッシュオブジェクト
 */
const StaticMeshes = React.memo(({ nodes, materials, instances }) => {
  return (
    <>
      {/* 通常のメッシュ */}
      {STATIC_MESHES.map((mesh, i) => (
        <mesh
          key={`static-mesh-${i}`}
          castShadow
          receiveShadow
          geometry={nodes[mesh.id]}
          material={materials.Texture}
          position={mesh.position}
          rotation={mesh.rotation}
          scale={mesh.scale}
        />
      ))}

      {/* Object32のインスタンス */}
      {OBJECT32_POSITIONS.map((props, i) => (
        <instances.Object32 key={`obj32-${i}`} {...props} />
      ))}
    </>
  )
})

export default StaticMeshes
