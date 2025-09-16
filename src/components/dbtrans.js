import { ref } from 'vue';
import axios from 'axios'
import { useAxios } from '@vueuse/integrations/useAxios'
import { useAsyncState, whenever } from '@vueuse/core'

export function getTrans(){
    const executeTrans = function(transParams, transId, transUrl, transMethod, emit, c, header, dataReady, transResult, options = {}){
        debugger;
        // Determine if this is a file upload (FormData) or regular request
        const isFileUpload = transParams instanceof FormData;

        let axiosConfig = {
            method: transMethod,
            timeout: options.timeout || 30000
        };

        // Handle different types of requests
        if (isFileUpload) {
            // File upload configuration
            axiosConfig.data = transParams; // FormData goes in data, not params
            axiosConfig.headers = {
                'Content-Type': 'multipart/form-data',
                ...options.headers
            };

            // Add upload progress tracking for file uploads
            if (options.onUploadProgress && typeof options.onUploadProgress === 'function') {
                axiosConfig.onUploadProgress = options.onUploadProgress;
            }
        } else if (transMethod.toUpperCase() === 'GET') {
            // GET request - use params
            axiosConfig.params = transParams;
            axiosConfig.headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };
        } else {
            // POST/PUT/etc with JSON data
            axiosConfig.data = transParams;
            axiosConfig.headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };
        }

        // Set up axios instance with bearer token
        if (header) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${header}`;
            axiosConfig.headers['Authorization'] = `Bearer ${header}`;
        }

        // Initialize useAxios with the configuration
        const { execute, data, isFinished, error, isLoading } = useAxios(transUrl, axiosConfig, { immediate: false });

        console.log('dbtrans executing:', {
            transId,
            transUrl,
            transMethod,
            isFileUpload,
            hasData: !!transParams
        });

        // Reset data
        data.value = '';
        dataReady.value = false;

        console.log('dbtrans dataReady.value 1', dataReady.value);

        try {
            // Execute the request
            execute();
        } catch (err) {
            console.error('Error executing transaction:', err);
            dataReady.value = true;
            transResult.value = {
                success: false,
                error: err.message || 'Request failed'
            };
            return;
        }

        // Handle completion
        whenever(isFinished, () => {
            console.log('returned dbTrans point1-', transId, data._rawValue);

            try {
                // Check for axios errors first
                if (error.value) {
                    console.error('Axios error:', error.value);
                    transResult.value = {
                        success: false,
                        error: error.value.message || 'Request failed',
                        status: error.value.response?.status,
                        statusText: error.value.response?.statusText
                    };
                } else {
                    // Success case
                    const responseData = data._rawValue || data.value;
                    transResult.value = responseData;

                    // For file uploads, ensure we have a proper success indicator
                    if (isFileUpload && responseData && typeof responseData === 'object') {
                        // If the response doesn't explicitly indicate success/failure,
                        // assume success if we got data back
                        if (responseData.success === undefined) {
                            transResult.value = {
                                ...responseData,
                                success: true
                            };
                        }
                    }

                    // Handle legacy token updates (for login responses)
                    if (responseData && responseData.access_token) {
                        axios.defaults.headers.common['Authorization'] = `Bearer ${responseData.access_token}`;
                    }
                }

                dataReady.value = true;

                console.log('dbtrans dataReady.value 2', dataReady.value, transResult.value);

                // Emit completion event if emit function provided
                if (emit && c && c.TRANSACTION_COMPLETED) {
                    emit('cevt', [c.TRANSACTION_COMPLETED, transId, transResult.value]);
                }

            } catch (processingError) {
                console.error('Error processing response:', processingError);
                transResult.value = {
                    success: false,
                    error: 'Failed to process response: ' + processingError.message
                };
                dataReady.value = true;
            }
        });

        // Handle errors that occur during request
        whenever(() => error.value, () => {
            if (error.value) {
                console.error('Request error:', error.value);
                transResult.value = {
                    success: false,
                    error: error.value.message || 'Network error',
                    status: error.value.response?.status,
                    statusText: error.value.response?.statusText,
                    data: error.value.response?.data
                };
                dataReady.value = true;

                if (emit && c && c.TRANSACTION_FAILED) {
                    emit('cevt', [c.TRANSACTION_FAILED, transId, transResult.value]);
                }
            }
        });

        // Return control objects for advanced usage
        return {
            execute,
            data,
            error,
            isLoading,
            isFinished,
            cancel: () => {
                // Note: useAxios doesn't provide direct cancellation,
                // but we can mark the transaction as cancelled
                if (!isFinished.value) {
                    transResult.value = {
                        success: false,
                        error: 'Request cancelled'
                    };
                    dataReady.value = true;
                }
            }
        };
    }

    // Enhanced version with upload progress support
    const executeFileUpload = function(files, transId, transUrl, emit, c, header, dataReady, transResult, options = {}) {
        const formData = new FormData();

        // Add files to FormData
        if (Array.isArray(files)) {
            files.forEach((file, index) => {
                formData.append(options.fieldName || 'files', file);
            });
        } else {
            formData.append(options.fieldName || 'files', files);
        }

        // Add additional fields if provided
        if (options.additionalFields) {
            Object.entries(options.additionalFields).forEach(([key, value]) => {
                formData.append(key, value);
            });
        }

        // Set up progress tracking
        const uploadProgress = ref(0);
        const enhancedOptions = {
            ...options,
            onUploadProgress: (progressEvent) => {
                if (progressEvent.lengthComputable) {
                    uploadProgress.value = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    console.log('Upload progress:', uploadProgress.value + '%');

                    // Call custom progress callback if provided
                    if (options.onProgress && typeof options.onProgress === 'function') {
                        options.onProgress(uploadProgress.value);
                    }
                }
            }
        };

        // Execute the upload
        const result = executeTrans(formData, transId, transUrl, 'POST', emit, c, header, dataReady, transResult, enhancedOptions);

        // Return enhanced result with progress
        return {
            ...result,
            uploadProgress
        };
    }

    return {
        executeTrans,
        executeFileUpload
    }
}
