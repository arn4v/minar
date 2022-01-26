import clsx from "clsx";
import React from "react";
import { BlockType } from "../types";

type Props = {
  type: BlockType;
  html: string;
} & JSX.IntrinsicElements["div"];

export const ContentEditable = React.forwardRef<HTMLDivElement, Props>(
  ({ type, html, ...props }, ref) => {
    const [innerHtml, setInnerHtml] = React.useState(html);
    const isFocused = React.useRef(false);
    const innerRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
      if (isFocused.current === true) {
        setInnerHtml(html);
      } else {
        const timer = setTimeout(() => setInnerHtml(html), 200);
        return () => clearTimeout(timer);
      }
    }, [html]);

    const onFocus = () => {
      isFocused.current = true;
    };

    return (
      <div
        {...props}
        contentEditable={true}
        className={clsx(
          type === "h1" && "",
          type === "h2" && "",
          type === "h3" && "",
          props.className
        )}
        ref={(instance) => {
          innerRef.current = instance;

          if (typeof ref === "function") {
            ref(instance);
          } else if (ref !== null) {
            ref.current = instance;
          }
        }}
        onFocus={(e) => {
          onFocus();
          props.onFocus(e);
        }}
        dangerouslySetInnerHTML={{
          __html: innerHtml,
        }}
      />
    );
  }
);
