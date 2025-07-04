import { useState } from 'react'

function ButtonTestCIM() {

    const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount((count) => count + 1)}>
    countCIM is {count}
  </button>
  )
}

export default ButtonTestCIM
