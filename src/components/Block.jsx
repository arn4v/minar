import { useStore } from "../store";
import * as React from "react";
import { BlockList } from "./BlockList";
import { ContentEditable } from "./ContentEditable";

const parseBlockContent = (content) => {
  return content;
};

export function Block({ id, blockChildren }) {
  const blocks = useStore((state) => state.data.blocks);

  console.log(id, blockChildren, blocks);

  return null;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <span>{"• "}</span>
        <ContentEditable html={parseBlockContent(block.content)} />
      </div>
      <div className="block-children mt-2">
        <BlockList blockChildren={blockChildren} />
      </div>
    </div>
  );
}
