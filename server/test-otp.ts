import { OTP } from 'otplib'

const authenticator = new OTP()

// Tao 1 secret key random
const secret = authenticator.generateSecret()
console.log('Secret:', secret)

const step = 5 // 5 seconds step
const window = 1 // +/- 1 step

// Generate OTP
const otp = await authenticator.generate({ secret, period: step })
console.log(`OTP (step=${step}s):`, otp)

// Verify OTP ngay lap tuc
const isValid = await authenticator.verify({ token: otp, secret, period: step, epochTolerance: window })
console.log('Is valid immediately:', isValid.valid) // → true

console.log('Waiting 6 seconds...')
await new Promise((r) => setTimeout(r, 6000))

// Verify OTP sau 6 giay (van con nam trong cua so window = 1 vi 6s <= 5s + 5s)
const isStillValid = await authenticator.verify({ token: otp, secret, period: step, epochTolerance: window })
console.log('Is valid after 6s (window=1):', isStillValid.valid)

console.log('Waiting another 5 seconds...')
await new Promise((r) => setTimeout(r, 5000))

// Verify OTP sau 11 giay (da qua cua so window = 1)
const isInvalid = await authenticator.verify({ token: otp, secret, period: step, epochTolerance: window })
console.log('Is valid after 11s:', isInvalid.valid)
