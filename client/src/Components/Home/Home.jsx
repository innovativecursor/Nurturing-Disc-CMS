import { Button, Table } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getAxiosCall } from "../../Axios/UniversalAxiosCalls";
import PageWrapper from "../PageContainer/PageWrapper";
import ProductTable from "../ProductTable/ProductTable";
function Home(props) {
  const navigateTo = useNavigate();
  const logOut = async () => {
    window.localStorage.clear();
    localStorage.removeItem("access_token");
    navigateTo("/");
    props.loggedOut();
  };
  return (
    <div className="flex flex-col">
      <div className="flex justify-center my-8">
        <h1 className="text-2xl font-medium">
          Hi, {props.userDetails?.firstName}
          {"  "}
          {props.userDetails?.lastName}
        </h1>
      </div>

      <div className="flex justify-center items-center">
        <Button type="primary" onClick={logOut} className="text-black">
          Log out
        </Button>
      </div>
      <ProductTable pageMode="View" type="Users" />
    </div>
  );
}
const mapDispatchToProps = (dispatch) => {
  return {
    loggedOut: () => dispatch({ type: "LOGGEDOUT" }),
  };
};
const mapStateToProps = (state) => {
  return {
    userDetails: state.universalReducer,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
