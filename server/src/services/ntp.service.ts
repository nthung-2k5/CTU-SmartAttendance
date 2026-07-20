import { NtpTimeSync } from 'ntp-time-sync';

let ntpOffset = 0;

export async function setupNtpSync() {
  const timeSync = NtpTimeSync.getInstance();

  const syncTime = async () => {
    try {
      const result = await timeSync.getTime();
      ntpOffset = result.offset;
      console.log(`[NTP] Time synced. Offset: ${ntpOffset}ms`);
    } catch (error) {
      console.error(`[NTP] Time sync failed:`, error);
    }
  };

  // Initial fetch
  await syncTime();

  // Resync every 1 hour (3600000 ms)
  setInterval(syncTime, 3600 * 1000);
}

export function getNtpTime(): number {
  return Date.now() + ntpOffset;
}
