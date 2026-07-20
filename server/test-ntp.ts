import { getNtpTime, setupNtpSync } from './src/services/ntp.service'

async function main() {
  await setupNtpSync()
  console.log('NTP Time:', getNtpTime())
  console.log('Date Time:', Date.now())
  process.exit(0)
}
main()
