import * as React from "react";
import type { SvgProps } from "react-native-svg";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../lib";
import { Styles } from "../styles";

export const LogOutIcon = (props: SvgProps) => {
  const { theme } = useTheme();
  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        d="M16 17L21 12L16 7"
        stroke={Styles[theme].IconAccent}
        strokeWidth={1.5}
      />
      <Path
        d="M21 12H9"
        stroke={Styles[theme].IconAccent}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Path
        d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
        stroke={Styles[theme].IconAccent}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
};
