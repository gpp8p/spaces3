import { ref, reactive, computed } from 'vue';
import { getTrans } from './dbtrans.js';

/**
 * Vue 3 Composable for file uploads using axios via dbtrans
 * @param {Object} config - Upload configuration
 * @returns {Object} - Reactive upload state and methods
 */
export function useFileUpload(config = {}) {
    // Get the dbtrans composable
    const { executeTrans } = getTrans();

    // Reactive state
    const isUploading = ref(false);
    const uploadProgress = ref(0);
    const uploadResults = ref([]);
    const error = ref(null);
    const abortController = ref(null);

    // Configuration with defaults
    const uploadConfig = reactive({
        url: '/api/upload',
        method: 'POST',
        headers: {},
        fieldName: 'files',
        maxRetries: 3,
        chunkSize: null,
        timeout: 30000,
        simultaneousUploads: 1,
        ...config
    });

    // Computed properties
    const hasError = computed(() => error.value !== null);
    const isComplete = computed(() => uploadProgress.value === 100 && !isUploading.value);
    const canCancel = computed(() => isUploading.value);

    // Private upload methods
    const uploadSequential = async (files, progressCallback) => {
        const results = [];

        for (let i = 0; i < files.length; i++) {
            if (abortController.value?.signal.aborted) {
                throw new Error('Upload cancelled');
            }

            const file = files[i];

            try {
                const result = await uploadSingleFile(file, (fileProgress) => {
                    const overallProgress = Math.round(
                        ((i * 100) + fileProgress) / files.length
                    );
                    progressCallback(overallProgress);
                });

                results.push({ success: true, file: file.name, data: result });
            } catch (err) {
                if (err.message === 'Upload cancelled') {
                    throw err;
                }
                results.push({ success: false, file: file.name, error: err.message });
            }
        }

        return results;
    };

    const uploadParallel = async (files, progressCallback) => {
        const fileProgresses = new Array(files.length).fill(0);

        const updateOverallProgress = () => {
            const totalProgress = fileProgresses.reduce((sum, progress) => sum + progress, 0);
            const overallProgress = Math.round(totalProgress / files.length);
            progressCallback(overallProgress);
        };

        const uploadPromises = files.map((file, index) => {
            return uploadSingleFile(file, (fileProgress) => {
                fileProgresses[index] = fileProgress;
                updateOverallProgress();
            }).then(result => ({
                success: true,
                file: file.name,
                data: result
            })).catch(err => {
                if (err.message === 'Upload cancelled') {
                    throw err;
                }
                return {
                    success: false,
                    file: file.name,
                    error: err.message
                };
            });
        });

        const results = await Promise.all(uploadPromises);
        return results;
    };

    const uploadSingleFile = async (file, progressCallback) => {
        let lastError;
        debugger;

        for (let attempt = 1; attempt <= uploadConfig.maxRetries; attempt++) {
            try {
                if (uploadConfig.chunkSize && file.size > uploadConfig.chunkSize) {
                    return await uploadFileChunked(file, progressCallback);
                } else {
                    return await uploadFileStandard(file, progressCallback);
                }
            } catch (err) {
                if (err.message === 'Upload cancelled') {
                    throw err;
                }

                lastError = err;

                if (attempt < uploadConfig.maxRetries) {
                    await new Promise(resolve =>
                        setTimeout(resolve, Math.pow(2, attempt) * 1000)
                    );
                }
            }
        }

        throw lastError;
    };

    const uploadFileStandard = async (file, progressCallback) => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append(uploadConfig.fieldName, file);

            if (uploadConfig.additionalFields) {
                Object.entries(uploadConfig.additionalFields).forEach(([key, value]) => {
                    formData.append(key, value);
                });
            }

            // Create refs for dbtrans
            const dataReady = ref(false);
            const transResult = ref(null);

            // Generate unique transaction ID
            const transId = 'upload_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

            // Mock emit function since we don't need the event system for this
            const mockEmit = () => {};

            // Mock constants object
            const mockC = {};
            debugger;
            try {
                // Execute the upload using dbtrans with progress tracking
                const { cancel, uploadProgress } = executeTrans(
                    formData,           // transParams (the FormData)
                    transId,           // transId
                    uploadConfig.url,  // transUrl
                    'POST',            // transMethod
                    mockEmit,          // emit
                    mockC,             // c (constants)
                    uploadConfig.headers.Authorization || '', // header (bearer token)
                    dataReady,         // dataReady ref
                    transResult,       // transResult ref
                    {                  // options
                        timeout: uploadConfig.timeout,
                        onProgress: progressCallback, // Pass our progress callback
                        headers: uploadConfig.headers
                    }
                );

                // Store cancel function for abort controller
                if (abortController.value) {
                    abortController.value.signal.addEventListener('abort', () => {
                        cancel();
                        reject(new Error('Upload cancelled'));
                    });
                }

                // Watch for completion using whenever (now available in dbtrans)
                whenever(dataReady, () => {
                    if (dataReady.value && transResult.value) {
                        // Check if the result indicates success
                        if (transResult.value.success !== false) {
                            resolve(transResult.value);
                        } else {
                            reject(new Error(transResult.value.error || transResult.value.message || 'Upload failed'));
                        }
                    }
                });

            } catch (err) {
                reject(new Error('Failed to initiate upload: ' + err.message));
            }
        });
    };

    const uploadFileChunked = async (file, progressCallback) => {
        const chunkSize = uploadConfig.chunkSize;
        const totalChunks = Math.ceil(file.size / chunkSize);
        const uploadId = generateUploadId();

        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            if (abortController.value?.signal.aborted) {
                throw new Error('Upload cancelled');
            }

            const start = chunkIndex * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const chunk = file.slice(start, end);

            const formData = new FormData();
            formData.append('chunk', chunk);
            formData.append('chunkIndex', chunkIndex.toString());
            formData.append('totalChunks', totalChunks.toString());
            formData.append('uploadId', uploadId);
            formData.append('fileName', file.name);
            formData.append('fileSize', file.size.toString());

            await uploadChunk(formData);

            const progress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
            progressCallback(progress);
        }

        return await finalizeChunkedUpload(uploadId, file.name);
    };

    const uploadChunk = async (formData) => {
        return new Promise((resolve, reject) => {
            const dataReady = ref(false);
            const transResult = ref(null);
            const transId = 'chunk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

            executeTrans(
                formData,
                transId,
                uploadConfig.url + '/chunk',
                'POST',
                () => {},
                {},
                uploadConfig.bearerToken || '',
                dataReady,
                transResult
            );

            const checkCompletion = () => {
                if (abortController.value?.signal.aborted) {
                    reject(new Error('Upload cancelled'));
                    return;
                }

                if (dataReady.value && transResult.value) {
                    if (transResult.value.success !== false) {
                        resolve(transResult.value);
                    } else {
                        reject(new Error('Chunk upload failed: ' + transResult.value.message));
                    }
                } else {
                    setTimeout(checkCompletion, 100);
                }
            };

            setTimeout(checkCompletion, 100);
        });
    };

    const finalizeChunkedUpload = async (uploadId, fileName) => {
        return new Promise((resolve, reject) => {
            const dataReady = ref(false);
            const transResult = ref(null);
            const transId = 'finalize_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

            const params = {
                uploadId,
                fileName
            };

            executeTrans(
                params,
                transId,
                uploadConfig.url + '/finalize',
                'POST',
                () => {},
                {},
                uploadConfig.bearerToken || '',
                dataReady,
                transResult
            );

            const checkCompletion = () => {
                if (abortController.value?.signal.aborted) {
                    reject(new Error('Upload cancelled'));
                    return;
                }

                if (dataReady.value && transResult.value) {
                    if (transResult.value.success !== false) {
                        resolve(transResult.value);
                    } else {
                        reject(new Error('Failed to finalize upload: ' + transResult.value.message));
                    }
                } else {
                    setTimeout(checkCompletion, 100);
                }
            };

            setTimeout(checkCompletion, 100);
        });
    };

    const generateUploadId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    // Public methods
    const upload = async (files) => {
        if (!files || files.length === 0) {
            throw new Error('No files provided for upload');
        }

        // Reset state
        isUploading.value = true;
        uploadProgress.value = 0;
        error.value = null;
        uploadResults.value = [];
        abortController.value = new AbortController();

        try {
            const progressCallback = (progress) => {
                uploadProgress.value = progress;
            };

            let results;
            if (uploadConfig.simultaneousUploads === 1) {
                results = await uploadSequential(files, progressCallback);
            } else {
                results = await uploadParallel(files, progressCallback);
            }

            uploadResults.value = results;
            uploadProgress.value = 100;

            return results;
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            isUploading.value = false;
            abortController.value = null;
        }
    };

    const cancel = () => {
        if (abortController.value) {
            abortController.value.abort();
            isUploading.value = false;
            uploadProgress.value = 0;
            error.value = 'Upload cancelled';
        }
    };

    const reset = () => {
        isUploading.value = false;
        uploadProgress.value = 0;
        uploadResults.value = [];
        error.value = null;
        if (abortController.value) {
            abortController.value.abort();
            abortController.value = null;
        }
    };

    const updateConfig = (newConfig) => {
        Object.assign(uploadConfig, newConfig);
    };

    // Return reactive state and methods
    return {
        // State
        isUploading,
        uploadProgress,
        uploadResults,
        error,
        uploadConfig,

        // Computed
        hasError,
        isComplete,
        canCancel,

        // Methods
        upload,
        cancel,
        reset,
        updateConfig
    };
}

// Helper composables for common upload configurations
export function useImageUpload(baseConfig = {}) {
    return useFileUpload({
        ...baseConfig,
        accept: 'image/*',
        maxSize: 5 * 1024 * 1024, // 5MB
        fieldName: 'images'
    });
}

export function useDocumentUpload(baseConfig = {}) {
    return useFileUpload({
        ...baseConfig,
        accept: '.pdf,.doc,.docx,.txt',
        maxSize: 10 * 1024 * 1024, // 10MB
        fieldName: 'documents'
    });
}

export function useLargeFileUpload(baseConfig = {}) {
    return useFileUpload({
        ...baseConfig,
        chunkSize: 1024 * 1024, // 1MB chunks
        maxRetries: 5,
        timeout: 60000
    });
}
