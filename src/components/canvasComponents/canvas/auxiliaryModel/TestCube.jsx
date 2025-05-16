function TestCube() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} /> 
      <meshStandardMaterial color="#a05ee9" />
    </mesh>
  )
}
export default TestCube