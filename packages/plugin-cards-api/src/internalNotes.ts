import { generateModels } from "./connectionResolver";

export default {
  generateInternalNoteNotif: async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    let model: any = models.GrowthHacks;

    const { contentTypeId, notifDoc, type } = data;

    if (type === "growthHack") {
      const hack = await model.getGrowthHack(contentTypeId);

      notifDoc.content = `${hack.name}`;

      return notifDoc;
    }

    switch (type) {
      case "task":
        model = models.Tasks;
        break;

      default:
        model = models.Tickets;
        break;
    }

    const card = await model.findOne({ _id: contentTypeId });
    const stage = await models.Stages.getStage(card.stageId);
    const pipeline = await models.Pipelines.getPipeline(stage.pipelineId);

    notifDoc.notifType = `${type}Delete`;
    notifDoc.content = `"${card.name}"`;
    notifDoc.link = `/${type}/board?id=${pipeline.boardId}&pipelineId=${pipeline._id}&itemId=${card._id}`;
    notifDoc.contentTypeId = card._id;
    notifDoc.contentType = `${type}`;
    notifDoc.item = card;

    // sendNotificationOfItems on ticket, task
    notifDoc.notifOfItems = true;

    return notifDoc;
  }
};
