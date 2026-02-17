/**
 * Stub for EVM version: no MinIO/S3. File upload will use IPFS only (see useBaseCertificationFlow).
 */
class MinIOService {
  async uploadCertificationToMinio(
    _files: File[],
    _onProgress?: (progress: number) => void,
    _signal?: AbortSignal
  ): Promise<void> {
    if (_onProgress) _onProgress(100);
    return Promise.resolve();
  }
}

export default MinIOService;
