;; Quantum Computing Time Token Contract

(define-fungible-token quantum-time-unit)

(define-data-var token-uri (string-utf8 256) u"https://example.com/metadata/quantum-time-unit")

(define-public (mint (amount uint) (recipient principal))
  (ft-mint? quantum-time-unit amount recipient)
)

(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) (err u403))
    (ft-transfer? quantum-time-unit amount sender recipient)
  )
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance quantum-time-unit account))
)

(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

(define-public (set-token-uri (new-uri (string-utf8 256)))
  (ok (var-set token-uri new-uri))
)

