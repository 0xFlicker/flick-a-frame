import { parse } from "dotenv";
import { readFileSync } from "fs";
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
    const environment: Record<string, string> = {};
    if (app.stage === "staging") {
      const env = parse(readFileSync(".env.staging"));
      Object.assign(environment, env);
    } else if (app.stage === "prod") {
      const env = parse(readFileSync(".env.production"));
      Object.assign(environment, env);
    }
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site", {
        environment: {
          ...environment,
          NEYNAR_API_KEY: process.env.NEYNAR_API_KEY || "",
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} as SSTConfig;
