import clsx from "clsx";
import { text } from "express";
import * as React from "react";
import { useDispatch } from "react-redux";
import { actions, store, useAppSelector } from "../store";
import { BlockList } from "./BlockList";

// const getCaretCoordinates = (fromStart: boolean = true) => {
//   let x: number, y: number;
//   const isSupported = typeof window.getSelection !== "undefined";
//   if (isSupported) {
//     const selection = window.getSelection();
//     if (selection.rangeCount !== 0) {
//       const range = selection.getRangeAt(0).cloneRange();
//       range.collapse(fromStart ? true : false);
//       const rect = range.getClientRects()[0];
//       if (rect) {
//         x = rect.left;
//         y = rect.top;
//       }
//     }
//   }
//   return { x, y };
// };

// const getSelection = (element: HTMLElement) => {
//   let selectionStart: number, selectionEnd: number;
//   const isSupported = typeof window.getSelection !== "undefined";
//   if (isSupported) {
//     const range = window.getSelection().getRangeAt(0);
//     const preSelectionRange = range.cloneRange();
//     preSelectionRange.selectNodeContents(element);
//     preSelectionRange.setEnd(range.startContainer, range.startOffset);
//     selectionStart = preSelectionRange.toString().length;
//     selectionEnd = selectionStart + range.toString().length;
//   }

//   return { selectionStart, selectionEnd };
// };

// const setCaretToEnd = (element: HTMLElement) => {
//   const range = document.createRange();
//   const selection = window.getSelection();
//   range.selectNodeContents(element);
//   range.collapse(false);
//   selection.removeAllRanges();
//   selection.addRange(range);
//   element.focus();
// };

/**
 * @description Replace [[Link]] with <Link to="/page/:od">[[Link]]</Link>
 */
const replaceLinkRefsInContent = (content: string) => {
  const matches = content.match(/\[\[(.*?)\]\]/g);

  // matches.forEach((match) => {
  //   console.log(match);
  // });

  return content;
};

/**
 * @description Replace ((blockId)) with block link
 */
const replaceBlockRefsInContent = (content: string) => {
  const matches = content.match(/\(\((.*?)\)\)/g);

  // matches.forEach((match) => {
  //   console.log(match);
  // });

  return content;
};

const parseBlockContent = (content: string) => {
  content = content
    .replace(/(#|##|###) /g, "")
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

const getBlockType = (content: string) => {
  switch (true) {
    case content.startsWith("### "): {
      return "h3";
    }
    case content.startsWith("## "): {
      return "h2";
    }
    case content.startsWith("# "): {
      return "h1";
    }
    case !content.startsWith("# "): {
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
  const blurTime = React.useRef(null);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const renderedRef = React.useRef<HTMLDivElement>(null);
  const clickPosRef = React.useRef<{ x: number; y: number }>(null);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    switch (true) {
      case !e.shiftKey && e.key === "Enter": {
        e.preventDefault();
        dispatch(
          actions.createBlock({
            content: "",
            type: "p",
            pageId,
            makeItActive: true,
          })
        );
        break;
      }
      case activeBlock === block.id && e.shiftKey && e.key === "Enter": {
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

  React.useEffect(() => {
    const listener = () => {
      const windowBlurTime = new Date().getTime();
      if (windowBlurTime - blurTime?.current < 100) {
        dispatch(actions.setActiveBlock({ id }));
      }
    };

    window.addEventListener("blur", listener);

    return () => window.removeEventListener("blur", listener);
  }, []);

  React.useEffect(() => {
    if (activeBlock === block?.id) {
      textAreaRef.current?.focus();
    }
  }, [activeBlock, block]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex space-x-3 items-start w-full">
        <div className="cursor-pointer">{"• "}</div>
        <div className="relative w-full">
          <textarea
            ref={textAreaRef}
            className={clsx(
              "w-full focus:outline-none bg-transparent resize-none absolute left-0 top-0",
              activeBlock !== block.id && "opacity-0"
            )}
            onBlur={(e) => {
              dispatch(actions.setActiveBlock({ id: null }));
              blurTime.current = new Date().getTime();
            }}
            value={block.content}
            onChange={(e) => {
              dispatch(
                actions.updateBlock({
                  id: block.id,
                  type: getBlockType(e.target.value),
                  content: e.target.value,
                })
              );
            }}
            onKeyDown={onKeyDown}
            autoCapitalize="none"
          />
          <div
            ref={renderedRef}
            style={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
            className={clsx(
              "w-full absolute left-0 top-0",
              activeBlock === block.id && "invisible"
            )}
            onClick={(e) => {
              dispatch(actions.setActiveBlock({ id: block.id }));
            }}
            onBlur={() => dispatch(actions.setActiveBlock({ id: null }))}
            dangerouslySetInnerHTML={{
              __html: block?.content.length
                ? parsedContent
                : "<i>Click here to edit block...</i>",
            }}
          />
        </div>
      </div>
      <div className="block-children mt-2 pl-4">
        <BlockList blockChildren={block.children} />
      </div>
    </div>
  );
}
