import customScalars from "@erxes/api-utils/src/customScalars";
import {
  Board,
  Pipeline,
  Stage,
  Task,
  TaskListItem,
  Ticket,
  TicketListItem,
  GrowthHack,
  Checklist
} from "./customResolvers";
import {
  Board as BoardMutations,
  Task as TaskMutations,
  Ticket as TicketMutations,
  GrowthHack as GrowthHackMutations,
  PipelineTemplate as PipelineTemplateMutations,
  PipelineLabel as PipelineLabelMutations,
  Checklists as ChecklistMutations
} from "./mutations";

import {
  Board as BoardQueries,
  Task as TaskQueries,
  Ticket as TicketQueries,
  GrowthHack as GrowthHackQueries,
  PipelineTemplate as PipelineTemplateQueries,
  PipelineLabel as PipelineLabelQueries,
  CheckLists as ChecklistQueries
} from "./queries";

const resolvers: any = {
  ...customScalars,
  Board,
  Pipeline,
  Stage,
  Task,
  TaskListItem,
  Ticket,
  TicketListItem,
  GrowthHack,
  Checklist,
  Mutation: {
    ...BoardMutations,
    ...TaskMutations,
    ...TicketMutations,
    ...GrowthHackMutations,
    ...PipelineTemplateMutations,
    ...PipelineLabelMutations,
    ...ChecklistMutations
  },
  Query: {
    ...BoardQueries,
    ...TaskQueries,
    ...TicketQueries,
    ...GrowthHackQueries,
    ...PipelineTemplateQueries,
    ...PipelineLabelQueries,
    ...ChecklistQueries
  }
};

export default resolvers;
