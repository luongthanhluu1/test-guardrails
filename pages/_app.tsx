import "styles/global.css";
import "react-toastify/dist/ReactToastify.css";
import "react-confirm-alert/src/react-confirm-alert.css";

import React from "react";
import App from "next/app";
import { Provider } from "react-redux";
import { CustomLayout } from "components/Layout";
import { ToastContainer } from "react-toastify";
import { store } from "stores";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { viVN } from "@material-ui/core/locale";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import moment from "moment";

import "moment/locale/vi";
moment.locale("vi");

const theme = createMuiTheme(
  {
    palette: {
      primary: { main: "#1976d2" },
    },
  },
  viVN
);

class TheApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <CustomLayout>
              <Component {...pageProps} />
            </CustomLayout>
            <ToastContainer />
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </Provider>
    );
  }
}

export default TheApp;
