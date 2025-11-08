/**
 * Interaction Models
 * Technical contracts for how stakeholders exchange data across architectural layers
 */

// Frontend interactions
export { AccountOpeningFormInteraction } from './frontend/AccountOpeningFormInteraction.js';
export { IDDocumentCaptureInteraction } from './frontend/IDDocumentCaptureInteraction.js';

// Device interactions
export { BiometricVerificationInteraction } from './device/BiometricVerificationInteraction.js';

// Backend interactions
export { SubmitAccountApplicationAPIInteraction } from './backend/SubmitAccountApplicationAPIInteraction.js';
export { ProcessAccountApplicationInteraction } from './backend/ProcessAccountApplicationInteraction.js';
export { ActivateAccountAPIInteraction } from './backend/ActivateAccountAPIInteraction.js';

// External interactions
export { KYCVerificationServiceInteraction } from './external/KYCVerificationServiceInteraction.js';

// Data interactions
export { StoreAccountApplicationInteraction } from './data/StoreAccountApplicationInteraction.js';
export { UpdateAccountStatusInteraction } from './data/UpdateAccountStatusInteraction.js';
export { QueryAccountApplicationInteraction } from './data/QueryAccountApplicationInteraction.js';

