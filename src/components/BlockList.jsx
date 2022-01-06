import clsx from "clsx";
import * as React from "react";
import { Block } from "./Block";

export function BlockList({ blockChildren }) {
  return (
    <div
      className={clsx("ml-7 flex flex-col items-start justify-start w-full")}
    >
      {blockChildren.map((item) => (
        <Block id={item.id} blockChildren={item.children} />
      ))}
    </div>
  );
}
