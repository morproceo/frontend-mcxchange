import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Upload,
  CheckCircle,
  Circle,
  AlertTriangle,
  Info,
  Loader2,
  X,
  File
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

interface RequiredDoc {
  id: string
  label: string
  description: string
  required: boolean
}

const REQUIRED_DOCUMENTS: RequiredDoc[] = [
  {
    id: 'articles-of-incorporation',
    label: 'Articles of Incorporation',
    description: 'Official formation document filed with the state',
    required: true,
  },
  {
    id: 'mc-certificate',
    label: 'MC Certificate',
    description: 'Motor Carrier operating authority certificate from FMCSA',
    required: true,
  },
  {
    id: 'ein-letter',
    label: 'EIN Letter',
    description: 'IRS Employer Identification Number confirmation letter',
    required: true,
  },
  {
    id: 'insurance-certificate',
    label: 'Insurance Certificate',
    description: 'Current certificate of liability insurance (BIPD, cargo, etc.)',
    required: true,
  },
  {
    id: 'loss-runs',
    label: 'Loss Runs',
    description: 'Insurance loss history report from your carrier',
    required: true,
  },
  {
    id: 'factoring-lor',
    label: 'Letter of Release (LOR) from Factoring',
    description: 'If you have a factoring company, provide the letter of release. Not required if no factoring agreement is in place.',
    required: false,
  },
]

interface UploadedFile {
  id: string
  docType: string
  fileName: string
  fileSize: string
  uploadedAt: string
  status: 'uploading' | 'uploaded' | 'error'
}

const SellerDocumentsPage = () => {
  const { user } = useAuth()
  const [uploads, setUploads] = useState<UploadedFile[]>([])
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeUploadDocType, setActiveUploadDocType] = useState<string | null>(null)

  // Load existing documents on mount
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const res = await api.getSellerDocuments()
        if (res.success && res.data) {
          // Map backend type to frontend docType
          const reverseTypeMap: Record<string, string> = {
            'ARTICLES_OF_INCORPORATION': 'articles-of-incorporation',
            'AUTHORITY': 'mc-certificate',
            'EIN_LETTER': 'ein-letter',
            'INSURANCE': 'insurance-certificate',
            'LOSS_RUNS': 'loss-runs',
            'LETTER_OF_RELEASE': 'factoring-lor',
          }
          const loaded: UploadedFile[] = res.data.map((doc: any) => ({
            id: doc.id,
            docType: reverseTypeMap[doc.type] || 'other',
            fileName: doc.name,
            fileSize: doc.size < 1024 * 1024
              ? `${(doc.size / 1024).toFixed(0)} KB`
              : `${(doc.size / (1024 * 1024)).toFixed(1)} MB`,
            uploadedAt: doc.createdAt,
            status: 'uploaded' as const,
          }))
          setUploads(loaded)
        }
      } catch {
        // ignore load errors
      }
    }
    loadDocuments()
  }, [])

  const handleUploadClick = (docType: string) => {
    setActiveUploadDocType(docType)
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !activeUploadDocType) return

    const docType = activeUploadDocType
    setActiveUploadDocType(null)
    e.target.value = ''

    const tempId = `${docType}-${Date.now()}`
    const fileSize = file.size < 1024 * 1024
      ? `${(file.size / 1024).toFixed(0)} KB`
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`

    setUploads(prev => [...prev, {
      id: tempId,
      docType,
      fileName: file.name,
      fileSize,
      uploadedAt: new Date().toISOString(),
      status: 'uploading',
    }])
    setUploadingId(tempId)

    // Map frontend doc types to backend enum
    const typeMap: Record<string, string> = {
      'articles-of-incorporation': 'ARTICLES_OF_INCORPORATION',
      'mc-certificate': 'AUTHORITY',
      'ein-letter': 'EIN_LETTER',
      'insurance-certificate': 'INSURANCE',
      'loss-runs': 'LOSS_RUNS',
      'factoring-lor': 'LETTER_OF_RELEASE',
    }

    try {
      await api.uploadSellerDocument(file, typeMap[docType] || 'OTHER')
      setUploads(prev => prev.map(u =>
        u.id === tempId ? { ...u, status: 'uploaded' } : u
      ))
    } catch (err: any) {
      console.error('Document upload failed:', err)
      setUploads(prev => prev.map(u =>
        u.id === tempId ? { ...u, status: 'error' } : u
      ))
    } finally {
      setUploadingId(null)
    }
  }

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id))
  }

  const getUploadsForDoc = (docType: string) =>
    uploads.filter(u => u.docType === docType)

  const uploadedDocTypes = new Set(
    uploads.filter(u => u.status === 'uploaded').map(u => u.docType)
  )

  const requiredCount = REQUIRED_DOCUMENTS.filter(d => d.required).length
  const completedCount = REQUIRED_DOCUMENTS.filter(d => d.required && uploadedDocTypes.has(d.id)).length

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
        <p className="text-gray-500 text-sm">These documents will be needed to complete the sale of your company. You don't need to upload them now — only once you accept an offer from a buyer.</p>
      </div>

      {/* Progress */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900">Upload Progress</h3>
          <span className="text-sm font-medium text-gray-500">{completedCount} / {requiredCount} required</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary-600 rounded-full transition-all duration-500"
            style={{ width: `${requiredCount > 0 ? (completedCount / requiredCount) * 100 : 0}%` }}
          />
        </div>
        {completedCount === requiredCount && requiredCount > 0 && (
          <p className="text-sm text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> All required documents uploaded
          </p>
        )}
      </Card>

      {/* Required Documents */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Required Documents</h3>
        <div className="space-y-3">
          {REQUIRED_DOCUMENTS.filter(d => d.required).map((doc, index) => {
            const docUploads = getUploadsForDoc(doc.id)
            const isUploaded = uploadedDocTypes.has(doc.id)

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`mt-0.5 flex-shrink-0 ${isUploaded ? 'text-emerald-500' : 'text-gray-300'}`}>
                        {isUploaded ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900">{doc.label}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{doc.description}</p>

                        {/* Uploaded files for this doc */}
                        {docUploads.map(upload => (
                          <div key={upload.id} className="mt-2 flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                            <File className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-xs text-gray-700 flex-1 truncate">{upload.fileName}</span>
                            <span className="text-xs text-gray-400">{upload.fileSize}</span>
                            {upload.status === 'uploading' ? (
                              <Loader2 className="w-4 h-4 text-secondary-500 animate-spin" />
                            ) : (
                              <button onClick={() => removeUpload(upload.id)} className="text-gray-400 hover:text-red-500">
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={isUploaded ? 'outline' : 'primary'}
                      onClick={() => handleUploadClick(doc.id)}
                      disabled={uploadingId === doc.id}
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      {isUploaded ? 'Replace' : 'Upload'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Optional Documents */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Optional Documents</h3>
        <div className="space-y-3">
          {REQUIRED_DOCUMENTS.filter(d => !d.required).map((doc, index) => {
            const docUploads = getUploadsForDoc(doc.id)
            const isUploaded = uploadedDocTypes.has(doc.id)

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`mt-0.5 flex-shrink-0 ${isUploaded ? 'text-emerald-500' : 'text-gray-300'}`}>
                        {isUploaded ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {doc.label}
                          <span className="ml-2 text-xs font-normal text-gray-400">Optional</span>
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">{doc.description}</p>

                        {docUploads.map(upload => (
                          <div key={upload.id} className="mt-2 flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                            <File className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-xs text-gray-700 flex-1 truncate">{upload.fileName}</span>
                            <span className="text-xs text-gray-400">{upload.fileSize}</span>
                            {upload.status === 'uploading' ? (
                              <Loader2 className="w-4 h-4 text-secondary-500 animate-spin" />
                            ) : (
                              <button onClick={() => removeUpload(upload.id)} className="text-gray-400 hover:text-red-500">
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUploadClick(doc.id)}
                      disabled={uploadingId === doc.id}
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      {isUploaded ? 'Replace' : 'Upload'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Buyer-specific notice */}
      <Card>
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Additional Information May Be Required</h4>
            <p className="text-xs text-gray-500 mt-1">
              Buyers may request additional company information or documents during the due diligence process.
              This can include financial statements, tax returns, driver rosters, equipment lists, or other records
              specific to their requirements. You will be notified through your dashboard messages if a buyer needs anything else.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default SellerDocumentsPage
