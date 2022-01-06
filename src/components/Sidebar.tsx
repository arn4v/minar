import * as React from "react";
import { Link } from "react-router-dom";

export function Sidebar() {
  return (
    <div className="w-1/6 h-full py-2 px-5 flex flex-col text-stone-200 bg-gray-800">
      <h1 className="text-2xl font-bold">Minar</h1>
      <ul className="mt-8">
        <li>
          <Link to="/">All Pages</Link>
        </li>
      </ul>
    </div>
  );
}
