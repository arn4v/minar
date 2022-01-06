import * as React from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../store";
import { BlockList } from "./BlockList";
import { PageHeading } from "./PageHeading";

export function PageEditor() {
  const { id } = useParams();
  const page = useStore((state) => {
    const page = state.data.pages[id];
    return page;
  });

  return (
    <div className="block">
      <PageHeading pageId={id} />
      <div className="mt-8 flex flex-col">
        <BlockList blockChildren={page.children} />
      </div>
    </div>
  );
}
