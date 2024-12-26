import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'hardware-integration': {
      functions: {
        'register-hardware-provider': vi.fn(),
        'update-hardware-provider': vi.fn(),
        'get-hardware-provider': vi.fn(),
        'list-hardware-providers': vi.fn(),
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

describe('Hardware Integration Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('register-hardware-provider', () => {
    it('should register a hardware provider successfully', async () => {
      const providerId = 'provider1'
      const name = 'Quantum Provider 1'
      const apiEndpoint = 'https://api.quantumprovider1.com'
      const supportedOperations = ['op1', 'op2', 'op3']
      mockClarity.contracts['hardware-integration'].functions['register-hardware-provider'].mockReturnValue({ success: true })
      
      const result = await callContract('hardware-integration', 'register-hardware-provider', [providerId, name, apiEndpoint, supportedOperations])
      
      expect(result.success).toBe(true)
    })
  })
  
  describe('update-hardware-provider', () => {
    it('should update a hardware provider successfully', async () => {
      const providerId = 'provider1'
      const name = 'Updated Quantum Provider 1'
      const apiEndpoint = 'https://api-v2.quantumprovider1.com'
      const supportedOperations = ['op1', 'op2', 'op3', 'op4']
      mockClarity.contracts['hardware-integration'].functions['update-hardware-provider'].mockReturnValue({ success: true })
      
      const result = await callContract('hardware-integration', 'update-hardware-provider', [providerId, name, apiEndpoint, supportedOperations])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail to update a non-existent hardware provider', async () => {
      const providerId = 'non-existent-provider'
      const name = 'Non-existent Provider'
      const apiEndpoint = 'https://api.non-existent.com'
      const supportedOperations = ['op1']
      mockClarity.contracts['hardware-integration'].functions['update-hardware-provider'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('hardware-integration', 'update-hardware-provider', [providerId, name, apiEndpoint, supportedOperations])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
  
  describe('get-hardware-provider', () => {
    it('should return hardware provider details successfully', async () => {
      const providerId = 'provider1'
      const providerDetails = {
        name: 'Quantum Provider 1',
        api_endpoint: 'https://api.quantumprovider1.com',
        supported_operations: ['op1', 'op2', 'op3']
      }
      mockClarity.contracts['hardware-integration'].functions['get-hardware-provider'].mockReturnValue(providerDetails)
      
      const result = await callContract('hardware-integration', 'get-hardware-provider', [providerId])
      
      expect(result).toEqual(providerDetails)
    })
    
    it('should return null for non-existent hardware provider', async () => {
      const providerId = 'non-existent-provider'
      mockClarity.contracts['hardware-integration'].functions['get-hardware-provider'].mockReturnValue(null)
      
      const result = await callContract('hardware-integration', 'get-hardware-provider', [providerId])
      
      expect(result).toBeNull()
    })
  })
  
  describe('list-hardware-providers', () => {
    it('should return true', async () => {
      mockClarity.contracts['hardware-integration'].functions['list-hardware-providers'].mockReturnValue({ success: true })
      
      const result = await callContract('hardware-integration', 'list-hardware-providers', [])
      
      expect(result.success).toBe(true)
    })
  })
})

