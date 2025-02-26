import {
  conformityQueryFieldDefs,
  conformityQueryFields
} from "@erxes/ui-sales/src/conformity";

const contractFields = `
  _id
  contractTypeId
  number
  status
  description
  createdBy
  createdAt
  marginAmount
  leaseAmount
  feeAmount
  tenor
  lossPercent
  lossCalcType
  interestRate
  repayment
  startDate
  firstPayDate
  scheduleDays
  debt
  debtTenor
  debtLimit
  insuranceAmount
  salvageAmount
  salvagePercent
  salvageTenor
  customerId
  customerType
  relationExpertId
  leasingExpertId
  riskExpertId
  weekends
  useHoliday
  useMargin
  useSkipInterest
  useDebt
  relContractId
  skipInterestCalcMonth
  dealId
  nextPayment
  currency
  classification
  expiredDays
  loanBalanceAmount
  storedInterest
  lastStoredDate
  useManualNumbering
  useFee
  loanPurpose
  givenAmount
  leaseType
  commitmentInterest
  endDate
`;

const selectContractFields = `
  _id
  contractTypeId
  number
  status
  description
  createdBy
  createdAt
  marginAmount
  leaseAmount
  feeAmount
  tenor
  lossPercent
  lossCalcType
  interestRate
  repayment
  startDate
  firstPayDate
  scheduleDays
  givenAmount
  leaseType
  commitmentInterest
  endDate
  classification
`;

const listParamsDef = `
  $page: Int
  $perPage: Int
  $sortField: String
  $sortDirection: Int

  $ids: [String]
  $excludeIds: Boolean
  $searchValue: String
  $isExpired: String
  $repaymentDate: String
  $startStartDate:Date
  $endStartDate:Date
  $startCloseDate:Date
  $endCloseDate:Date
  $dealId: String
  $customerId: String
  $contractTypeId: String
  $leaseAmount: Float
  $interestRate: Float
  $tenor: Int
  $repayment: String
  ${conformityQueryFields}
  $closeDate: Date
  $closeDateType:String
  $branchId:String

  $dealIds: [String]
`;

const listParamsMainDef = `
  ${listParamsDef}
`;

const listParamsValue = `
  page: $page
  perPage: $perPage
  sortField: $sortField
  sortDirection: $sortDirection

  ids: $ids
  excludeIds: $excludeIds
  searchValue: $searchValue
  isExpired: $isExpired
  repaymentDate: $repaymentDate
  startStartDate: $startStartDate
  endStartDate: $endStartDate
  startCloseDate: $startCloseDate
  endCloseDate: $endCloseDate
  dealId: $dealId
  customerId: $customerId
  contractTypeId: $contractTypeId
  leaseAmount: $leaseAmount
  interestRate: $interestRate
  tenor: $tenor
  repayment: $repayment
  ${conformityQueryFieldDefs}
  closeDate: $closeDate
  closeDateType: $closeDateType
  branchId: $branchId

  dealIds: $dealIds
`;

const listParamsMainValue = `
  ${listParamsValue}
`;

export const contracts = `
  query contracts(${listParamsDef}) {
    contracts(${listParamsValue}) {
      ${contractFields}
    }
  }
`;

export const selectContracts = `
  query contracts(${listParamsDef}) {
    contracts(${listParamsValue}) {
      ${selectContractFields}
    }
  }
`;

export const savingContracts = `
  query savingsContracts(
    $page: Int
    $perPage: Int
    $searchValue: String
    $isExpired: String
    $startStartDate:Date
    $endStartDate:Date
    $startCloseDate:Date
    $endCloseDate:Date
    $dealId: String
    $customerId: String
    $sortField: String
    $sortDirection: Int
    $contractTypeId: String
    $interestRate: Float
    $closeDate: Date
    $closeDateType:String
    $branchId:String
    $status:String
    $isDeposit:Boolean
  ) {
    savingsContracts(
      page: $page
      perPage: $perPage
      searchValue: $searchValue
      isExpired: $isExpired
      startStartDate: $startStartDate
      endStartDate: $endStartDate
      startCloseDate: $startCloseDate
      endCloseDate: $endCloseDate
      dealId: $dealId
      customerId: $customerId
      sortField: $sortField
      sortDirection: $sortDirection
      contractTypeId: $contractTypeId
      interestRate: $interestRate
      closeDate: $closeDate
      closeDateType: $closeDateType
      branchId: $branchId
      status: $status
      isDeposit: $isDeposit
    ) {
        _id
        contractTypeId
        number
        branchId
        status
        description
        createdBy
        createdAt
        savingAmount
        duration
        interestRate
        closeInterestRate
        startDate
        customerId
        customerType
        closeDate
        closeType
        closeDescription
        dealId
        hasTransaction
        currency
        closeInterestRate
        interestCalcType
        storedInterest
        endDate
        isAllowIncome
        isAllowOutcome
        isDeposit
        customers {
          code
          firstName
          lastName
        }
    }
  }
`;

export const contractsMain = `
  query contractsMain(${listParamsMainDef}) {
    contractsMain(${listParamsMainValue}) {
      list {
        ${contractFields}
        nextPayment
        customers {
          code
          firstName
          lastName
        }
        contractType {
          name
        }
      }
      totalCount
    }
  }
`;

export const contractDetailFields = `
  branchId
  downPayment
  skipAmountCalcMonth
  customPayment
  customInterest
  invoices
  storeInterest
  loanTransactionHistory
  depositAccountId
  contractType {
    code
    name
    productCategoryIds
    leaseType
  }

  customers {
    _id
    firstName
    lastName
    primaryEmail
    primaryPhone
  }
  companies {
    _id
    primaryName
    website
  }

  collateralsData
  collaterals
  insurancesData
  insurances

  relationExpert
  leasingExpert
  riskExpert

  closeDate
  closeType
  closeDescription

  relContract {
    _id
    number
    startDate
    closeDate
    closeType
  }
  hasTransaction
  nextPayment
  customFieldsData
  savingContractId
  holidayType
`;

export const contractDetail = `
  query contractDetail($_id: String!) {
    contractDetail(_id: $_id) {
      ${contractFields}
      ${contractDetailFields}
    }
  }
`;

export const schedules = `
  query schedules($contractId: String!, $isFirst: Boolean, $year: Float) {
    schedules(contractId: $contractId, isFirst: $isFirst, year: $year) {
      _id
      contractId
      version
      createdAt
      status
      payDate

      balance
      loss
      interest
      interestEve
      interestNonce
      commitmentInterest
      payment
      insurance
      debt
      total

      didLoss
      didInterest
      didInterestEve
      didInterestNonce
      didCommitmentInterest
      didPayment
      didInsurance
      didDebt
      didTotal
      surplus

      isDefault
      transactionIds
    }
  }
`;

export const scheduleYears = `
  query scheduleYears($contractId: String!) {
    scheduleYears(contractId: $contractId) {
      year
    }
  }
`;

export const convertToContract = `
  query convertToContract($id: String!, $contentType: String) {
    convertToContract(id: $id, contentType: $contentType)
  }
`

export const closeInfo = `
  query closeInfo($contractId: String, $date: Date) {
    closeInfo(contractId: $contractId, date: $date) {
      balance
      loss
      interest
      interestEve
      interestNonce
      payment
      insurance
      storedInterest
      debt
      total
    }
  }
`;

const documents = `
  query documents($page: Int, $perPage: Int, $contentType: String) {
    documents(page: $page, perPage: $perPage, contentType: $contentType) {
      _id
      contentType
      name
      createdAt
    }
  }
`;

const contractsAlert = `
  query contractsAlert($date: Date) {
    contractsAlert(date: $date) {
      name
      count
      filter
    }
  }
`;

const getPolarisData = `
  query Query($method: String, $data: JSON) {
    getPolarisData(method: $method, data: $data)
  }
`;
export default {
  contracts,
  selectContracts,
  contractsMain,
  contractDetail,
  schedules,
  scheduleYears,
  closeInfo,
  documents,
  contractsAlert,
  savingContracts,
  getPolarisData,
  convertToContract
};
