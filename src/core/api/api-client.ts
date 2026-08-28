import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from './response-models';

export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status?: number,
    public readonly details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'AppError';
  }
}
export function formatApiErrorMessage(apiError: any, defaultMessage: string): string {
  if (!apiError) return defaultMessage;

  // 1. If detail is an array (FastAPI validation errors)
  if (Array.isArray(apiError.detail)) {
    return apiError.detail
      .map((err: any) => {
        const field = Array.isArray(err.loc) ? err.loc[err.loc.length - 1] : '';
        return field ? `${field}: ${err.msg}` : err.msg;
      })
      .join(', ');
  }

  // 2. If detail is a string
  if (typeof apiError.detail === 'string') {
    return apiError.detail;
  }

  // 3. If details is a record of string/string arrays
  if (apiError.details && typeof apiError.details === 'object') {
    const messages: string[] = [];
    for (const [key, value] of Object.entries(apiError.details)) {
      if (Array.isArray(value)) {
        messages.push(`${key}: ${value.join(', ')}`);
      } else if (typeof value === 'string') {
        messages.push(`${key}: ${value}`);
      }
    }
    if (messages.length > 0) {
      return messages.join(', ');
    }
  }

  // 4. Fallback to message
  if (typeof apiError.message === 'string') {
    return apiError.message;
  }

  return defaultMessage;
}

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private inFlightGetRequests = new Map<string, Promise<any>>();

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request Interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Append device_id and language key header to every outgoing API request
        if (typeof window !== 'undefined') {
          try {
            let deviceId = localStorage.getItem('bigtv_cms_device_id') || localStorage.getItem('device_id');
            if (!deviceId) {
              const uuid =
                typeof crypto !== 'undefined' && crypto.randomUUID
                  ? crypto.randomUUID()
                  : `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 11)}`;
              deviceId = `BTVCMS-${uuid.toUpperCase()}`;
              localStorage.setItem('bigtv_cms_device_id', deviceId);
              localStorage.setItem('device_id', deviceId);
            }
            const isBypassDeviceId =
              config.url?.includes('/generate-upload-url') ||
              config.url?.includes('/creators') ||
              config.url?.includes('/categories') ||
              config.url?.includes('/aitags') ||
              config.url?.includes('/states') ||
              config.url?.includes('/locations');

            const isCreateOrUpdateMethod =
              config.method?.toLowerCase() === 'post' ||
              config.method?.toLowerCase() === 'put' ||
              config.method?.toLowerCase() === 'patch';

            if (isBypassDeviceId) {
              if (config.headers) {
                delete config.headers['device_id'];
                delete config.headers['device-id'];
                delete config.headers['x-device-id'];
                delete config.headers['X-Device-Id'];
              }
              if (config.params) {
                delete config.params.device_id;
                delete config.params.deviceId;
              }
            } else if (config.headers) {
              config.headers['device_id'] = deviceId;
              config.headers['device-id'] = deviceId;
              config.headers['x-device-id'] = deviceId;
              config.headers['X-Device-Id'] = deviceId;
            }

            // Do not send device_id in request body payload during create/update time
            if (config.data && typeof config.data === 'object' && !Array.isArray(config.data)) {
              delete (config.data as any).device_id;
              delete (config.data as any).deviceId;
            }
          } catch (e) {
            console.error('Failed to set device_id header', e);
          }

          try {
            // Bypass language filter for /post-types, /languages, /admin/states, /states, /locations, and /creators endpoints or when explicitly disabled
            const isBypassLangApi =
              config.url?.includes('/categories') ||
              config.url?.includes('/post-types') ||
              config.url?.includes('/languages') ||
              config.url?.includes('/states') ||
              config.url?.includes('/locations') ||
              config.url?.includes('/creators') ||
              config.params?.skip_lang_param;
            if (!isBypassLangApi) {
              // Determine active language from params or localStorage
              let lang = config.params?.lang || config.params?.language;
              if (!lang) {
                const langStoreRaw = localStorage.getItem('bigtv-language-store');
                if (langStoreRaw) {
                  const langState = JSON.parse(langStoreRaw);
                  lang = langState?.state?.language;
                }
              }

              if (lang) {
                if (config.headers) {
                  config.headers['Accept-Language'] = lang;
                }
                if (config.method?.toLowerCase() === 'get' && !config.params?.lang) {
                  config.params = { lang, ...config.params };
                }
              }
            } else if (config.params) {
              delete config.params.lang;
              delete config.params.language;
              if ('skip_lang_param' in config.params) {
                delete config.params.skip_lang_param;
              }
            }
          } catch (e) {
            console.error('Failed to parse language store', e);
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor & Refresh Token & Retry logic outline
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;
        const isAuthRequest = originalRequest?.url?.includes('/login') || originalRequest?.url?.includes('/refresh');
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
          originalRequest._retry = true;
          try {
            const refreshResponse = await this.refreshToken();
            const newAccessToken = refreshResponse.data.accessToken;
            if (typeof window !== 'undefined') {
              localStorage.setItem('access_token', newAccessToken);
            }
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('access_token');
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }

        const apiError = error.response?.data as any;
        const errorMessage = formatApiErrorMessage(apiError, error.message || 'An unexpected error occurred');

        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('app-global-error', {
              detail: { message: errorMessage, status: error.response?.status },
            })
          );
        }

        return Promise.reject(
          new AppError(
            apiError?.code || 'UNKNOWN_ERROR',
            errorMessage,
            error.response?.status,
            apiError?.details
          )
        );
      }
    );
  }

  private async refreshToken(): Promise<AxiosResponse<{ accessToken: string }>> {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
    return axios.post(`${this.axiosInstance.defaults.baseURL}/auth/refresh`, { refreshToken });
  }

  private async request<T>(config: { method: string; url: string; data?: unknown; params?: Record<string, unknown> }): Promise<T> {
    const response = await this.axiosInstance.request<T>(config);
    return response.data;
  }

  public async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const key = `${url}?${JSON.stringify(params || {})}`;
    if (this.inFlightGetRequests.has(key)) {
      return this.inFlightGetRequests.get(key) as Promise<T>;
    }

    const promise = this.request<T>({ method: 'get', url, params }).finally(() => {
      this.inFlightGetRequests.delete(key);
    });

    this.inFlightGetRequests.set(key, promise);
    return promise;
  }

  public async post<T, R = unknown>(url: string, data: R): Promise<T> {
    return this.request<T>({ method: 'post', url, data });
  }

  public async put<T, R = unknown>(url: string, data: R): Promise<T> {
    return this.request<T>({ method: 'put', url, data });
  }

  public async delete<T>(url: string): Promise<T> {
    return this.request<T>({ method: 'delete', url });
  }
}

export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'https://api.chotanews.com'
);

