import { AlgoliaIndexType } from "../modules/algolia/service";

declare module "@medusajs/framework/utils" {
  interface ModuleServiceTypes {
    algolia: {
      indexData: (
        data: Record<string, unknown>[],
        type?: AlgoliaIndexType
      ) => Promise<void>;
      retrieveFromIndex: (
        objectIDs: string[],
        type?: AlgoliaIndexType
      ) => Promise<Record<string, unknown>[]>;
      deleteFromIndex: (
        objectIDs: string[],
        type?: AlgoliaIndexType
      ) => Promise<void>;
      search: (query: string, type?: AlgoliaIndexType) => Promise<any>;
    };
  }
}
