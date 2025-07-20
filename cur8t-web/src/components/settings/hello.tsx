import { Button } from "@/components/ui/button";

export default function Hello() {
  let count = 0;

  const handleClick = () => {
    count++;
  };

  return (
    <div>
      <Button onClick={handleClick}>Click me</Button>
      <p>Count: {count}</p>
    </div>
  );
}
