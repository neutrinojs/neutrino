import React, { useState } from 'react';

// From https://reactjs.org/docs/hooks-state.html
export default function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
  const message = `You clicked ${count} times`;

  return (
    <div>
      <p>{message}</p>
      <button type="button" onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
