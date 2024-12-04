export const reservationServices = [
    { 
      id: '1',
      title: "Approval of building plans", 
      description: "",
      details: {
        processingTime: '14 -21 days',
        requiredDocuments: [
          'Architectural plans',
          'Land ownership documents',
          'National ID card',

        ],
        fees: 'LKR 750.00',
        additionalInfo: 'Plans must comply with local building regulations'
      },
      onPress: () => {} 
    },
    { 
      id: '2',
      title: "Approving land subdivision and amalgamation development plans", 
      description: "", 
      details: {
        processingTime: '14-21 days',
        requiredDocuments: [
          'Request letter',
          'Land survey report',
          'Ownership certificates',
          'A copy of National Id Card'
        ],
        fees: 'LKR 750.00 ',
        additionalInfo: 'Must follow local urban planning guidelines'
      },
      onPress: () => {} 
    },
    { 
      id: '3',
      title: "Issuance of Certificate of Conformity", 
      description: "", 
      details: {
        processingTime: '14-20 days',
        requiredDocuments: [
          'Completed application form',
          'Request letter',
          'Copy of building plan'
        ],
        fees: 'LKR 2,000.00',
        additionalInfo: 'Proof of compliance'
      },
      onPress: () => {} 
    },
    { 
      id: '5',
      title: "Obtaining a trade license", 
      description: "", 
      details: {
        processingTime: '7-21 days',
        requiredDocuments: [
          'Completed application form',
          'Business registration',
          'Tax identification number',
          
        ],
        fees: 'LKR 3,000.00 ',
        additionalInfo: 'Varies based on business type and size'
      },
      onPress: () => {} 
    },
    { 
      id: '6',
      title: "Obtaining an Environmental Compliance Certificate", 
      description: "", 
      details: {
        processingTime: '14-24 days',
        requiredDocuments: [
          'Environmental impact assessment',
          'Project proposal',
          'Site environmental survey',
          'Trade license'
        ],
        fees: 'LKR 3100.00',
        additionalInfo: 'Road map from the nearest city to reach the industrial site'
      },
      onPress: () => {} 
    }
  ];