export interface WebhookData {
  id: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  title: string;
  description: string;
  priority: number;
  boardOrder: number;
  sortOrder: number;
  teamId: string;
  previousIdentifiers: [];
  creatorId: string;
  stateId: string;
  priorityLabel: string;
  subscriberIds: string[];
  labelIds: string[];
  state: {
    id: string;
    name: string;
    color: string;
    type: string;
  };
  team: {
    id: string;
    name: string;
    key: string;
  };
  labels: unknown[];
}
