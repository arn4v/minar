import * as React from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../store";
import { BlockList } from "./BlockList";
import { PageHeading } from "./PageHeading";

export function PageEditor() {
  const { id } = useParams();
  const { page } = useAppSelector((state) => {
    const page = state.data.pages[id];
    return { page };
  });

  return (
    <div className="block w-full">
      <PageHeading pageId={id} />
      <div className="mt-8 flex flex-col w-full">
        <BlockList blockChildren={page.children} />
      </div>
    </div>
  );
}
