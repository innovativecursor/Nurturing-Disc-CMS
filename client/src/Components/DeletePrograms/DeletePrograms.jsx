import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GlobalForm from "../GlobalForm/GlobalForm";

function DeletePrograms() {
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
    <div>
      {record ? (
        <GlobalForm type="Programs" pageMode="Delete" record={record} />
      ) : null}
    </div>
  );
}

export default DeletePrograms;
