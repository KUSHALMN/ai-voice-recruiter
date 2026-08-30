'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { Upload, FileText, CheckCircle, AlertTriangle, X } from 'lucide-react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

interface ResumeUploadProps {
  interviewId: string
  onUploadComplete: (url: string) => void
}

export default function ResumeUpload({ interviewId, onUploadComplete }: ResumeUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const validateFile = (selectedFile: File): boolean => {
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Only PDF files are allowed.')
      setStatus('error')
      return false
    }

    const maxBytes = 5 * 1024 * 1024 // 5MB
    if (selectedFile.size > maxBytes) {
      setErrorMsg('File size exceeds the 5MB limit.')
      setStatus('error')
      return false
    }

    setErrorMsg('')
    return true
  }

  const uploadFile = async (targetFile: File) => {
    setStatus('uploading')
    setProgress(0)

    const formData = new FormData()
    formData.append('file', targetFile)
    formData.append('interviewId', interviewId)

    try {
      const response = await axios.post('/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || targetFile.size
          const current = progressEvent.loaded
          const percentCompleted = Math.round((current * 100) / total)
          setProgress(percentCompleted)
        },
      })

      if (response.data?.url) {
        setStatus('success')
        onUploadComplete(response.data.url)
      } else {
        throw new Error('No url returned from server.')
      }
    } catch (err: any) {
      console.error('Upload component error:', err)
      const msg = err.response?.data?.error || err.message || 'Upload failed'
      setErrorMsg(msg)
      setStatus('error')
    }
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (validateFile(droppedFile)) {
        setFile(droppedFile)
        uploadFile(droppedFile)
      }
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (validateFile(selectedFile)) {
        setFile(selectedFile)
        uploadFile(selectedFile)
      }
    }
  }

  const onButtonClick = () => {
    inputRef.current?.click()
  }

  const resetUpload = () => {
    setFile(null)
    setProgress(0)
    setStatus('idle')
    setErrorMsg('')
  }

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,application/pdf"
        onChange={handleChange}
      />

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={status === 'idle' ? onButtonClick : undefined}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
            : 'border-slate-300 hover:border-indigo-400 bg-slate-50/30'
        } ${status === 'idle' ? 'cursor-pointer' : ''}`}
      >
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto text-indigo-600">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-700 font-semibold text-base">
                  Drag and drop candidate's resume here, or <span className="text-indigo-600 hover:underline">browse</span>
                </p>
                <p className="text-slate-400 text-xs mt-1">Supports PDF up to 5MB</p>
              </div>
            </motion.div>
          )}

          {status === 'uploading' && file && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mx-auto text-indigo-600">
                <FileText className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left max-w-sm mx-auto">
                <div className="flex justify-between items-center text-sm font-semibold text-slate-700 mb-1">
                  <span className="truncate pr-4">{file.name}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">Uploading resume...</p>
              </div>
            </motion.div>
          )}

          {status === 'success' && file && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-emerald-700 font-semibold text-base">Resume uploaded successfully!</p>
                <p className="text-slate-700 text-sm mt-1">{file.name} ({formatSize(file.size)})</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  resetUpload()
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Remove file
              </button>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-red-700 font-semibold text-base">Failed to upload resume</p>
                <p className="text-slate-600 text-sm mt-1">{errorMsg}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  resetUpload()
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
