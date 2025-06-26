import { useState } from 'react'

function ButtonTestIssues() {

    const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount((count) => count + 1)}>
    countIssues is {count}
  </button>
  )
}

export default ButtonTestIssues
