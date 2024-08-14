import React, { useEffect, useState } from "react";
import GlobalForm from "../GlobalForm/GlobalForm";
import { useLocation } from "react-router-dom";

function UpdateEvents() {
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
        <GlobalForm pageMode="Update" type="Events" record={record} />
      ) : null}
    </>
  );
}

export default UpdateEvents;
