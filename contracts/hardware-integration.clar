;; Quantum Hardware Integration Contract

(define-map hardware-providers
  { provider-id: (string-ascii 50) }
  {
    name: (string-ascii 100),
    api-endpoint: (string-ascii 256),
    supported-operations: (list 10 (string-ascii 50))
  }
)

(define-public (register-hardware-provider (provider-id (string-ascii 50)) (name (string-ascii 100)) (api-endpoint (string-ascii 256)) (supported-operations (list 10 (string-ascii 50))))
  (ok (map-set hardware-providers { provider-id: provider-id }
    {
      name: name,
      api-endpoint: api-endpoint,
      supported-operations: supported-operations
    }))
)

(define-public (update-hardware-provider (provider-id (string-ascii 50)) (name (string-ascii 100)) (api-endpoint (string-ascii 256)) (supported-operations (list 10 (string-ascii 50))))
  (begin
    (asserts! (is-some (map-get? hardware-providers { provider-id: provider-id })) (err u404))
    (ok (map-set hardware-providers { provider-id: provider-id }
      {
        name: name,
        api-endpoint: api-endpoint,
        supported-operations: supported-operations
      }))
  )
)

(define-read-only (get-hardware-provider (provider-id (string-ascii 50)))
  (map-get? hardware-providers { provider-id: provider-id })
)

(define-read-only (list-hardware-providers)
  (ok true)
)
