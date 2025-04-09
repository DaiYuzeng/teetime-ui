import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import WebsiteLayout from "@/components/layouts/Website";
import ManagementLayout from "@/components/layouts/Management";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import "@/styles/globals.scss";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactElement;
  requiresAuth?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const isManagementPage = router.pathname.startsWith("/management");

  if (isManagementPage) {
    return (
      <ProtectedRoute>
        <ManagementLayout>
          <Component {...pageProps} />
        </ManagementLayout>
      </ProtectedRoute>
    );
  }

  const getLayout = Component.getLayout ?? ((page) => <WebsiteLayout>{page}</WebsiteLayout>);

  return getLayout(<Component {...pageProps} />);
}
