import BigNumber from 'bignumber.js';
import { IModels } from '../connectionResolver';
import * as moment from 'moment';
import { generateChartData, generateData } from './utils';

const DIMENSION_OPTIONS = [
  {
    label: 'Number',
    value: 'number',
    aggregate: { project: { path: 'number', value: 1 } }
  },
  {
    label: 'Classification',
    value: 'classification',
    aggregate: { project: { path: 'classification', value: 1 } }
  },
  {
    label: 'Interest Rate',
    value: 'interestRate',
    aggregate: { project: { path: 'interestRate', value: 1 } }
  },
  {
    label: 'Contract Type',
    value: 'contractType',
    aggregate: {
      project: {
        path: 'contractType',
        value: '$contractType.name'
      },
      lookup: [
        {
          $lookup: {
            from: 'loan_contract_types', // The collection name in MongoDB (usually the plural of the model name)
            localField: 'contractTypeId', // The field from the Order collection
            foreignField: '_id', // The field from the User collection
            as: 'contractType' // The field to add the results
          }
        },
        {
          $unwind: '$contractType' // Deconstruct the array field from the $lookup stage
        }
      ]
    }
  },
  {
    label: 'StartDate',
    value: 'startDate',
    format: (v: Date | undefined) => v && moment(v).format('YYYY-MM-DD'),
    aggregate: { project: { path: 'startDate', value: 1 } }
  },
  {
    label: 'EndDate',
    value: 'endDate',
    format: (v: Date | undefined) => v && moment(v).format('YYYY-MM-DD'),
    aggregate: { project: { path: 'endDate', value: 1 } }
  },
  {
    label: 'Expired Day',
    value: 'mustPayDate',
    format: (v: Date | undefined) => v && moment(v).diff(moment(), 'day'),
    aggregate: { project: { path: 'mustPayDate', value: 1 } }
  }
];

const MEASURE_OPTIONS = [
  {
    label: 'Balance Amount',
    value: 'loanBalanceAmount',
    aggregate: { project: { path: 'loanBalanceAmount', value: 1 } },
    format: (v: number = 0) => new BigNumber(v).toFormat()
  }
];

const loanReportData = {
  templateType: 'loanExpiredReportData',
  serviceType: 'loans',
  name: 'Loan Expired Data',
  chartTypes: ['table', 'bar', 'pie'],
  getChartResult: async (models: IModels, filter: any, chartType: string) => {
    const title = 'Loan Expiration Data';
    if (!filter.measure || filter.dimension?.length == 0) {
      filter.dimension = ['number'];
    }

    if (!filter.measure || filter.measure?.length == 0) {
      filter.measure = ['loanBalanceAmount'];
    }

    const data = await generateData(
      models,
      'Contracts',
      DIMENSION_OPTIONS,
      MEASURE_OPTIONS,
      filter,
      chartType
    );

    if (chartType !== 'table') {
      let chartData = generateChartData(
        data,
        filter.dimension[0],
        filter.measure[0]
      );
      return { title, data: chartData.data, labels: chartData.labels };
    }

    return { title, data };
  },

  filterTypes: [
    {
      fieldName: 'leaseExpertId',
      fieldType: 'select',
      multi: false,
      fieldQuery: 'users',
      fieldLabel: 'Select lease expert'
    },
    {
      fieldName: 'branchId',
      fieldType: 'select',
      multi: false,
      fieldQuery: 'branches',
      fieldLabel: 'Select branches'
    },
    {
      fieldName: 'customerId',
      fieldType: 'select',
      fieldQuery: 'customers',
      multi: false,
      fieldOptions: 'customerId',
      fieldLabel: 'Select source'
    },
    {
      fieldName: 'dimension',
      fieldType: 'select',
      multi: true,
      fieldOptions: DIMENSION_OPTIONS,
      fieldDefaultValue: ['number'],
      fieldLabel: 'Select dimension'
    },
    {
      fieldName: 'measure',
      fieldType: 'select',
      multi: true,
      fieldOptions: MEASURE_OPTIONS,
      fieldDefaultValue: ['loanBalanceAmount'],
      fieldLabel: 'Select measure'
    }
  ]
};

export default loanReportData;
