/* eslint-disable @typescript-eslint/no-explicit-any */
export type DeviceType = "ios" | "android" | "desktop";

export function detectDevice(): DeviceType {
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera;

  // Deteksi iPhone / iPad / iPod
  if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) {
    return "ios";
  }

  // Deteksi Android
  if (/android/i.test(ua)) {
    return "android";
  }

  // Sisa: Windows, macOS, Linux
  return "desktop";
}
