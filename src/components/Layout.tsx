import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  Camera, 
  Eye, 
  FileText, 
  GitCompare, 
  Calculator,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Capture', href: '/capture', icon: Camera },
    { name: 'Review', href: '/review', icon: Eye },
    { name: 'Report', href: '/report', icon: FileText },
    { name: 'Compare', href: '/compare', icon: GitCompare },
    { name: 'Estimate', href: '/estimate', icon: Calculator },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-primary-600 transition-colors">
            PropertyAI
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`${
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-700 border-primary-200'
                        : 'text-gray-700 hover:bg-gray-50 border-transparent'
                    } flex items-center px-4 py-3 text-base font-semibold border-l-3 border rounded-xl transition-all duration-200`}
                  >
                    <Icon className={`h-5 w-5 mr-4 ${
                      isActive(item.href) ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-100 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-8 py-8">
              <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-primary-600 transition-colors">
                PropertyAI
              </Link>
            </div>
            <div className="flex-1 flex flex-col px-6">
              <nav className="flex-1 space-y-3">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isActive(item.href)
                          ? 'bg-primary-50 text-primary-700 border-primary-200'
                          : 'text-gray-700 hover:bg-gray-50 border-transparent hover:border-gray-200'
                      } group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 border`}
                    >
                      <Icon
                        className={`${
                          isActive(item.href)
                            ? 'text-primary-600'
                            : 'text-gray-400 group-hover:text-gray-600'
                        } mr-4 h-5 w-5 transition-colors`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 mt-8 mb-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl border border-primary-100">
                <div className="text-sm font-semibold text-gray-900 mb-1">AI-Powered</div>
                <div className="text-xs text-gray-600">Modern property inspection technology</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-72 flex flex-col flex-1">
          <main className="flex-1 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;