import * as React from "react";
import { actions, useAppDispatch, useAppSelector } from "../store";
import { BlockList } from "./BlockList";
import { ContentEditable } from "./ContentEditable";

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
  /** Content Editable Ref */
  const contentEditableRef = React.useRef<HTMLDivElement>(null);

  /**
   * Redux Subscription/Dispatch
   */
  const { activeBlock, block, pageId } = useAppSelector((state) => ({
    pageId: state.activePage,
    block: state.data.blocks[id],
    activeBlock: state.activeBlock,
  }));
  const dispatch = useAppDispatch();

  const isBlockActive = React.useMemo(
    () => block?.id === activeBlock,
    [block?.id, activeBlock]
  );
  const blockHtml = React.useMemo(() => {
    return isBlockActive
      ? parseBlockContent(block?.content ?? "")
      : block.content;
  }, [block.content]);
  const blurTime = React.useRef(null);

  /* -------------------------------------------------------------------------- */
  /*                               Event Handlers                               */
  /* -------------------------------------------------------------------------- */

  const onFocus = () => dispatch(actions.setActiveBlock({ id: block?.id }));

  const onInput: React.FormEventHandler<HTMLDivElement> = (e) => {
    dispatch(
      actions.updateBlock({ id: block?.id, content: e.currentTarget.innerHTML })
    );
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
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
      case e.key === "Backspace": {
        if (e.currentTarget.innerHTML === "") {
          e.preventDefault();
        }
        break;
      }
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Effects                                  */
  /* -------------------------------------------------------------------------- */

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
      contentEditableRef.current?.focus();
    }
  }, [activeBlock, block]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex space-x-3 items-start w-full">
        <div className="cursor-pointer">{"• "}</div>
        <ContentEditable
          className="outline-none"
          ref={contentEditableRef}
          html={blockHtml}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onInput={onInput}
        />
      </div>
      <div className="block-children mt-2 pl-4">
        <BlockList blockChildren={block.children} />
      </div>
    </div>
  );
}
