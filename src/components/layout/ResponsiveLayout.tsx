import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bars3Icon, 
  XMarkIcon, 
  ArrowRightOnRectangleIcon, 
  ChevronDownIcon, 
  BuildingOfficeIcon,
  ChartBarIcon,
  DocumentTextIcon,
  WalletIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children, title = "Dashboard EVM" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { disconnect, address, smartAccountAddress, chainId, balance } = useAuth();

  // Helper function to truncate address
  const truncateAddress = (address?: string, startChars: number = 4, endChars: number = 4): string => {
    if (!address || address.length < startChars + endChars) {
      return address || 'Non connesso';
    }
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
  };

  // Get network name from chainId
  const getNetworkName = (chainId?: number): string => {
    switch (chainId) {
      case 1: return 'Ethereum';
      case 11155111: return 'Sepolia';
      case 137: return 'Polygon';
      case 42161: return 'Arbitrum';
      default: return 'Unknown';
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: <ChartBarIcon className="h-5 w-5" />, 
      tooltip: 'Panoramica generale delle certificazioni EVM' 
    },
    { 
      name: 'Certificazioni', 
      href: '/certifications', 
      icon: <DocumentTextIcon className="h-5 w-5" />, 
      tooltip: 'Crea e gestisci certificazioni per artefatti digitali' 
    },
    { 
      name: 'Wallet', 
      href: '/wallet', 
      icon: <WalletIcon className="h-5 w-5" />, 
      tooltip: 'Smart Account, transazioni e assets' 
    },
  ];

  const isCurrentPath = (href: string) => {
    if (href === '/dashboard') return location.pathname === '/dashboard' || location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const handleProfileEdit = () => {
    setUserMenuOpen(false);
    navigate('/profile');
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    try {
      disconnect();
      navigate('/dashboard');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-slate-900/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-slate-800 border-r border-slate-700">
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-white font-semibold">ArtCertify EVM</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <nav className="mt-4 px-2">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    title={item.tooltip}
                    className={`flex items-center w-full px-3 py-3 font-medium rounded-lg transition-colors ${
                      isCurrentPath(item.href)
                        ? 'bg-primary-600 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="mr-3 flex-shrink-0">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-slate-800 border-r border-slate-700">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-slate-700">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-white font-semibold">ArtCertify EVM</span>
          </div>

          {/* Navigation */}
          <nav className="mt-4 flex-1 px-2">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    title={item.tooltip}
                    className={`flex items-center w-full px-3 py-3 font-medium rounded-lg transition-colors ${
                      isCurrentPath(item.href)
                        ? 'bg-primary-600 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <span className="mr-3 flex-shrink-0">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <div className="sticky top-0 z-40 bg-slate-900 border-b border-slate-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Left side - Mobile menu button and title */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-400 hover:text-white mr-4"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
              
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-white">{title}</h1>
                {chainId && (
                  <span className="ml-3 px-2 py-1 text-xs bg-primary-600 text-white rounded-full">
                    {getNetworkName(chainId)}
                  </span>
                )}
              </div>
            </div>

            {/* Right side - User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {address ? address.slice(2, 4).toUpperCase() : 'AA'}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-medium text-white font-mono">
                      {truncateAddress(address, 4, 4)}
                    </div>
                    {balance && (
                      <div className="text-xs text-slate-400">
                        {Number(balance).toFixed(4)} ETH
                      </div>
                    )}
                  </div>
                </div>
                <ChevronDownIcon className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-slate-700">
                    <p className="text-xs font-medium text-white font-mono">
                      EOA: {truncateAddress(address, 6, 6)}
                    </p>
                    {smartAccountAddress && (
                      <p className="text-xs text-slate-300 font-mono mt-1">
                        Smart: {truncateAddress(smartAccountAddress, 6, 6)}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      {getNetworkName(chainId)} • {balance ? `${Number(balance).toFixed(4)} ETH` : '0 ETH'}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleProfileEdit}
                      className="flex items-center w-full px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                      <BuildingOfficeIcon className="h-4 w-4 mr-3" />
                      Impostazioni Account
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                      Disconnetti
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResponsiveLayout; 