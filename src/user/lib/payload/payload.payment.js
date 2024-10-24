const Hash = require('../../utils/util.hash')


module.exports = {
  
  checkCardSavedPayload: (paymentRecord, body) => [
    paymentRecord.user_id,
    body.data.authorization.brand,
    body.data.authorization.exp_month,
    body.data.authorization.exp_year,
    body.data.authorization.bank,
    'paystack'
  ],
  saveDebitCardPayload: async(paymentRecord, body, isDefaultCardChoice) => [
    paymentRecord.user_id,
    'paystack',
    encodeURIComponent(await Hash.encrypt(body.data.authorization.bin.trim())),
    encodeURIComponent(await Hash.encrypt(body.data.authorization.last4.trim())),
    body.data.authorization.brand,
    body.data.authorization.exp_month,
    body.data.authorization.exp_year,
    encodeURIComponent(await Hash.encrypt(body.data.authorization.authorization_code.trim())),
    body.data.authorization.bank,
    body.data.authorization.account_name,
    isDefaultCardChoice
  ],
  trackLoanDisbursement: async(body, paymentRecord, loanDetails, status) => [
    paymentRecord.user_id,
    paymentRecord.loan_id,
    parseFloat(paymentRecord.amount),
    paymentRecord.id,
    body.data.recipient.details.account_number,
    body.data.recipient.details.account_name,
    body.data.recipient.details.bank_name,
    body.data.recipient.details.bank_code,
    body.data.recipient.recipient_code,
    body.data.transfer_code,
    status
  ],
  trackLoanPayment: async(paymentRecord, loanDetails) => [
    paymentRecord.user_id,
    paymentRecord.loan_id,
    parseFloat(paymentRecord.amount),
    'credit',
    loanDetails.loan_reason,
    'loan disbursement',
    'paystack transfer'
  ],
  loanDisbursementPayload: async(userDetails, loanDetails) => ({
    first_name: userDetails.first_name,
    email: userDetails.email,
    loanAmount: `₦${parseFloat(loanDetails.amount_requested).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
    loanDuration: Number(loanDetails.loan_tenor_in_months),
    loanPurpose: `${loanDetails.loan_reason || ''}`,
    pricingBand: `${parseFloat(loanDetails.percentage_pricing_band).toFixed(2)}%`,
    monthlyInterest: `${(parseFloat(loanDetails.monthly_interest)).toFixed(2)}%`,
    totalInterestAmount: `₦${parseFloat(loanDetails.total_interest_amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
    insuranceFee: `₦${parseFloat(loanDetails.insurance_fee).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
    processingFee: `₦${parseFloat(loanDetails.processing_fee).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
    advisoryFee: `₦${parseFloat(loanDetails.advisory_fee).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
    totalRepaymentAmount: `₦${parseFloat(loanDetails.total_repayment_amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
    monthlyRepayment: `₦${parseFloat(loanDetails.monthly_repayment).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
    offerLetterUrl: loanDetails.offer_letter_url
  }),
  trackClusterLoanDisbursement: async(body, member, paymentRecord, status) => [
    member.user_id,
    member.cluster_id,
    member.member_loan_id,
    member.loan_id,
    parseFloat(member.amount_requested),
    paymentRecord.id,
    body.data.recipient.details.account_number,
    body.data.recipient.details.account_name,
    body.data.recipient.details.bank_name,
    body.data.recipient.details.bank_code,
    body.data.recipient.recipient_code,
    body.data.transfer_code,
    status
  ],
  trackClusterLoanPayment: async(member) => [
    member.user_id,
    member.cluster_id,
    member.member_loan_id,
    member.loan_id,
    parseFloat(member.amount_requested),
    'credit',
    `${member.cluster_name} cluster loan`,
    'cluster loan disbursement',
    'paystack transfer'
  ],
  createClusterLoanSchedulePayload: async(member, schedule) => [
    member.cluster_id,
    member.member_loan_id,
    member.loan_id,
    schedule.user_id,
    schedule.repayment_order,
    schedule.principal_payment,
    schedule.interest_payment,
    schedule.fees,
    schedule.total_payment_amount,
    schedule.pre_payment_outstanding_amount,
    schedule.post_payment_outstanding_amount,
    schedule.proposed_payment_date,
    schedule.proposed_payment_date
  ]
};
