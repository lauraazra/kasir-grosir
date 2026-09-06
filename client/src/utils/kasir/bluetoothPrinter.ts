/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/bluetoothPrinter.ts
import { generateReceiptText } from "./receiptFormatter";
import type { ICartItem } from "../../types/kasir";

let persistentDevice: any = null;
let persistentCharacteristic: any = null;

export async function printViaBluetooth(
  cart: ICartItem[],
  grandTotal: number,
): Promise<void> {
  // Cek apakah browser mendukung Web Bluetooth
  if (!("bluetooth" in navigator)) {
    throw new Error("Web Bluetooth tidak didukung di browser ini.");
  }

  try {
    // 1. Cek atau bangun ulang koneksi GATT jika belum ada / terputus
    if (!persistentCharacteristic || !persistentDevice?.gatt?.connected) {
      // Reset state sebelumnya
      persistentDevice = null;
      persistentCharacteristic = null;

      // Scan device Bluetooth
      persistentDevice = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          "000018f0-0000-1000-8000-00805f9b34fb",
          "49535343-fe7d-4ae5-8fa9-9fafd205e455",
          "0000ff00-0000-1000-8000-00805f9b34fb",
          "0000e7e0-0000-1000-8000-00805f9b34fb",
          "00001801-0000-1000-8000-00805f9b34fb",
          "00001800-0000-1000-8000-00805f9b34fb",
          "0000af00-0000-1000-8000-00805f9b34fb", // Tambahan untuk beberapa printer POS iOS
        ],
      });

      // Dengarkan event jika Bluetooth terputus tiba-tiba
      persistentDevice.addEventListener("gattserverdisconnected", () => {
        persistentDevice = null;
        persistentCharacteristic = null;
      });

      const server = await persistentDevice.gatt.connect();
      const services = await server.getPrimaryServices();

      if (!services || services.length === 0) {
        throw new Error("Service printer tidak ditemukan.");
      }

      // Loop SELURUH service untuk mencari characteristic yang support WRITE
      // (Khusus iOS / Bluefy, service cetak seringkali bukan di urutan index pertama)
      let targetCharacteristic: any = null;

      for (const service of services) {
        try {
          const characteristics = await service.getCharacteristics();
          const writeable = characteristics.find(
            (c: any) => c.properties.write || c.properties.writeWithoutResponse,
          );

          if (writeable) {
            targetCharacteristic = writeable;
            break;
          }
        } catch {
          // Abaikan service yang terkunci/ditolak izinnya oleh iOS
          continue;
        }
      }

      if (!targetCharacteristic) {
        throw new Error("Karakteristik write printer tidak ditemukan.");
      }

      persistentCharacteristic = targetCharacteristic;
    }

    // 2. Format teks struk
    const receiptText = generateReceiptText(cart, grandTotal);

    // 3. Konversi perintah ESC/POS
    const encoder = new TextEncoder();
    let commands: number[] = [];

    // Reset Printer (ESC @)
    commands.push(0x1b, 0x40);
    // Encode Teks Struk
    commands.push(...encoder.encode(receiptText));
    commands.push(0x0a, 0x1b, 0x64, 2);

    const dataUint8 = new Uint8Array(commands);

    // 4. Kirim byte data bertahap (Chunking 100 bytes per paket)
    // iOS / Bluefy sering bermasalah jika buffer data dikirim sekaligus
    const chunkSize = 100;
    for (let i = 0; i < dataUint8.length; i += chunkSize) {
      const chunk = dataUint8.slice(i, i + chunkSize);

      if (persistentCharacteristic.properties.writeWithoutResponse) {
        await persistentCharacteristic.writeValueWithoutResponse(chunk);
      } else {
        await persistentCharacteristic.writeValue(chunk);
      }

      // Delay mikro agar buffer printer tidak meluap di Bluefy
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  } catch (error) {
    // Reset variabel persistent jika gagal
    persistentDevice = null;
    persistentCharacteristic = null;
    throw error;
  }
}
