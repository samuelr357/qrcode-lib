import { B as BrowserQRCodeCreateInput, a as BrowserQRCodeInstance } from './types-CZ3DbJda.cjs';

declare function createBrowserQRCode(input: BrowserQRCodeCreateInput): Promise<BrowserQRCodeInstance>;
declare const createQrCode: typeof createBrowserQRCode;

export { createBrowserQRCode, createQrCode };
