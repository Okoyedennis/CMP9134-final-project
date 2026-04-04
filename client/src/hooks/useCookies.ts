import Cookies from "js-cookie";

type CookieOptions = Cookies.CookieAttributes;

export const useCookies = () => {
  const setCookie = (name: string, value: string, options?: CookieOptions) => {
    Cookies.set(name, value, options);
  };

  const getCookie = (name: string) => {
    return Cookies.get(name);
  };

  const removeCookie = (name: string) => {
    Cookies.remove(name);
  };

  return { setCookie, getCookie, removeCookie };
};
