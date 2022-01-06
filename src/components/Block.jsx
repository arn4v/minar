import { useStore } from "../store";
import * as React from "react";
import { BlockList } from "./BlockList";
import { ContentEditable } from "./ContentEditable";
import { useParams } from "react-router-dom";

const parseBlockContent = (content) => {
  return content;
};

export function Block({ id, blockChildren }) {
  const pageId = useParams().id;
  const block = useStore((state) => state.data.blocks[id]);
  const actions = useStore((state) => state.actions);
  const wrapperRef = React.useRef();
  const contentEditableRef = React.useRef();

  /** @param {React.KeyboardEvent<HTMLDivElement>} e */
  const onKeyDown = (e) => {
    console.log(e.shiftKey);
    switch (true) {
      case !e.shiftKey && e.key === "Enter": {
        e.preventDefault();
        const blockId = actions.createBlock({
          content: "New block",
          type: "p",
          pageId,
        }).id;
        actions.addPrimaryBlockToPage({
          blockId,
          pageId,
        });
        break;
      }
      case e.shiftKey && e.key === "Enter": {
        break;
      }
      case e.shiftKey && e.key === "Tab": {
        e.preventDefault();
        break;
      }
      case !e.shiftKey && e.key === "Tab": {
        e.preventDefault();
        break;
      }
    }
  };

  return (
    <div
      className="flex flex-col"
      onFocus={() => {
        contentEditableRef.current.click();
      }}
    >
      <div className="flex flex-row space-x-3 items-center">
        <span className="cursor-pointer">{"• "}</span>
        <ContentEditable
          ref={contentEditableRef}
          html={parseBlockContent(block.content)}
          className="px-2 py-0.5"
          onKeyDown={onKeyDown}
        />
      </div>
      <div className="block-children mt-2">
        <BlockList blockChildren={blockChildren} />
      </div>
    </div>
  );
}
