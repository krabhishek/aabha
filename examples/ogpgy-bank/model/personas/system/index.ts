/**
 * System Personas
 *
 * Personas for APIs, services, platforms, and automated systems.
 * Systems are StakeholderType.System when used in stakeholder definitions.
 */

// KYC & Verification
export { EKYCVerificationServicePersona, CentralBankKYCRegistryPersona } from './kyc-verification.persona.js';

// Email Validation
export { EmailValidationServicePersona } from './email-validation.persona.js';

// Document & AI
export { AIDocumentVerificationServicePersona } from './document-verification-ai.persona.js';

// Core Banking & Platforms
export { CoreBankingPlatformPersona, MobileAppBackendServicePersona } from './core-banking.persona.js';

// Audit & Fraud
export { AuditLogSystemPersona, AIFraudDetectionSystemPersona } from './audit-fraud.persona.js';

// Payment & Cards
export { VirtualCardIssuanceSystemPersona, PaymentGatewayServicePersona } from './payment-card.persona.js';
