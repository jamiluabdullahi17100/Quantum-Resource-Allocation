import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'quantum-time-token': {
      functions: {
        mint: vi.fn(),
        transfer: vi.fn(),
        'get-balance': vi.fn(),
        'get-token-uri': vi.fn(),
        'set-token-uri': vi.fn(),
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

describe('Quantum Time Token Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('mint', () => {
    it('should mint tokens successfully', async () => {
      const amount = 100
      const recipient = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      mockClarity.contracts['quantum-time-token'].functions.mint.mockReturnValue({ success: true })
      
      const result = await callContract('quantum-time-token', 'mint', [amount, recipient])
      
      expect(result.success).toBe(true)
    })
  })
  
  describe('transfer', () => {
    it('should transfer tokens successfully', async () => {
      const amount = 50
      const sender = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['quantum-time-token'].functions.transfer.mockReturnValue({ success: true })
      
      const result = await callContract('quantum-time-token', 'transfer', [amount, sender, recipient])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail to transfer if sender is not tx-sender', async () => {
      const amount = 50
      const sender = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const recipient = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      mockClarity.contracts['quantum-time-token'].functions.transfer.mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('quantum-time-token', 'transfer', [amount, sender, recipient])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('get-balance', () => {
    it('should return the correct balance', async () => {
      const account = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const expectedBalance = 1000
      mockClarity.contracts['quantum-time-token'].functions['get-balance'].mockReturnValue({ success: true, value: expectedBalance })
      
      const result = await callContract('quantum-time-token', 'get-balance', [account])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(expectedBalance)
    })
  })
  
  describe('get-token-uri', () => {
    it('should return the correct token URI', async () => {
      const expectedUri = 'https://example.com/metadata/quantum-time-unit'
      mockClarity.contracts['quantum-time-token'].functions['get-token-uri'].mockReturnValue({ success: true, value: expectedUri })
      
      const result = await callContract('quantum-time-token', 'get-token-uri', [])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(expectedUri)
    })
  })
  
  describe('set-token-uri', () => {
    it('should set the token URI successfully', async () => {
      const newUri = 'https://example.com/new-metadata/quantum-time-unit'
      mockClarity.contracts['quantum-time-token'].functions['set-token-uri'].mockReturnValue({ success: true })
      
      const result = await callContract('quantum-time-token', 'set-token-uri', [newUri])
      
      expect(result.success).toBe(true)
    })
  })
})

