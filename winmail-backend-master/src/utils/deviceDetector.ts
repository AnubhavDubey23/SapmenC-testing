import DeviceDetector from 'device-detector-js';
import { Request } from 'express';

const deviceDetector = new DeviceDetector();

export function getDeviceDetectorResult(req: Request) {
  const userAgent = req.headers['user-agent'];
  const result = deviceDetector.parse(userAgent!);
  return result;
}

export default deviceDetector;
