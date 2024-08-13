import React, { useEffect } from "react";
import PageWrapper from "../PageContainer/PageWrapper";
import GlobalForm from "../GlobalForm/GlobalForm";

function Gallery(props) {
  useEffect(() => {
    console.log("props", props);
  }, [props?.pageMode]);

  return (
    <div>
      <GlobalForm pageMode={props?.pageMode} type={props?.type} />
    </div>
  );
}

export default Gallery;
