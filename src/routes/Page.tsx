import * as React from "react";
import { Sidebar } from "../components/Sidebar";
import { PageEditor } from "../components/PageEditor";
import { useParams } from "react-router-dom";

export function Page() {
  const params = useParams();

  return (
    <div className="flex items-start justify-start h-screen w-screen bg-gray-200">
      <Sidebar />
      <div className="w-full h-full px-24 py-10">
        <PageEditor />
      </div>
    </div>
  );
}
