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
    // 1. Re-use koneksi jika device sudah terhubung
    if (!persistentCharacteristic || !persistentDevice?.gatt?.connected) {
      // Minta izin pairing (Hanya berjalan di transaksi pertama)
      persistentDevice = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          "000018f0-0000-1000-8000-00805f9b34fb",
          "49535343-fe7d-4ae5-8fa9-9fafd205e455",
          "0000ff00-0000-1000-8000-00805f9b34fb",
        ],
      });

      const server = await persistentDevice.gatt.connect();
      const services = await server.getPrimaryServices();

      if (!services || services.length === 0) {
        throw new Error("Service printer tidak ditemukan.");
      }

      const characteristics = await services[0].getCharacteristics();
      persistentCharacteristic = characteristics.find(
        (c: any) => c.properties.write || c.properties.writeWithoutResponse,
      );

      if (!persistentCharacteristic) {
        throw new Error("Karakteristik write printer tidak ditemukan.");
      }
    }

    // 2. Format teks struk menggunakan modul receiptFormatter
    const receiptText = generateReceiptText(cart, grandTotal);

    // 3. Konversi perintah ESC/POS (Hex Command)
    const encoder = new TextEncoder();
    let commands: number[] = [];

    // Perintah Reset Printer (ESC @)
    commands.push(0x1b, 0x40);
    // Encode Teks Struk
    commands.push(...encoder.encode(receiptText));
    // Perintah Auto Cut Kertas (GS V 66 0)
    commands.push(0x1d, 0x56, 66, 0);

    // 4. Kirim byte data langsung ke printer
    const dataUint8 = new Uint8Array(commands);
    await persistentCharacteristic.writeValue(dataUint8);
  } catch (error) {
    // Reset variabel persistent jika koneksi terputus/gagal
    persistentDevice = null;
    persistentCharacteristic = null;
    throw error;
  }
}
