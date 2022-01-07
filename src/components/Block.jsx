import * as React from "react";
import { useDispatch } from "react-redux";
import { actions, store, useAppSelector } from "../store";
import { BlockList } from "./BlockList";

/**
 * @description Replace [[Link]] with <Link to="/page/:od">[[Link]]</Link>
 * @param {string} content
 */
const replaceLinkRefsInContent = (content) => {
  const matches = content.match(/\[\[(.*?)\]\]/g);
  console.log("Link refs", matches);

  // matches.forEach((match) => {
  //   console.log(match);
  // });

  return content;
};

/**
 * @description Replace ((blockId)) with block link
 * @param {string} content
 */
const replaceBlockRefsInContent = (content) => {
  const matches = content.match(/\(\((.*?)\)\)/g);
  console.log("Blocks refs", matches);

  // matches.forEach((match) => {
  //   console.log(match);
  // });

  return content;
};

/** @param {string} content */
const parseBlockContent = (content) => {
  content = content
    .replace("#", "")
    .replace("##", "")
    .replace("###", "")
    .replace(/(?:\*)(?:(?!\s))((?:(?!\*|\n).)+)(?:\*)/g, "<b>$1</b>")
    .replace(/(?:_)(?:(?!\s))((?:(?!\n|_).)+)(?:_)/g, "<i>$1</i>")
    .replace(/(?:~)(?:(?!\s))((?:(?!\n|~).)+)(?:~)/g, "<s>$1</s>")
    .replace(/(?:--)(?:(?!\s))((?:(?!\n|--).)+)(?:--)/g, "<u>$1</u>")
    .replace(/(?:```)(?:(?!\s))((?:(?!\n|```).)+)(?:```)/g, "<tt>$1</tt>");
  content = replaceLinkRefsInContent(content);
  content = replaceBlockRefsInContent(content);

  return content;
};

const getBlockType = (content) => {
  switch (true) {
    case content.startsWith("###"): {
      return "h3";
    }
    case content.startsWith("##"): {
      return "h2";
    }
    case content.startsWith("#"): {
      return "h1";
    }
    case !content.startsWith("#"): {
      return "p";
    }
  }
};

export function Block({ id, blockChildren }) {
  const { activeBlock, block, pageId } = useAppSelector((state) => ({
    pageId: state.activePage,
    block: state.data.blocks[id],
    activeBlock: state.activeBlock,
  }));
  const dispatch = useDispatch();
  const parsedContent = React.useMemo(() => {
    return parseBlockContent(block?.content ?? "");
  }, [block.content]);

  console.log(block, id, pageId);

  /** @param {React.KeyboardEvent<HTMLDivElement>} e */
  const onKeyDown = (e) => {
    switch (true) {
      case !e.shiftKey && e.key === "Enter": {
        e.preventDefault();
        dispatch(
          actions.createBlock({
            content: "",
            type: "p",
            pageId,
          })
        );
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
      className="flex flex-col w-full"
      onClick={() => dispatch(actions.setActiveBlock({ id: block.id }))}
      // onBlur={() => dispatch(actions.setActiveBlock({ id: null }))}
    >
      <div className="flex flex-row space-x-3 items-center w-full">
        <span className="cursor-pointer">{"• "}</span>
        {activeBlock === block.id ? (
          <textarea
            className="w-full focus:outline-none bg-transparent resize-none"
            autoCapitalize="none"
            autoFocus
            value={block.content}
            onKeyDown={onKeyDown}
            onChange={(e) => {
              dispatch(
                actions.updateBlock({
                  id: block.id,
                  content: e.target.value,
                })
              );
            }}
          />
        ) : (
          <div
            className="w-full"
            dangerouslySetInnerHTML={{ __html: parsedContent }}
          />
        )}
      </div>
      <div className="block-children mt-2">
        <BlockList blockChildren={block.children} />
      </div>
    </div>
  );
}
