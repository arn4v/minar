import { Sidebar } from "../components/Sidebar";
import { PageEditor } from "../components/PageEditor";
import * as React from "react";

export function Page() {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Sidebar />
      <div className="w-full h-full">
        <PageEditor />
      </div>
    </div>
  );
}
