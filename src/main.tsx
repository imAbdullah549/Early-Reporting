import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "antd/dist/reset.css";
import "antd/dist/reset.css";
import "./App.css";
import { ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";

import dayjs from "dayjs";
import "dayjs/locale/en";

dayjs.locale("en");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={enUS}>
        <App />
      </ConfigProvider>
    </Provider>
  </StrictMode>
);
