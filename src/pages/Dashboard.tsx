import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  Eye, 
  FileText, 
  GitCompare, 
  Calculator,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity,
  Zap,
  Shield,
  Target,
  BarChart3,
  Users,
  MapPin
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { 
      name: 'Active Inspections', 
      value: '12', 
      icon: Clock, 
      color: 'from-blue-600 to-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      change: '+12%',
      changeType: 'increase'
    },
    { 
      name: 'Completed Today', 
      value: '8', 
      icon: CheckCircle, 
      color: 'from-emerald-600 to-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      change: '+8%',
      changeType: 'increase'
    },
    { 
      name: 'Pending Review', 
      value: '4', 
      icon: Eye, 
      color: 'from-amber-600 to-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      change: '-15%',
      changeType: 'decrease'
    },
    { 
      name: 'Issues Detected', 
      value: '23', 
      icon: AlertTriangle, 
      color: 'from-red-600 to-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      change: '+5%',
      changeType: 'increase'
    },
  ];

  const recentInspections = [
    {
      id: 1,
      property: 'Sunset Apartments #302',
      type: 'Move-Out',
      tenant: 'Sarah Johnson',
      status: 'Completed',
      date: '2025-01-08',
      issues: 3,
      priority: 'high'
    },
    {
      id: 2,
      property: 'Oak Street Condo #15',
      type: 'Move-In',
      tenant: 'Michael Chen',
      status: 'In Review',
      date: '2025-01-08',
      issues: 1,
      priority: 'medium'
    },
    {
      id: 3,
      property: 'Riverside Tower #701',
      type: 'Move-Out',
      tenant: 'Emily Davis',
      status: 'Pending',
      date: '2025-01-07',
      issues: 0,
      priority: 'low'
    },
  ];

  const quickActions = [
    {
      name: 'Start New Inspection',
      description: 'Begin video recording for property inspection',
      href: '/capture',
      icon: Camera,
      color: 'from-indigo-600 to-indigo-500',
      hoverColor: 'hover:from-indigo-700 hover:to-indigo-600'
    },
    {
      name: 'Review AI Detections',
      description: 'Confirm damage detections and annotations',
      href: '/review',
      icon: Eye,
      color: 'from-purple-600 to-purple-500',
      hoverColor: 'hover:from-purple-700 hover:to-purple-600'
    },
    {
      name: 'Generate Report',
      description: 'Create and download inspection reports',
      href: '/report',
      icon: FileText,
      color: 'from-emerald-600 to-emerald-500',
      hoverColor: 'hover:from-emerald-700 hover:to-emerald-600'
    },
    {
      name: 'Compare Inspections',
      description: 'View before/after photo comparisons',
      href: '/compare',
      icon: GitCompare,
      color: 'from-orange-600 to-orange-500',
      hoverColor: 'hover:from-orange-700 hover:to-orange-600'
    },
  ];

  const aiMetrics = [
    { label: 'Damage Detection Accuracy', value: '98.5%', icon: Target },
    { label: 'Processing Time', value: '2.3s', icon: Zap },
    { label: 'Images Processed Today', value: '847', icon: Activity },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'In Review':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Pending':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-amber-500';
      case 'low':
        return 'bg-emerald-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="p-8 space-y-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-emerald-600/5 rounded-3xl"></div>
          <div className="relative p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
                  Property Inspection Dashboard
                </h1>
                <p className="text-lg text-slate-600 font-medium">
                  AI-powered property inspections and damage detection system
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">System Active</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900">January 8, 2025</div>
                  <div className="text-xs text-slate-500">Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="group">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bgColor} p-3 rounded-xl`}>
                      <Icon className={`h-6 w-6 ${stat.textColor}`} />
                    </div>
                    <div className={`flex items-center space-x-1 text-xs font-semibold ${
                      stat.changeType === 'increase' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`h-3 w-3 ${stat.changeType === 'decrease' ? 'rotate-180' : ''}`} />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900 tracking-tight mb-1">{stat.value}</p>
                    <p className="text-sm text-slate-600 font-semibold">{stat.name}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Quick Actions
            </h2>
            <div className="flex items-center space-x-2 text-slate-600">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm font-semibold">Workflow</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.name}
                  to={action.href}
                  className={`group relative overflow-hidden bg-gradient-to-r ${action.color} ${action.hoverColor} p-8 rounded-2xl text-white transition-all duration-300 shadow-sm hover:shadow-xl transform hover:-translate-y-1`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-white/20 p-2 rounded-xl">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wide opacity-90">
                          Step {index + 1}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 tracking-tight">{action.name}</h3>
                      <p className="text-sm opacity-90 font-medium leading-relaxed">{action.description}</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Inspections */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Recent Inspections
              </h2>
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                {recentInspections.length} Active
              </span>
            </div>
            <Link
              to="/review"
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 text-sm font-semibold transition-colors group"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Issues
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {recentInspections.map((inspection) => (
                    <tr key={inspection.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(inspection.priority)}`}></div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{inspection.property}</div>
                            <div className="flex items-center space-x-1 text-xs text-slate-500">
                              <MapPin className="h-3 w-3" />
                              <span>Los Angeles, CA</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                          {inspection.type}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {inspection.tenant.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-sm font-semibold text-slate-900">{inspection.tenant}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(inspection.status)}`}>
                          {inspection.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm font-bold">
                        {inspection.issues > 0 ? (
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="text-red-600">{inspection.issues} issues</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                            <span className="text-emerald-600">No issues</span>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-sm font-semibold text-slate-900">
                        {new Date(inspection.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI Processing Status */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-emerald-600 rounded-2xl"></div>
          <div className="relative bg-white/95 backdrop-blur rounded-2xl p-8 m-0.5">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-indigo-600 to-emerald-600 p-3 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    AI Processing Status
                  </h2>
                  <p className="text-slate-600 font-medium">Real-time system performance</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold">Online</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {aiMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="bg-slate-50 p-4 rounded-2xl mb-4 group-hover:bg-slate-100 transition-colors">
                      <Icon className="h-8 w-8 text-slate-600 mx-auto" />
                    </div>
                    <div className="text-4xl font-bold text-slate-900 tracking-tight mb-2">{metric.value}</div>
                    <div className="text-sm text-slate-600 font-semibold">{metric.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
            Ready to start your next inspection?
          </h3>
          <p className="text-slate-600 font-medium mb-6">
            Use AI-powered video analysis for faster, more accurate property assessments
          </p>
          <Link
            to="/capture"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Camera className="h-5 w-5" />
            <span>Start New Inspection</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;