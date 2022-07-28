import express from "express";
import * as bodyParser from "body-parser";
import { LinearClient } from "@linear/sdk";
import { WebhookData } from "./types";
import { repos } from "./config";

const linearClient = new LinearClient({ apiKey: process.env.LINEAR_KEY });

const app = express();
const port = 3000;

// Parse the request body
app.use(bodyParser.json());

// Receive HTTP POST requests
app.post("/linear-webhook", async (req, res) => {
  const payload = req.body;
  const { action, data, type } = payload;

  if (action === "create" && type === "Issue") {
    const payload: WebhookData = data;

    const branchName = `${payload.team.key}-${payload.number}`;
    await Promise.all(
      repos.map(async (repo) => {
        await linearClient.attachmentCreate({
          issueId: payload.id,
          title: repo,
          url: `https://codesandbox.io/p/github/${repo}/${branchName}?create=true`,
          subtitle: "Open in CodeSandbox",
          iconUrl: "https://codesandbox.io/favicon.ico?",
        });
      })
    );
  }

  // Do something neat with the data received!

  // Finally, respond with a HTTP 200 to signal all good
  res.sendStatus(200);
});

app.listen(port, () =>
  console.log(`My webhook consumer listening on port ${port}!`)
);
