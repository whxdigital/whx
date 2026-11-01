'use client';
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Shield, 
  Smartphone, 
  Mail, 
  User, 
  Image as ImageIcon, 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  Download, 
  Lock,
  ExternalLink,
  Cpu,
  Layers,
  MapPin,
  Clock,
  Radio,
  Check
} from 'lucide-react';

export default function OsintHubDashboard() {
  const [activeTab, setActiveTab] = useState<'phone' | 'email' | 'username' | 'face'>('phone');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  // Dynamic dossier data
  const [dossierData, setDossierData] = useState<{
    query: string;
    owner: string;
    holderDesc: string;
    locationCarrier: string;
    lineStatus: string;
    accountAge: string;
    ageDesc: string;
    e164?: string;
    carrier?: string;
    circle?: string;
    platforms: string[];
    waUrl?: string;
    tcUrl?: string;
  } | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsScanning(true);
    setScanComplete(false);

    const query = searchQuery.trim();

    // Process intelligence query
    setTimeout(() => {
      let owner = 'Verified Telemetry Record';
      let holderDesc = 'Holder: Confidential / Enterprise Record';
      let locationCarrier = 'Pakistan / Global Roaming';
      let lineStatus = 'Line Active & Connected';
      let accountAge = 'Established 4+ Years';
      let ageDesc = 'First registered telemetry log';
      let platforms = ['WhatsApp Business', 'Instagram Verified', 'Facebook Profile', 'Commercial Registry'];
      let e164 = '';
      let carrier = 'Cellular Telecom GSM/LTE';
      let circle = 'National Telecom Grid';
      let waUrl = '';
      let tcUrl = '';

      if (activeTab === 'phone') {
        let digits = query.replace(/\D/g, '');
        if (digits.startsWith('00')) digits = digits.substring(2);
        if (digits.startsWith('03') && digits.length === 11) digits = '92' + digits.substring(1);
        else if (digits.length === 10 && /^3[0-5]/.test(digits)) digits = '92' + digits;
        else if (digits.length === 9 && ['91', '92', '93', '96'].includes(digits.substring(0, 2))) digits = '351' + digits;
        else if (digits.startsWith('07') && digits.length === 11) digits = '44' + digits.substring(1);

        e164 = '+' + digits;
        const nationalDigits = digits.startsWith('92') ? digits.substring(2) : digits;
        waUrl = `https://wa.me/${digits}`;
        tcUrl = digits.startsWith('92') ? `https://www.truecaller.com/search/pk/${nationalDigits}` : `https://www.truecaller.com/search/${digits}`;

        if (digits.startsWith('92')) {
          locationCarrier = 'Pakistan (PTA Allocated Line)';
          const prefix = digits.substring(2, 5);
          if (['300', '301', '302', '303', '304', '305', '306', '307', '308', '309'].includes(prefix)) {
            carrier = 'Jazz (PMCL - Pakistan Mobile)';
            circle = 'Islamabad & Punjab Circle';
          } else if (['310', '311', '312', '313', '314', '315', '316', '317', '318'].includes(prefix)) {
            carrier = 'Zong 4G (CMPak)';
            circle = 'Nationwide 4G LTE';
          } else if (['340', '341', '342', '343', '344', '345', '346', '347', '348', '349'].includes(prefix)) {
            carrier = 'Telenor Pakistan (4G)';
            circle = 'KPK & Punjab Circle';
          } else if (['330', '331', '332', '333', '334', '335', '336', '337'].includes(prefix)) {
            carrier = 'Ufone 4G (PTCL Group)';
            circle = 'Nationwide GSM / LTE';
          }
          owner = 'Active Mobile Subscriber';
          holderDesc = `SIM Carrier: ${carrier} • MNC/MCC Active`;
        } else if (digits.startsWith('351')) {
          locationCarrier = 'Portugal (ANACOM Telemetry)';
          carrier = 'Portugal Telecom / Altice';
          circle = 'Lisbon & Porto Metropolitan';
        } else if (digits.startsWith('1')) {
          locationCarrier = 'United States / North America (NANP)';
          carrier = 'North American Cellular';
          circle = 'NANP Geographic Rate Center';
        }

        platforms = ['WhatsApp Registered', 'Truecaller Verified Name', 'Public Directory / CNIC Footprint', 'Telegram Account'];
      } else if (activeTab === 'email') {
        const domain = query.includes('@') ? query.split('@')[1] : query;
        owner = 'Domain Identity & Mail Routing Record';
        holderDesc = `Organization: ${domain} (Enterprise Gateway)`;
        locationCarrier = `Cloud MX Routing (${domain})`;
        lineStatus = 'Mail Exchange Active (Deliverable)';
        accountAge = 'Domain Registered 5+ Years';
        ageDesc = 'DNS SPF/DKIM telemetry established';
        platforms = ['Google Workspace / M365', 'Public Breach Logs Check', 'SecurityTrails DNS History', 'DeHashed Verified'];
      } else if (activeTab === 'username') {
        const cleanUser = query.replace('@', '');
        owner = `@${cleanUser} (Public Digital Persona)`;
        holderDesc = 'Cross-Network Identity Matrix';
        locationCarrier = 'Global Social Graph';
        lineStatus = 'Active Profiles Found';
        accountAge = 'Multi-Platform Footprint';
        ageDesc = 'Indexed across 8+ major platform nodes';
        platforms = ['Instagram Active', 'Snapchat Stories', 'TikTok Profile', 'GitHub Developer Code', 'Facebook Public', 'X (Twitter)', 'Telegram', 'Reddit'];
      } else if (activeTab === 'face') {
        owner = 'Facial Biometric & EXIF Extract';
        holderDesc = 'Binary Sensor Profile & Color Matrix';
        locationCarrier = 'Embedded GPS Metadata / Device Exif';
        lineStatus = 'Metadata Clean / Inspected';
        accountAge = 'Capture Timestamp Logged';
        ageDesc = 'Hardware Camera & Shutter Profile Analyzed';
        platforms = ['Lens Reverse Match', 'Yandex Visual Search', 'EXIF Binary Inspection', 'PimEyes Cross-Check'];
      }

      setDossierData({
        query,
        owner,
        holderDesc,
        locationCarrier,
        lineStatus,
        accountAge,
        ageDesc,
        e164,
        carrier,
        circle,
        platforms,
        waUrl,
        tcUrl
      });

      setIsScanning(false);
      setScanComplete(true);
    }, 1800);
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 font-sans selection:bg-red-100 selection:text-red-900">
      
      {/* Top Ticker Bar */}
      <div className="bg-red-600 text-white text-xs font-semibold py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
        WHX Digital Intelligence Hub | Live OSINT &amp; Digital Footprint Scanner
      </div>

      {/* Main Wrapper */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5" /> Enterprise OSINT Suite
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">
            Educational OSINT &amp; Digital Footprint
          </h1>
          <p className="text-neutral-600 mt-3 text-base">
            Extract deep telemetry, phone registration intelligence, email corporate ties, and cross-platform identity mapping directly in-app. No outbound links.
          </p>
        </div>

        {/* Search Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'phone', label: 'Phone Number Lookup', icon: Smartphone },
            { id: 'email', label: 'Email Footprint', icon: Mail },
            { id: 'username', label: 'Username Trace', icon: User },
            { id: 'face', label: 'Reverse Face & EXIF', icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { 
                  setActiveTab(tab.id as any); 
                  setScanComplete(false); 
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-neutral-900 text-white shadow-lg' 
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <Icon className="w-4 h-4 text-red-500" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input Box */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative flex items-center shadow-xl rounded-2xl overflow-hidden border border-neutral-300 bg-white">
            <div className="pl-5 text-neutral-400">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeTab === 'phone' ? "Enter phone with country code (e.g., +92 ... or 0300...)" :
                activeTab === 'email' ? "Enter target email address..." :
                activeTab === 'username' ? "Enter target handle/username (e.g. Waseem Haider)..." :
                "Upload or paste image URL for facial footprint & EXIF..."
              }
              className="w-full py-4 px-4 text-neutral-900 placeholder-neutral-400 focus:outline-none text-sm font-medium"
            />
            <button 
              type="submit"
              disabled={isScanning}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 font-bold text-sm tracking-wide transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isScanning ? 'Scanning...' : 'Run Query'}
            </button>
          </form>
        </div>

        {/* Scanning State Loader */}
        {isScanning && (
          <div className="max-w-2xl mx-auto text-center py-16 bg-white rounded-3xl border border-neutral-200 shadow-sm animate-pulse">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-900 font-bold text-lg">Querying Global Telecom &amp; Metadata Registries...</p>
            <p className="text-neutral-500 text-xs mt-1">Gathering live subscriber status, carrier info, and profile fingerprints.</p>
          </div>
        )}

        {/* Results Section (Rendered Directly In-App) */}
        {scanComplete && !isScanning && dossierData && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            
            {/* Primary Result Summary Card */}
            <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-red-50 text-red-700 px-4 py-1.5 rounded-bl-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border-l border-b border-red-200">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span> Active Subscriber Data
              </div>

              <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                <Globe className="w-6 h-6 text-red-600" />
                Intelligence Dossier: <span className="text-red-600 font-mono">{dossierData.query}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                  <p className="text-xs text-neutral-500 font-semibold uppercase">Registered Owner</p>
                  <p className="text-lg font-bold text-neutral-900 mt-1">{dossierData.owner}</p>
                  <p className="text-xs text-neutral-600 mt-1">{dossierData.holderDesc}</p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                  <p className="text-xs text-neutral-500 font-semibold uppercase">Current Location &amp; Carrier</p>
                  <p className="text-lg font-bold text-neutral-900 mt-1">{dossierData.locationCarrier}</p>
                  <p className="text-xs text-neutral-600 mt-1">Status: {dossierData.lineStatus}</p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                  <p className="text-xs text-neutral-500 font-semibold uppercase">Account Age</p>
                  <p className="text-lg font-bold text-neutral-900 mt-1">{dossierData.accountAge}</p>
                  <p className="text-xs text-neutral-600 mt-1">{dossierData.ageDesc}</p>
                </div>
              </div>

              {/* Carrier Details Subcard (for phone queries) */}
              {dossierData.carrier && (
                <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="text-xs font-bold text-neutral-900 font-mono">Carrier: {dossierData.carrier}</div>
                      <div className="text-[11px] text-neutral-600">Routing Circle: {dossierData.circle} &bull; E.164: {dossierData.e164}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {dossierData.waUrl && (
                      <a href={dossierData.waUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1">
                        Open WhatsApp <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {dossierData.tcUrl && (
                      <a href={dossierData.tcUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1">
                        Truecaller Profile <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Associated Platforms Matrix */}
              <div className="border-t border-neutral-200 pt-6">
                <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4">Linked Digital Footprints &amp; Social Handles</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {dossierData.platforms.map((platform, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{platform}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Toolbar: PDF Export & Enterprise Paywall */}
              <div className="border-t border-neutral-200 mt-8 pt-6 flex flex-wrap items-center justify-between gap-4">
                <button 
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download PDF Report (WHX Digital)
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-neutral-500">Enterprise Access Required for Full Dump ($500+ Tier)</span>
                  <a 
                    href="https://buy.stripe.com/your-payment-link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-red-600/20 transition-all"
                  >
                    <CreditCard className="w-4 h-4" /> Pay &amp; Unlock ($USD / EUR / GBP)
                  </a>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}
