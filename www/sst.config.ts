import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "www",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site", {
        environment: {
          // kind of stupid that I need to put it here, it is not picked up from .env
          NEYNAR_API_KEY: "<api-key>",
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} as SSTConfig;
