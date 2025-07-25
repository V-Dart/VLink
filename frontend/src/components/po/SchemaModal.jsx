import { useState } from "react";
import { FaTimes, FaTable, FaUsers, FaClock, FaDatabase, FaDownload, FaEdit } from "react-icons/fa";
import { SiMongodb, SiPostgresql, SiFirebase, SiMysql } from "react-icons/si";

const dbIcons = {
  "MongoDB": <SiMongodb className="text-green-500" />,
  "PostgreSQL": <SiPostgresql className="text-blue-500" />,
  "Firebase": <SiFirebase className="text-orange-500" />,
  "MySQL": <SiMysql className="text-blue-600" />
};

const getFieldTypeIcon = (fieldName) => {
  const lowerField = fieldName.toLowerCase();
  if (lowerField.includes('id')) return '🔑';
  if (lowerField.includes('email')) return '📧';
  if (lowerField.includes('name') || lowerField.includes('title')) return '📝';
  if (lowerField.includes('date') || lowerField.includes('time')) return '📅';
  if (lowerField.includes('price') || lowerField.includes('cost')) return '💰';
  if (lowerField.includes('status')) return '📊';
  if (lowerField.includes('count') || lowerField.includes('number')) return '🔢';
  if (lowerField.includes('url') || lowerField.includes('link')) return '🔗';
  if (lowerField.includes('phone')) return '📞';
  if (lowerField.includes('address')) return '📍';
  if (lowerField.includes('role') || lowerField.includes('type')) return '👤';
  return '📄';
};

export default function SchemaModal({ isOpen, client, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTable, setSelectedTable] = useState(null);

  if (!isOpen || !client) return null;

  const {
    clientName,
    dbType,
    usedStorage,
    totalStorage,
    storagePercentage,
    tables,
    connectionStatus,
    lastBackup
  } = client;

  const dbIcon = dbIcons[dbType] || <FaDatabase className="text-gray-400" />;
  const totalRecords = Object.values(tables).reduce((sum, table) => sum + table.count, 0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleTableSelect = (tableName) => {
    setSelectedTable(tableName);
    setActiveTab('table-detail');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaDatabase /> },
    { id: 'schema', label: 'Schema', icon: <FaTable /> },
    { id: 'table-detail', label: 'Table Details', icon: <FaEdit />, hidden: !selectedTable }
  ].filter(tab => !tab.hidden);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e293b] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {dbIcon}
            <div>
              <h2 className="text-2xl font-bold text-white">{clientName}</h2>
              <p className="text-gray-400">{dbType} Database Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-white border-b-2 border-green-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Database Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0f172a] rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center gap-3">
                    <FaDatabase className="text-green-400 text-xl" />
                    <div>
                      <p className="text-2xl font-bold text-white">{Object.keys(tables).length}</p>
                      <p className="text-gray-400 text-sm">Tables/Collections</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0f172a] rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center gap-3">
                    <FaUsers className="text-blue-400 text-xl" />
                    <div>
                      <p className="text-2xl font-bold text-white">{totalRecords.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm">Total Records</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#0f172a] rounded-xl p-4 border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${connectionStatus === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="text-lg font-bold text-white capitalize">{connectionStatus}</p>
                      <p className="text-gray-400 text-sm">Connection Status</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Storage Information */}
              <div className="bg-[#0f172a] rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Storage Usage</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Used Storage:</span>
                    <span className="text-white font-medium">{usedStorage.toFixed(2)} GB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Total Storage:</span>
                    <span className="text-white font-medium">{totalStorage.toFixed(2)} GB</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        storagePercentage >= 90 ? 'bg-red-500' :
                        storagePercentage >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${storagePercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400">{storagePercentage}% used</p>
                </div>
              </div>

              {/* Backup Information */}
              <div className="bg-[#0f172a] rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FaClock />
                  Backup Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Last Backup:</span>
                    <span className="text-white font-medium">{formatDate(lastBackup)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Backup Status:</span>
                    <span className="text-green-400 font-medium">Up to date</span>
                  </div>
                </div>
                <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <FaDownload />
                  Download Backup
                </button>
              </div>
            </div>
          )}

          {/* Schema Tab */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Database Schema</h3>
                <span className="text-sm text-gray-400">{Object.keys(tables).length} tables/collections</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(tables).map(([tableName, tableData]) => (
                  <div
                    key={tableName}
                    className="bg-[#0f172a] rounded-xl p-4 border border-gray-700 hover:border-green-500/50 cursor-pointer transition-all"
                    onClick={() => handleTableSelect(tableName)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-white capitalize flex items-center gap-2">
                        <FaTable className="text-green-400" />
                        {tableName}
                      </h4>
                      <span className="text-sm text-gray-400">{tableData.count.toLocaleString()} records</span>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-300">
                        <span className="text-gray-400">Fields:</span> {tableData.fields.length}
                      </p>
                      <p className="text-sm text-gray-300">
                        <span className="text-gray-400">Last Updated:</span> {formatDate(tableData.lastUpdated)}
                      </p>
                      
                      {/* Field Preview */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tableData.fields.slice(0, 4).map((field) => (
                          <span
                            key={field}
                            className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full flex items-center gap-1"
                          >
                            <span>{getFieldTypeIcon(field)}</span>
                            {field}
                          </span>
                        ))}
                        {tableData.fields.length > 4 && (
                          <span className="px-2 py-1 text-xs bg-gray-600 text-gray-400 rounded-full">
                            +{tableData.fields.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Table Detail Tab */}
          {activeTab === 'table-detail' && selectedTable && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white capitalize flex items-center gap-2">
                    <FaTable className="text-green-400" />
                    {selectedTable} Table
                  </h3>
                  <p className="text-gray-400">{tables[selectedTable].count.toLocaleString()} total records</p>
                </div>
                <button
                  onClick={() => setActiveTab('schema')}
                  className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  ← Back to Schema
                </button>
              </div>

              {/* Table Statistics */}
              <div className="bg-[#0f172a] rounded-xl p-6 border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">Table Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-white">{tables[selectedTable].count.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">Total Records</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{tables[selectedTable].fields.length}</p>
                    <p className="text-gray-400 text-sm">Fields/Columns</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">{formatDate(tables[selectedTable].lastUpdated)}</p>
                    <p className="text-gray-400 text-sm">Last Updated</p>
                  </div>
                </div>
              </div>

              {/* Field Details */}
              <div className="bg-[#0f172a] rounded-xl p-6 border border-gray-700">
                <h4 className="text-lg font-semibold text-white mb-4">Field Structure</h4>
                <div className="space-y-3">
                  {tables[selectedTable].fields.map((field, index) => (
                    <div
                      key={field}
                      className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <span className="text-lg">{getFieldTypeIcon(field)}</span>
                      <div className="flex-1">
                        <p className="text-white font-medium">{field}</p>
                        <p className="text-xs text-gray-400">
                          {field.toLowerCase().includes('id') ? 'Primary Key' :
                           field.toLowerCase().includes('email') ? 'Email Address' :
                           field.toLowerCase().includes('date') || field.toLowerCase().includes('time') ? 'Timestamp' :
                           field.toLowerCase().includes('price') || field.toLowerCase().includes('cost') ? 'Currency' :
                           'Text Field'}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">#{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
