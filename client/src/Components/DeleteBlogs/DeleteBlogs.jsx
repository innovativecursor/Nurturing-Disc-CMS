import React, { useEffect, useState } from "react";
import GlobalForm from "../GlobalForm/GlobalForm";
import { useLocation } from "react-router-dom";

function DeleteBlogs() {
  const location = useLocation();
  const [record, setRecord] = useState(location.state);
  useEffect(() => {
    if (location?.state) {
      "Location state", location.state;
      let asd = { ...location.state };
      setRecord(asd);
    }
  }, [location]);
  return (
    <>
      {record ? (
        <GlobalForm pageMode="Delete" type="Blogs" record={record} />
      ) : null}
    </>
  );
}

export default DeleteBlogs;
