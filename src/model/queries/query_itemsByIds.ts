//
//  query_itemsByIds.ts
//  Design System Documentation Site
//
//  Created by Jiri Trecak <jiri@supernova.io> 
//  Supernova.io 
//

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Imports

import { SupernovaTypes } from "../../../plugins/supernova-gatsby-source/build/exports"
import QueryAllItems from "./query_allItems"

const QueryItemsByIds = (ids: Array<string>): Array<SupernovaTypes.DocumentationItem> => {
  return QueryAllItems().filter(i => ids.includes(i.id) || ids.includes(i.persistentId))
};

export default QueryItemsByIds;