import { Request, Response } from "express";
import os from "os";

/**
 * Controller for GET /api/health
 * Returns comprehensive server and system diagnostics in JSON format
 */
export class HealthController {
  public static check(req: Request, res: Response): void {
    const totalMemBytes = os.totalmem();
    const freeMemBytes = os.freemem();
    const usedMemBytes = totalMemBytes - freeMemBytes;
    const memoryUsagePercent = Number(((usedMemBytes / totalMemBytes) * 100).toFixed(2));

    const uptimeSeconds = Math.floor(process.uptime());
    const uptimeFormatted = `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor(
      (uptimeSeconds % 3600) / 60
    )}m ${uptimeSeconds % 60}s`;

    const toMB = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

    const memoryInfo = process.memoryUsage();

    res.status(200).json({
      status: "healthy",
      service: "alumni-tracker-api",
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: uptimeSeconds,
        formatted: uptimeFormatted,
      },
      system: {
        platform: os.platform(),
        architecture: os.arch(),
        cpuCores: os.cpus().length,
        hostname: os.hostname(),
      },
      memory: {
        systemTotal: toMB(totalMemBytes),
        systemUsed: toMB(usedMemBytes),
        systemFree: toMB(freeMemBytes),
        usagePercentage: `${memoryUsagePercent}%`,
        processHeapUsed: toMB(memoryInfo.heapUsed),
        processRss: toMB(memoryInfo.rss),
      },
      runtime: {
        nodeVersion: process.version,
        pid: process.pid,
        environment: process.env.NODE_ENV || "development",
      },
    });
  }
}
