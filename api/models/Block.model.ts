import * as m from "mongoose";

const BlockSchema = new m.Schema({});

export const BlockModel = m.model("Block", BlockSchema);
