import { Interaction, InteractionPattern, InteractionLayer } from 'aabha';
import { DigitalCustomerStakeholder } from '../../stakeholders/human/DigitalCustomerStakeholder.js';

/**
 * Biometric Verification Interaction
 * Device-level interaction for biometric authentication (fingerprint, face ID)
 */
@Interaction({
  name: 'Biometric Verification',
  description: 'Customer verifies identity using device biometric authentication (fingerprint or face recognition) as part of account opening process',
  pattern: InteractionPattern.SensorRead,
  layer: InteractionLayer.Device,
  inputs: [
    {
      name: 'biometricType',
      type: 'string',
      required: true,
      description: 'Type of biometric to use (fingerprint, face-id)',
      validation: {
        constraints: ['Must be one of: fingerprint, face-id']
      }
    },
    {
      name: 'biometricPermission',
      type: 'boolean',
      required: true,
      description: 'User permission to use biometric authentication'
    }
  ],
  outputs: [
    {
      name: 'verificationResult',
      type: 'object',
      required: true,
      description: 'Result of biometric verification including success status and confidence score',
      validation: {
        format: 'json'
      },
      sensitivity: 'confidential'
    },
    {
      name: 'biometricTemplate',
      type: 'string',
      required: false,
      description: 'Encrypted biometric template for future verification (stored securely)',
      sensitivity: 'restricted',
      validation: {
        format: 'encrypted',
        constraints: ['Must be encrypted before storage']
      }
    }
  ],
  deviceConfig: {
    requiredCapabilities: ['biometric'],
    sensorDetails: {
      sensorType: 'fingerprint',
      accuracy: 'high',
      samplingRate: 1
    },
    platformRequirements: {
      minimumOS: 'iOS 13.0 / Android 10.0',
      permissions: ['USE_BIOMETRIC'],
      platforms: ['ios', 'android']
    },
    storageDetails: {
      storageType: 'keychain',
      encrypted: true,
      backup: false
    },
    powerConsideration: {
      batteryImpact: 'low',
      backgroundExecution: false
    }
  },
  security: {
    authentication: 'biometric',
    encryptionAtRest: {
      required: true,
      algorithm: 'AES-256',
      keyManagement: 'device-keychain'
    },
    compliance: ['GDPR', 'PCI-DSS']
  },
  participants: [
    {
      stakeholder: DigitalCustomerStakeholder,
      role: 'initiator',
      required: true
    }
  ],
  tags: ['device', 'biometric', 'security', 'authentication', 'identity-verification']
})
export class BiometricVerificationInteraction {}

