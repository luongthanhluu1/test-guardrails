import { useEffectOnce } from "react-use";

import Head from "next/head";
import { Layout } from "antd";
import { Sider } from "components/Sider";
import { SignIn } from "components/SignIn";

interface CustomLayoutProps {
  children: React.ReactElement;
}
export const CustomLayout: React.FC<CustomLayoutProps> = ({ children }) => {
  useEffectOnce(() => {
    // document.addEventListener('visibilitychange', function() {
    //   let state = document.visibilityState;
    //   if (state === 'hidden') {
    //     localStorage.setItem('hidden-since', Date.now());
    //   } else {
    //     let elapsed =
    //       Date.now() -
    //       Number(localStorage.getItem('hidden-since') ?? Date.now());
    //     if (elapsed > 60e3) {
    //       location.reload();
    //     }
    //   }
    // });
  });

  return (
    <div>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>AvaDeli</title>
      </Head>

      <Layout>
        <SignIn>
          <Sider />
          <Layout style={{ minHeight: "calc(100vh - 64px)" }}>
            {/* <TheHeader /> */}

            <Layout.Content style={{ padding: "2rem" }}>
              {children}
            </Layout.Content>
          </Layout>
        </SignIn>
      </Layout>
    </div>
  );
};
