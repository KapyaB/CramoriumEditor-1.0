import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import App from "./App";
import reducers from "./reducers";

ReactDOM.render(
  <Provider
    store={createStore(
      reducers,
      composeWithDevTools(applyMiddleware(reduxThunk))
    )}
  >
    <App />
  </Provider>,
  document.getElementById("root")
);
