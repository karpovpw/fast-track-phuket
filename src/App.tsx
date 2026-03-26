import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, MessageCircle, Star, Shield, Luggage, Building, 
  ChevronDown, Send, X, Check, ArrowRight,
  BookOpen, Coins, Flag, Phone
} from 'lucide-react';
import Hero3D from './components/Hero3D';
import './index.css';

const SimpleModal = ({ isOpen, onClose, title, children, highlight = false }: any) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={highlight ? { border: '2px solid var(--color-gold)', boxShadow: '0 0 30px rgba(212, 175, 55, 0.3)' } : {}}>
        <button className="modal-close" onClick={onClose}><X size={24} /></button>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {highlight && <Star className="text-gold" fill="currentColor" />}
          {title}
        </h2>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

function App() {
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  // Price Calculator State
  const [calcService, setCalcService] = useState('arr');
  const [calcAdults, setCalcAdults] = useState<number | string>(1);
  const [calcKids, setCalcKids] = useState<number | string>(0);

  const languages = [
    { code: 'en', name: 'English' }, { code: 'ru', name: 'Русский' }, { code: 'zh', name: '中文' }, 
    { code: 'hi', name: 'हिन्दी' }, { code: 'he', name: 'עברית' }, { code: 'ar', name: 'العربية' },
    { code: 'es', name: 'Español' }, { code: 'fr', name: 'Français' }, { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' }
  ];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
  };

  const totalPrice = useMemo(() => {
    const adults = typeof calcAdults === 'number' ? calcAdults : 0;
    const kids = typeof calcKids === 'number' ? calcKids : 0;
    
    let adultPrice = 1800;
    let kidPrice = 900;
    if (calcService === 'arr') {
      adultPrice = (adults >= 2) ? 1650 : 1800;
      kidPrice = 900;
    } else if (calcService === 'dep') {
      adultPrice = (adults >= 2) ? 1750 : 1900;
      kidPrice = 950;
    } else if (calcService === 'combo') {
      adultPrice = (adults >= 2) ? 3200 : 3500;
      kidPrice = 1750;
    }
    return (adults * adultPrice) + (kids * kidPrice);
  }, [calcService, calcAdults, calcKids]);

  const ctaLinks = {
    whatsapp: "https://wa.me/79697189210?text=Hello,%20I'd%20like%20to%20inquire%20about%20the%20VIP%20Fast%20Track.",
    telegram: "https://t.me/danilaru"
  };

  const paymentMethods = [
    { key: "1", icon: <Building size={24} />, title: "Bank Transfer", desc: "Thai bank QR payment in THB — instant confirmation." },
    { key: "3", icon: <Coins size={24} />, title: "USDT Crypto", desc: "TRC20 or ERC20 USDT transfer accepted." },
    { key: "6", icon: <Flag size={24} />, title: "Russian Cards", desc: "Payment in rubles to Russian bank cards." }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <Hero3D />

      <div style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-bg)', textAlign: 'center', padding: '0.5rem', fontWeight: 600, fontSize: '0.85rem', zIndex: 110, position: 'relative' }}>
        {t('nav.badge')}
      </div>

      {/* Navigation */}
      <nav style={{ padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(10, 10, 10, 0.6)', backdropFilter: 'blur(15px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontWeight: 700, fontSize: '1.4rem', fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>
          FAST<span className="text-gold">TRACK</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          
          {/* Top Bar Chat Buttons with Text Labels */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href={ctaLinks.telegram} target="_blank" rel="noreferrer" className="animate-bounce-soft" style={{ color: '#2AABEE', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              <Send size={18} /> <span>Telegram</span>
            </a>
            <a href={ctaLinks.whatsapp} target="_blank" rel="noreferrer" className="animate-bounce-soft" style={{ color: '#25D366', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              <MessageCircle size={18} /> <span>WhatsApp</span>
            </a>
            <a href="tel:+66993879422" style={{ color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              <Phone size={18} /> <span>Call</span>
            </a>
          </div>

          <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />

          <div style={{ position: 'relative' }}>
            <button onClick={() => setLangOpen(!langOpen)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>
              <Globe size={16} /> {languages.find(l => l.code === i18n.language)?.name || 'Language'} <ChevronDown size={12} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', backgroundColor: 'var(--color-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: '130px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
                >
                  {languages.map(lang => (
                    <button key={lang.code} onClick={() => changeLanguage(lang.code)} style={{ textAlign: 'left', padding: '0.4rem 0.8rem', background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '0.85rem' }}>
                      {lang.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      <section style={{ padding: '6rem 0', position: 'relative' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>{t('hero.title')}</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', marginBottom: '2.5rem' }}>{t('hero.subtitle')}</p>
            <div className="takeaway-list">
              {[1, 2, 5].map(i => (
                <div key={i} className="takeaway-item">
                  <Check size={20} className="text-gold" />
                  <span>{t(`takeaways.${i}`)}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Calculator with Fixed Labels and Inputs */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="card" style={{ padding: '2.5rem', border: '1px solid var(--color-gold)', background: 'rgba(10,10,10,0.5)', backdropFilter: 'blur(20px)' }}>
              <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{t('calc.title')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'var(--color-gold)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{t('calc.service')}</label>
                  <select value={calcService} onChange={(e) => setCalcService(e.target.value)}>
                    <option value="arr">{t('packages.arr.title')} (฿1,800)</option>
                    <option value="dep">{t('packages.dep.title')} (฿1,900)</option>
                    <option value="combo">{t('packages.combo.title')} (฿3,500)</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', color: 'var(--color-gold)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{t('calc.adults')}</label>
                    <input 
                      type="number" min="0" 
                      value={calcAdults} 
                      onChange={(e) => setCalcAdults(e.target.value === '' ? '' : parseInt(e.target.value))} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'var(--color-gold)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{t('calc.kids')}</label>
                    <input 
                      type="number" min="0" 
                      value={calcKids} 
                      onChange={(e) => setCalcKids(e.target.value === '' ? '' : parseInt(e.target.value))} 
                    />
                  </div>
                </div>
                <div style={{ padding: '1.5rem', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '0.25rem' }}>TOTAL ESTIMATE</div>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-gold)' }}>฿{totalPrice.toLocaleString()}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <a href={ctaLinks.telegram} target="_blank" rel="noreferrer" className="btn" style={{ background: '#2AABEE', color: '#fff', padding: '1rem' }}>
                    <Send size={18} /> Telegram
                  </a>
                  <a href={ctaLinks.whatsapp} target="_blank" rel="noreferrer" className="btn" style={{ background: '#25D366', color: '#fff', padding: '1rem' }}>
                    <MessageCircle size={18} /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Selectable Packages */}
      <section style={{ padding: '6rem 0', background: 'rgba(10,10,10,0.6)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.1rem' }}>{t('packages.title')}</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>{t('packages.subtitle')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {['arr', 'dep', 'combo'].map((pkg) => (
              <div 
                key={pkg} 
                onClick={() => setSelectedPackage(pkg)}
                className={`card selectable-card ${selectedPackage === pkg ? 'active' : ''}`}
                style={{ 
                  display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: selectedPackage === pkg ? '1px solid var(--color-gold)' : '1px solid rgba(255,255,255,0.05)',
                  backgroundColor: selectedPackage === pkg ? 'rgba(212, 175, 55, 0.05)' : 'var(--color-surface)',
                  transform: selectedPackage === pkg ? 'translateY(-10px)' : 'none'
                }}
              >
                {pkg === 'arr' && <Luggage size={40} className="text-gold" />}
                {pkg === 'dep' && <Building size={40} className="text-gold" />}
                {pkg === 'combo' && <Shield size={40} className="text-gold" />}
                <h3 style={{ margin: '1.5rem 0 0.8rem' }}>{t(`packages.${pkg}.title`)}</h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, flex: 1 }}>{t(`packages.${pkg}.desc`)}</p>
                <div style={{ marginTop: '2rem', fontSize: '1.6rem', fontWeight: 800, color: pkg === 'combo' ? 'var(--color-gold)' : '#fff' }}>
                  ฿{pkg === 'arr' ? '1,800' : pkg === 'dep' ? '1,900' : '3,500'}
                </div>
                
                <AnimatePresence>
                  {selectedPackage === pkg && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', overflow: 'hidden' }}
                    >
                      <a href={ctaLinks.telegram} target="_blank" rel="noreferrer" className="btn" style={{ background: '#2AABEE', color: '#fff', fontSize: '0.8rem', padding: '0.75rem' }} onClick={(e) => e.stopPropagation()}>
                        <Send size={16} /> Telegram
                      </a>
                      <a href={ctaLinks.whatsapp} target="_blank" rel="noreferrer" className="btn" style={{ background: '#25D366', color: '#fff', fontSize: '0.8rem', padding: '0.75rem' }} onClick={(e) => e.stopPropagation()}>
                        <MessageCircle size={16} /> WhatsApp
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TDAC Highlight Card */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div 
              className="card" onClick={() => setActiveModal('tdac')} 
              style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(10,10,10,0) 100%)', border: '2px solid var(--color-gold)', cursor: 'pointer', position: 'relative' }}
            >
              <div style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'var(--color-gold)', color: 'var(--color-bg)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>REQUIRED</div>
              <Star size={32} className="text-gold" style={{ marginBottom: '1.5rem' }} />
              <h3>Official TDAC 2026 Guide</h3>
              <p style={{ color: 'var(--color-text-secondary)', marginTop: '1rem', lineHeight: 1.6 }}>Step-by-step instructions on filling the mandatory Thailand Arrival Card for free. Avoid common scams.</p>
              <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold)', fontWeight: 700 }}>
                View Guide Now <ArrowRight size={18} />
              </div>
            </div>
            {['arr-guide', 'ft-what', 'entry'].map((guide, i) => (
              <div key={guide} className="card" onClick={() => setActiveModal(guide)} style={{ cursor: 'pointer' }}>
                <BookOpen size={32} style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                <h3>{t(`guides.${i+1}.t`)}</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginTop: '1.1rem', lineHeight: 1.5 }}>{t(`guides.${i+1}.d`)}</p>
                <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-gold)' }}>
                  Learn More <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Segment */}
      <section style={{ padding: '6rem 0', background: 'rgba(20,20,20,0.8)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '3.5rem' }}>{t('compare.title')}</h2>
          <div className="compare-container">
            <table>
              <thead>
                <tr><th>Feature</th><th>Standard Way</th><th style={{ color: 'var(--color-gold)' }}>VIP Fast Track ✈</th></tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map(i => (
                  <tr key={i}>
                    <td>{t(`compare.f${i}`)}</td>
                    <td style={{ opacity: 0.6 }}>{t(`compare.r${i}.1`)}</td>
                    <td className="check" style={{ fontWeight: 600 }}>{t(`compare.r${i}.2`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Segment */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '4rem' }}>{t('faq.title')}</h2>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="card">
                <h4 style={{ color: 'var(--color-gold)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>{t(`faq.${i}.q`)}</h4>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{t(`faq.${i}.a`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reduced Payment Methods */}
      <section style={{ padding: '6rem 0', background: 'rgba(10,10,10,0.6)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.1rem' }}>{t('payments.title')}</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>Secure and trusted payment options</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            {paymentMethods.map(pm => (
              <div key={pm.key} className="card" style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--color-gold)', marginBottom: '1.2rem' }}>{pm.icon}</div>
                <h4 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>{pm.title}</h4>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{pm.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer style={{ padding: '5rem 0', background: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: '1.6rem', fontFamily: 'var(--font-heading)', marginBottom: '2rem' }}>
            FAST<span className="text-gold">TRACK</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '2.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            <button onClick={() => setActiveModal('terms')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 600 }}>TERMS</button>
            <button onClick={() => setActiveModal('privacy')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 600 }}>PRIVACY</button>
          </div>
          <p style={{ opacity: 0.4, fontSize: '0.75rem', letterSpacing: '1px' }}>{t('footer.legal')}</p>
        </div>
      </footer>

      {/* Modals */}
      <SimpleModal isOpen={activeModal === 'tdac'} onClose={() => setActiveModal(null)} title="Thailand Digital Arrival Card Guide" highlight={true}>
        <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#fff' }}>The official TDAC form is required for 2026 entry.</p>
          <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-gold)' }}>
            <h4 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }}>⚠️ SCAM PROTECTION</h4>
            <p>The official portal is <strong>100% free</strong>. Never pay for this form. Use ONLY <strong>tdac.immigration.go.th</strong>.</p>
          </div>
          <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Filing Guide:</h4>
          <ol style={{ paddingLeft: '1.5rem', display: 'grid', gap: '0.8rem' }}>
            <li>Register at the official portal 72h before landing.</li>
            <li>Port: Select <strong>Phuket Airport (HKT)</strong>.</li>
            <li>Accurately input passport and flight TG/EK numbers.</li>
            <li>Save the resulting QR code – you MUST show it on your phone.</li>
          </ol>
        </div>
      </SimpleModal>

      <SimpleModal isOpen={activeModal === 'arr-guide'} onClose={() => setActiveModal(null)} title={t('guides.1.t')}>
        <p style={{ lineHeight: 1.6 }}>{t('guides.1.d')}</p>
        <p style={{ marginTop: '1.5rem', color: '#fff' }}>Arrival process without VIP: 60-90 minutes. With Fast Track: Under 5 minutes.</p>
      </SimpleModal>

      <SimpleModal isOpen={activeModal === 'ft-what'} onClose={() => setActiveModal(null)} title={t('guides.2.t')}>
        <p style={{ lineHeight: 1.6 }}>{t('guides.2.d')}</p>
        <p style={{ marginTop: '1.5rem', color: '#fff' }}>A dedicated officer greets you with a sign, takes you through the priority lane, and handles baggage identification.</p>
      </SimpleModal>

      <SimpleModal isOpen={activeModal === 'entry'} onClose={() => setActiveModal(null)} title={t('guides.3.t')}>
        <p style={{ lineHeight: 1.6 }}>{t('guides.3.d')}</p>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '1.5rem' }}>
          <li>Passport (6mo validity)</li>
          <li>TDAC QR Code</li>
          <li>Hotel Address</li>
        </ul>
      </SimpleModal>

      <SimpleModal isOpen={activeModal === 'terms'} onClose={() => setActiveModal(null)} title="Terms & Conditions">
        <p style={{ lineHeight: 1.7 }}>Service is non-refundable 24 hours prior to arrival. 100% refund if the airline cancels the flight. We track all delays automatically.</p>
      </SimpleModal>

      <SimpleModal isOpen={activeModal === 'privacy'} onClose={() => setActiveModal(null)} title="Privacy Policy">
        <p style={{ lineHeight: 1.7 }}>We securely process your name and flight number only for coordination. Data is wiped after service completion. Conversations via WhatsApp/Telegram are end-to-end encrypted.</p>
      </SimpleModal>

    </div>
  );
}

export default App;
