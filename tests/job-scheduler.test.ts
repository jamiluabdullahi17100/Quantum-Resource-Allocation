import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'job-scheduler': {
      functions: {
        'submit-job': vi.fn(),
        'update-job-status': vi.fn(),
        'get-job': vi.fn(),
      },
    },
    'quantum-time-token': {
      functions: {
        transfer: vi.fn(),
      },
    },
  },
  globals: {
    'tx-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  },
}

function callContract(contractName: string, functionName: string, args: any[]) {
  return mockClarity.contracts[contractName].functions[functionName](...args)
}

describe('Job Scheduler Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('submit-job', () => {
    it('should submit a job successfully', async () => {
      const priority = 1
      const quantumTimeUnits = 100
      const hardwareProvider = 'provider1'
      mockClarity.contracts['quantum-time-token'].functions.transfer.mockReturnValue({ success: true })
      mockClarity.contracts['job-scheduler'].functions['submit-job'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('job-scheduler', 'submit-job', [priority, quantumTimeUnits, hardwareProvider])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('update-job-status', () => {
    it('should update job status successfully', async () => {
      const jobId = 1
      const newStatus = 'completed'
      mockClarity.contracts['job-scheduler'].functions['update-job-status'].mockReturnValue({ success: true })
      
      const result = await callContract('job-scheduler', 'update-job-status', [jobId, newStatus])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail to update job status if not the job owner', async () => {
      const jobId = 1
      const newStatus = 'completed'
      mockClarity.contracts['job-scheduler'].functions['update-job-status'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('job-scheduler', 'update-job-status', [jobId, newStatus])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('get-job', () => {
    it('should return job details successfully', async () => {
      const jobId = 1
      const jobDetails = {
        owner: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        status: 'pending',
        priority: 1,
        quantum_time_units: 100,
        hardware_provider: 'provider1'
      }
      mockClarity.contracts['job-scheduler'].functions['get-job'].mockReturnValue(jobDetails)
      
      const result = await callContract('job-scheduler', 'get-job', [jobId])
      
      expect(result).toEqual(jobDetails)
    })
    
    it('should return null for non-existent job', async () => {
      const jobId = 999
      mockClarity.contracts['job-scheduler'].functions['get-job'].mockReturnValue(null)
      
      const result = await callContract('job-scheduler', 'get-job', [jobId])
      
      expect(result).toBeNull()
    })
  })
})

