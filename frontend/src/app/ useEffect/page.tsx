import React, { useEffect, useState } from "react";

const ExampleComponent = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Avoid rendering server-inconsistent content
  }

  return <div>Client-only content here</div>;
};