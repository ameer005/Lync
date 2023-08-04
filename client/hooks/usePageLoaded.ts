import { useState, useEffect } from "react";

const usePageLoaded = () => {
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    setPageLoaded(true);
  });

  return pageLoaded;
};

export default usePageLoaded;
