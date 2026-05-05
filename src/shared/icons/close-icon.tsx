import { FC } from "react";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

import { useTheme } from "../lib";
import { Styles } from "../styles";

export const CloseIcon: FC = () => {
  const { theme } = useTheme();

  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_12817_533671)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.21967 5.21967C5.51256 4.92678 5.98744 4.92678 6.28033 5.21967L18.7803 17.7197C19.0732 18.0126 19.0732 18.4874 18.7803 18.7803C18.4874 19.0732 18.0126 19.0732 17.7197 18.7803L5.21967 6.28033C4.92678 5.98744 4.92678 5.51256 5.21967 5.21967Z"
          fill={Styles[theme].IconAccent}
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.7803 5.21967C19.0732 5.51256 19.0732 5.98744 18.7803 6.28033L6.28033 18.7803C5.98744 19.0732 5.51256 19.0732 5.21967 18.7803C4.92678 18.4874 4.92678 18.0126 5.21967 17.7197L17.7197 5.21967C18.0126 4.92678 18.4874 4.92678 18.7803 5.21967Z"
          fill={Styles[theme].IconAccent}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_12817_533671">
          <Rect
            width="20"
            height="20"
            fill="white"
            transform="translate(2 2)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
};
