import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework";
import { syncProductsWorkflow } from "../workflows/sync-products";

export default async function algoliaSyncHandler({
  container,
}: SubscriberArgs) {
  const logger = container.resolve("logger");

  let hasMore = true;
  let offset = 0;
  const limit = 50;
  let totalIndexed = 0;

  logger.info("Starting product indexing...");

  while (hasMore) {
    try {
      const {
        result: { products, metadata },
      } = await syncProductsWorkflow(container).run({
        input: {
          limit,
          offset,
        },
      });

      hasMore = offset + limit < (metadata?.count ?? 0);
      offset += limit;
      totalIndexed += products.length;

      logger.info(`Indexed ${products.length} products`);
    } catch (err) {
      logger.error(err);
    } finally {
      logger.info(`Successfully indexed ${totalIndexed} products`);
      logger.info(`Total indexed: ${totalIndexed}`);
    }
  }
}

export const config: SubscriberConfig = {
  event: "algolia.sync",
};
