/**
 * Digital Banking Context - Stakeholders
 *
 * All stakeholders operating in the digital banking context,
 * including customers, systems, and services that power
 * digital banking experiences.
 */

// Customer Stakeholders
export {
  DigitalFirstCustomerStakeholder,
  StudentMobileUserStakeholder,
  FamilyDigitalBankingUserStakeholder
} from './customer-stakeholders.js';

// System Stakeholders
export {
  EmailValidationProviderStakeholder,
  DocumentVerificationAIProviderStakeholder,
  KYCVerificationProviderStakeholder,
  CentralBankKYCDataProviderStakeholder,
  CoreBankingAccountManagerStakeholder,
  MobileAppBackendServiceStakeholder,
  VirtualCardIssuerStakeholder,
  AuditLoggerStakeholder,
  FraudDetectionMonitorStakeholder
} from './system-stakeholders.js';
