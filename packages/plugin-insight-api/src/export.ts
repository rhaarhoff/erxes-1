import * as xlsxPopulate from 'xlsx-populate';
import { chartGetResult } from './graphql/resolvers/utils';

/**
 * Creates blank workbook
 */
export const createXlsFile = async () => {
  // Generating blank workbook
  const workbook = await xlsxPopulate.fromBlankAsync();

  return { workbook, sheet: workbook.sheet(0) };
};

/**
 * Generates downloadable xls file on the url
 */
export const generateXlsx = async (workbook: any): Promise<string> => {
  return workbook.outputAsync();
};

const addIntoSheet = async (
  values: any,
  startRowIdx: string,
  endRowIdx: string,
  sheet: any,
  customStyles?: any,
) => {
  let r;

  r = sheet.range(`${startRowIdx}:${endRowIdx}`);

  if (customStyles) {
    for (const cStyle of customStyles) {
      r.style(cStyle.style, cStyle.value);
    }
  }

  r.value(values);
  r.style({ wrapText: true });
};

const prepareHeader = async (sheet: any, title: string) => {
  const header = ['Team member', title];

  sheet.column('A').width(40);
  sheet.column('B').width(15);

  addIntoSheet([header], 'A1', 'B1', sheet);
};

const isArrayPrimitive = (arr) => {
  for (const element of arr) {
    if (typeof element !== 'object' && typeof element !== 'function') {
      return true;
    }
  }
  return false;
};


const extractAndAddIntoSheet = async (
  sheet: any,
  data: any,
  labels: string[],
) => {
  const extractValuesIntoArr: any[][] = [];
  const startRowIdx = 2;
  const endRowIdx = 2 + data.length;

  const sortedData = data.sort((a, b) => Number(b) - Number(a));

  if (isArrayPrimitive(data)) {
    for (let i = 0; i < sortedData.length; i++) {
      extractValuesIntoArr.push([labels[i], data[i]]);
    }
  }

  const dataRange = sheet.range(`A${startRowIdx - 1}:B${endRowIdx - 1}`);
  dataRange.style({ border: 'thin' });

  addIntoSheet(extractValuesIntoArr, `A${startRowIdx}`, `B${endRowIdx}`, sheet);
};

const toCamelCase = (str: string) => {
  return str.replace(/[-_](.)/g, function (match, group) {
    return group.toUpperCase();
  });
};

export const buildFile = async (subdomain: string, params: any) => {
  const { workbook, sheet } = await createXlsFile();
  const dataset = await chartGetResult(params, subdomain);
  const { title, data, labels } = dataset;

  await prepareHeader(sheet, title);
  await extractAndAddIntoSheet(sheet, data, labels);

  return {
    name: `${toCamelCase(title)}`,
    response: await generateXlsx(workbook),
  };
};
