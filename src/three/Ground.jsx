export default function Ground() {
  return (
    <mesh
      rotation={[-Math.PI /2, 0, 0]}
      position={[5, -0.01, -10]}
      scale={[1, 1, 100]} 
    >
      <planeGeometry args={[30, 20]} />
      <meshStandardMaterial color="grey" />
    </mesh>
  );
}
