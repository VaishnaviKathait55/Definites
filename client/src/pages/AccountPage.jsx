import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// ── Helpers ───────────────────────────────────────────────────────────────────

const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

// ── Data ──────────────────────────────────────────────────────────────────────

const stats = [
  { label: 'Active Cases',  value: '3',      sub: '1 hearing this week',  color: 'primary', icon: 'ti-briefcase'   },
  { label: 'Documents',     value: '14',     sub: '2 pending review',     color: 'teal',    icon: 'ti-file-text'   },
  { label: 'Next Hearing',  value: '12 May', sub: 'CESTAT, New Delhi',    color: 'amber',   icon: 'ti-calendar'    },
  { label: 'Open Queries',  value: '2',      sub: '1 replied',            color: 'rose',    icon: 'ti-message'     },
];

const cases = [
  { id: 'GST/2024/091',  title: 'Input Tax Credit Dispute',       forum: 'CESTAT, New Delhi',        next: '12 May 2024', status: 'urgent', amount: '₹48,20,000' },
  { id: 'CUST/2024/021', title: 'Customs Classification — HS Code', forum: 'Commissionerate, Delhi', next: '18 May 2024', status: 'active', amount: '₹12,50,000' },
  { id: 'GST/2024/055',  title: 'IGST Refund — SEZ Supply',       forum: 'GST Authority',            next: 'Awaited',     status: 'review', amount: '₹6,80,000'  },
];

const documents = [
  { name: 'INV-Batch-Q3-2023.pdf',    type: 'Invoice',       case: 'GST/2024/091',  date: 'Today',      status: 'pending',    icon: 'ti-file-invoice', color: 'blue'    },
  { name: 'EWB-4821930211.pdf',       type: 'E-way Bill',    case: 'GST/2024/091',  date: '5 hrs ago',  status: 'verified',   icon: 'ti-route',        color: 'teal'    },
  { name: 'ITC-Mismatch-Report.xlsx', type: 'Report',        case: 'GST/2024/091',  date: 'Yesterday',  status: 'processing', icon: 'ti-table',        color: 'amber'   },
  { name: 'Show-Cause-Notice.pdf',    type: 'Notice',        case: 'CUST/2024/021', date: '2 days ago', status: 'verified',   icon: 'ti-file-alert',   color: 'rose'    },
  { name: 'Reply-Brief-Draft-v2.docx',type: 'Brief',         case: 'GST/2024/091',  date: '3 days ago', status: 'review',     icon: 'ti-file-text',    color: 'primary' },
];

const activity = [
  { msg: 'Hearing rescheduled — CESTAT shifted date to 12 May',   time: 'Today 9:00 AM',    color: '#c53030' },
  { msg: '14 documents uploaded — ITC invoices Q3 2023',          time: 'Yesterday 3:00 PM',color: '#184E44' },
  { msg: 'Advocate Rahul Sharma assigned as lead counsel',         time: '5 Jan 2024',       color: '#d97706' },
  { msg: 'Case GST/2024/091 filed — Show Cause Notice received',  time: '2 Jan 2024',       color: '#9ca3af' },
];

// ── Token maps ────────────────────────────────────────────────────────────────

const statusMap = {
  urgent:     { label: 'Urgent',     bg: '#fff0f0', color: '#c53030' },
  active:     { label: 'Active',     bg: '#e6f4f0', color: '#184E44' },
  review:     { label: 'In Review',  bg: '#fffbeb', color: '#b45309' },
  pending:    { label: 'Pending',    bg: '#fffbeb', color: '#b45309' },
  verified:   { label: 'Verified',   bg: '#e6f4f0', color: '#184E44' },
  processing: { label: 'Processing', bg: '#eff6ff', color: '#1e40af' },
};

const colorMap = {
  primary: { accent: '#184E44', light: '#e6f4f0' },
  teal:    { accent: '#0f766e', light: '#e0f2f1' },
  amber:   { accent: '#b45309', light: '#fffbeb' },
  rose:    { accent: '#be185d', light: '#fdf2f8' },
  blue:    { accent: '#1e40af', light: '#eff6ff' },
};

// ── Shared tokens (inline style helpers) ─────────────────────────────────────

const T = {
  // Surfaces
  bg:        '#f5f4f0',
  surface:   '#ffffff',
  surface2:  '#f0ede8',
  surface3:  '#e8e4de',
  // Borders
  border:    'rgba(0,0,0,0.08)',
  borderMd:  'rgba(0,0,0,0.13)',
  // Text
  text1:     '#1a1916',
  text2:     '#5a574f',
  text3:     '#9a9690',
  // Accent (brand green — from original code, NOT the HTML template)
  accent:    '#184E44',
  accentBg:  '#e6f4f0',
  accentText:'#184E44',
  // Amber
  amber:     '#b45309',
  amberBg:   '#fffbeb',
  amberText: '#b45309',
  // Blue
  blue:      '#1e40af',
  blueBg:    '#eff6ff',
  blueText:  '#1e40af',
  // Red
  red:       '#c53030',
  redBg:     '#fff0f0',
  redText:   '#c53030',
  // Radii
  r:  '10px',
  rLg:'14px',
  // Font
  font: "'DM Sans', sans-serif",
  mono: "'DM Mono', monospace",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function Badge({ status }) {
  const s = statusMap[status] || { label: status, bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, borderRadius: 20,
      padding: '2px 8px', background: s.bg, color: s.color,
      whiteSpace: 'nowrap', fontFamily: T.mono,
    }}>
      {s.label}
    </span>
  );
}

function NavItem({ icon, label, active, badge, badgeAmber, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '7px 8px', borderRadius: T.r, cursor: 'pointer',
        fontSize: 13,
        color:       active ? T.accentText : T.text2,
        background:  active ? T.accentBg   : 'transparent',
        fontWeight:  active ? 500           : 400,
        border: 'none', width: '100%', textAlign: 'left',
        marginBottom: 1,
        transition: 'background 0.12s, color 0.12s',
        userSelect: 'none',
        fontFamily: T.font,
      }}
    >
      <i className={`ti ${icon}`} style={{ fontSize: 17, opacity: 0.85 }} aria-hidden="true" />
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span style={{
          fontSize: 10, fontWeight: 600, borderRadius: 20,
          padding: '1px 6px', fontFamily: T.mono,
          background: badgeAmber ? T.amberBg  : T.redBg,
          color:      badgeAmber ? T.amberText : T.redText,
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({ stat }) {
  const c = colorMap[stat.color];
  return (
    <div className = "cdp-stat-card" style={{
      background: T.surface, border: `1px solid ${T.border}`,
      borderRadius: T.rLg, padding: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: T.text3, fontWeight: 500, letterSpacing: '0.03em' }}>
          {stat.label}
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, background: c.light, color: c.accent,
        }}>
          <i className={`ti ${stat.icon}`} aria-hidden="true" />
        </div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 600, color: T.text1, letterSpacing: '-0.03em', lineHeight: 1 }}>
        {stat.value}
      </div>
      <div style={{ fontSize: 11, color: T.text3, marginTop: 4 }}>
        {stat.sub}
      </div>
    </div>
  );
}

function DocRow({ doc, last }) {
  const c = colorMap[doc.color];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 16px',
      borderBottom: last ? 'none' : `1px solid ${T.border}`,
      cursor: 'pointer', margin: '0 -16px',
      transition: 'background 0.1s',
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = T.surface2}
    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        width: 34, height: 34, borderRadius: 8, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, background: c.light, color: c.accent,
      }}>
        <i className={`ti ${doc.icon}`} aria-hidden="true" />
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: T.text1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {doc.name}
        </div>
        <div style={{ fontSize: 11, color: T.text3, marginTop: 1 }}>
          {doc.type} · {doc.date}
        </div>
      </div>
      <Badge status={doc.status} />
    </div>
  );
}

function CaseRow({ c: cas, last }) {
  const cm = colorMap[cas.status === 'urgent' ? 'rose' : cas.status === 'active' ? 'primary' : 'amber'];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 0',
      borderBottom: last ? 'none' : `1px solid ${T.border}`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: cm.light, color: cm.accent,
      }}>
        <i className="ti ti-briefcase" style={{ fontSize: 16 }} aria-hidden="true" />
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: T.text1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {cas.title}
        </div>
        <div style={{ fontSize: 11, color: T.text3, marginTop: 1 }}>
          {cas.id} · {cas.forum}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <Badge status={cas.status} />
        <div style={{ fontSize: 10, color: T.text3, marginTop: 3, fontFamily: T.mono }}>{cas.next}</div>
      </div>
    </div>
  );
}

function Card({ children, style = {}, className = ''  }) {
  return (
    <div className={`cdp-card${className ? ' ' + className : ''}`} style={{
      background: T.surface, border: `1px solid ${T.border}`,
      borderRadius: T.rLg, padding: 16, ...style,
    }}>
      {children}
    </div>
  );
}

function CardHead({ title, linkLabel, onLink }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: T.text1 }}>{title}</div>
      {linkLabel && (
        <button onClick={onLink} style={{
          fontSize: 12, color: T.accentText, background: 'none',
          border: 'none', cursor: 'pointer', fontFamily: T.font, fontWeight: 400,
        }}>
          {linkLabel}
        </button>
      )}
    </div>
  );
}

function BtnPrimary({ children, onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 14px', background: T.accent, color: '#fff',
        border: 'none', borderRadius: T.r,
        fontSize: 13, fontWeight: 500, cursor: 'pointer',
        fontFamily: T.font, transition: 'opacity 0.12s', ...style,
      }}
      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.88'}
      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
    >
      {children}
    </button>
  );
}

function BtnIcon({ icon, label, dot }) {
  return (
    <button
      aria-label={label}
      title={label}
      style={{
        width: 34, height: 34,
        border: `1px solid ${T.borderMd}`, borderRadius: T.r,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: T.text2, cursor: 'pointer', fontSize: 17,
        background: T.surface, position: 'relative',
        transition: 'background 0.12s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = T.surface2}
      onMouseLeave={(e) => e.currentTarget.style.background = T.surface}
    >
      <i className={`ti ${icon}`} aria-hidden="true" />
      {dot && (
        <span style={{
          position: 'absolute', top: 6, right: 6,
          width: 6, height: 6, borderRadius: '50%',
          background: T.redText, border: `1.5px solid ${T.surface}`,
        }} />
      )}
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ClientDashboardPage() {
  const auth = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState(0);
  const user = auth.user || {};

  const pageTitles = {
    dashboard: 'Overview',
    cases:     'My Cases',
    documents: 'Documents',
    messages:  'Messages',
    account:   'Account',
  };

  const shell = {
    display: 'flex', height: '100vh', overflow: 'hidden',
    fontFamily: T.font, background: T.bg, color: T.text1,
    fontSize: 14, lineHeight: 1.5,
  };

  // ── Sidebar ─────────────────────────────────────────────────────────────────
  const sidebar = (
    <aside style={{
      width: 228, minWidth: 228,
      background: T.surface, borderRight: `1px solid ${T.border}`,
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto', scrollbarWidth: 'none',
    }}>

      {/* Logo */}
      <div style={{
        padding: '20px 16px 16px', borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 16, flexShrink: 0, fontWeight: 700,
        }}>D</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.text1, letterSpacing: '-0.02em' }}>Definites</div>
          <div style={{ fontSize: 10, color: T.text3, fontFamily: T.mono, marginTop: -2 }}>Client Portal</div>
        </div>
      </div>

      {/* Nav — Main section */}
      <div style={{ padding: '14px 10px 4px' }}>
        <div style={{
          fontSize: 10, fontWeight: 500, color: T.text3,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '0 8px', marginBottom: 4,
        }}>Main</div>
        <NavItem icon="ti-layout-dashboard" label="Overview"   active={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
        <NavItem icon="ti-briefcase"        label="My Cases"   active={activePage === 'cases'}     onClick={() => setActivePage('cases')}     badge="3" />
        <NavItem icon="ti-files"            label="Documents"  active={activePage === 'documents'} onClick={() => setActivePage('documents')} />
        <NavItem icon="ti-message"          label="Messages"   active={activePage === 'messages'}  onClick={() => setActivePage('messages')}  badge="1" />
      </div>

      {/* Nav — Account section */}
      <div style={{ padding: '10px 10px 4px' }}>
        <div style={{
          fontSize: 10, fontWeight: 500, color: T.text3,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '0 8px', marginBottom: 4,
        }}>Account</div>
        <NavItem icon="ti-settings" label="Settings" active={activePage === 'account'} onClick={() => setActivePage('account')} />
        <NavItem icon="ti-help-circle" label="Help" active={false} onClick={() => {}} />
      </div>

      {/* User card */}
      <div style={{ marginTop: 'auto', padding: 12, borderTop: `1px solid ${T.border}` }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: 8, borderRadius: T.r, cursor: 'pointer',
            transition: 'background 0.12s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = T.surface2}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: `linear-gradient(135deg, ${T.accent}, #2A6A5E)`,
            color: '#fff', fontSize: 11, fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, letterSpacing: '0.02em',
          }}>
            {getInitials(user.name)}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: T.text1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.name || 'Client'}
            </div>
            <div style={{ fontSize: 11, color: T.text3 }}>Client</div>
          </div>
          <button
            onClick={auth.logout}
            title="Sign out"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.text3, fontSize: 15, display: 'flex', alignItems: 'center' }}
          >
            <i className="ti ti-logout" aria-label="Sign out" />
          </button>
        </div>
      </div>
    </aside>
  );

  // ── Topbar ───────────────────────────────────────────────────────────────────
  const topbar = (
    <header style={{
      background: T.surface, borderBottom: `1px solid ${T.border}`,
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 24px', flexShrink: 0,
    }}>
      <div style={{ fontSize: 15, fontWeight: 500, color: T.text1, flex: 1 }}>
        {pageTitles[activePage]}
        <small style={{ fontSize: 12, color: T.text3, fontWeight: 400, marginLeft: 4 }}>
          · May 2026
        </small>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <BtnIcon icon="ti-search" label="Search" />
        <BtnIcon icon="ti-bell" label="Notifications" dot />
        <BtnPrimary onClick={() => setUploadOpen(true)}>
          <i className="ti ti-upload" style={{ fontSize: 16 }} aria-hidden="true" />
          Upload doc
        </BtnPrimary>
      </div>
    </header>
  );

  // ── Upload Modal ─────────────────────────────────────────────────────────────
  const docTypes = [
    { icon: 'ti-file-invoice', label: 'Invoice' },
    { icon: 'ti-route',        label: 'E-way Bill' },
    { icon: 'ti-truck-delivery',label: 'Transport Doc' },
    { icon: 'ti-id',           label: 'PAN / KYC' },
    { icon: 'ti-camera',       label: 'Vehicle photo' },
    { icon: 'ti-user',         label: 'Driver photo' },
  ];

  const uploadModal = uploadOpen && (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
        zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => e.target === e.currentTarget && setUploadOpen(false)}
      role="dialog" aria-modal="true" aria-labelledby="modal-title"
    >
      <div style={{
        background: T.surface, borderRadius: T.rLg, border: `1px solid ${T.border}`,
        padding: 24, width: 420, maxWidth: '95vw',
      }}>
        {/* Head */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div id="modal-title" style={{ fontSize: 15, fontWeight: 600, color: T.text1 }}>Upload document</div>
          <button
            onClick={() => setUploadOpen(false)}
            style={{
              width: 28, height: 28, borderRadius: 6, border: `1px solid ${T.border}`,
              background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 16, color: T.text2,
            }}
            aria-label="Close modal"
          >
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>

        {/* Doc type selector */}
        <p style={{ fontSize: 12, color: T.text3, marginBottom: 12 }}>Select document type</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          {docTypes.map((dt, i) => (
            <div
              key={dt.label}
              onClick={() => setSelectedDocType(i)}
              role="button"
              tabIndex={0}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 10px', borderRadius: T.r, cursor: 'pointer',
                transition: 'border-color 0.12s, background 0.12s',
                border: `1px solid ${selectedDocType === i ? T.accent : T.border}`,
                background: selectedDocType === i ? T.accentBg : T.surface,
              }}
            >
              <i className={`ti ${dt.icon}`} style={{ fontSize: 17, color: T.accentText }} aria-hidden="true" />
              <div style={{ fontSize: 12, fontWeight: 500, color: T.text1 }}>{dt.label}</div>
            </div>
          ))}
        </div>

        {/* Dropzone */}
        <div style={{
          border: `1.5px dashed ${T.borderMd}`, borderRadius: T.r,
          padding: 28, textAlign: 'center', cursor: 'pointer', marginBottom: 14,
          transition: 'border-color 0.12s, background 0.12s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.background = T.accentBg; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.borderMd; e.currentTarget.style.background = 'transparent'; }}
        >
          <i className="ti ti-cloud-upload" style={{ fontSize: 28, color: T.text3, display: 'block', marginBottom: 6 }} aria-hidden="true" />
          <p style={{ fontSize: 12, color: T.text2, margin: 0 }}>Drop files here or click to browse</p>
          <small style={{ fontSize: 11, color: T.text3 }}>PDF, JPG, PNG, WEBP — max 20 MB</small>
        </div>

        {/* Link to invoice / PO */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 500, color: T.text2, marginBottom: 4, display: 'block', letterSpacing: '0.03em' }}
            htmlFor="link-ref">
            Link to case / reference (optional)
          </label>
          <input
            id="link-ref"
            type="text"
            placeholder="e.g. GST/2024/091 or SCN-0047"
            style={{
              width: '100%', padding: '8px 10px',
              border: `1px solid ${T.borderMd}`, borderRadius: T.r,
              fontSize: 13, color: T.text1, fontFamily: T.font,
              background: T.surface, outline: 'none',
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={() => setUploadOpen(false)}
            style={{
              padding: '8px 16px', border: `1px solid ${T.borderMd}`,
              borderRadius: T.r, background: 'none',
              fontSize: 13, color: T.text2, cursor: 'pointer', fontFamily: T.font,
            }}
          >
            Cancel
          </button>
          <BtnPrimary onClick={() => setUploadOpen(false)}>
            <i className="ti ti-upload" aria-hidden="true" /> Upload
          </BtnPrimary>
        </div>
      </div>
    </div>
  );

  // ── Page: Overview ───────────────────────────────────────────────────────────
  const overviewPage = (
    <>
      {/* Welcome banner */}
      <div className = "cdp-banner" style={{
        background: `linear-gradient(135deg, ${T.accent} 0%, #2A6A5E 60%, #1d8758 100%)`,
        borderRadius: T.rLg, padding: '20px 24px',
        display: 'flex', alignItems: 'center', gap: 16,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -20, top: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', right: 60, bottom: -50, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Welcome back</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0 }}>{user.name || 'Client'}</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4, marginBottom: 0 }}>
            You have 1 hearing scheduled this week at CESTAT, New Delhi.
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 24, position: 'relative', zIndex: 1 }}>
          {[['3', 'Active Cases'], ['14', 'Documents'], ['12 May', 'Next Hearing']].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }} role="list" aria-label="Key metrics">
        {stats.map((s) => <StatCard key={s.label} stat={s} />)}
      </div>

      {/* Row 1: Cases + Recent docs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, alignItems: 'start' }}>

        <Card>
          <CardHead title="Active Cases" linkLabel="View all →" onLink={() => setActivePage('cases')} />
          {cases.map((c, i) => <CaseRow key={c.id} c={c} last={i === cases.length - 1} />)}
        </Card>

        <Card>
          <CardHead title="Recent Documents" linkLabel="View all →" onLink={() => setActivePage('documents')} />
          {documents.slice(0, 4).map((d, i) => <DocRow key={d.name} doc={d} last={i === 3} />)}
        </Card>
      </div>

      {/* Activity feed */}
      <Card>
        <CardHead title="Recent Activity" />
        {activity.map((a, i) => (
          <div key={i} style={{
            display: 'flex', gap: 10,
            padding: '8px 0',
            borderBottom: i < activity.length - 1 ? `1px solid ${T.border}` : 'none',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 3 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
              {i < activity.length - 1 && (
                <div style={{ width: 1, flex: 1, background: T.border, marginTop: 4 }} />
              )}
            </div>
            <div>
              <div style={{ fontSize: 12, color: T.text1, lineHeight: 1.5 }}>{a.msg}</div>
              <div style={{ fontSize: 10, color: T.text3, marginTop: 2, fontFamily: T.mono }}>{a.time}</div>
            </div>
          </div>
        ))}
      </Card>
    </>
  );

  // ── Page: Cases ──────────────────────────────────────────────────────────────
  const casesPage = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {cases.map((c) => (
        <Card key={c.id}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: T.text3, fontFamily: T.mono, marginBottom: 4 }}>{c.id}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: T.text1 }}>{c.title}</div>
            </div>
            <Badge status={c.status} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[['Forum', c.forum], ['Next Hearing', c.next], ['Amount in Dispute', c.amount]].map(([k, v]) => (
              <div key={k} style={{ background: T.bg, borderRadius: T.r, padding: '10px 14px' }}>
                <div style={{ fontSize: 11, color: T.text3, fontWeight: 500, marginBottom: 3 }}>{k}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.text1 }}>{v}</div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );

  // ── Page: Documents ──────────────────────────────────────────────────────────
  const documentsPage = (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.text1 }}>All Documents</div>
        <BtnPrimary onClick={() => setUploadOpen(true)} style={{ padding: '6px 14px', fontSize: 12 }}>
          <i className="ti ti-plus" style={{ fontSize: 14 }} aria-hidden="true" /> Upload
        </BtnPrimary>
      </div>
      {documents.map((d, i) => {
        const c = colorMap[d.color];
        return (
          <div key={d.name} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 0',
            borderBottom: i < documents.length - 1 ? `1px solid ${T.border}` : 'none',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17, background: c.light, color: c.accent,
            }}>
              <i className={`ti ${d.icon}`} aria-hidden="true" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.text1 }}>{d.name}</div>
              <div style={{ fontSize: 11, color: T.text3, marginTop: 1 }}>
                {d.type} · {d.case} · {d.date}
              </div>
            </div>
            <Badge status={d.status} />
          </div>
        );
      })}
    </Card>
  );

  // ── Page: Messages ───────────────────────────────────────────────────────────
  const messagesPage = (
    <Card>
      <div style={{ textAlign: 'center', padding: '40px 0', color: T.text3 }}>
        <i className="ti ti-message" style={{ fontSize: 40, display: 'block', marginBottom: 12, color: T.accentText }} aria-hidden="true" />
        <div style={{ fontSize: 14, fontWeight: 600, color: T.text1, marginBottom: 6 }}>Messages coming soon</div>
        <div style={{ fontSize: 13 }}>Direct communication with your advocate team will appear here.</div>
      </div>
    </Card>
  );

  // ── Page: Account ────────────────────────────────────────────────────────────
  const accountPage = (
    <Card style={{ maxWidth: 560 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: T.text1, marginBottom: 4 }}>Account Settings</div>
      <div style={{ fontSize: 13, color: T.text3, marginBottom: 24 }}>Manage your profile and preferences.</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: `linear-gradient(135deg, ${T.accent}, #2A6A5E)`,
          color: '#fff', fontSize: 18, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {getInitials(user.name)}
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.text1 }}>{user.name}</div>
          <div style={{ fontSize: 12, color: T.text3 }}>{user.email}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {[['Full name', user.name], ['Email', user.email], ['Phone', user.phone || '—'], ['Organization', user.organization || '—']].map(([label, val]) => (
          <div key={label}>
            <label style={{
              fontSize: 11, fontWeight: 500, color: T.text2,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              display: 'block', marginBottom: 5,
            }}>
              {label}
            </label>
            <input
              defaultValue={val}
              style={{
                width: '100%', padding: '8px 10px',
                border: `1px solid ${T.borderMd}`, borderRadius: T.r,
                fontSize: 13, color: T.text1, background: T.bg,
                fontFamily: T.font, outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = T.accent}
              onBlur={(e) => e.target.style.borderColor = T.borderMd}
            />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
        <BtnPrimary>Save changes</BtnPrimary>
        <button
          onClick={auth.logout}
          style={{
            padding: '8px 16px', background: 'none',
            color: T.redText, border: `1px solid ${T.redBg}`,
            borderRadius: T.r, fontSize: 13, fontWeight: 500,
            cursor: 'pointer', fontFamily: T.font,
          }}
        >
          Sign out
        </button>
      </div>
    </Card>
  );

  // ── Render ───────────────────────────────────────────────────────────────────
  const pageContent = {
    dashboard: overviewPage,
    cases:     casesPage,
    documents: documentsPage,
    messages:  messagesPage,
    account:   accountPage,
  };

  return (
    <div style={shell}>
      {sidebar}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {topbar}

        <main
          id="main-content"
          style={{
            flex: 1, overflowY: 'auto',
            padding: '22px 24px',
            display: 'flex', flexDirection: 'column', gap: 20,
          }}
        >
          {pageContent[activePage]}
        </main>
      </div>

      {uploadModal}
    </div>
  );
}





// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';

// const getInitials = (name = '') =>
//   name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

// const stats = [
//   { label: 'Active Cases', value: '3', sub: '1 hearing this week', color: 'primary', icon: 'ti-briefcase' },
//   { label: 'Documents', value: '14', sub: '2 pending review', color: 'teal', icon: 'ti-file-text' },
//   { label: 'Next Hearing', value: '12 May', sub: 'CESTAT, New Delhi', color: 'amber', icon: 'ti-calendar' },
//   { label: 'Open Queries', value: '2', sub: '1 replied', color: 'rose', icon: 'ti-message' },
// ];

// const cases = [
//   { id: 'GST/2024/091', title: 'Input Tax Credit Dispute', forum: 'CESTAT, New Delhi', next: '12 May 2024', status: 'urgent', amount: '₹48,20,000' },
//   { id: 'CUST/2024/021', title: 'Customs Classification — HS Code', forum: 'Commissionerate, Delhi', next: '18 May 2024', status: 'active', amount: '₹12,50,000' },
//   { id: 'GST/2024/055', title: 'IGST Refund — SEZ Supply', forum: 'GST Authority', next: 'Awaited', status: 'review', amount: '₹6,80,000' },
// ];

// const documents = [
//   { name: 'INV-Batch-Q3-2023.pdf', type: 'Invoice', case: 'GST/2024/091', date: 'Today', status: 'pending', icon: 'ti-file-invoice', color: 'blue' },
//   { name: 'EWB-4821930211.pdf', type: 'E-way Bill', case: 'GST/2024/091', date: '5 hrs ago', status: 'verified', icon: 'ti-route', color: 'teal' },
//   { name: 'ITC-Mismatch-Report.xlsx', type: 'Report', case: 'GST/2024/091', date: 'Yesterday', status: 'processing', icon: 'ti-table', color: 'amber' },
//   { name: 'Show-Cause-Notice.pdf', type: 'Notice', case: 'CUST/2024/021', date: '2 days ago', status: 'verified', icon: 'ti-file-alert', color: 'rose' },
//   { name: 'Reply-Brief-Draft-v2.docx', type: 'Brief', case: 'GST/2024/091', date: '3 days ago', status: 'review', icon: 'ti-file-text', color: 'primary' },
// ];

// const activity = [
//   { msg: 'Hearing rescheduled — CESTAT shifted date to 12 May', time: 'Today 9:00 AM', color: '#e53e3e' },
//   { msg: '14 documents uploaded — ITC invoices Q3 2023', time: 'Yesterday 3:00 PM', color: '#184E44' },
//   { msg: 'Advocate Rahul Sharma assigned as lead counsel', time: '5 Jan 2024', color: '#d97706' },
//   { msg: 'Case GST/2024/091 filed — Show Cause Notice received', time: '2 Jan 2024', color: '#9ca3af' },
// ];

// const statusMap = {
//   urgent:     { label: 'Urgent',     bg: '#fff0f0', color: '#c53030' },
//   active:     { label: 'Active',     bg: '#e6f4f0', color: '#184E44' },
//   review:     { label: 'In Review',  bg: '#fffbeb', color: '#b45309' },
//   pending:    { label: 'Pending',    bg: '#fffbeb', color: '#b45309' },
//   verified:   { label: 'Verified',   bg: '#e6f4f0', color: '#184E44' },
//   processing: { label: 'Processing', bg: '#eff6ff', color: '#1e40af' },
// };

// const colorMap = {
//   primary: { bg: '#184E44', light: '#e6f4f0', icon: '#184E44' },
//   teal:    { bg: '#0f766e', light: '#e0f2f1', icon: '#0f766e' },
//   amber:   { bg: '#b45309', light: '#fffbeb', icon: '#b45309' },
//   rose:    { bg: '#be185d', light: '#fdf2f8', icon: '#be185d' },
//   blue:    { bg: '#1e40af', light: '#eff6ff', icon: '#1e40af' },
// };

// const iconColorMap = {
//   blue:    { bg: '#eff6ff', color: '#1e40af' },
//   teal:    { bg: '#e0f2f1', color: '#0f766e' },
//   amber:   { bg: '#fffbeb', color: '#b45309' },
//   rose:    { bg: '#fdf2f8', color: '#be185d' },
//   primary: { bg: '#e6f4f0', color: '#184E44' },
// };

// function Badge({ status }) {
//   const s = statusMap[status] || { label: status, bg: '#f3f4f6', color: '#374151' };
//   return (
//     <span style={{
//       fontSize: 11, fontWeight: 600, borderRadius: 20,
//       padding: '2px 10px', background: s.bg, color: s.color,
//       whiteSpace: 'nowrap',
//     }}>{s.label}</span>
//   );
// }

// function NavItem({ icon, label, active, badge, onClick }) {
//   return (
//     <button onClick={onClick} style={{
//       display: 'flex', alignItems: 'center', gap: 8,
//       padding: '7px 10px', borderRadius: 8, cursor: 'pointer',
//       fontSize: 13, color: active ? '#184E44' : '#5a574f',
//       background: active ? '#e6f4f0' : 'transparent',
//       fontWeight: active ? 600 : 400,
//       border: 'none', width: '100%', textAlign: 'left',
//       marginBottom: 1, transition: 'background 0.12s',
//     }}>
//       <i className={`ti ${icon}`} style={{ fontSize: 17, opacity: 0.85 }} aria-hidden="true" />
//       <span style={{ flex: 1 }}>{label}</span>
//       {badge && (
//         <span style={{
//           fontSize: 10, fontWeight: 700, borderRadius: 20,
//           padding: '1px 6px', background: '#fff0f0', color: '#c53030',
//         }}>{badge}</span>
//       )}
//     </button>
//   );
// }

// export default function ClientDashboardPage() {
//   const auth = useAuth();
//   const [activePage, setActivePage] = useState('dashboard');
//   const [uploadOpen, setUploadOpen] = useState(false);
//   const user = auth.user || {};

//   const pageTitles = {
//     dashboard: 'Overview',
//     cases: 'My Cases',
//     documents: 'Documents',
//     messages: 'Messages',
//     account: 'Account',
//   };

//   return (
//     <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'DM Sans', sans-serif", background: '#f5f4f0' }}>

//       {/* Sidebar */}
//       <aside style={{
//         width: 228, minWidth: 228,
//         background: '#fff', borderRight: '1px solid rgba(0,0,0,0.08)',
//         display: 'flex', flexDirection: 'column', overflowY: 'auto',
//       }}>
//         {/* Logo */}
//         <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
//           <div style={{
//             width: 34, height: 34, borderRadius: 8,
//             background: '#184E44', display: 'flex', alignItems: 'center', justifyContent: 'center',
//             color: '#fff', fontSize: 16, flexShrink: 0, fontWeight: 700,
//           }}>D</div>
//           <div>
//             <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1916', letterSpacing: '-0.02em' }}>Definites</div>
//             <div style={{ fontSize: 10, color: '#9a9690', marginTop: 1 }}>Client Portal</div>
//           </div>
//         </div>

//         {/* Nav */}
//         <div style={{ padding: '14px 10px 4px' }}>
//           <div style={{ fontSize: 10, fontWeight: 600, color: '#9a9690', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 4 }}>Main</div>
//           <NavItem icon="ti-layout-dashboard" label="Overview" active={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
//           <NavItem icon="ti-briefcase" label="My Cases" active={activePage === 'cases'} badge="3" onClick={() => setActivePage('cases')} />
//           <NavItem icon="ti-files" label="Documents" active={activePage === 'documents'} onClick={() => setActivePage('documents')} />
//           <NavItem icon="ti-message" label="Messages" active={activePage === 'messages'} badge="1" onClick={() => setActivePage('messages')} />
//         </div>

//         <div style={{ padding: '10px 10px 4px' }}>
//           <div style={{ fontSize: 10, fontWeight: 600, color: '#9a9690', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 4 }}>Account</div>
//           <NavItem icon="ti-settings" label="Settings" active={activePage === 'account'} onClick={() => setActivePage('account')} />
//         </div>

//         {/* User card */}
//         <div style={{ marginTop: 'auto', padding: 12, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: 8, borderRadius: 8 }}>
//             <div style={{
//               width: 32, height: 32, borderRadius: '50%',
//               background: 'linear-gradient(135deg, #184E44, #2A6A5E)',
//               color: '#fff', fontSize: 12, fontWeight: 700,
//               display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
//             }}>{getInitials(user.name)}</div>
//             <div style={{ flex: 1, overflow: 'hidden' }}>
//               <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1916', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name || 'Client'}</div>
//               <div style={{ fontSize: 11, color: '#9a9690' }}>Client</div>
//             </div>
//             <button onClick={auth.logout} title="Sign out" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9a9690', fontSize: 17, display: 'flex', alignItems: 'center' }}>
//               <i className="ti ti-logout" aria-label="Sign out" />
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* Main */}
//       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

//         {/* Topbar */}
//         <div style={{
//           background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.08)',
//           display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', flexShrink: 0,
//         }}>
//           <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1916', flex: 1 }}>{pageTitles[activePage]}</div>
//           <button onClick={() => setUploadOpen(true)} style={{
//             display: 'flex', alignItems: 'center', gap: 6,
//             padding: '7px 14px', background: '#184E44', color: '#fff',
//             border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600,
//             cursor: 'pointer',
//           }}>
//             <i className="ti ti-upload" style={{ fontSize: 15 }} aria-hidden="true" />
//             Upload Document
//           </button>
//         </div>

//         {/* Content */}
//         <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

//           {/* ── OVERVIEW PAGE ── */}
//           {activePage === 'dashboard' && (
//             <>
//               {/* Welcome banner */}
//               <div style={{
//                 background: 'linear-gradient(135deg, #184E44 0%, #2A6A5E 60%, #1d8758 100%)',
//                 borderRadius: 14, padding: '20px 24px',
//                 display: 'flex', alignItems: 'center', gap: 16,
//                 position: 'relative', overflow: 'hidden',
//               }}>
//                 <div style={{ position: 'absolute', right: -20, top: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
//                 <div style={{ position: 'absolute', right: 60, bottom: -50, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
//                 <div style={{ position: 'relative', zIndex: 1 }}>
//                   <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Welcome back</div>
//                   <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0 }}>{user.name || 'Client'}</h2>
//                   <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4, marginBottom: 0 }}>You have 1 hearing scheduled this week at CESTAT, New Delhi.</p>
//                 </div>
//                 <div style={{ marginLeft: 'auto', display: 'flex', gap: 24, position: 'relative', zIndex: 1 }}>
//                   {[['3', 'Active Cases'], ['14', 'Documents'], ['12 May', 'Next Hearing']].map(([val, lbl]) => (
//                     <div key={lbl} style={{ textAlign: 'center' }}>
//                       <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{val}</div>
//                       <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{lbl}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Stats grid */}
//               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
//                 {stats.map((s) => {
//                   const c = colorMap[s.color];
//                   return (
//                     <div key={s.label} style={{
//                       background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
//                       borderRadius: 14, padding: 16, position: 'relative', overflow: 'hidden',
//                     }}>
//                       <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: c.bg, borderRadius: '14px 14px 0 0' }} />
//                       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
//                         <div style={{ fontSize: 11, color: '#9a9690', fontWeight: 500, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{s.label}</div>
//                         <div style={{ width: 30, height: 30, borderRadius: 7, background: c.light, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.icon }}>
//                           <i className={`ti ${s.icon}`} style={{ fontSize: 15 }} aria-hidden="true" />
//                         </div>
//                       </div>
//                       <div style={{ fontSize: 26, fontWeight: 700, color: '#1a1916', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
//                       <div style={{ fontSize: 11, color: '#9a9690', marginTop: 4 }}>{s.sub}</div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Two col: cases + docs */}
//               <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, alignItems: 'start' }}>

//                 {/* Cases */}
//                 <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: 18 }}>
//                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
//                     <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916' }}>Active Cases</div>
//                     <button onClick={() => setActivePage('cases')} style={{ fontSize: 12, color: '#184E44', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all →</button>
//                   </div>
//                   {cases.map((c, i) => (
//                     <div key={c.id} style={{
//                       display: 'flex', alignItems: 'center', gap: 12,
//                       padding: '11px 0', borderBottom: i < cases.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
//                     }}>
//                       <div style={{
//                         width: 36, height: 36, borderRadius: 9,
//                         background: c.status === 'urgent' ? '#fff0f0' : c.status === 'active' ? '#e6f4f0' : '#fffbeb',
//                         display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
//                         color: c.status === 'urgent' ? '#c53030' : c.status === 'active' ? '#184E44' : '#b45309',
//                       }}>
//                         <i className="ti ti-briefcase" style={{ fontSize: 16 }} aria-hidden="true" />
//                       </div>
//                       <div style={{ flex: 1, overflow: 'hidden' }}>
//                         <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1916', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>
//                         <div style={{ fontSize: 11, color: '#9a9690', marginTop: 1 }}>{c.id} · {c.forum}</div>
//                       </div>
//                       <div style={{ textAlign: 'right', flexShrink: 0 }}>
//                         <Badge status={c.status} />
//                         <div style={{ fontSize: 10, color: '#9a9690', marginTop: 3 }}>{c.next}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Recent docs */}
//                 <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: 18 }}>
//                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
//                     <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916' }}>Recent Documents</div>
//                     <button onClick={() => setActivePage('documents')} style={{ fontSize: 12, color: '#184E44', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View all →</button>
//                   </div>
//                   {documents.slice(0, 4).map((d, i) => {
//                     const ic = iconColorMap[d.color];
//                     return (
//                       <div key={d.name} style={{
//                         display: 'flex', alignItems: 'center', gap: 10,
//                         padding: '9px 0', borderBottom: i < 3 ? '1px solid rgba(0,0,0,0.06)' : 'none',
//                       }}>
//                         <div style={{ width: 32, height: 32, borderRadius: 8, background: ic.bg, color: ic.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//                           <i className={`ti ${d.icon}`} style={{ fontSize: 15 }} aria-hidden="true" />
//                         </div>
//                         <div style={{ flex: 1, overflow: 'hidden' }}>
//                           <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1916', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
//                           <div style={{ fontSize: 11, color: '#9a9690', marginTop: 1 }}>{d.type} · {d.date}</div>
//                         </div>
//                         <Badge status={d.status} />
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Activity */}
//               <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: 18 }}>
//                 <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916', marginBottom: 16 }}>Recent Activity</div>
//                 {activity.map((a, i) => (
//                   <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < activity.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
//                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 3 }}>
//                       <div style={{ width: 7, height: 7, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
//                       {i < activity.length - 1 && <div style={{ width: 1, flex: 1, background: 'rgba(0,0,0,0.08)', marginTop: 4 }} />}
//                     </div>
//                     <div>
//                       <div style={{ fontSize: 12, color: '#1a1916', lineHeight: 1.5 }}>{a.msg}</div>
//                       <div style={{ fontSize: 10, color: '#9a9690', marginTop: 2 }}>{a.time}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}

//           {/* ── CASES PAGE ── */}
//           {activePage === 'cases' && (
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//               {cases.map((c) => (
//                 <div key={c.id} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: 20 }}>
//                   <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
//                     <div>
//                       <div style={{ fontSize: 11, color: '#9a9690', fontFamily: 'monospace', marginBottom: 4 }}>{c.id}</div>
//                       <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1916' }}>{c.title}</div>
//                     </div>
//                     <Badge status={c.status} />
//                   </div>
//                   <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
//                     {[['Forum', c.forum], ['Next Hearing', c.next], ['Amount in Dispute', c.amount]].map(([k, v]) => (
//                       <div key={k} style={{ background: '#f5f4f0', borderRadius: 8, padding: '10px 14px' }}>
//                         <div style={{ fontSize: 11, color: '#9a9690', fontWeight: 500, marginBottom: 3 }}>{k}</div>
//                         <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916' }}>{v}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* ── DOCUMENTS PAGE ── */}
//           {activePage === 'documents' && (
//             <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: 18 }}>
//               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
//                 <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1916' }}>All Documents</div>
//                 <button onClick={() => setUploadOpen(true)} style={{
//                   display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
//                   background: '#184E44', color: '#fff', border: 'none', borderRadius: 8,
//                   fontSize: 12, fontWeight: 600, cursor: 'pointer',
//                 }}>
//                   <i className="ti ti-plus" style={{ fontSize: 14 }} aria-hidden="true" /> Upload
//                 </button>
//               </div>
//               {documents.map((d, i) => {
//                 const ic = iconColorMap[d.color];
//                 return (
//                   <div key={d.name} style={{
//                     display: 'flex', alignItems: 'center', gap: 12,
//                     padding: '11px 0', borderBottom: i < documents.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
//                   }}>
//                     <div style={{ width: 36, height: 36, borderRadius: 9, background: ic.bg, color: ic.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//                       <i className={`ti ${d.icon}`} style={{ fontSize: 17 }} aria-hidden="true" />
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1916' }}>{d.name}</div>
//                       <div style={{ fontSize: 11, color: '#9a9690', marginTop: 1 }}>{d.type} · {d.case} · {d.date}</div>
//                     </div>
//                     <Badge status={d.status} />
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//           {/* ── MESSAGES PAGE ── */}
//           {activePage === 'messages' && (
//             <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: 24 }}>
//               <div style={{ textAlign: 'center', padding: '40px 0', color: '#9a9690' }}>
//                 <i className="ti ti-message" style={{ fontSize: 40, display: 'block', marginBottom: 12, color: '#184E44' }} aria-hidden="true" />
//                 <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1916', marginBottom: 6 }}>Messages coming soon</div>
//                 <div style={{ fontSize: 13 }}>Direct communication with your advocate team will appear here.</div>
//               </div>
//             </div>
//           )}

//           {/* ── ACCOUNT PAGE ── */}
//           {activePage === 'account' && (
//             <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: 24, maxWidth: 560 }}>
//               <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1916', marginBottom: 4 }}>Account Settings</div>
//               <div style={{ fontSize: 13, color: '#9a9690', marginBottom: 24 }}>Manage your profile and preferences.</div>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
//                 <div style={{
//                   width: 56, height: 56, borderRadius: '50%',
//                   background: 'linear-gradient(135deg, #184E44, #2A6A5E)',
//                   color: '#fff', fontSize: 18, fontWeight: 700,
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 }}>{getInitials(user.name)}</div>
//                 <div>
//                   <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1916' }}>{user.name}</div>
//                   <div style={{ fontSize: 12, color: '#9a9690' }}>{user.email}</div>
//                 </div>
//               </div>
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
//                 {[['Full name', user.name], ['Email', user.email], ['Phone', user.phone || '—'], ['Organization', user.organization || '—']].map(([label, val]) => (
//                   <div key={label}>
//                     <label style={{ fontSize: 11, fontWeight: 600, color: '#9a9690', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 5 }}>{label}</label>
//                     <input defaultValue={val} style={{
//                       width: '100%', padding: '8px 12px',
//                       border: '1px solid rgba(0,0,0,0.13)', borderRadius: 8,
//                       fontSize: 13, color: '#1a1916', background: '#f5f4f0',
//                       fontFamily: 'inherit',
//                     }} />
//                   </div>
//                 ))}
//               </div>
//               <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
//                 <button style={{ padding: '8px 18px', background: '#184E44', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Save changes</button>
//                 <button onClick={auth.logout} style={{ padding: '8px 18px', background: 'none', color: '#c53030', border: '1px solid #fca5a5', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Sign out</button>
//               </div>
//             </div>
//           )}

//         </div>
//       </div>

//       {/* Upload Modal */}
//       {uploadOpen && (
//         <div style={{
//           position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
//           zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
//         }} onClick={(e) => e.target === e.currentTarget && setUploadOpen(false)}>
//           <div style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(0,0,0,0.08)', padding: 24, width: 420, maxWidth: '95vw' }}>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
//               <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1916' }}>Upload Document</div>
//               <button onClick={() => setUploadOpen(false)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid rgba(0,0,0,0.08)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#5a574f' }}>
//                 <i className="ti ti-x" aria-label="Close" />
//               </button>
//             </div>
//             <div style={{ fontSize: 11, color: '#9a9690', marginBottom: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Document type</div>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
//               {[['ti-file-invoice', 'Invoice'], ['ti-route', 'E-way Bill'], ['ti-truck-delivery', 'Transport Doc'], ['ti-id', 'PAN / KYC']].map(([icon, label]) => (
//                 <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#1a1916' }}>
//                   <i className={`ti ${icon}`} style={{ fontSize: 17, color: '#184E44' }} aria-hidden="true" />
//                   {label}
//                 </div>
//               ))}
//             </div>
//             <div style={{
//               border: '1.5px dashed rgba(0,0,0,0.15)', borderRadius: 10,
//               padding: 28, textAlign: 'center', cursor: 'pointer', marginBottom: 14,
//               background: '#f5f4f0',
//             }}>
//               <i className="ti ti-cloud-upload" style={{ fontSize: 28, color: '#9a9690', display: 'block', marginBottom: 6 }} aria-hidden="true" />
//               <p style={{ fontSize: 12, color: '#5a574f', margin: 0 }}>Drop files here or click to browse</p>
//               <small style={{ fontSize: 11, color: '#9a9690' }}>PDF, JPG, PNG — max 20 MB</small>
//             </div>
//             <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
//               <button onClick={() => setUploadOpen(false)} style={{ padding: '7px 16px', border: '1px solid rgba(0,0,0,0.13)', borderRadius: 8, background: 'none', fontSize: 13, cursor: 'pointer', color: '#5a574f' }}>Cancel</button>
//               <button style={{ padding: '7px 16px', background: '#184E44', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Upload</button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }




// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// function AccountPage() {
//   const auth = useAuth();

//   return (
//     <div className="dashboard-shell">
//       <header className="dashboard-header">
//         <div>
//           <span className="status-pill">Secure account</span>
//           <h1>Welcome back, {auth.user?.name}</h1>
//           <p>Your account is active and ready for the practice management portal.</p>
//         </div>
//         <div className="dashboard-header-actions">
//           <Link to="/change-password" className="btn-secondary nav-auth-btn">
//             Change password
//           </Link>
//           <button className="btn-primary nav-auth-btn" type="button" onClick={auth.logout}>
//             Sign out
//           </button>
//         </div>
//       </header>

//       <section className="dashboard-panel account-panel">
//         <div className="account-grid">
//           <article className="account-card">
//             <span>Name</span>
//             <strong>{auth.user?.name}</strong>
//           </article>
//           <article className="account-card">
//             <span>Email</span>
//             <strong>{auth.user?.email}</strong>
//           </article>
//           <article className="account-card">
//             <span>Phone</span>
//             <strong>{auth.user?.phone}</strong>
//           </article>
//           <article className="account-card">
//             <span>Organization</span>
//             <strong>{auth.user?.organization || 'Not provided'}</strong>
//           </article>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default AccountPage;
