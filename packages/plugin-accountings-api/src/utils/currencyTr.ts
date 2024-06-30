import * as moment from 'moment';
import { nanoid } from 'nanoid';
import { IModels } from '../connectionResolver';
import { JOURNALS, TR_SIDES } from '../models/definitions/constants';
import { ITransaction, ITransactionDocument } from "../models/definitions/transaction";

export const checkValidationCurrency = async (models: IModels, doc: ITransaction) => {
  const detail = doc.details[0];
  if (!detail) {
    throw new Error('has not detail')
  }
  const mainCurrency = await models.AccountingConfigs.getConfig('MainCurrency');
  const account = await models.Accounts.getAccount({ _id: detail.accountId });
  if (mainCurrency === account.currency) {
    return;
  }

  let currencyDiffTrDoc: ITransaction | undefined;

  if (!detail.currencyAmount) {
    throw new Error('must fill Currency Amount')
  }

  const spotRateObj = await models.ExchangeRates.getExchangeRate({ date: moment(doc.date).format('YYYY-MM-DD'), mainCurrency, rateCurrency: account.currency });

  if (!spotRateObj?.rate) {
    throw new Error('not found spot rate')
  }
  const spotRate = spotRateObj.rate;

  if (detail.customRate && spotRate !== detail.customRate && !detail.followInfos?.currencyDiffAccountId) {
    throw new Error('not found spot rate..')
  }

  if (detail.customRate && spotRate !== detail.customRate && detail.followInfos.currencyDiffAccountId) {
    const rateDiff = detail.customRate - spotRate;
    let amount = detail.currencyAmount * rateDiff;

    let side = detail.side;
    if (amount < 0) {
      side = TR_SIDES.DEBIT === detail.side ? TR_SIDES.CREDIT : TR_SIDES.DEBIT;
      amount = -1 * amount;
    }

    currencyDiffTrDoc = {
      ptrId: doc.ptrId,
      parentId: doc.parentId,
      number: doc.number,
      date: doc.date,
      description: doc.description,
      journal: JOURNALS.MAIN,
      branchId: doc.branchId,
      departmentId: doc.departmentId,
      customerType: doc.customerType,
      customerId: doc.customerId,
      details: [{
        _id: nanoid(),
        accountId: detail.followInfos.currencyDiffAccountId,
        side,
        amount
      }],
    }

    return currencyDiffTrDoc
  }
}

export const doCurrencyTr = async (models: IModels, transaction: ITransactionDocument, currencyDoc?: ITransaction) => {
  let currencyTr;
  const oldFollowInfo = (transaction.follows || []).find(f => f.type === 'currencyDiff')

  if (!currencyDoc) {
    if (oldFollowInfo) {
      await models.Transactions.updateOne({ _id: transaction._id }, {
        $pull: {
          follows: { ...oldFollowInfo }
        }
      });
      await models.Transactions.deleteOne({ _id: oldFollowInfo.id })
    }
    return;
  }

  if (oldFollowInfo) {
    const oldCurrencyTr = await models.Transactions.findOne({ _id: oldFollowInfo.id });
    if (oldCurrencyTr) {
      await models.Transactions.updateTransaction(oldCurrencyTr._id, { ...currencyDoc, originId: transaction._id });
      currencyTr = models.Transactions.findOne({ _id: oldCurrencyTr._id });

    } else {
      currencyTr = await models.Transactions.createTransaction({ ...currencyDoc, originId: transaction._id });
      await models.Transactions.updateOne({ _id: transaction._id }, {
        $pull: {
          follows: { ...oldFollowInfo }
        }
      })
      await models.Transactions.updateOne({ _id: transaction._id }, {
        $addToSet: {
          follows: {
            type: 'currencyDiff',
            id: currencyTr._id
          }
        }
      });
    }

  } else {
    currencyTr = await models.Transactions.createTransaction({ ...currencyDoc, originId: transaction._id });
    await models.Transactions.updateOne({ _id: transaction._id }, {
      $addToSet: {
        follows: [{
          type: 'currencyDiff',
          id: currencyTr._id
        }]
      }
    });
  }

  return currencyTr;
}