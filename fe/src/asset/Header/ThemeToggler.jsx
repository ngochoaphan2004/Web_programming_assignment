import { useTheme } from "@emotion/react";
import { useEffect } from "react";

import Image from "next/image";
import logomoon from "../images/icon/icon-moon.svg"
import logosun from "../images/icon/icon-sun.svg"

const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();

  useEffect(()=>{
    if (!localStorage.getItem('darkmode'))
      localStorage.setItem('darkmode','light')
  },[])

  function reverseMode(){
    localStorage.setItem("darkmode",localStorage.getItem("darkmode") == "light" ? "dark":"light")
  }

  return (
    <button
      aria-label="theme toggler"
      onClick={() => reverseMode()}
      className="bg-gray-2 dark:bg-dark-bg absolute right-17 mr-1.5 flex cursor-pointer items-center justify-center rounded-full text-black dark:text-white lg:static"
    >
      <Image
        src={logomoon}
        alt="logo"
        width={21}
        height={21}
        className="dark:hidden"
      />

      <Image
        src={logosun}
        alt="logo"
        width={22}
        height={22}
        className="hidden dark:block"
      />
    </button>
  );
};

export default ThemeToggler;
