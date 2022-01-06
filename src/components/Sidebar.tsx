import * as React from "react";
import { Link } from "react-router-dom";

export function Sidebar() {
  return (
    <div className="w-1/6 h-full py-2 px-5 flex flex-col text-stone-800 bg-gray-100">
      <h1 className="text-2xl font-bold">Minar</h1>
      <ul className="mt-8">
        <li>
          <Link to="/pages">All Pages</Link>
        </li>
      </ul>
    </div>
  );
}
