"use client";

import { useEffect, useState } from "react";

export default function Hello() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    console.log("useEffect hook", count);

    //cleanup function
    return () => {
      console.log("unmount", count);
    };
  }, []);

  // ui
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
