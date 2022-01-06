import clsx from "clsx";
import React from "react";
import { BlockType } from "../types";

type Props = {
  type: BlockType;
  html: string;
} & JSX.IntrinsicElements["div"];

export const ContentEditable = React.forwardRef<HTMLDivElement, Props>(
  ({ type, html, ...props }, ref) => {
    const innerRef = React.useRef<HTMLDivElement | null>(null);

    return (
      <div
        className={clsx(
          type === "h1" && "",
          type === "h2" && "",
          type === "h3" && ""
        )}
        ref={(instance) => {
          innerRef.current = instance;

          if (typeof ref === "function") {
            ref(instance);
          } else if (ref !== null) {
            ref.current = instance;
          }
        }}
        contentEditable
        dangerouslySetInnerHTML={{
          __html: html,
        }}
        {...props}
      />
    );
  }
);
