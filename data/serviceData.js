export const reservationServices = [
    { 
      id: '1',
      title: "Approval of building plans", 
      description: "",
      details: {
        processingTime: '7-14 days',
        requiredDocuments: [
          'Architectural plans',
          'Land ownership documents',
          'Site plan'
        ],
        fees: 'LKR 5,000 - 10,000',
        additionalInfo: 'Plans must comply with local building regulations'
      },
      onPress: () => {} 
    },
    { 
      id: '2',
      title: "Approving land subdivision and amalgamation development plans", 
      description: "", 
      details: {
        processingTime: '14-30 days',
        requiredDocuments: [
          'Subdivision layout',
          'Land survey report',
          'Ownership certificates'
        ],
        fees: 'LKR 15,000 - 25,000',
        additionalInfo: 'Must follow local urban planning guidelines'
      },
      onPress: () => {} 
    },
    { 
      id: '3',
      title: "Issuance of Certificate of Conformity", 
      description: "", 
      details: {
        processingTime: '5-10 days',
        requiredDocuments: [
          'Completed application form',
          'Proof of compliance',
          'Site inspection report'
        ],
        fees: 'LKR 3,000 - 7,000',
        additionalInfo: 'Required for certain development projects'
      },
      onPress: () => {} 
    },
    { 
      id: '5',
      title: "Obtaining a trade license", 
      description: "", 
      details: {
        processingTime: '7-14 days',
        requiredDocuments: [
          'Business registration',
          'Tax identification number',
          'Proof of business location'
        ],
        fees: 'LKR 5,000 - 15,000',
        additionalInfo: 'Varies based on business type and size'
      },
      onPress: () => {} 
    },
    { 
      id: '6',
      title: "Obtaining an Environmental Compliance Certificate", 
      description: "", 
      details: {
        processingTime: '21-45 days',
        requiredDocuments: [
          'Environmental impact assessment',
          'Project proposal',
          'Site environmental survey'
        ],
        fees: 'LKR 20,000 - 50,000',
        additionalInfo: 'Comprehensive review required for environmental protection'
      },
      onPress: () => {} 
    }
  ];