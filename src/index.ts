import express from "express";
import * as bodyParser from "body-parser";
import { LinearClient } from "@linear/sdk";
import { WebhookData } from "./types";
import { repos } from "./config";

let linearClient: LinearClient | undefined;

try {
  linearClient = new LinearClient({ apiKey: process.env.LINEAR_KEY });
} catch (e) {
  console.warn(
    "LINEAR_KEY is not configured yet! Configure it in environment variables."
  );
  linearClient = undefined;
}

const app = express();
const port = 3000;

// Parse the request body
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  const integrationStatus = linearClient
    ? "Linear client is correctly configured!"
    : "Linear client not yet configured, configure it by setting <code>LINEAR_KEY</code> in environment variables (check <code>README.md</code>)";
  res.send("Welcome to CodeSandbox Linear integration!<p>" + integrationStatus);
});

// Receive HTTP POST requests
app.post("/linear-webhook", async (req, res) => {
  const payload = req.body;
  const { action, data, type } = payload;

  if (action === "create" && type === "Issue") {
    const payload: WebhookData = data;

    const branchName = `${payload.team.key}-${payload.number}`;
    console.log("Linear Issue: " + branchName);
    await Promise.all(
      repos.map(async (repo) => {
        if (linearClient) {
          await linearClient.attachmentCreate({
            issueId: payload.id,
            title: repo,
            url: `https://codesandbox.io/p/github/${repo}/${branchName}?create=true`,
            subtitle: "Open in CodeSandbox",
            iconUrl: "https://codesandbox.io/favicon.ico?",
            groupBySource: true,
          });
        } else {
          console.warn(
            "Tried to create attachment but linear client is not configured"
          );
        }
      })
    );
  }

  // Finally, respond with a HTTP 200 to signal all good
  res.sendStatus(200);
});

app.listen(port, () =>
  console.log(`Linear webhook listener is listening on ${port}!`)
);
