/**
 * Health Check Endpoint for Vaani
 *
 * Usage:
 *   GET /api/health
 *
 * Response:
 *   {
 *     "status": "ok",
 *     "timestamp": "2026-05-11T12:34:56.789Z",
 *     "uptime": 12345,
 *     "version": "1.0.0",
 *     "environment": "production"
 *   }
 */

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const startTime = process.uptime();

    return NextResponse.json(
      {
        status: 'ok',
        message: 'Vaani Hindi AI Tutor is healthy',
        timestamp: new Date().toISOString(),
        uptime: Math.round(startTime),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        memory: {
          heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024), // MB
          heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024), // MB
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Vaani health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}

// HEAD request for monitoring systems (smaller response)
export async function HEAD() {
  return NextResponse.json(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
}
