import { generateModels, IModels } from './connectionResolver';
import { EXPORT_TYPES, MODULE_NAMES } from './constants';
import { fetchSegment, sendFormsMessage } from './messageBroker';

const prepareData = async (
  models: IModels,
  subdomain: string,
  query: any
): Promise<any[]> => {
  const { contentType, unlimited = true, segmentId } = query;

  const type = contentType.split(':')[1];

  let data: any[] = [];

  const contactsFilter: any = {};

  if (segmentId) {
    const itemIds = await fetchSegment(subdomain, segmentId);

    contactsFilter._id = { $in: itemIds };
  }

  switch (type) {
    case MODULE_NAMES.COMPANY:
      data = await models.Companies.find(contactsFilter).lean();

      break;
    case 'lead':
      data = await models.Customers.find(contactsFilter).lean();

      break;
    case 'visitor':
      data = await models.Customers.find(contactsFilter).lean();

      break;
    case MODULE_NAMES.CUSTOMER:
      data = await models.Customers.find(contactsFilter).lean();
      break;
  }

  return data;
};

const getCustomFieldsData = async (item, fieldId) => {
  let value;

  if (item.customFieldsData && item.customFieldsData.length > 0) {
    for (const customFeild of item.customFieldsData) {
      if (customFeild.field === fieldId) {
        value = customFeild.value;

        if (Array.isArray(value)) {
          value = value.join(', ');
        }

        return { value };
      }
    }
  }

  return { value };
};

const getTrackedData = async (item, fieldname) => {
  let value;

  if (item.trackedData && item.trackedData.length > 0) {
    for (const data of item.trackedData) {
      if (data.field === fieldname) {
        value = data.value;

        if (Array.isArray(value)) {
          value = value.join(', ');
        }

        return { value };
      }
    }
  }

  return { value };
};

export default {
  exportTypes: EXPORT_TYPES,

  prepareExportData: async ({ subdomain, data }) => {
    const models = await generateModels(subdomain);

    const { columnsConfig, contentType, segmentId } = data;

    const docs = [] as any;
    const headers = [] as any;

    try {
      const results = await prepareData(models, subdomain, data);

      for (const column of columnsConfig) {
        if (column.startsWith('customFieldsData')) {
          const fieldId = column.split('.')[1];
          const field = await sendFormsMessage({
            subdomain,
            action: 'fields.findOne',
            data: {
              query: { _id: fieldId }
            },
            isRPC: true
          });

          headers.push(`customFieldsData.${field.text}.${fieldId}`);
        } else {
          headers.push(column);
        }
      }

      for (const item of results) {
        const result = {};

        for (const column of headers) {
          if (column.startsWith('customFieldsData')) {
            const fieldId = column.split('.')[2];
            const fieldName = column.split('.')[1];

            const { value } = await getCustomFieldsData(item, fieldId);

            result[column] = value || '-';
          } else if (column.startsWith('location')) {
            const location = item.location || {};

            result[column] = location[column.split('.')[1]];
          } else if (column.startsWith('visitorContactInfo')) {
            const visitorContactInfo = item.visitorContactInfo || {};

            result[column] = visitorContactInfo[column.split('.')[1]];
          } else if (column.startsWith('trackedData')) {
            const fieldName = column.split('.')[1];

            const { value } = await getTrackedData(item, fieldName);

            result[column] = value || '-';
          } else {
            result[column] = item[column];
          }
        }

        docs.push(result);
      }
    } catch (e) {
      return { error: e.message };
    }
    return { docs, headers };
  }
};
