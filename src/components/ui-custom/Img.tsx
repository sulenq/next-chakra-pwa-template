import { IMAGES_PATH } from "@/constants/paths";
import { Image, ImageProps } from "@chakra-ui/react";
import { useState } from "react";

interface Props extends ImageProps {}

const Img = (props: Props) => {
  // Props
  const { src, onError, ...rest } = props;

  // States
  const fallbackSrc = `${IMAGES_PATH}/no_img.jpeg`;
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
    if (onError) onError(e);
  };

  return <Image {...rest} src={currentSrc} onError={handleError} />;
};

export default Img;
