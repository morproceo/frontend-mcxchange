export interface RequiredDocument {
  id: string
  label: string
  description: string
  required: boolean
}

// IDs match backend DocumentType enum values
export const REQUIRED_DOCUMENTS: RequiredDocument[] = [
  {
    id: 'ARTICLES_OF_INCORPORATION',
    label: 'Articles of Incorporation',
    description: 'Official formation document filed with the state',
    required: true,
  },
  {
    id: 'AUTHORITY',
    label: 'MC Certificate',
    description: 'Motor Carrier operating authority certificate from FMCSA',
    required: true,
  },
  {
    id: 'EIN_LETTER',
    label: 'EIN Letter',
    description: 'IRS Employer Identification Number confirmation letter',
    required: true,
  },
  {
    id: 'INSURANCE',
    label: 'Insurance Certificate',
    description: 'Current certificate of liability insurance (BIPD, cargo, etc.)',
    required: true,
  },
  {
    id: 'LOSS_RUNS',
    label: 'Loss Runs',
    description: 'Insurance loss history report from your carrier',
    required: true,
  },
  {
    id: 'LETTER_OF_RELEASE',
    label: 'Letter of Release (LOR) from Factoring',
    description: 'If you have a factoring company, provide the letter of release. Not required if no factoring agreement is in place.',
    required: false,
  },
]
