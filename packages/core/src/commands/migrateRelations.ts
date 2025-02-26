import * as dotenv from "dotenv";

dotenv.config();

import { Collection, Db, MongoClient } from "mongodb";

const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  throw new Error(`Environment variable MONGO_URL not set.`);
}

const client = new MongoClient(MONGO_URL);

let db: Db;

let Segments: Collection<any>;
let Fields: Collection<any>;
let FieldGroups: Collection<any>;
let Tags: Collection<any>;
let InternalNotes: Collection<any>;
let Webhooks: Collection<any>;
let ActivityLogs: Collection<any>;
let Charts: Collection<any>;
let Reports: Collection<any>;
let Logs: Collection<any>;

const switchContentType = contentType => {
  let changedContentType = contentType;

  switch (contentType) {
    case "cards:deal":
      changedContentType = `sales:deal`;
      break;
    case "cards:purchase":
      changedContentType = `purchases:purchase`;
      break;
    case "cards:ticket":
      changedContentType = `tickets:ticket`;
      break;
    case "cards:task":
      changedContentType = `tasks:task`;
      break;
    case "growthhacks:growthHack":
      changedContentType = `growthhacks:growthHack`;
      break;

    case "contacts:customer":
      changedContentType = `core:customer`;
      break;

    case "contacts:company":
      changedContentType = `core:company`;
      break;

    case "contacts:lead":
      changedContentType = `core:lead`;
      break;

    default:
      changedContentType = contentType;
  }

  return changedContentType;
};

const command = async () => {
  await client.connect();
  db = client.db() as Db;

  Segments = db.collection("segments");
  Fields = db.collection("form_fields");
  FieldGroups = db.collection("fields_groups");
  Tags = db.collection("tags");
  InternalNotes = db.collection("internal_notes");
  ActivityLogs = db.collection("activity_logs");
  Webhooks = db.collection("webhooks");
  Charts = db.collection("insight_charts");
  Reports = db.collection("reports");
  Logs = db.collection("logs");

  try {
    await Segments.find({}).forEach(doc => {
      const contentType = switchContentType(doc.contentType);

      Segments.updateOne({ _id: doc._id }, { $set: { contentType } });

      const updatedConditions: any = [];

      for (const condition of doc.conditions || []) {
        if (condition.propertyType) {
          condition.propertyType = switchContentType(condition.propertyType);
        }

        updatedConditions.push(condition);
      }

      Segments.updateOne(
        { _id: doc._id },
        { $set: { conditions: updatedConditions } }
      );
    });

    await FieldGroups.find({}).forEach(doc => {
      const contentType = switchContentType(doc.contentType);

      FieldGroups.updateOne({ _id: doc._id }, { $set: { contentType } });
    });

    await Fields.find({}).forEach(doc => {
      const contentType = switchContentType(doc.contentType);

      Fields.updateOne({ _id: doc._id }, { $set: { contentType } });
    });

    await Logs.find({}).forEach(doc => {
      const contentType = switchContentType(doc.contentType);

      Logs.updateOne({ _id: doc._id }, { $set: { contentType } });
    });

    await ActivityLogs.find({}).forEach(doc => {
      const contentType = switchContentType(doc.contentType);

      ActivityLogs.updateOne({ _id: doc._id }, { $set: { contentType } });
    });

    await Tags.find({}).forEach(doc => {
      const contentType = switchContentType(doc.type);

      Tags.updateOne({ _id: doc._id }, { $set: { type: contentType } });
    });

    await InternalNotes.find({}).forEach(doc => {
      const contentType = switchContentType(doc.contentType);

      InternalNotes.updateOne({ _id: doc._id }, { $set: { contentType } });
    });

    await Webhooks.find({}).forEach(webhook => {
      const actions = webhook.actions || [];
      const fixedActions = [] as any;

      for (const action of actions) {
        const type = switchContentType(action.type);

        fixedActions.push({
          ...action,
          type
        });
      }

      Webhooks.updateOne(
        { _id: webhook._id },
        {
          $set: {
            actions: fixedActions
          }
        }
      );
    });

    await Charts.updateMany(
      { templateType: { $regex: new RegExp("Deal") } },
      { $set: { serviceName: "sales" } }
    );

    await Charts.updateMany(
      { templateType: { $regex: new RegExp("Ticket") } },
      { $set: { serviceName: "tickets" } }
    );

    await Charts.updateMany(
      { templateType: { $regex: new RegExp("Task") } },
      { $set: { serviceName: "tasks" } }
    );

    await Charts.updateMany(
      { templateType: { $regex: new RegExp("Purchase") } },
      { $set: { serviceName: "purchases" } }
    );

    await Reports.updateMany(
      { serviceType: "task" },
      { $set: { serviceName: "tasks" } }
    );

    await Reports.updateMany(
      { serviceType: "ticket" },
      { $set: { serviceName: "tickets" } }
    );

    await Reports.updateMany(
      { serviceType: "deal" },
      { $set: { serviceName: "sales" } }
    );

    await Reports.updateMany(
      { serviceType: "purchase" },
      { $set: { serviceName: "purchases" } }
    );
  } catch (e) {
    console.log(`Error occurred: ${e.message}`);
  }

  console.log(`Process finished at: ${new Date()}`);

  process.exit();
};

command();
