import { generateModels } from "./connectionResolver";
import { getBoardItemLink } from "./models/utils";

export default {
  actions: [
    {
      label: "Task created",
      action: "create",
      type: "cards:task"
    },
    {
      label: "Task updated",
      action: "update",
      type: "cards:task"
    },
    {
      label: "Task deleted",
      action: "delete",
      type: "cards:task"
    },
    {
      label: "Task moved",
      action: "createBoardItemMovementLog",
      type: "cards:task"
    },
    {
      label: "Ticket created",
      action: "create",
      type: "cards:ticket"
    },
    {
      label: "Ticket updated",
      action: "update",
      type: "cards:ticket"
    },
    {
      label: "Ticket deleted",
      action: "delete",
      type: "cards:ticket"
    },
    {
      label: "Ticket moved",
      action: "createBoardItemMovementLog",
      type: "cards:ticket"
    }
  ],
  getInfo: async ({
    subdomain,
    data: { data, contentType, actionText, action }
  }) => {
    const models = await generateModels(subdomain);

    if (action === "createBoardItemMovementLog") {
      return {
        content: `${contentType} with name ${
          data.data.item.name || ""
        } has moved from ${data.data.activityLogContent.text}`,
        url: data.data.link
      };
    }

    if (!["create", "update"].includes(action)) {
      return {
        content: `${contentType} ${actionText}`,
        url: ""
      };
    }

    const { object } = data;

    return {
      url: await getBoardItemLink(models, object.stageId, object._id),
      content: `${contentType} ${actionText}`
    };
  }
};
