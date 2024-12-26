;; Job Scheduler Contract

(define-map jobs
  { job-id: uint }
  {
    owner: principal,
    status: (string-ascii 20),
    priority: uint,
    quantum-time-units: uint,
    hardware-provider: (string-ascii 50)
  }
)

(define-data-var job-nonce uint u0)

(define-public (submit-job (priority uint) (quantum-time-units uint) (hardware-provider (string-ascii 50)))
  (let
    (
      (job-id (+ (var-get job-nonce) u1))
    )
    (try! (contract-call? .quantum-time-token transfer quantum-time-units tx-sender (as-contract tx-sender)))
    (map-set jobs { job-id: job-id }
      {
        owner: tx-sender,
        status: "pending",
        priority: priority,
        quantum-time-units: quantum-time-units,
        hardware-provider: hardware-provider
      }
    )
    (var-set job-nonce job-id)
    (ok job-id)
  )
)

(define-public (update-job-status (job-id uint) (new-status (string-ascii 20)))
  (let
    (
      (job (unwrap! (map-get? jobs { job-id: job-id }) (err u404)))
    )
    (asserts! (is-eq tx-sender (get owner job)) (err u403))
    (ok (map-set jobs { job-id: job-id }
      (merge job { status: new-status })))
  )
)

(define-read-only (get-job (job-id uint))
  (map-get? jobs { job-id: job-id })
)

