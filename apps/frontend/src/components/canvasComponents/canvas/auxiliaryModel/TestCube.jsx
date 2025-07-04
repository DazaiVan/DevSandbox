import { useEffect } from "react";
import useCounterStore from "../../../../store/store";

function TestCube() {
  const { count, increment } = useCounterStore();
  useEffect(() => {
    console.log(count);
  }, [count]);
  const handleClick = () => {
    increment();
  };
  return (
    <mesh position={[0, 0, 0]} onClick={handleClick}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#a05ee9" />
    </mesh>
  );
}

export default TestCube;
