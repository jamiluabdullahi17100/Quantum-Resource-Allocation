;; Quantum Computing Marketplace Contract

(define-map listings
  { listing-id: uint }
  {
    seller: principal,
    quantum-time-units: uint,
    price-per-unit: uint,
    hardware-provider: (string-ascii 50)
  }
)

(define-data-var listing-nonce uint u0)

(define-public (create-listing (quantum-time-units uint) (price-per-unit uint) (hardware-provider (string-ascii 50)))
  (let
    (
      (listing-id (+ (var-get listing-nonce) u1))
    )
    (try! (contract-call? .quantum-time-token transfer quantum-time-units tx-sender (as-contract tx-sender)))
    (map-set listings { listing-id: listing-id }
      {
        seller: tx-sender,
        quantum-time-units: quantum-time-units,
        price-per-unit: price-per-unit,
        hardware-provider: hardware-provider
      }
    )
    (var-set listing-nonce listing-id)
    (ok listing-id)
  )
)

(define-public (buy-listing (listing-id uint) (units-to-buy uint))
  (let
    (
      (listing (unwrap! (map-get? listings { listing-id: listing-id }) (err u404)))
      (total-cost (* (get price-per-unit listing) units-to-buy))
    )
    (asserts! (<= units-to-buy (get quantum-time-units listing)) (err u400))
    (try! (stx-transfer? total-cost tx-sender (get seller listing)))
    (try! (as-contract (contract-call? .quantum-time-token transfer units-to-buy (as-contract tx-sender) tx-sender)))
    (if (is-eq units-to-buy (get quantum-time-units listing))
      (map-delete listings { listing-id: listing-id })
      (map-set listings { listing-id: listing-id }
        (merge listing { quantum-time-units: (- (get quantum-time-units listing) units-to-buy) }))
    )
    (ok true)
  )
)

(define-read-only (get-listing (listing-id uint))
  (map-get? listings { listing-id: listing-id })
)

