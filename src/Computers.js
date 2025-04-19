import * as THREE from 'three'
import { useMemo, useContext, createContext, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Merged, RenderTexture, PerspectiveCamera, Text } from '@react-three/drei'
import { SpinningBox } from './SpinningBox'

// 基本設定
THREE.ColorManagement.legacyMode = false

// 共通定数
const CONSTANTS = {
  // モデル関連
  MODEL_PATH: '/computers_1-transformed.glb',
  DEFAULT_OBJECT_SCALE: 1.52,
  SMALL_OBJECT_SCALE: 0.5,
  // カラー設定
  COLORS: {
    glow: '#35c19f',
    white: '#ffffff',
    black: 'black',
    orange: 'orange',
    blue: '#3b82f6',
    purple: '#8b5cf6'
  },
  // テクスチャ設定
  TEXTURE: {
    width: 764,
    height: 400,
    anisotropy: 16
  },
  // 数学定数
  HALF_PI: Math.PI / 2,
  FULL_PI: Math.PI
}

// モデルをプリロード
useGLTF.preload(CONSTANTS.MODEL_PATH)

/*
このファイルは3Dのレトロコンピュータモデルを表示するためのコンポーネントを提供します。
主な機能:
- 3Dモデルのインスタンス化による効率的な描画
- コンピュータのモニター画面へのテキストや3Dオブジェクトの表示
- 点滅するLEDなどの効果による臨場感の演出

このコードは、単一のGLTFモデルから複数のコンピュータを効率的に描画し、
それぞれのモニター画面に異なるコンテンツを表示することで、
インタラクティブな3D環境を作成します。
*/

/*
以下は次のコマンドによって自動生成されました: npx gltfjsx computers.glb --transform --instance
--instanceフラグを使用することで、類似のジオメトリを検出してインスタンス化し、描画コールを最小限に抑えています

作者: Rafael Rodrigues (https://sketchfab.com/RafaelBR873D)
ライセンス: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
ソース: https://sketchfab.com/3d-models/old-computers-7bb6e720499a467b8e0427451d180063
タイトル: Old Computers
*/

// コンテキスト設定
const context = createContext()

// インスタンス管理コンポーネント
export function Instances({ children, ...props }) {
  const { nodes } = useGLTF(CONSTANTS.MODEL_PATH)

  // インスタンス定義
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
      {(instances) => <context.Provider value={instances} children={children} />}
    </Merged>
  )
}

// メインコンピュータグループコンポーネント
export function Computers(props) {
  const { nodes: n, materials: m } = useGLTF(CONSTANTS.MODEL_PATH)
  const instances = useContext(context)

  return (
    <group {...props} dispose={null}>
      {/* コンピュータオブジェクトグループ */}
      <ComputerObjects instances={instances} />

      {/* 静的メッシュグループ */}
      <StaticMeshes nodes={n} materials={m} instances={instances} />

      {/* インタラクティブなスクリーン */}
      <ScreenGroup instances={instances} />

      {/* LED光源 */}
      <Leds instances={instances} />
    </group>
  )
}

// コンピュータオブジェクトをレンダリング
function ComputerObjects({ instances }) {
  // オブジェクト定義 - タイプ別に構造化
  const objects = {
    basic: [
      { position: [0.16, 0.79, -1.97], rotation: [-0.54, 0.93, -1.12], scale: CONSTANTS.SMALL_OBJECT_SCALE },
      { position: [-2.79, 0.27, 1.82], rotation: [-1.44, 1.22, 1.43], scale: CONSTANTS.SMALL_OBJECT_SCALE },
      { position: [-5.6, 4.62, -0.03], rotation: [-1.96, 0.16, 1.2], scale: CONSTANTS.SMALL_OBJECT_SCALE },
      { position: [2.62, 1.98, -2.47], rotation: [-0.42, -0.7, -1.85], scale: CONSTANTS.SMALL_OBJECT_SCALE },
      { position: [4.6, 3.46, 1.19], rotation: [-1.24, -0.72, 0.48], scale: CONSTANTS.SMALL_OBJECT_SCALE }
    ],

    type1: [
      { position: [0.63, 0, -3], rotation: [0, 0.17, 0] },
      { position: [-2.36, 0.32, -2.02], rotation: [0, 0.53, -CONSTANTS.HALF_PI] },
      { position: [-3.53, 0, 0.59], rotation: [CONSTANTS.FULL_PI, -1.09, CONSTANTS.FULL_PI] },
      { position: [-3.53, 1.53, 0.59], rotation: [0, 0.91, 0] },
      { position: [3.42, 0, 0], rotation: [-CONSTANTS.FULL_PI, 1.13, -CONSTANTS.FULL_PI] },
      { position: [4.09, 2.18, 2.41], rotation: [0, -1.55, 1.57] },
      { position: [-3.69, 0, 2.59], rotation: [0, -1.57, 0] },
      { position: [-5.36, 2.18, 0.81], rotation: [0, 0.77, CONSTANTS.HALF_PI] },
      { position: [-5.47, 2.79, 0.74], rotation: [CONSTANTS.FULL_PI, -1.16, CONSTANTS.HALF_PI] },
      { position: [-5.28, 0, -2.33], rotation: [0, 0.75, 0] },
      { position: [-5.49, 0, -1.38], rotation: [CONSTANTS.FULL_PI, -0.99, CONSTANTS.FULL_PI] },
      { position: [-3.01, 0, -3.79], rotation: [0, 0.6, 0] },
      { position: [-2.08, 0, -4.32], rotation: [CONSTANTS.FULL_PI, -0.6, CONSTANTS.FULL_PI] },
      { position: [-1.02, 0, -4.49], rotation: [0, 0.31, 0] },
      { position: [-5.31, 1.83, -1.41], rotation: [0, 1.06, CONSTANTS.HALF_PI] },
      { position: [-4.18, 1.83, -3.06], rotation: [-CONSTANTS.FULL_PI, -0.46, -CONSTANTS.HALF_PI] },
      { position: [-1.76, 1.83, -3.6], rotation: [0, -1.16, CONSTANTS.HALF_PI] },
      { position: [-0.25, 1.83, -5.54], rotation: [0, 1.55, 1.57] },
      { position: [-5.28, 2.14, -2.33], rotation: [CONSTANTS.FULL_PI, -0.75, CONSTANTS.FULL_PI] },
      { position: [-5.49, 2.14, -1.38], rotation: [0, 0.99, 0] },
      { position: [-3.01, 2.14, -3.79], rotation: [CONSTANTS.FULL_PI, -0.6, CONSTANTS.FULL_PI] },
      { position: [-2.08, 2.14, -4.32], rotation: [0, 0.6, 0] },
      { position: [-1.02, 2.14, -4.49], rotation: [CONSTANTS.FULL_PI, -0.31, CONSTANTS.FULL_PI] },
      { position: [-5.31, 3.98, -1.41], rotation: [0, 1.06, CONSTANTS.HALF_PI] },
      { position: [-4.18, 3.98, -3.06], rotation: [-CONSTANTS.FULL_PI, -0.46, -CONSTANTS.HALF_PI] },
      { position: [-1.17, 3.98, -4.45], rotation: [0, 0.17, CONSTANTS.HALF_PI] },
      { position: [-0.94, 3.98, -4.66], rotation: [CONSTANTS.FULL_PI, 0.02, -CONSTANTS.HALF_PI] }
    ],

    type3: [
      { position: [4.31, 1.57, 2.34], rotation: [0, -1.15, -CONSTANTS.HALF_PI], scale: -CONSTANTS.DEFAULT_OBJECT_SCALE },
      { position: [-3.79, 0, 1.66], rotation: [CONSTANTS.FULL_PI, -1.39, 0], scale: -CONSTANTS.DEFAULT_OBJECT_SCALE },
      { position: [-3.79, 1.53, 1.66], rotation: [0, 1.22, -CONSTANTS.FULL_PI], scale: -CONSTANTS.DEFAULT_OBJECT_SCALE },
      { position: [-5.56, 1.57, 0.69], rotation: [0, 1.17, -CONSTANTS.HALF_PI], scale: -CONSTANTS.DEFAULT_OBJECT_SCALE },
      { position: [-5.29, 3.41, 0.89], rotation: [CONSTANTS.FULL_PI, -0.76, -CONSTANTS.HALF_PI], scale: -CONSTANTS.DEFAULT_OBJECT_SCALE }
    ],

    type23: [
      { position: [-2.29, 1.56, -2.26], rotation: [0, -0.005, -CONSTANTS.HALF_PI] },
      { position: [-2.9, 0.3, -1.47], rotation: [CONSTANTS.FULL_PI, -1.35, CONSTANTS.HALF_PI] },
      { position: [3.22, 0, -0.8], rotation: [0, -1.32, 0] },
      { position: [3.53, 1.83, 0.44], rotation: [-CONSTANTS.FULL_PI, 1.32, CONSTANTS.HALF_PI] },
      { position: [4.26, 0.94, 2.22], rotation: [0, -1, CONSTANTS.HALF_PI] },
      { position: [-5.61, 0.94, 0.82], rotation: [0, 1.32, 1.57] },
      { position: [-5.39, 4.03, 0.99], rotation: [CONSTANTS.FULL_PI, -0.61, CONSTANTS.HALF_PI] },
      { position: [-5.95, 0, -0.64], rotation: [0, 0.95, 0] },
      { position: [-4.48, 0, -2.75], rotation: [CONSTANTS.FULL_PI, -0.57, CONSTANTS.FULL_PI] },
      { position: [-3.72, 0, -2.89], rotation: [0, 0.64, 0] },
      { position: [-0.08, 0, -5.03], rotation: [CONSTANTS.FULL_PI, -0.04, CONSTANTS.FULL_PI] },
      { position: [-5.95, 2.14, -0.64], rotation: [CONSTANTS.FULL_PI, -0.95, CONSTANTS.FULL_PI] },
      { position: [-4.48, 2.14, -2.75], rotation: [0, 0.57, 0] },
      { position: [-3.73, 2.14, -3.1], rotation: [CONSTANTS.FULL_PI, -0.64, CONSTANTS.FULL_PI] },
      { position: [-0.08, 2.14, -5.03], rotation: [0, 0.04, 0] }
    ],

    type24: [
      { position: [-2.19, 2.19, -1.87], rotation: [0, 0.51, CONSTANTS.HALF_PI], scale: -CONSTANTS.DEFAULT_OBJECT_SCALE },
      { position: [3.87, 0.32, 2.35], rotation: [0, -1.53, -1.57], scale: -CONSTANTS.DEFAULT_OBJECT_SCALE },
      { position: [-5.26, 0.32, 1.01], rotation: [0, 0.79, -CONSTANTS.HALF_PI], scale: -CONSTANTS.DEFAULT_OBJECT_SCALE },
      { position: [-5.7, 4.66, 0.72], rotation: [CONSTANTS.FULL_PI, -1.13, -CONSTANTS.HALF_PI], scale: -CONSTANTS.DEFAULT_OBJECT_SCALE },
      { position: [-4.19, 1.84, -2.77], rotation: [CONSTANTS.FULL_PI, -0.66, -CONSTANTS.HALF_PI], scale: -CONSTANTS.DEFAULT_OBJECT_SCALE },
      { position: [-4.19, 3.98, -2.77], rotation: [CONSTANTS.FULL_PI, -0.66, -CONSTANTS.HALF_PI], scale: -CONSTANTS.DEFAULT_OBJECT_SCALE }
    ],

    type36: [
      { position: [0.35, 2.35, -3.34], rotation: [-0.26, 0, 0] },
      { position: [0.18, 2.8, -2.85], rotation: [0.09, 0.15, -0.005] },
      { position: [1.89, 0, -1.94], rotation: [0, -0.44, 0], scale: [1.5, 1, 1.5] },
      { position: [1.86, 1.61, -1.81], rotation: [0, -CONSTANTS.FULL_PI / 3, 0] },
      { position: [3.95, 2.49, 1.61], rotation: [0, -CONSTANTS.FULL_PI / 3, 0] },
      { position: [-1.1, 4.29, -4.43], rotation: [0, 0.36, 0] },
      { position: [-5.25, 4.29, -1.47], rotation: [0, 1.25, 0] }
    ]
  }

  // オブジェクトの内容をレンダリング
  return (
    <>
      {/* 基本オブジェクト */}
      {objects.basic.map((props, i) => (
        <instances.Object key={`obj-${i}`} {...props} />
      ))}

      {/* タイプ1オブジェクト */}
      {objects.type1.map((props, i) => (
        <instances.Object1 key={`obj1-${i}`} {...props} scale={props.scale || CONSTANTS.DEFAULT_OBJECT_SCALE} />
      ))}

      {/* タイプ3オブジェクト */}
      {objects.type3.map((props, i) => (
        <instances.Object3 key={`obj3-${i}`} {...props} />
      ))}

      {/* タイプ23オブジェクト */}
      {objects.type23.map((props, i) => (
        <instances.Object23 key={`obj23-${i}`} {...props} scale={props.scale || CONSTANTS.DEFAULT_OBJECT_SCALE} />
      ))}

      {/* タイプ24オブジェクト */}
      {objects.type24.map((props, i) => (
        <instances.Object24 key={`obj24-${i}`} {...props} />
      ))}

      {/* タイプ36オブジェクト */}
      {objects.type36.map((props, i) => (
        <instances.Object36 key={`obj36-${i}`} {...props} />
      ))}
    </>
  )
}

/* このコンポーネントはモニター（GLTFモデルから取り出したもの）をレンダリングします
   カスタムシーンをテクスチャにレンダリングし、それをモニターの画面に投影します */
function Screen({ frame, panel, children, customEffect = false, ...props }) {
  const { nodes, materials } = useGLTF(CONSTANTS.MODEL_PATH)
  const screenRef = useRef()
  const textureWidth = CONSTANTS.TEXTURE.width
  const textureHeight = CONSTANTS.TEXTURE.height
  const aspectRatio = textureWidth / textureHeight

  // スクリーンパラメータ
  const screenParams = useMemo(() => {
    // パネルのジオメトリサイズを計算
    const geometry = nodes[panel].geometry
    const box = new THREE.Box3().setFromBufferAttribute(geometry.attributes.position)
    const size = box.getSize(new THREE.Vector3())

    // スクリーンのスケール係数
    const screenScale = 1.3
    // y軸位置の調整値
    const yAdjustment = -0.02
    // 実際のスクリーンサイズを計算
    const width = size.x * screenScale
    const height = size.y * screenScale
    // コーナー装飾の位置調整のためのオフセット
    const cornerOffset = 0.02

    return {
      size,
      yAdjustment,
      scale: screenScale,
      width,
      height,
      cornerOffset,
      z: {
        glow: 0.48, // 輝き効果のZ位置
        main: 0.5, // メインスクリーンのZ位置
        corner: 0.51 // コーナー装飾のZ位置
      },
      corner: {
        x: width / 2 - cornerOffset,
        topY: height / 2 - cornerOffset + yAdjustment,
        bottomY: -height / 2 + cornerOffset + yAdjustment
      }
    }
  }, [nodes, panel])

  // スクリーンの輝き効果用の材質を作成
  const glowMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(CONSTANTS.COLORS.glow),
        emissive: new THREE.Color(CONSTANTS.COLORS.glow).multiplyScalar(0.15),
        roughness: 0.2,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
        transmission: 0.95,
        thickness: 0.05,
        transparent: true,
        opacity: 0.6
      }),
    []
  )

  // コーナー装飾用の共通材質
  const cornerMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: CONSTANTS.COLORS.glow,
        emissive: CONSTANTS.COLORS.glow,
        emissiveIntensity: 0.6
      }),
    []
  )

  // スキャンライン効果の材質
  const scanlineMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          tMap: { value: null },
          uTime: { value: 0 },
          uIntensity: { value: 0.15 }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D tMap;
          uniform float uTime;
          uniform float uIntensity;
          varying vec2 vUv;
          
          void main() {
            vec4 color = texture2D(tMap, vUv);
            
            // スキャンライン効果
            float scanline = sin(vUv.y * 100.0 + uTime) * 0.04 * uIntensity;
            
            // ブラウン管風のビネット効果
            float vignetteAmount = 1.0 - length(vUv - 0.5) * 0.7;
            
            // 微小なノイズ
            float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233) * uTime * 0.1)) * 43758.5453) * 0.03 * uIntensity;
            
            gl_FragColor = vec4(color.rgb * (1.0 + scanline + noise) * vignetteAmount, color.a);
          }
        `,
        transparent: true
      }),
    []
  )

  // スキャンライン効果のアニメーション
  useFrame(({ clock }) => {
    if (customEffect && screenRef.current) {
      scanlineMaterial.uniforms.uTime.value = clock.getElapsedTime() * 2
    }
  })

  // コーナー装飾のサイズと形状
  const cornerScale = 0.02
  const cornerGeometry = <sphereGeometry args={[1, 16, 16, 0, CONSTANTS.HALF_PI]} />

  return (
    <group {...props}>
      <mesh castShadow receiveShadow geometry={nodes[frame].geometry} material={materials.Texture} />

      {/* スクリーン周囲の輝き効果 */}
      <mesh
        geometry={nodes[panel].geometry}
        position={[0, screenParams.yAdjustment, screenParams.z.glow]}
        scale={[screenParams.scale, screenParams.scale, 1.3]}
        material={glowMaterial}
      />

      {/* メインスクリーン */}
      <mesh ref={screenRef} geometry={nodes[panel].geometry} position={[0, screenParams.yAdjustment, screenParams.z.main]} scale={screenParams.scale}>
        <meshBasicMaterial transparent={false} toneMapped={false}>
          <RenderTexture width={textureWidth} height={textureHeight} attach="map" anisotropy={CONSTANTS.TEXTURE.anisotropy}>
            {children}
          </RenderTexture>
        </meshBasicMaterial>
      </mesh>

      {/* スキャンライン効果オーバーレイ（オプション） */}
      {customEffect && (
        <mesh geometry={nodes[panel].geometry} position={[0, screenParams.yAdjustment, screenParams.z.main + 0.001]} scale={screenParams.scale}>
          <primitive object={scanlineMaterial}>
            <RenderTexture width={textureWidth} height={textureHeight} attach="uniforms-tMap-value" anisotropy={CONSTANTS.TEXTURE.anisotropy} />
          </primitive>
        </mesh>
      )}

      {/* コーナー加飾 - 左上 */}
      <mesh position={[-screenParams.corner.x, screenParams.corner.topY, screenParams.z.corner]} scale={cornerScale}>
        {cornerGeometry}
        <primitive object={cornerMaterial} />
      </mesh>

      {/* コーナー加飾 - 右上 */}
      <mesh position={[screenParams.corner.x, screenParams.corner.topY, screenParams.z.corner]} scale={cornerScale} rotation={[0, 0, CONSTANTS.HALF_PI]}>
        {cornerGeometry}
        <primitive object={cornerMaterial} />
      </mesh>

      {/* コーナー加飾 - 左下 */}
      <mesh position={[-screenParams.corner.x, screenParams.corner.bottomY, screenParams.z.corner]} scale={cornerScale} rotation={[0, 0, -CONSTANTS.HALF_PI]}>
        {cornerGeometry}
        <primitive object={cornerMaterial} />
      </mesh>

      {/* コーナー加飾 - 右下 */}
      <mesh position={[screenParams.corner.x, screenParams.corner.bottomY, screenParams.z.corner]} scale={cornerScale} rotation={[0, 0, CONSTANTS.FULL_PI]}>
        {cornerGeometry}
        <primitive object={cornerMaterial} />
      </mesh>
    </group>
  )
}

/* テキストを表示するモニターをレンダリングします */
function ScreenText({ invert, x = 0, y = 1.2, content = 'Poimandres.', fontSize = 4, animated = true, customEffect = false, ...props }) {
  const textRef = useRef()
  const rand = Math.random() * 10000
  const aspectRatio = CONSTANTS.TEXTURE.width / CONSTANTS.TEXTURE.height

  // テキストの位置アニメーション
  useFrame((state) => {
    if (animated && textRef.current) {
      textRef.current.position.x = x + Math.sin(rand + state.clock.elapsedTime / 4) * 8
    }
  })

  // 配色を決定
  const colors = {
    background: invert ? CONSTANTS.COLORS.black : CONSTANTS.COLORS.glow,
    text: !invert ? CONSTANTS.COLORS.black : CONSTANTS.COLORS.glow
  }

  return (
    <Screen {...props} customEffect={customEffect}>
      <PerspectiveCamera makeDefault manual aspect={aspectRatio} position={[0, 0, 15]} />
      <color attach="background" args={[colors.background]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
      <Text
        font="/Inter-Medium.woff"
        position={[x, y, 0]}
        ref={textRef}
        fontSize={fontSize}
        letterSpacing={-0.1}
        color={colors.text}
        anchorX="center"
        anchorY="middle"
        maxWidth={30}>
        {content}
      </Text>
    </Screen>
  )
}

/* 回転するボックスを表示するモニターをレンダリングします */
function ScreenInteractive({ backgroundColor = CONSTANTS.COLORS.orange, customEffect = true, ...props }) {
  const aspectRatio = CONSTANTS.TEXTURE.width / CONSTANTS.TEXTURE.height

  return (
    <Screen {...props} customEffect={customEffect}>
      <PerspectiveCamera makeDefault manual aspect={aspectRatio} position={[0, 0, 10]} />
      <color attach="background" args={[backgroundColor]} />
      <ambientLight intensity={CONSTANTS.FULL_PI / 2} />
      <pointLight decay={0} position={[10, 10, 10]} intensity={CONSTANTS.FULL_PI} />
      <pointLight decay={0} position={[-10, -10, -10]} />
      <SpinningBox position={[-3.15, 0.75, 0]} scale={0.5} />
    </Screen>
  )
}

// 点滅するLEDをレンダリングします
function Leds({ instances }) {
  const ref = useRef()
  const { nodes } = useGLTF(CONSTANTS.MODEL_PATH)

  // 基本材質の設定
  useMemo(() => {
    nodes.Sphere.material = new THREE.MeshBasicMaterial()
    nodes.Sphere.material.toneMapped = false
  }, [nodes])

  // LED位置の定義
  const ledPositions = [
    [-0.41, 1.1, -2.21],
    [0.59, 1.32, -2.22],
    [1.77, 1.91, -1.17],
    [2.44, 1.1, -0.79],
    [4.87, 3.8, -0.1],
    [1.93, 3.8, -3.69],
    [-2.35, 3.8, -3.48],
    [-4.71, 4.59, -1.81],
    [-3.03, 2.85, 1.19],
    [-1.21, 1.73, -1.49]
  ]

  // LEDの点滅アニメーション
  useFrame((state) => {
    ref.current.children.forEach((instance) => {
      const rand = Math.abs(2 + instance.position.x)
      const t = Math.round((1 + Math.sin(rand * 10000 + state.clock.elapsedTime * rand)) / 2)
      instance.color.setRGB(0, t * 1.1, t) // 緑〜シアン系の輝き
    })
  })

  return (
    <group ref={ref}>
      {ledPositions.map((position, i) => (
        <instances.Sphere key={`led-${i}`} position={position} scale={0.005} color={[1, 2, 1]} />
      ))}
    </group>
  )
}

// 静的メッシュをレンダリング
function StaticMeshes({ nodes, materials, instances }) {
  // 静的メッシュのプロパティを定義
  const meshes = [
    { id: 'Object_24.geometry', position: [-2.42, 0.94, -2.25], rotation: [0, 0.14, CONSTANTS.HALF_PI], scale: -CONSTANTS.DEFAULT_OBJECT_SCALE },
    { id: 'Object_140.geometry', position: [5.53, 2.18, 0.17], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_144.geometry', position: [5.74, 1.57, 0.05], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_148.geometry', position: [5.65, 2.79, 0.11], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_152.geometry', position: [5.46, 3.41, 0.26], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_156.geometry', position: [4.86, 0, -2.54], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_160.geometry', position: [5.06, 0, -1.6], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_164.geometry', position: [2.59, 0, -4], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_168.geometry', position: [1.66, 0, -4.54], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_170.geometry', position: [0.59, 0, -4.7], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_176.geometry', position: [1.33, 1.83, -3.82], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_180.geometry', position: [4.86, 2.14, -2.54], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_184.geometry', position: [5.06, 2.14, -1.6], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_188.geometry', position: [2.59, 2.14, -4], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_192.geometry', position: [1.66, 2.14, -4.54], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_194.geometry', position: [0.59, 2.14, -4.7], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_200.geometry', position: [0.75, 3.98, -4.66], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_18.geometry', position: [-0.19, 0, -2.96], rotation: [0, -0.06, 0], scale: CONSTANTS.DEFAULT_OBJECT_SCALE },
    { id: 'Object_142.geometry', position: [5.79, 0.94, 0.18], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_146.geometry', position: [5.43, 0.32, 0.37], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_150.geometry', position: [5.56, 4.03, 0.35], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_154.geometry', position: [5.87, 4.66, 0.08], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_158.geometry', position: [5.53, 0, -0.85], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_162.geometry', position: [4.05, 0, -2.96], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_166.geometry', position: [3.29, 0, -3.1], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_190.geometry', position: [3.3, 2.14, -3.31], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { id: 'Object_204.geometry', position: [3.2, 4.29, -3.09], rotation: [-CONSTANTS.FULL_PI, 0.56, 0], scale: -1 }
  ]

  // Object32のインスタンス位置
  const object32Positions = [
    { position: [3.77, 1.84, -2.98], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 },
    { position: [3.77, 3.98, -2.98], rotation: [-CONSTANTS.FULL_PI, 0, 0], scale: -1 }
  ]

  return (
    <>
      {/* 通常のメッシュ */}
      {meshes.map((mesh, i) => (
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
      {object32Positions.map((props, i) => (
        <instances.Object32 key={`obj32-${i}`} {...props} />
      ))}
    </>
  )
}

// スクリーングループ
function ScreenGroup({ instances }) {
  // スクリーン定義
  const screens = [
    {
      type: 'interactive',
      frame: 'Object_206',
      panel: 'Object_207',
      position: [0.27, 1.53, -2.61],
      backgroundColor: CONSTANTS.COLORS.blue,
      customEffect: true
    },
    {
      type: 'text',
      frame: 'Object_209',
      panel: 'Object_210',
      y: 5,
      position: [-1.43, 2.5, -1.8],
      rotation: [0, 1, 0],
      content: 'System online.',
      customEffect: true
    },
    {
      type: 'text',
      frame: 'Object_212',
      panel: 'Object_213',
      x: -5,
      y: 5,
      position: [-2.73, 0.63, -0.52],
      rotation: [0, 1.09, 0],
      invert: true,
      content: 'Initializing...',
      customEffect: false
    },
    {
      type: 'text',
      frame: 'Object_215',
      panel: 'Object_216',
      position: [1.84, 0.38, -1.77],
      rotation: [0, -CONSTANTS.FULL_PI / 9, 0],
      invert: true,
      content: 'Poimandres.',
      animated: false,
      customEffect: true
    },
    {
      type: 'text',
      frame: 'Object_218',
      panel: 'Object_219',
      x: -5,
      position: [3.11, 2.15, -0.18],
      rotation: [0, -0.79, 0],
      scale: 0.81,
      invert: true,
      content: 'Loading...',
      fontSize: 3.5,
      customEffect: true
    },
    {
      type: 'text',
      frame: 'Object_221',
      panel: 'Object_222',
      y: 5,
      position: [-3.42, 3.06, 1.3],
      rotation: [0, 1.22, 0],
      scale: 0.9,
      content: 'Ready',
      customEffect: false
    },
    {
      type: 'text',
      frame: 'Object_224',
      panel: 'Object_225',
      position: [-3.9, 4.29, -2.64],
      rotation: [0, 0.54, 0],
      invert: true,
      content: 'System check',
      fontSize: 3,
      customEffect: true
    },
    {
      type: 'text',
      frame: 'Object_227',
      panel: 'Object_228',
      position: [0.96, 4.28, -4.2],
      rotation: [0, -0.65, 0],
      content: 'Standby',
      customEffect: false
    },
    {
      type: 'text',
      frame: 'Object_230',
      panel: 'Object_231',
      position: [4.68, 4.29, -1.56],
      rotation: [0, -CONSTANTS.FULL_PI / 3, 0],
      content: 'Processing',
      animated: true,
      customEffect: true
    }
  ]

  return (
    <>
      {screens.map((screen, i) => {
        // スクリーンのタイプによって適切なコンポーネントを返す
        if (screen.type === 'interactive') {
          return <ScreenInteractive key={`screen-${i}`} {...screen} />
        } else if (screen.type === 'text') {
          return <ScreenText key={`screen-${i}`} {...screen} />
        }
        return null
      })}
    </>
  )
}
