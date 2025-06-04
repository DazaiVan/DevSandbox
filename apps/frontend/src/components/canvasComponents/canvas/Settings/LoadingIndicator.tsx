import { Spin } from 'antd';
import { Html } from '@react-three/drei';

export function LoadingIndicator() {
  return (
    <Html center>
      <Spin 
        size="large" 
        tip="Loading 3D model..." 
        style={{ color: 'white' }} 
      />
    </Html>
  );
}