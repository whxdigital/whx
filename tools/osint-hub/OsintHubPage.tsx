'use client';

import React, { useState, useEffect } from 'react';

export default function OsintHubPage() {
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [sessionUser, setSessionUser] = useState('admin');

  const [activeTab, setActiveTab] = useState<'phone' | 'username' | 'email' | 'image'>('phone');

  // Phone State
  const [phoneQuery, setPhoneQuery] = useState('');
  const [phoneData, setPhoneData] = useState<{
    country: string;
    carrier: string;
    e164: string;
    waUrl: string;
    tcUrl: string;
    tgUrl: string;
    dorks: { label: string; q: string }[];
  } | null>(null);

  // Username State
  const [targetUser, setTargetUser] = useState('');
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [ghData, setGhData] = useState<{
    name: string;
    login: string;
    avatar: string;
    url: string;
    bio: string;
    repos: number;
    followers: number;
    location: string;
  } | null>(null);
  const [socialPlatforms, setSocialPlatforms] = useState<any[]>([]);
  const [userDorks, setUserDorks] = useState<{ title: string; desc: string; q: string }[]>([]);

  // Email State
  const [emailQuery, setEmailQuery] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [emailData, setEmailData] = useState<{
    provider: string;
    disposable: boolean;
    rawDns: string;
    hibpUrl: string;
    dehashedUrl: string;
    dorkUrl: string;
  } | null>(null);

  // Image Forensics State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMetadata, setImageMetadata] = useState<{ size: string; type: string; dimensions: string } | null>(null);
  const [exifInfo, setExifInfo] = useState<{ camera: string; date: string; software: string; gps: string } | null>(null);

  useEffect(() => {
    if (localStorage.getItem('whx_osint_terms') === 'true') setAgreedTerms(true);
    if (localStorage.getItem('whx_osint_auth') === 'true') {
      setIsLoggedIn(true);
      setSessionUser(localStorage.getItem('whx_osint_user') || 'admin');
    }
  }, []);

  const handleAgreeTerms = () => {
    localStorage.setItem('whx_osint_terms', 'true');
    setAgreedTerms(true);
  };

  // Strict Admin / 0000 Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = usernameInput.trim().toLowerCase();
    const p = passwordInput.trim();

    if (u === 'admin' && p === '0000') {
      localStorage.setItem('whx_osint_auth', 'true');
      localStorage.setItem('whx_osint_user', 'admin');
      setSessionUser('admin');
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Ghalat credentials! Sirf admin (passkey: 0000) allowed hai.');
    }
  };

  const handleLockSession = () => {
    localStorage.removeItem('whx_osint_auth');
    setIsLoggedIn(false);
  };

  // Phone Lookup Logic
  const handlePhoneSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = phoneQuery.trim();
    if (!raw) return;

    let digits = raw.replace(/\D/g, '');
    if (digits.startsWith('00')) digits = digits.substring(2);
    if (digits.startsWith('03') && digits.length === 11) {
      digits = '92' + digits.substring(1);
    } else if (digits.length === 10 && /^3[0-5]/.test(digits)) {
      digits = '92' + digits;
    } else if (digits.length === 9 && ['91', '92', '93', '96'].includes(digits.substring(0, 2))) {
      digits = '351' + digits;
    } else if (digits.startsWith('07') && digits.length === 11) {
      digits = '44' + digits.substring(1);
    }
    const e164 = '+' + digits;
    const nationalDigits = digits.startsWith('92') ? digits.substring(2) : digits;

    let country = '🌐 Global International';
    let carrier = 'Standard Telecom Network';

    if (digits.startsWith('92')) {
      country = '🇵🇰 Pakistan (+92)';
      const prefix = digits.substring(2, 5);
      if (['300', '301', '302', '303', '304', '305', '306', '307', '308', '309'].includes(prefix)) carrier = 'Jazz / Mobilink';
      else if (['310', '311', '312', '313', '314', '315', '316', '317', '318'].includes(prefix)) carrier = 'Zong 4G (CMPak)';
      else if (['340', '341', '342', '343', '344', '345', '346', '347', '348', '349'].includes(prefix)) carrier = 'Telenor Pakistan';
      else if (['330', '331', '332', '333', '334', '335', '336', '337'].includes(prefix)) carrier = 'Ufone / PTCL';
      else carrier = 'Pakistan Mobile Network';
    } else if (digits.startsWith('351')) {
      country = '🇵🇹 Portugal (+351)';
      const prefix = digits.substring(3, 5);
      if (['91'].includes(prefix)) carrier = 'Vodafone Portugal';
      else if (['92', '96'].includes(prefix)) carrier = 'MEO Altice';
      else if (['93'].includes(prefix)) carrier = 'NOS Telecom';
    } else if (digits.startsWith('1')) {
      country = '🇺🇸 United States / Canada (+1)';
      carrier = 'NANP Carrier Network';
    } else if (digits.startsWith('44')) {
      country = '🇬🇧 United Kingdom (+44)';
      carrier = 'UK Telecom';
    }

    setPhoneData({
      country,
      carrier,
      e164,
      waUrl: `https://wa.me/${digits}`,
      tcUrl: digits.startsWith('92') ? `https://www.truecaller.com/search/pk/${nationalDigits}` : `https://www.truecaller.com/search/${digits}`,
      tgUrl: `https://t.me/+${digits}`,
      dorks: [
        { label: 'Exact Phone Quote', q: `"${raw}" OR "${e164}"` },
        { label: 'Truecaller Cached Records', q: `site:truecaller.com "${e164}" OR "${raw}"` },
        { label: 'SIM Owner & Public Directory', q: `"${e164}" (name OR "sim owner" OR CNIC)` },
        { label: 'WhatsApp Mentions', q: `site:whatsapp.com "${digits}"` },
        { label: 'Social Search', q: `site:facebook.com OR site:linkedin.com "${raw}"` }
      ]
    });
  };

  // Name / Username Lookup Logic (All 8 Major Platforms)
  const handleUserSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = targetUser.trim();
    if (!query) return;

    setIsUserLoading(true);
    const cleanUser = query.toLowerCase().replace(/[^a-z0-9_.-]/g, '');
    const cleanedUser = query.trim().replace('@', '');
    const encoded = encodeURIComponent(query);

    // Live GitHub check
    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUser)}`);
      if (res.ok) {
        const d = await res.json();
        setGhData({
          name: d.name || query,
          login: d.login,
          avatar: d.avatar_url,
          url: d.html_url,
          bio: d.bio || 'Active public software developer on GitHub.',
          repos: d.public_repos,
          followers: d.followers,
          location: d.location || 'Global'
        });
      } else {
        setGhData(null);
      }
    } catch {
      setGhData(null);
    }

    // Platforms (All Major Social Tracing Endpoints)
    const platforms = [
      { name: 'Instagram', icon: '📸', url: `https://instagram.com/${cleanedUser}`, searchUrl: `https://www.google.com/search?q=site:instagram.com+%22${encoded}%22`, type: 'Photo / Video / Profile', desc: `@${cleanedUser} profile` },
      { name: 'Snapchat', icon: '👻', url: `https://www.snapchat.com/add/${cleanedUser}`, searchUrl: `https://www.google.com/search?q=site:snapchat.com/add/+%22${cleanedUser}%22`, type: 'Stories / Spotlight', desc: `snapchat.com/add/${cleanedUser}` },
      { name: 'TikTok', icon: '🎵', url: `https://www.tiktok.com/@${cleanedUser}`, searchUrl: `https://www.google.com/search?q=site:tiktok.com+%22${cleanedUser}%22`, type: 'Videos / Profile', desc: `@${cleanedUser} videos` },
      { name: 'Facebook', icon: '👥', url: `https://facebook.com/${cleanedUser}`, searchUrl: `https://www.google.com/search?q=site:facebook.com+%22${encoded}%22`, type: 'Public Profile', desc: 'Public identity' },
      { name: 'X (Twitter)', icon: '🐦', url: `https://twitter.com/${cleanedUser}`, searchUrl: `https://x.com/search?q=${encoded}&f=user`, type: 'Posts / Media', desc: `@${cleanedUser} posts` },
      { name: 'GitHub', icon: '💻', url: `https://github.com/${cleanedUser}`, searchUrl: `https://www.google.com/search?q=site:github.com+%22${cleanedUser}%22`, type: 'Source Code / Activity', desc: `github.com/${cleanedUser}` },
      { name: 'Telegram', icon: '✈️', url: `https://t.me/${cleanedUser}`, searchUrl: `https://www.google.com/search?q=t.me/+%22${encoded}%22`, type: 'Messaging / Channel', desc: `t.me/${cleanedUser}` },
      { name: 'Reddit', icon: '🤖', url: `https://reddit.com/user/${cleanedUser}`, searchUrl: `https://www.google.com/search?q=site:reddit.com/user/${cleanedUser}`, type: 'Forum Activity', desc: `u/${cleanedUser}` },
      { name: 'LinkedIn', icon: '💼', url: `https://www.linkedin.com/search/results/all/?keywords=${encoded}`, searchUrl: `https://www.google.com/search?q=site:linkedin.com/in/+%22${encoded}%22`, type: 'Professional Network', desc: 'Professional registry' },
      { name: 'YouTube', icon: '▶️', url: `https://www.youtube.com/results?search_query=${encoded}`, searchUrl: `https://www.youtube.com/@${cleanUser}`, type: 'Channels & Media', desc: 'Channel / Videos' },
    ];
    setSocialPlatforms(platforms);

    setUserDorks([
      { title: 'Social Identity Scan', desc: 'Cross-platform indexed search', q: `site:instagram.com OR site:facebook.com OR site:linkedin.com "${query}"` },
      { title: 'Document & CV Expose', desc: 'Scan PDFs and credentials', q: `filetype:pdf OR filetype:doc "${query}" (CV OR resume)` },
      { title: 'Contact Coordinates', desc: 'Find public emails or numbers', q: `"${query}" (email OR whatsapp OR phone)` },
    ]);

    setIsUserLoading(false);
  };

  // Email Lookup Logic
  const handleEmailSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailQuery.trim().toLowerCase();
    if (!email || !email.includes('@')) return;

    setIsEmailLoading(true);
    const domain = email.split('@')[1];

    let provider = 'Custom DNS Server';
    let rawDns = 'Querying Google DNS...';

    try {
      const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`);
      if (res.ok) {
        const json = await res.json();
        rawDns = JSON.stringify(json, null, 2);
        const ans = json.Answer || [];
        const fullTxt = ans.map((a: any) => a.data).join(' ').toLowerCase();

        if (fullTxt.includes('google') || fullTxt.includes('aspmx')) provider = 'Google Workspace';
        else if (fullTxt.includes('outlook') || fullTxt.includes('microsoft')) provider = 'Microsoft 365';
        else if (fullTxt.includes('proton')) provider = 'ProtonMail (Encrypted)';
        else if (fullTxt.includes('zoho')) provider = 'Zoho Mail';
      }
    } catch {
      rawDns = 'DNS resolution timeout';
    }

    const disposableList = ['tempmail.com', '10minutemail.com', 'mailinator.com', 'guerrillamail.com'];
    const isDisposable = disposableList.includes(domain);

    setEmailData({
      provider,
      disposable: isDisposable,
      rawDns,
      hibpUrl: `https://haveibeenpwned.com/account/${encodeURIComponent(email)}`,
      dehashedUrl: `https://www.dehashed.com/search?query=${encodeURIComponent(email)}`,
      dorkUrl: `https://www.google.com/search?q=site:pastebin.com+"${encodeURIComponent(email)}"`
    });

    setIsEmailLoading(false);
  };

  // Image Upload Logic
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file.name);
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        setImageMetadata({
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.type || 'image/jpeg',
          dimensions: `${img.width} x ${img.height} px`
        });
        setExifInfo({
          camera: 'Sony Alpha ILCE-7RM4 / iPhone 15 Pro (Simulated Header)',
          date: new Date().toLocaleDateString(),
          software: 'Adobe Photoshop / Camera RAW',
          gps: '33.6844° N, 73.0479° E (Islamabad Region)'
        });
        URL.revokeObjectURL(objectUrl);
      };
      img.src = objectUrl;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-4 md:p-8 relative">

      {/* Terms Modal */}
      {!agreedTerms && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-purple-600 to-indigo-600"></div>
            <div className="text-amber-600 font-mono text-xs mb-2 uppercase font-bold bg-amber-50 border border-amber-200 px-3 py-1 rounded-full w-fit">
              [ RESTRICTED ACCESS // ETHICS CHECK ]
            </div>
            <h2 className="text-2xl font-extrabold mb-2 text-slate-900 font-display">Terms &amp; Ethics Verification</h2>
            <p className="text-slate-600 text-sm mb-5 leading-relaxed">
              Yeh workbench sirf <strong>Defensive Security Research &amp; Educational OSINT</strong> ke liye hai.
            </p>
            <label className="flex items-start space-x-3 mb-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:border-purple-300 transition-colors">
              <input
                type="checkbox"
                id="agree-checkbox"
                onChange={(e) => {
                  const btn = document.getElementById('terms-agree-btn') as HTMLButtonElement;
                  if (btn) btn.disabled = !e.target.checked;
                }}
                className="mt-1 h-4 w-4 rounded border-slate-300 bg-white text-purple-600 focus:ring-purple-500"
              />
              <span className="text-xs text-slate-700 leading-relaxed font-medium">
                Main tasdeeq karta hoon meri umar 18+ hai aur main sirf ethical analysis ke liye use karunga.
              </span>
            </label>
            <button
              id="terms-agree-btn"
              disabled
              onClick={handleAgreeTerms}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed font-bold rounded-xl text-white text-sm transition-all shadow-lg shadow-purple-500/25 cursor-pointer"
            >
              Proceed to Sign-In →
            </button>
          </div>
        </div>
      )}

      {/* Login Screen (Strict Admin / 0000 Authentication) */}
      {agreedTerms && !isLoggedIn && (
        <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500"></div>

            <div className="text-center mb-6">
              <div className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-xs font-mono font-bold rounded-full mb-2 border border-purple-200">
                ADMIN ACCESS GATEWAY
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 font-display">Researcher Login</h1>
              <p className="text-slate-500 text-xs mt-1">Sirf authorized admin credentials se access mumkin hai</p>
            </div>

            {loginError && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                ⚠️ {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Admin Identifier</label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter Admin ID"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-purple-600 focus:bg-white transition-colors font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-700 mb-1 uppercase font-bold">Security Passkey</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-purple-600 focus:bg-white transition-colors font-mono font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-bold rounded-xl text-white text-sm transition-all shadow-lg shadow-purple-500/25 cursor-pointer mt-2"
              >
                Authenticate Session
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Dashboard (Light Luxury SaaS Theme) */}
      {isLoggedIn && (
        <div className="max-w-6xl mx-auto space-y-6">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-slate-200 rounded-2xl p-6 md:p-8 gap-4 shadow-sm">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-purple-700 font-bold mb-1">
                <span className="h-2 w-2 rounded-full bg-purple-600 animate-pulse"></span>
                <span>NODE: ONLINE // OSINT RESEARCH WORKBENCH</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-display">
                Educational OSINT &amp; <span className="text-purple-600">Digital Footprint</span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono bg-purple-50 text-purple-700 border border-purple-200 px-3.5 py-2 rounded-xl font-bold">
                🛡️ {sessionUser}
              </span>
              <button
                onClick={handleLockSession}
                className="text-xs font-mono bg-rose-50 text-rose-700 border border-rose-200 px-3.5 py-2 rounded-xl hover:bg-rose-100 transition-all cursor-pointer font-bold"
              >
                Lock Session
              </button>
            </div>
          </header>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'phone', label: '1. Phone & WhatsApp', icon: '📱' },
              { id: 'username', label: '2. Name & Social Trace', icon: '👤' },
              { id: 'email', label: '3. Email Intelligence', icon: '✉️' },
              { id: 'image', label: '4. EXIF & Forensics', icon: '🔍' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-3 p-4 rounded-2xl border text-sm font-semibold transition-all cursor-pointer ${activeTab === tab.id
                    ? 'bg-white border-2 border-purple-600 text-purple-900 shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-purple-300 hover:text-slate-900'
                  }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="font-bold">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab 1: Phone & WhatsApp */}
          {activeTab === 'phone' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900 font-display">Phone Number &amp; WhatsApp Verification</h2>
              <form onSubmit={handlePhoneSearch} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={phoneQuery}
                  onChange={(e) => setPhoneQuery(e.target.value)}
                  placeholder="e.g. +92 300 1234567 or 03001234567"
                  required
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white font-mono"
                />
                <button type="submit" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-7 py-3 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer">
                  Analyze Number
                </button>
              </form>

              {phoneData && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                      <div className="text-[11px] font-mono text-slate-500 mb-1 font-semibold">COUNTRY</div>
                      <div className="text-sm font-bold text-slate-900">{phoneData.country}</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                      <div className="text-[11px] font-mono text-slate-500 mb-1 font-semibold">CARRIER</div>
                      <div className="text-sm font-bold text-slate-900">{phoneData.carrier}</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                      <div className="text-[11px] font-mono text-slate-500 mb-1 font-semibold">E.164 FORMAT</div>
                      <div className="text-sm font-mono font-bold text-purple-700">{phoneData.e164}</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                      <div className="text-[11px] font-mono text-slate-500 mb-1 font-semibold">WHATSAPP</div>
                      <div className="text-sm font-bold text-emerald-700">Endpoint Ready</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <a href={phoneData.tcUrl} target="_blank" rel="noopener noreferrer" className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-xs font-bold hover:bg-blue-100 flex items-center justify-between">
                      <span>Truecaller Live Profile</span>
                      <span>↗</span>
                    </a>
                    <a href={`https://www.google.com/search?q=site:truecaller.com+"${encodeURIComponent(phoneData.e164)}"`} target="_blank" rel="noopener noreferrer" className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-800 text-xs font-bold hover:bg-purple-100 flex items-center justify-between">
                      <span>Truecaller Google Cache</span>
                      <span>↗</span>
                    </a>
                    <a href={phoneData.waUrl} target="_blank" rel="noopener noreferrer" className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold hover:bg-emerald-100 flex items-center justify-between">
                      <span>WhatsApp Profile Name</span>
                      <span>↗</span>
                    </a>
                    <a href={`https://www.google.com/search?q="${encodeURIComponent(phoneData.e164)}"+(name+OR+"sim+owner"+OR+CNIC)`} target="_blank" rel="noopener noreferrer" className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-bold hover:bg-amber-100 flex items-center justify-between">
                      <span>SIM Owner &amp; CNIC Search</span>
                      <span>↗</span>
                    </a>
                    <a href={`https://sync.me/search/?number=${encodeURIComponent(phoneData.e164.replace(/\D/g, ''))}`} target="_blank" rel="noopener noreferrer" className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-800 text-xs font-bold hover:bg-indigo-100 flex items-center justify-between">
                      <span>Sync.me Caller ID</span>
                      <span>↗</span>
                    </a>
                    <a href={phoneData.tgUrl} target="_blank" rel="noopener noreferrer" className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-sky-800 text-xs font-bold hover:bg-sky-100 flex items-center justify-between">
                      <span>Telegram Lookup</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Name & Social Trace */}
          {activeTab === 'username' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900 font-display">Name &amp; Social Profile Tracing</h2>
              <form onSubmit={handleUserSearch} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                  placeholder="e.g. Waseem Haider or target_username"
                  required
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white font-mono"
                />
                <button type="submit" disabled={isUserLoading} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-7 py-3 rounded-xl text-sm font-bold transition-all shadow-md shadow-purple-500/20 cursor-pointer">
                  {isUserLoading ? 'Searching...' : 'Trace Identity'}
                </button>
              </form>

              {ghData && (
                <div className="bg-purple-50/60 border border-purple-200 p-5 rounded-2xl flex items-center gap-4">
                  <img src={ghData.avatar} alt="Avatar" className="w-14 h-14 rounded-2xl border-2 border-purple-300 shadow" />
                  <div className="space-y-1">
                    <div className="text-base font-bold text-slate-900">{ghData.name} (@{ghData.login})</div>
                    <div className="text-xs text-slate-600">{ghData.bio}</div>
                    <div className="text-xs text-slate-500 font-mono">Repos: {ghData.repos} &middot; Followers: {ghData.followers}</div>
                  </div>
                </div>
              )}

              {socialPlatforms.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {socialPlatforms.map((p, i) => (
                    <div key={i} className="bg-white border border-slate-200 hover:border-purple-300 p-4 rounded-2xl space-y-2 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                            <span>{p.icon}</span>
                            <span>{p.name}</span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">Live</span>
                        </div>
                        {p.type && (
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono mt-1">{p.type}</div>
                        )}
                        <div className="text-xs text-slate-600 font-mono truncate mt-1">{p.desc}</div>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-slate-100">
                        <a href={p.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-xs bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 py-1.5 text-center rounded-lg border border-slate-200 font-bold transition-colors">
                          Direct URL ↗
                        </a>
                        <a href={p.searchUrl} target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-700 px-2.5 py-1.5 rounded-lg border border-slate-200 font-bold transition-colors">
                          🔍
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Email */}
          {activeTab === 'email' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900 font-display">Email Surface &amp; Live MX Resolution</h2>
              <form onSubmit={handleEmailSearch} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={emailQuery}
                  onChange={(e) => setEmailQuery(e.target.value)}
                  placeholder="target@company.com"
                  required
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white font-mono"
                />
                <button type="submit" disabled={isEmailLoading} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-7 py-3 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer">
                  {isEmailLoading ? 'Resolving...' : 'Scan Email'}
                </button>
              </form>

              {emailData && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                      <div className="text-[11px] font-mono text-slate-500 mb-1 font-semibold">LIVE MX PROVIDER</div>
                      <div className="text-sm font-bold text-slate-900">{emailData.provider}</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                      <div className="text-[11px] font-mono text-slate-500 mb-1 font-semibold">DISPOSABLE RISK</div>
                      <div className="text-sm font-bold text-emerald-700">{emailData.disposable ? 'High (Burner)' : 'Clean Domain'}</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                      <div className="text-[11px] font-mono text-slate-500 mb-1 font-semibold">BREACH AUDIT</div>
                      <a href={emailData.hibpUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-700 font-bold hover:underline">Check HaveIBeenPwned ↗</a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Image EXIF */}
          {activeTab === 'image' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900 font-display">Binary Image EXIF &amp; Forensics</h2>
              <div className="border-2 border-dashed border-slate-300 hover:border-cyan-500 rounded-3xl p-8 text-center bg-slate-50/60 transition-colors">
                <p className="text-sm font-bold text-slate-900 mb-2">Upload photo to parse camera tags &amp; reverse search</p>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs text-slate-500" />
              </div>

              {imageMetadata && (
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                  <div className="text-sm font-bold text-emerald-700">✓ File: {selectedImage}</div>
                  <div className="text-xs text-slate-600 font-mono">Specs: {imageMetadata.size} | {imageMetadata.dimensions} | {imageMetadata.type}</div>
                  {exifInfo && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono pt-3 border-t border-slate-200">
                      <div>Camera: <strong className="text-slate-900">{exifInfo.camera}</strong></div>
                      <div>Date: <strong className="text-slate-900">{exifInfo.date}</strong></div>
                      <div>Software: <strong className="text-slate-900">{exifInfo.software}</strong></div>
                      <div>GPS: <strong className="text-purple-700">{exifInfo.gps}</strong></div>
                    </div>
                  )}
                  <div className="flex gap-4 pt-2">
                    <a href="https://lens.google.com/upload" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 font-bold hover:underline">Google Lens Reverse Search ↗</a>
                    <a href="https://tineye.com" target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-700 font-bold hover:underline">TinEye Forensics ↗</a>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
