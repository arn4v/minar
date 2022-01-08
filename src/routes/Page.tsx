import * as React from "react";
import { Sidebar } from "../components/Sidebar";
import { PageEditor } from "../components/PageEditor";
import { useParams } from "react-router-dom";
import { actions, useAppDispatch } from "../store";

export function Page() {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(actions.setActivePage({ id }));
  }, [dispatch, id]);

  return (
    <div className="flex items-start justify-start h-screen w-screen bg-gray-200">
      <Sidebar />
      <div className="w-full h-full">
        <PageEditor />
      </div>
    </div>
  );
}
