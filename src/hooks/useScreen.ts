import { client } from "@/utils/client";
import { useEffect, useState } from "react";

interface Screen {
  sw: number;
  sh: number;
}

const useScreen = (timeout: number = 200) => {
  const [screen, setScreen] = useState<Screen>({
    sw: 0,
    sh: 0,
  });

  useEffect(() => {
    if (!client()) return;

    // Set initial value di client
    setScreen({ sw: window.innerWidth, sh: window.innerHeight });

    let resizeTimeout: any;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setScreen({ sw: window.innerWidth, sh: window.innerHeight });
      }, timeout);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [timeout]);

  return screen;
};

export default useScreen;
