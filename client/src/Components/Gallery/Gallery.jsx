import React, { useEffect } from "react";
import PageWrapper from "../PageContainer/PageWrapper";
import GlobalForm from "../GlobalForm/GlobalForm";

function Gallery(props) {
  return (
    <div>
      <GlobalForm pageMode={props?.pageMode} type={props?.type} />
    </div>
  );
}

export default Gallery;
