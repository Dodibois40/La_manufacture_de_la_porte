// 🎯 Types TypeScript - La Manufacture de la Porte Backend

import { Request } from 'express'
import { UserRole, ProjectStatus } from '@prisma/client'

// 👤 Types Utilisateur
export interface UserPayload {
  id: number
  email: string
  role: UserRole
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload
}

// 🔐 Types Authentification
export interface RegisterRequest {
  email: string
  password: string
  displayName: string
  role?: UserRole
  company?: string
  phone?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: number
    email: string
    displayName: string
    role: UserRole
    company?: string
  }
  token: string
  expiresIn: string
}

// ⚙️ Types Configuration
export interface ConfigurationRequest {
  name: string
  description?: string
  svgOriginal?: string
  svgModified: string
  parameters: Record<string, any>
  tags?: string[]
}

export interface ConfigurationResponse {
  id: number
  name: string
  description?: string
  parameters: Record<string, any>
  tags: string[]
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
  isTemplate: boolean
}

// 🏢 Types Projet
export interface ProjectRequest {
  clientName: string
  clientEmail?: string
  clientPhone?: string
  clientAddress?: string
  projectName: string
  description?: string
}

export interface ProjectResponse {
  id: number
  projectName: string
  clientName: string
  status: ProjectStatus
  quotedPrice?: number
  createdAt: Date
  deadline?: Date
  configurationsCount: number
}

// 📊 Types Analytics
export interface ActivityLogData {
  action: string
  resourceType?: string
  resourceId?: number
  details?: Record<string, any>
}

// 🔧 Types Utilitaires
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// 🚨 Types d'Erreur
export interface ApiError {
  message: string
  code: string
  statusCode: number
  details?: any
}

// 📧 Types Email
export interface EmailTemplate {
  to: string
  subject: string
  template: string
  data: Record<string, any>
}

// 🔍 Types de Recherche
export interface SearchFilters {
  search?: string
  tags?: string[]
  isPublic?: boolean
  isTemplate?: boolean
  userId?: number
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ProjectFilters {
  status?: ProjectStatus
  clientName?: string
  partnerId?: number
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
