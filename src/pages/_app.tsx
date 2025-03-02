import type { AppProps } from "next/app";
import { ConfigProvider } from "antd";
// import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import "@/styles/globals.scss";

export default function App({ Component, pageProps }: AppProps) {
  // Optional: Handle authentication on mount
  useEffect(() => {
    console.log("Next.js App Mounted");
  }, []);

  return (
    <ConfigProvider>
      {/* <ThemeProvider attribute="class"> */}
        <Component {...pageProps} />
      {/* </ThemeProvider> */}
    </ConfigProvider>
  );
}
