import React, { useEffect, useState } from "react";
import GlobalForm from "../GlobalForm/GlobalForm";
import { useLocation } from "react-router-dom";

function DeleteEvents() {
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
        <GlobalForm type="Events" pageMode="Delete" record={record} />
      ) : null}
    </div>
  );
}

export default DeleteEvents;
