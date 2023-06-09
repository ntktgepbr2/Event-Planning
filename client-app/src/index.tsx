import ReactDOM from "react-dom/client";
import App from "./app/layout/App";
import reportWebVitals from "./reportWebVitals";
import "react-toastify/dist/ReactToastify.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "./app/layout/style.css";
import "react-calendar/dist/Calendar.css";
import { createBrowserHistory } from "history";
import { StoreContext, store } from "./app/stores/store";
import { Router } from "react-router-dom";
import ScrollToTop from "./app/layout/ScrollToTop";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
export const history = createBrowserHistory();
root.render(
  <StoreContext.Provider value={store}>
    <Router history={history}>
      <ScrollToTop />
      <App />
    </Router>
  </StoreContext.Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
