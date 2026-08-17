import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { syncAug15Targets } from "@/lib/syncAug15Targets";

const ProjectsDataSync = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === "/projects" || pathname.startsWith("/projects/")) {
      void syncAug15Targets();
    }
  }, [pathname]);

  return null;
};

export default ProjectsDataSync;
