import "antd/dist/antd.css";
import "styles/global.css";
import "react-toastify/dist/ReactToastify.css";

import App from "next/app";
import { Provider } from "react-redux";
import { CustomLayout } from "components/Layout";
import { store } from "stores";

class TheApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Provider store={store}>
        <CustomLayout>
          <Component {...pageProps} />
        </CustomLayout>
      </Provider>
    );
  }
}

export default TheApp;
