"use server"

import { getExecutions, getExecutionMetrics } from "../db/data-access"

export async function fetchExecutions(userId: string, limit = 20) {
  return getExecutions(userId, limit)
}

export async function fetchExecutionMetrics(userId: string, days = 30) {
  return getExecutionMetrics(userId, days)
}
