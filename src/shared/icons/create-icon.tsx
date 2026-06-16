import { FC } from "react";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

export const CreateIcon: FC = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <G clipPath="url(#clip0_21652_9396)">
      <Path
        d="M12 3V21M21 12L3 12"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_21652_9396">
        <Rect width="24" height="24" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
