/**
 * API utilities with retry logic, error handling, caching, and request queuing
 */

import { apiCache } from './cache';
import { requestQueue } from './requestQueue';

interface FetchWithRetryOptions {
    maxRetries?: number;
    retryDelay?: number;
    timeout?: number;
    priority?: number;
    useQueue?: boolean;
}

export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public details?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Fetch with automatic retry on failure and optional request queuing
 */
export async function fetchWithRetry(
    url: string,
    options: RequestInit = {},
    retryOptions: FetchWithRetryOptions = {}
): Promise<Response> {
    const { 
        maxRetries = 3, 
        retryDelay = 1000, 
        timeout = 30000,
        priority = 0,
        useQueue = true
    } = retryOptions;

    const fetchFn = async (): Promise<Response> => {
        let lastError: Error | null = null;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);

                const response = await fetch(url, {
                    ...options,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new ApiError(
                        `HTTP ${response.status}: ${response.statusText}`,
                        response.status
                    );
                }

                return response;
            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));

                // Don't retry on certain errors
                if (error instanceof ApiError && error.statusCode && error.statusCode < 500) {
                    throw error; // Client errors shouldn't be retried
                }

                if (attempt < maxRetries) {
                    // Exponential backoff
                    const delay = retryDelay * Math.pow(2, attempt);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        throw lastError || new Error('Request failed after retries');
    };

    // Use request queue if enabled
    if (useQueue) {
        return requestQueue.enqueue(fetchFn, priority);
    }

    return fetchFn();
}

/**
 * POST JSON with retry
 */
export async function postJson<T>(
    url: string,
    data: unknown,
    options: FetchWithRetryOptions = {}
): Promise<T> {
    const response = await fetchWithRetry(
        url,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        },
        options
    );

    return response.json();
}

/**
 * GET JSON with retry and optional caching
 */
export async function getJson<T>(
    url: string,
    options: FetchWithRetryOptions & { cache?: boolean; cacheTtl?: number } = {}
): Promise<T> {
    const { cache = false, cacheTtl = 5 * 60 * 1000, ...fetchOptions } = options;

    // Check cache first
    if (cache) {
        const cached = apiCache.get(url);
        if (cached !== null) {
            return cached as T;
        }
    }

    const response = await fetchWithRetry(url, {}, fetchOptions);
    const data = await response.json();

    // Store in cache
    if (cache) {
        apiCache.set(url, data, cacheTtl);
    }

    return data;
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
        if (error.statusCode === 404) {
            return 'Resource not found';
        }
        if (error.statusCode === 500) {
            return 'Server error. Please try again later.';
        }
        return error.message;
    }

    if (error instanceof Error) {
        if (error.name === 'AbortError') {
            return 'Request timed out. Please check your connection.';
        }
        if (error.message.includes('fetch')) {
            return 'Unable to connect to server. Please check if the backend is running.';
        }
        return error.message;
    }

    return 'An unexpected error occurred';
}
