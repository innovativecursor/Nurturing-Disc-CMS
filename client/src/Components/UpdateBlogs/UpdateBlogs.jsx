import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GlobalForm from "../GlobalForm/GlobalForm";

function UpdateBlogs() {
  const location = useLocation();
  const [record, setRecord] = useState(location.state);
  useEffect(() => {
    if (location?.state) {
      let asd = { ...location.state };
      setRecord(asd);
    }
  }, [location]);
  return (
    <>
      {record ? (
        <GlobalForm pageMode="Update" type="Blogs" record={record} />
      ) : null}
    </>
  );
}

export default UpdateBlogs;
