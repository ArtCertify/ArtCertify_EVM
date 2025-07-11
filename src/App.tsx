import { useState } from 'react';
import { Button, Card, Alert, Spinner } from './components/atoms';
import { usePasskey } from './hooks/usePasskey';
import { useSafe } from './hooks/useSafe';

function App() {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPasskeyForm, setShowPasskeyForm] = useState(false);
  const [showPasskeySelector, setShowPasskeySelector] = useState(false);
  const [message, setMessage] = useState('');

  const {
    passkeys,
    isSupported,
    isPlatformAvailable,
    isLoading: passkeyLoading,
    error: passkeyError,
    createNewPasskey,
    authenticatePasskey,
    removePasskey,
    clearError: clearPasskeyError,
  } = usePasskey();

  const {
    safeConfig,
    safeInfo,
    isDeployed,
    isLoading: safeLoading,
    error: safeError,

    deploySafe,
    refreshSafeInfo,
    clearSafeConfig,
    clearError: clearSafeError,
    formatAddress,
    getSafeUrl,
  } = useSafe('sepolia');

  const handleCreatePasskey = async () => {
    if (!username || !displayName) {
      setMessage('Please enter both username and display name');
      return;
    }

    const credential = await createNewPasskey(username, displayName);
    if (credential) {
      setMessage('Passkey created successfully!');
      setShowPasskeyForm(false);
      setUsername('');
      setDisplayName('');
    }
  };

  const handleAuthenticatePasskey = async (credentialId?: string) => {
    const assertion = await authenticatePasskey(credentialId);
    if (assertion) {
      setMessage('Authentication successful!');
    }
  };

  const handleAuthenticateWithSelection = () => {
    if (passkeys.length === 1) {
      handleAuthenticatePasskey(passkeys[0].rawId);
    } else if (passkeys.length > 1) {
      setShowPasskeySelector(true);
    } else {
      setMessage('No passkeys available');
    }
  };

  const handleCreateSafe = async () => {
    if (passkeys.length === 0) {
      setMessage('Please create a passkey first');
      return;
    }

    // Use all passkeys as owners
    const threshold = 1;

    const success = await deploySafe(passkeys, threshold);
    if (success) {
      setMessage('Safe created successfully!');
    }
  };

  const handleSignMessage = async () => {
    if (passkeys.length === 0) {
      setMessage('Please create a passkey first');
      return;
    }

    const assertion = await authenticatePasskey(passkeys[0].rawId);
    if (assertion) {
      setMessage('Message signed successfully!');
    }
  };

  const isLoading = passkeyLoading || safeLoading;

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            ArtCertify - Safe Passkey Demo
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Create and manage your Safe wallet using passkeys
          </p>
        </div>

        {/* Error Messages */}
        {(passkeyError || safeError) && (
          <div className="mb-6">
            <Alert 
              variant="error" 
              onClose={() => {
                clearPasskeyError();
                clearSafeError();
              }}
            >
              {passkeyError || safeError}
            </Alert>
          </div>
        )}

        {/* Success Messages */}
        {message && (
          <div className="mb-6">
            <Alert 
              variant="success" 
              onClose={() => setMessage('')}
            >
              {message}
            </Alert>
          </div>
        )}

        {/* WebAuthn Support Check */}
        {!isSupported && (
          <div className="mb-6">
            <Alert variant="warning">
              WebAuthn is not supported in this browser or secure context. 
              {typeof window !== 'undefined' && window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && (
                <><br />For mobile devices, please use HTTPS or access via localhost.</>
              )}
              Please use a modern browser that supports passkeys.
              <details className="mt-2 text-xs">
                <summary>Debug Info</summary>
                <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono">
                  <p>Host: {typeof window !== 'undefined' ? window.location.hostname : 'unknown'}</p>
                  <p>Protocol: {typeof window !== 'undefined' ? window.location.protocol : 'unknown'}</p>
                  <p>isSecureContext: {typeof window !== 'undefined' ? window.isSecureContext?.toString() : 'unknown'}</p>
                  <p>PublicKeyCredential: {typeof window !== 'undefined' && window.PublicKeyCredential ? 'available' : 'not available'}</p>
                  <p>navigator.credentials: {typeof window !== 'undefined' && navigator.credentials ? 'available' : 'not available'}</p>
                </div>
              </details>
            </Alert>
          </div>
        )}

        {!isPlatformAvailable && isSupported && (
          <div className="mb-6">
            <Alert variant="warning">
              Platform authenticator is not available. Please ensure your device supports biometric authentication.
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Passkey Section */}
          <Card>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Passkey Management
              </h2>
              <p className="text-gray-600 text-sm">
                Create and manage your passkeys for secure authentication
              </p>
            </div>

            {passkeys.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-4">No passkeys created yet</p>
                <Button 
                  onClick={() => setShowPasskeyForm(true)}
                  disabled={!isSupported || isLoading}
                >
                  Create First Passkey
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {passkeys.map((passkey) => (
                  <div key={passkey.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{passkey.name}</p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(passkey.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2 sm:ml-4 flex-shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleAuthenticatePasskey(passkey.rawId)}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none"
                      >
                        Authenticate
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => removePasskey(passkey.id)}
                        disabled={isLoading}
                        className="flex-1 sm:flex-none"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPasskeyForm(true)}
                    disabled={isLoading}
                  >
                    Add New Passkey
                  </Button>
                  <Button
                    onClick={handleAuthenticateWithSelection}
                    disabled={isLoading}
                  >
                    Authenticate
                  </Button>
                </div>
              </div>
            )}

            {/* Passkey Creation Form */}
            {showPasskeyForm && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-3">Create New Passkey</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-900 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      placeholder="Enter display name"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button
                      onClick={handleCreatePasskey}
                      disabled={isLoading}
                      isLoading={passkeyLoading}
                      className="flex-1 sm:flex-none"
                    >
                      Create Passkey
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowPasskeyForm(false)}
                      disabled={isLoading}
                      className="flex-1 sm:flex-none"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Safe Section */}
          <Card>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Safe Wallet
              </h2>
              <p className="text-gray-600 text-sm">
                Deploy and manage your Safe wallet
              </p>
            </div>

            {!safeConfig?.safeAddress ? (
              <div className="text-center py-4">
                <p className="text-gray-500 mb-4">No Safe wallet created yet</p>
                <Button 
                  onClick={handleCreateSafe}
                  disabled={!isSupported || isLoading || passkeys.length === 0}
                  isLoading={safeLoading}
                >
                  Create Safe Wallet
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-green-900">Safe Address</p>
                      <p className="text-sm text-green-700 font-mono break-all">
                        {safeConfig.safeAddress}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {formatAddress(safeConfig.safeAddress)}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {isDeployed ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Deployed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {safeInfo && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Safe Info</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">Owners:</span> {safeInfo.owners.length}</p>
                      <p><span className="font-medium">Threshold:</span> {safeInfo.threshold}</p>
                      <p><span className="font-medium">Nonce:</span> {safeInfo.nonce}</p>
                      <p><span className="font-medium">Version:</span> {safeInfo.version}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={handleSignMessage}
                    disabled={isLoading || passkeys.length === 0}
                  >
                    Sign Message
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={refreshSafeInfo}
                    disabled={isLoading}
                  >
                    Refresh Info
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(getSafeUrl(safeConfig.safeAddress || ''), '_blank')}
                  >
                    View in Safe
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={clearSafeConfig}
                  >
                    Clear Safe
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Passkey Selection Modal */}
        {showPasskeySelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Passkey</h3>
              <div className="space-y-2">
                {passkeys.map((passkey) => (
                  <button
                    key={passkey.id}
                    onClick={() => {
                      handleAuthenticatePasskey(passkey.rawId);
                      setShowPasskeySelector(false);
                    }}
                    className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="font-medium text-gray-900">{passkey.name}</div>
                    <div className="text-sm text-gray-500">
                      Created: {new Date(passkey.createdAt).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowPasskeySelector(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center space-x-3">
                <Spinner />
                <span className="text-gray-700">Processing...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
