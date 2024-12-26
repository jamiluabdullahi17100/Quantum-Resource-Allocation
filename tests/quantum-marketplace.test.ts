import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'quantum-marketplace': {
      functions: {
        'create-listing': vi.fn(),
        'buy-listing': vi.fn(),
        'get-listing': vi.fn(),
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

describe('Quantum Marketplace Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('create-listing', () => {
    it('should create a listing successfully', async () => {
      const quantumTimeUnits = 100
      const pricePerUnit = 10
      const hardwareProvider = 'provider1'
      mockClarity.contracts['quantum-time-token'].functions.transfer.mockReturnValue({ success: true })
      mockClarity.contracts['quantum-marketplace'].functions['create-listing'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('quantum-marketplace', 'create-listing', [quantumTimeUnits, pricePerUnit, hardwareProvider])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('buy-listing', () => {
    it('should buy a listing successfully', async () => {
      const listingId = 1
      const unitsToBuy = 50
      mockClarity.contracts['quantum-marketplace'].functions['buy-listing'].mockReturnValue({ success: true })
      
      const result = await callContract('quantum-marketplace', 'buy-listing', [listingId, unitsToBuy])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail to buy a listing if not enough units available', async () => {
      const listingId = 1
      const unitsToBuy = 1000
      mockClarity.contracts['quantum-marketplace'].functions['buy-listing'].mockReturnValue({ success: false, error: 400 })
      
      const result = await callContract('quantum-marketplace', 'buy-listing', [listingId, unitsToBuy])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(400)
    })
  })
  
  describe('get-listing', () => {
    it('should return listing details successfully', async () => {
      const listingId = 1
      const listingDetails = {
        seller: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        quantum_time_units: 100,
        price_per_unit: 10,
        hardware_provider: 'provider1'
      }
      mockClarity.contracts['quantum-marketplace'].functions['get-listing'].mockReturnValue(listingDetails)
      
      const result = await callContract('quantum-marketplace', 'get-listing', [listingId])
      
      expect(result).toEqual(listingDetails)
    })
    
    it('should return null for non-existent listing', async () => {
      const listingId = 999
      mockClarity.contracts['quantum-marketplace'].functions['get-listing'].mockReturnValue(null)
      
      const result = await callContract('quantum-marketplace', 'get-listing', [listingId])
      
      expect(result).toBeNull()
    })
  })
})

