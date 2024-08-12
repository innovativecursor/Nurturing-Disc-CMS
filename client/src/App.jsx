import { connect } from "react-redux";
import "./App.css";
import Navigation from "./Navigation/Navigation";
import { Spin } from "antd";
import { useEffect } from "react";

function App(props) {
  //Clearing localstorage after shutting the browser or tab window..
  useEffect(() => {
    // Set flag in sessionStorage on load
    sessionStorage.setItem("isReloading", "true");

    const handleBeforeUnload = (event) => {
      // Check if the flag is present in sessionStorage
      const isReloading = sessionStorage.getItem("isReloading");

      if (!isReloading) {
        // Clear localStorage only if the page is not reloading
        localStorage.clear();
      } else {
        // Remove the flag on unload if it exists
        sessionStorage.removeItem("isReloading");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <Spin
        spinning={props?.loading == undefined ? false : props?.loading}
        size="large"
        tip="Powered by Innovative Cursor"
      >
        <Navigation />
      </Spin>
    </>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    isLoggedIn: () => dispatch({ type: "LOGGEDIN" }),
  };
};
const mapStateToProps = (state) => {
  return {
    loading: state.loadingReducer?.loading,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
