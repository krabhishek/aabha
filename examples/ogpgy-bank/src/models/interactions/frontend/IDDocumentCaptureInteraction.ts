import { Interaction, InteractionPattern, InteractionLayer } from 'aabha';
import { DigitalCustomerStakeholder } from '../../stakeholders/human/DigitalCustomerStakeholder.js';

/**
 * ID Document Capture Interaction
 * Frontend interaction for capturing government ID document using device camera
 */
@Interaction({
  name: 'ID Document Capture',
  description: 'Customer captures photo of government-issued ID document (passport, driver license, national ID) using device camera for identity verification',
  pattern: InteractionPattern.UserGesture,
  layer: InteractionLayer.Frontend,
  inputs: [
    {
      name: 'cameraPermission',
      type: 'boolean',
      required: true,
      description: 'User permission to access device camera'
    },
    {
      name: 'documentType',
      type: 'string',
      required: true,
      description: 'Type of document being captured (passport, driver-license, national-id)',
      validation: {
        constraints: ['Must be one of: passport, driver-license, national-id']
      }
    }
  ],
  outputs: [
    {
      name: 'capturedImage',
      type: 'object',
      required: true,
      description: 'Captured image data of the ID document',
      sensitivity: 'restricted',
      validation: {
        format: 'image',
        constraints: ['Image must be clear and readable', 'Minimum resolution: 1920x1080']
      }
    },
    {
      name: 'captureMetadata',
      type: 'object',
      required: true,
      description: 'Metadata about the capture including timestamp, device info, image quality'
    }
  ],
  frontendConfig: {
    framework: 'react-native',
    gestureTypes: ['tap', 'long-press'],
    accessibility: {
      ariaLabels: {
        capture: 'Capture ID document photo',
        retake: 'Retake photo if not clear'
      },
      keyboardNavigation: false,
      screenReaderSupport: true
    }
  },
  deviceConfig: {
    requiredCapabilities: ['camera'],
    sensorDetails: {
      sensorType: 'camera',
      accuracy: 'high',
      resolution: '1920x1080 minimum'
    },
    platformRequirements: {
      minimumOS: 'iOS 13.0 / Android 10.0',
      permissions: ['CAMERA'],
      platforms: ['ios', 'android']
    },
    powerConsideration: {
      batteryImpact: 'low',
      backgroundExecution: false
    }
  },
  participants: [
    {
      stakeholder: DigitalCustomerStakeholder,
      role: 'initiator',
      required: true
    }
  ],
  tags: ['frontend', 'camera', 'document-capture', 'kyc', 'identity-verification']
})
export class IDDocumentCaptureInteraction {}

