import { ReactNode } from "react";

import { useSessionStore } from "../../model/async-store";
import { ThemeContext } from "./theme-context";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme, setTheme } = useSessionStore();

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
