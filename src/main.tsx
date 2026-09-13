import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { SpacetimeDBProvider } from "spacetimedb/react";
import { DbConnection, ErrorContext } from "./module_bindings/index.ts";
import "./style.css";

const HOST =
  import.meta.env.VITE_SPACETIMEDB_HOST ?? "ws://maincloud.spacetimedb.com";
const DB_NAME = import.meta.env.VITE_SPACETIMEDB_DB_NAME ?? "to-manager";

const onConnectError = (_ctx: ErrorContext, err: Error) => {
  console.log("Error connecting to SpacetimeDB:", err);
};

const connectionBuilder = DbConnection.builder()
  .withUri(HOST)
  .withDatabaseName(DB_NAME)
  .onConnectError(onConnectError);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SpacetimeDBProvider connectionBuilder={connectionBuilder}>
      <App />
    </SpacetimeDBProvider>
  </StrictMode>,
);
