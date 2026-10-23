import type { BlogPost } from "./types";
import { post as customVsOffTheShelf } from "./custom-vs-off-the-shelf";
import { post as serverComponentsDataFetching } from "./server-components-data-fetching";
import { post as planningAnErpRollout } from "./planning-an-erp-rollout";

/**
 * Every article, published or draft. To add one: create a file next to this one exporting `post`,
 * then list it here. Visibility (drafts, preview) is decided in src/lib/blog.ts.
 */
export const allPosts: BlogPost[] = [customVsOffTheShelf, serverComponentsDataFetching, planningAnErpRollout];
