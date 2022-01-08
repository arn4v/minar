import * as React from "react";
import { useDispatch } from "react-redux";
import { actions, store, useAppSelector } from "../store";
import { BlockList } from "./BlockList";

const getCaretCoordinates = (fromStart: boolean = true) => {
  let x: number, y: number;
  const isSupported = typeof window.getSelection !== "undefined";
  if (isSupported) {
    const selection = window.getSelection();
    if (selection.rangeCount !== 0) {
      const range = selection.getRangeAt(0).cloneRange();
      range.collapse(fromStart ? true : false);
      const rect = range.getClientRects()[0];
      if (rect) {
        x = rect.left;
        y = rect.top;
      }
    }
  }
  return { x, y };
};

const getSelection = (element: HTMLElement) => {
  let selectionStart: number, selectionEnd: number;
  const isSupported = typeof window.getSelection !== "undefined";
  if (isSupported) {
    const range = window.getSelection().getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(element);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    selectionStart = preSelectionRange.toString().length;
    selectionEnd = selectionStart + range.toString().length;
  }

  return { selectionStart, selectionEnd };
};

const setCaretToEnd = (element: HTMLElement) => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
  element.focus();
};

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
  const beforeBlurTextareaCaretPost = React.useRef(null);
  const onDivClickSelection = React.useRef<Range>(null);

  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const renderedRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const listener = () => {
      const windowBlurTime = new Date().getTime();
      if (windowBlurTime - blurTime?.current < 100) {
        dispatch(actions.setActiveBlock({ id }));
        if (textAreaRef?.current && beforeBlurTextareaCaretPost.current) {
          textAreaRef.current?.setSelectionRange(
            beforeBlurTextareaCaretPost.current,
            beforeBlurTextareaCaretPost.current
          );
        }
      }
    };

    window.addEventListener("blur", listener);

    return () => window.removeEventListener("blur", listener);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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

  return (
    <div
      className="flex flex-col w-full"
      onClick={() => dispatch(actions.setActiveBlock({ id: block.id }))}
      onBlur={() => dispatch(actions.setActiveBlock({ id: null }))}
    >
      <div className="flex space-x-3 items-start w-full">
        <div className="cursor-pointer">{"• "}</div>
        {activeBlock === block.id ? (
          <textarea
            onLoad={() => {
              const s = window.getSelection();
              if (s.rangeCount > 0) s.removeAllRanges();
              s.addRange(onDivClickSelection.current);
            }}
            onBlur={(e) => {
              blurTime.current = new Date().getTime();
              beforeBlurTextareaCaretPost.current =
                e.currentTarget.selectionStart;
            }}
            ref={textAreaRef}
            className="w-full focus:outline-none bg-transparent resize-none"
            autoCapitalize="none"
            autoFocus
            value={block.content}
            onKeyDown={onKeyDown}
            onChange={(e) => {
              dispatch(
                actions.updateBlock({
                  id: block.id,
                  type: getBlockType(e.target.value),
                  content: e.target.value,
                })
              );
            }}
          />
        ) : (
          <div
            ref={renderedRef}
            className="w-full"
            onClick={(e) => {
              const posX = e.pageX - renderedRef.current?.offsetLeft;
              const posY = e.pageY - renderedRef.current?.offsetTop;
              onDivClickSelection.current = window.getSelection().getRangeAt(0);
            }}
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
