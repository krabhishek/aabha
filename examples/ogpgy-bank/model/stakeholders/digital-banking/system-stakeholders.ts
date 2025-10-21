/**
 * Digital Banking - System Stakeholders
 *
 * System and service stakeholders in the digital banking context,
 * representing APIs, platforms, and automated systems that power
 * digital banking experiences.
 */

import { Stakeholder, StakeholderType } from '../../../../../src/index.js';
import { RetailBankingContext } from '../../contexts/retail-banking.context.js';
import {
  EKYCVerificationServicePersona,
  CentralBankKYCRegistryPersona
} from '../../personas/system/kyc-verification.persona.js';
import { EmailValidationServicePersona } from '../../personas/system/email-validation.persona.js';
import { AIDocumentVerificationServicePersona } from '../../personas/system/document-verification-ai.persona.js';
import {
  CoreBankingPlatformPersona,
  MobileAppBackendServicePersona
} from '../../personas/system/core-banking.persona.js';
import {
  AuditLogSystemPersona,
  AIFraudDetectionSystemPersona
} from '../../personas/system/audit-fraud.persona.js';
import { VirtualCardIssuanceSystemPersona } from '../../personas/system/payment-card.persona.js';

// ============================================================================
// Verification & Validation Systems
// ============================================================================

@Stakeholder({
  type: StakeholderType.System,
  role: 'Email Validation Provider',
  persona: EmailValidationServicePersona,
  context: RetailBankingContext,
  responsibilities: [
    'Validate email format (RFC 5322)',
    'Verify DNS MX records',
    'Detect disposable/temporary emails',
    'Check for typos and common domains',
    'Provide deliverability score'
  ],
  permissions: ['read_email_input', 'write_validation_result', 'write_audit_log'],
  description: 'Third-party email validation API ensuring valid customer email addresses during signup'
})
export class EmailValidationProviderStakeholder {}

@Stakeholder({
  type: StakeholderType.System,
  role: 'Document Verification AI Provider',
  persona: AIDocumentVerificationServicePersona,
  context: RetailBankingContext,
  responsibilities: [
    'Extract data from ID documents (OCR)',
    'Verify document authenticity',
    'Perform facial biometric matching',
    'Detect liveness (anti-spoofing)',
    'Score confidence for each verification step',
    'Return structured verification results'
  ],
  permissions: [
    'read_document_images',
    'read_selfie_images',
    'write_verification_results',
    'write_confidence_scores',
    'write_audit_trail'
  ],
  description: 'AI-powered document verification service for instant KYC during account opening'
})
export class DocumentVerificationAIProviderStakeholder {}

@Stakeholder({
  type: StakeholderType.System,
  role: 'KYC Verification Provider',
  persona: EKYCVerificationServicePersona,
  context: RetailBankingContext,
  responsibilities: [
    'Verify identity against Central Bank KYC Registry',
    'Perform sanctions screening',
    'Check PEP (Politically Exposed Person) status',
    'Validate address and contact details',
    'Return verification status and risk score'
  ],
  permissions: [
    'read_customer_identity_data',
    'query_central_bank_registry',
    'write_verification_status',
    'write_risk_score',
    'write_compliance_audit_log'
  ],
  description: 'eKYC service connecting to Central Bank registry for real-time identity verification'
})
export class KYCVerificationProviderStakeholder {}

@Stakeholder({
  type: StakeholderType.System,
  role: 'Central Bank KYC Data Provider',
  persona: CentralBankKYCRegistryPersona,
  context: RetailBankingContext,
  responsibilities: [
    'Maintain national KYC database',
    'Provide real-time identity lookups',
    'Return biometric match results',
    'Provide sanctions/PEP status',
    'Log all access for audit'
  ],
  permissions: [
    'provide_identity_data',
    'provide_biometric_match',
    'provide_sanctions_status',
    'log_bank_access'
  ],
  description: 'Government-operated KYC registry providing authoritative identity data'
})
export class CentralBankKYCDataProviderStakeholder {}

// ============================================================================
// Core Banking Systems
// ============================================================================

@Stakeholder({
  type: StakeholderType.System,
  role: 'Core Banking Account Manager',
  persona: CoreBankingPlatformPersona,
  context: RetailBankingContext,
  responsibilities: [
    'Create new customer accounts',
    'Generate unique account numbers',
    'Initialize account balances',
    'Store customer master data',
    'Enable account for transactions',
    'Send account creation events'
  ],
  permissions: [
    'create_account',
    'assign_account_number',
    'write_customer_data',
    'write_account_data',
    'publish_account_events'
  ],
  description: 'Core banking platform managing account lifecycle and customer data'
})
export class CoreBankingAccountManagerStakeholder {}

@Stakeholder({
  type: StakeholderType.System,
  role: 'Mobile App Backend Service',
  persona: MobileAppBackendServicePersona,
  context: RetailBankingContext,
  responsibilities: [
    'Orchestrate account opening workflow',
    'Coordinate between verification services',
    'Manage session state for mobile users',
    'Provide GraphQL API for mobile app',
    'Handle real-time status updates',
    'Send push notifications'
  ],
  permissions: [
    'orchestrate_workflows',
    'call_external_services',
    'manage_sessions',
    'send_push_notifications',
    'write_analytics_events'
  ],
  description: 'Backend-for-frontend service powering mobile app account opening flow'
})
export class MobileAppBackendServiceStakeholder {}

// ============================================================================
// Card & Payment Systems
// ============================================================================

@Stakeholder({
  type: StakeholderType.System,
  role: 'Virtual Card Issuer',
  persona: VirtualCardIssuanceSystemPersona,
  context: RetailBankingContext,
  responsibilities: [
    'Issue instant virtual debit cards',
    'Provision cards to Apple Pay / Google Pay',
    'Set initial PIN',
    'Configure card controls',
    'Enable card for transactions'
  ],
  permissions: [
    'issue_virtual_card',
    'provision_to_wallets',
    'set_card_pin',
    'configure_card_limits',
    'enable_card'
  ],
  description: 'Card issuance platform providing instant virtual cards upon account creation'
})
export class VirtualCardIssuerStakeholder {}

// ============================================================================
// Audit & Fraud Systems
// ============================================================================

@Stakeholder({
  type: StakeholderType.System,
  role: 'Audit Logger',
  persona: AuditLogSystemPersona,
  context: RetailBankingContext,
  responsibilities: [
    'Log all account opening events',
    'Record user actions and system responses',
    'Store verification results',
    'Maintain immutable audit trail',
    'Enable compliance reporting'
  ],
  permissions: [
    'write_audit_logs',
    'write_compliance_events',
    'provide_audit_trail',
    'support_forensic_analysis'
  ],
  description: 'Centralized audit logging system capturing all events for compliance and forensics'
})
export class AuditLoggerStakeholder {}

@Stakeholder({
  type: StakeholderType.System,
  role: 'Fraud Detection Monitor',
  persona: AIFraudDetectionSystemPersona,
  context: RetailBankingContext,
  responsibilities: [
    'Monitor account opening for suspicious patterns',
    'Detect synthetic identities',
    'Flag high-risk applications',
    'Perform device fingerprinting',
    'Score fraud probability'
  ],
  permissions: [
    'analyze_application_data',
    'check_device_fingerprint',
    'write_fraud_score',
    'flag_suspicious_activity',
    'block_high_risk_applications'
  ],
  description: 'AI-powered fraud detection system monitoring account openings for suspicious activity'
})
export class FraudDetectionMonitorStakeholder {}
