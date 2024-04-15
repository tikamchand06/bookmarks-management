import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { App as AntApp, ConfigProvider } from "antd";

import "./index.css";
import "simplebar-react/dist/simplebar.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ConfigProvider
    theme={{
      hashed: false,
      token: { controlHeight: 36, colorPrimary: "#2196f3" },
      components: {
        Collapse: { headerPadding: 10, contentPadding: 10 },
      },
    }}
  >
    <AntApp>
      <App />
    </AntApp>
  </ConfigProvider>
);
