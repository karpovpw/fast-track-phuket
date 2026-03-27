import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, MessageCircle, Star, Building, 
  ChevronDown, Send, X, Check, ArrowRight,
  Coins, CreditCard, Quote, Phone
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
  const [calcInfants, setCalcInfants] = useState<number | string>(0);

  useEffect(() => {
    const detectLanguage = async () => {
      if (localStorage.getItem('langSet')) return;
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        const country = data.country;
        
        const countryMap: Record<string, string> = {
          'RU': 'ru', 'BY': 'ru', 'KZ': 'ru',
          'CN': 'zh', 'HK': 'zh', 'TW': 'zh',
          'IN': 'hi', 'IL': 'he',
          'AE': 'ar', 'SA': 'ar', 'QA': 'ar',
          'ES': 'es', 'MX': 'es', 'AR': 'es',
          'FR': 'fr', 'DE': 'de', 'AT': 'de', 'CH': 'de',
          'IT': 'it'
        };
        
        if (country && countryMap[country]) {
          i18n.changeLanguage(countryMap[country]);
        }
        localStorage.setItem('langSet', 'true');
      } catch (e) {
        console.error('Loc fetch err', e);
      }
    };
    detectLanguage();
  }, [i18n]);

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
    const totalPayingPax = adults + kids;
    
    let basePriceStr = 1700;
    let groupPrice = 1600;
    
    if (calcService === 'arr') {
      basePriceStr = 1700;
      groupPrice = 1600;
    } else if (calcService === 'dep') {
      basePriceStr = 1800;
      groupPrice = 1700;
    } else if (calcService === 'combo') {
      basePriceStr = 3300;
      groupPrice = 3100;
    }
    
    const adultPrice = totalPayingPax > 1 ? groupPrice : basePriceStr;
    const kidPrice = basePriceStr * 0.5;
    
    return (adults * adultPrice) + (kids * kidPrice);
  }, [calcService, calcAdults, calcKids, calcInfants]);

  const ctaLinks = {
    whatsapp: "https://wa.me/79697189210?text=Hello,%20I'd%20like%20to%20inquire%20about%20the%20VIP%20Fast%20Track.",
    telegram: "https://t.me/danilaru",
    phone: "tel:+66643162330"
  };

  const paymentMethods = [
    { key: "1", icon: <Building size={24} />, title: t("payments.1.t"), desc: t("payments.1.d") },
    { key: "2", icon: <Coins size={24} />, title: t("payments.2.t"), desc: t("payments.2.d") },
    { key: "4", icon: <CreditCard size={24} />, title: t("payments.4.t"), desc: t("payments.4.d") }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <Hero3D />

      <div style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-bg)', padding: '0.6rem 0', fontWeight: 700, fontSize: '0.85rem', zIndex: 110, position: 'relative', letterSpacing: '1px', textTransform: 'uppercase' }}>
        <div className="marquee-container">
          <div className="marquee-content">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="marquee-item">{t('nav.badge')}</div>
            ))}
          </div>
          <div className="marquee-content">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="marquee-item">{t('nav.badge')}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(10, 10, 10, 0.6)', backdropFilter: 'blur(15px)', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky' }}>
        
        {/* Language Selector (Moved to Left) */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <button onClick={() => setLangOpen(!langOpen)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.4rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
            <Globe size={16} /> <span className="mobile-hide">{languages.find(l => l.code === i18n.language)?.name || 'Language'}</span> <ChevronDown size={12} />
          </button>
          <AnimatePresence>
            {langOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                style={{ position: 'absolute', top: '100%', left: 0, marginTop: '0.5rem', backgroundColor: 'var(--color-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: '130px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 1000 }}
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

        {/* Centered Logo */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontWeight: 800, fontSize: '1.4rem', fontFamily: 'var(--font-heading)', letterSpacing: '1px', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
          FAST<span className="text-gold">TRACK</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', zIndex: 2 }}>
          {/* Top Bar Chat Buttons (Responsive) */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href={ctaLinks.phone} className="mobile-hide" style={{ color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              <Phone size={18} /> <span>{t('nav.call')}</span>
            </a>
            <a href={ctaLinks.telegram} target="_blank" rel="noreferrer" className="mobile-hide" style={{ color: '#2AABEE', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              <Send size={18} /> <span>Telegram</span>
            </a>
            <a href={ctaLinks.whatsapp} target="_blank" rel="noreferrer" className="mobile-hide" style={{ color: '#25D366', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              <MessageCircle size={18} /> <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </nav>

      <section style={{ padding: '8rem 0', position: 'relative' }}>
        <div className="container" style={{ maxWidth: '900px', textAlign: 'center' }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              background: 'rgba(5, 5, 5, 0.45)', 
              backdropFilter: 'blur(20px)', 
              padding: '4rem 2rem', 
              borderRadius: '24px', 
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
            }}
          >
            <h1 style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', lineHeight: 1.1, marginBottom: '2rem' }}>{t('hero.title')}</h1>
            <p style={{ fontSize: '1.4rem', color: 'var(--color-text-secondary)', marginBottom: '3.5rem', lineHeight: 1.6 }}>{t('hero.subtitle')}</p>
            <div className="takeaway-list">
              {[0, 1, 2, 5].map(i => (
                <div key={i} className="takeaway-item">
                  <Check size={20} className="text-gold" style={{ flexShrink: 0 }} />
                  <span>{t(`takeaways.${i}`)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Choose Your Fast Track Package Section */}
      <section style={{ padding: '6rem 0' }} id="packages">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.2rem' }}>{t('pkg_section.title')}</h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>{t('pkg_section.subtitle')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {['arr', 'dep', 'combo'].map((pkg) => {
              const iActive = selectedPackage === pkg;
              const isComboFeatured = pkg === 'combo' && !selectedPackage;
              const pkgPrice = pkg === 'arr' ? '1,700' : pkg === 'dep' ? '1,800' : '3,300';
              return (
              <div 
                key={pkg} 
                className="package-card-wrapper"
                style={{ position: 'relative' }}
              >
                {pkg === 'combo' && (
                  <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-gold)', color: '#000', padding: '0.25rem 1rem', borderRadius: '30px', fontSize: '0.75rem', fontWeight: 800, zIndex: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                    {t('packages.combo.badge')}
                  </div>
                )}
                  <div 
                    onClick={() => setSelectedPackage(pkg)}
                    className={`card selectable-card ${iActive ? 'active' : ''}`}
                    style={{ 
                      display: 'flex', flexDirection: 'column', cursor: 'pointer', height: '100%',
                      border: iActive || isComboFeatured ? '2px solid var(--color-gold)' : '1px solid rgba(255,255,255,0.05)',
                      background: pkg === 'combo' ? 'linear-gradient(180deg, #1e1b10 0%, #141414 100%)' : 'var(--color-surface)',
                      transform: iActive ? 'scale(1.05)' : (isComboFeatured ? 'scale(1.02)' : 'none'),
                      zIndex: iActive || isComboFeatured ? 5 : 1,
                      boxShadow: isComboFeatured ? '0 10px 40px rgba(212, 175, 55, 0.2)' : '0 10px 30px rgba(0,0,0,0.4)',
                      padding: '2.5rem'
                    }}
                  >
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.75rem', color: pkg === 'combo' ? 'var(--color-gold)' : '#fff', margin: 0, lineHeight: 1.2 }}>{t(`packages.${pkg}.title`)}</h3>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                          {pkg === 'combo' ? (
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                              <span style={{ color: 'var(--color-gold)', fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }}>฿3,300</span>
                              <span style={{ textDecoration: 'line-through', opacity: 0.5, fontSize: '0.9rem' }}>฿3,500</span>
                            </div>
                          ) : (
                            <div style={{ color: 'var(--color-gold)', fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }}>฿{pkgPrice}</div>
                          )}
                        </div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>{t('packages.th2')}</div>
                      </div>
                    </div>
                    
                    <div className="price-grid">
                       <div className="price-col">
                         <span className="price-label">
                           {t('packages.th3').split('|')[0]}
                         </span>
                         <span className="price-value">฿{pkg === 'arr' ? '1,600' : pkg === 'dep' ? '1,700' : '3,100'}</span>
                       </div>
                       <div className="price-col">
                         <span className="price-label">
                           {t('packages.th4').split('|')[0]}
                         </span>
                         <span className="price-value">฿{pkg === 'arr' ? '850' : pkg === 'dep' ? '900' : '1,650'}</span>
                       </div>
                       <div className="price-col" style={{ gridColumn: 'span 2', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.6rem' }}>
                         <div className="price-free">
                           <Star size={14} fill="var(--color-gold)" /> <span>{t('packages.th5')}: FREE</span>
                         </div>
                       </div>
                    </div>
                  </div>
                  <div style={{ flex: 1, marginBottom: '2.5rem' }}>
                    {(t(`packages.${pkg}.features`) as string).split('|').map((feature, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.95rem', alignItems: 'flex-start' }}>
                        <Check size={18} className="text-gold" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ color: idx === 0 ? '#fff' : 'var(--color-text-secondary)' }}>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ marginTop: 'auto' }}>
                    {selectedPackage === pkg && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                          <a href={ctaLinks.telegram} target="_blank" rel="noreferrer" className="btn" style={{ background: '#2AABEE', color: '#fff', fontSize: '0.85rem', padding: '0.8rem' }} onClick={(e) => e.stopPropagation()}>
                            <Send size={18} /> Telegram
                          </a>
                          <a href={ctaLinks.whatsapp} target="_blank" rel="noreferrer" className="btn" style={{ background: '#25D366', color: '#fff', fontSize: '0.85rem', padding: '0.8rem' }} onClick={(e) => e.stopPropagation()}>
                            <MessageCircle size={18} /> WhatsApp
                          </a>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', opacity: 0.5, fontWeight: 600 }}>
                          {t('pkg_section.book_pre') || 'BOOK'} {t(`packages.${pkg}.btn`)} →
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </section>

      {/* Reduced Payment Methods */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.1rem' }}>{t('payments.title')}</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>{t('payments.subtitle')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            {paymentMethods.map(pm => (
              <div key={pm.key} className="card" style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--color-gold)', marginBottom: '1.2rem', display: 'flex', justifyContent: 'center' }}>{pm.icon}</div>
                <h4 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>{pm.title}</h4>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{pm.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Table SEO Segment */}
      <section style={{ padding: '6rem 0' }} id="pricing">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.1rem' }}>{t('packages.title')}</h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>{t('packages.subtitle')}</p>
          </div>
          
          <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--color-gold)', position: 'relative' }}>
             <div style={{ position: 'absolute', top: 0, left: 0, background: 'var(--color-gold)', color: '#000', padding: '0.4rem 1rem', borderBottomRightRadius: '8px', fontWeight: 'bold', fontSize: '0.8rem', zIndex: 10 }}>{t('pricing.guarantee')}</div>
             <div style={{ overflowX: 'auto' }}>
               <table style={{ minWidth: '800px', width: '100%', margin: 0, border: 'none' }}>
                 <thead>
                   <tr>
                     <th style={{ padding: '2rem 1.5rem 1.5rem', background: 'rgba(212, 175, 55, 0.1)', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', verticalAlign: 'middle' }}>
                        {t('packages.th1')}
                      </th>
                      <th style={{ padding: '2rem 1.5rem 1.5rem', background: 'rgba(212, 175, 55, 0.1)', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', verticalAlign: 'middle' }}>
                        {t('packages.th2')}
                      </th>
                      <th style={{ padding: '2rem 1.5rem 1.5rem', background: 'rgba(212, 175, 55, 0.1)', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', color: 'var(--color-gold)', verticalAlign: 'middle' }}>
                        {t('packages.th3').split('|').map((line: string, i: number) => <div key={i}>{line}</div>)}
                      </th>
                      <th style={{ padding: '2rem 1.5rem 1.5rem', background: 'rgba(212, 175, 55, 0.1)', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', verticalAlign: 'middle' }}>
                        {t('packages.th4').split('|').map((line: string, i: number) => (
                           <div key={i} style={i === 1 ? { background: '#25D366', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', display: 'inline-block', marginTop: '0.2rem', fontWeight: 800 } : {}}>
                             {line}
                           </div>
                        ))}
                      </th>
                      <th style={{ padding: '2rem 1.5rem 1.5rem', background: 'rgba(212, 175, 55, 0.1)', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', verticalAlign: 'middle' }}>
                        {t('packages.th5').split('|').map((line: string, i: number) => <div key={i} style={{ fontSize: i === 1 ? '0.8rem' : 'inherit', opacity: i === 1 ? 0.7 : 1 }}>{line}</div>)}
                      </th>
                   </tr>
                 </thead>
                 <tbody>
                    <tr>
                      <td style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{t('packages.arr.title')}</div>
                      </td>
                     <td style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '1.2rem', fontWeight: 600 }}>฿1,700</td>
                     <td style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--color-gold)', fontSize: '1.2rem', fontWeight: 700 }}>฿1,600 / pax</td>
                     <td style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>฿850</td>
                     <td style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#25D366', fontWeight: 700 }}>FREE</td>
                   </tr>
                    <tr>
                     <td style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{t('packages.dep.title')}</div>
                     </td>
                     <td style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '1.2rem', fontWeight: 600 }}>฿1,800</td>
                     <td style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--color-gold)', fontSize: '1.2rem', fontWeight: 700 }}>฿1,700 / pax</td>
                     <td style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>฿900</td>
                     <td style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#25D366', fontWeight: 700 }}>FREE</td>
                   </tr>
                   <tr>
                     <td style={{ padding: '1.5rem' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{t('packages.combo.title')}</div>
                     </td>
                     <td style={{ padding: '1.5rem', fontSize: '1.2rem', fontWeight: 600 }}>฿3,300</td>
                     <td style={{ padding: '1.5rem', color: 'var(--color-gold)', fontSize: '1.2rem', fontWeight: 700 }}>฿3,100 / pax</td>
                     <td style={{ padding: '1.5rem' }}>฿1,650</td>
                     <td style={{ padding: '1.5rem', color: '#25D366', fontWeight: 700 }}>FREE</td>
                   </tr>
                 </tbody>
               </table>
             </div>
             <div style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(20,20,20,0.8)', borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)', textAlign: 'center' }}>{t('packages.footer')}</p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <a href="#packages" className="btn" style={{ background: 'var(--color-gold)', color: '#000', padding: '1rem 2rem', borderRadius: '30px', fontWeight: 700 }}>
                      {t('pricing.cta')}
                    </a>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Pricing Calculator Section (Moved Below Prices Table) */}
      <section style={{ padding: '6rem 0' }} id="calculator">
        <div className="container" style={{ maxWidth: '600px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="card" style={{ padding: '3rem', border: '1px solid var(--color-gold)', background: 'var(--color-surface)', backdropFilter: 'none' }}>
              <h3 style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '2rem' }}>{t('calc.title')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <div style={{ display: 'block', marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', color: 'var(--color-gold)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{t('calc.service')}</label>
                    <select value={calcService} onChange={(e) => setCalcService(e.target.value)} style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px' }}>
                      <option value="arr" style={{ color: '#000' }}>{t('packages.arr.title')} (฿1,700)</option>
                      <option value="dep" style={{ color: '#000' }}>{t('packages.dep.title')} (฿1,800)</option>
                      <option value="combo" style={{ color: '#000' }}>{t('packages.combo.title')} (฿3,300)</option>
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', color: 'var(--color-gold)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{t('calc.adults')}</label>
                      <input 
                        type="number" min="0" 
                        value={calcAdults} 
                        onChange={(e) => setCalcAdults(e.target.value === '' ? '' : parseInt(e.target.value))} 
                        style={{ width: '100%', padding: '1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: 'var(--color-gold)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{t('calc.kids')}</label>
                      <input 
                        type="number" min="0" 
                        value={calcKids} 
                        onChange={(e) => setCalcKids(e.target.value === '' ? '' : parseInt(e.target.value))} 
                        style={{ width: '100%', padding: '1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: 'var(--color-gold)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{t('calc.infants') || 'Infants'}</label>
                      <input 
                        type="number" min="0" 
                        value={calcInfants} 
                        onChange={(e) => setCalcInfants(e.target.value === '' ? '' : parseInt(e.target.value))} 
                        style={{ width: '100%', padding: '1rem' }}
                      />
                    </div>
                  </div>
                </div>
                <div style={{ padding: '2rem', background: 'rgba(212, 175, 55, 0.15)', borderRadius: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '0.25rem', fontWeight: 600 }}>{t('calc.estimate')}</div>
                  <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-gold)' }}>฿{totalPrice.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                   <a href={ctaLinks.telegram} target="_blank" rel="noreferrer" className="btn" style={{ background: '#2AABEE', color: '#fff', padding: '1rem 2rem', fontWeight: 700, minWidth: '160px' }}>
                    <Send size={20} /> Telegram
                  </a>
                  <a href={ctaLinks.whatsapp} target="_blank" rel="noreferrer" className="btn" style={{ background: '#25D366', color: '#fff', padding: '1rem 2rem', fontWeight: 700, minWidth: '160px' }}>
                    <MessageCircle size={20} /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured TDAC Guide */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div 
            className="card" onClick={() => setActiveModal('tdac')} 
            style={{ 
              background: 'linear-gradient(135deg, #1e1b10 0%, #0a0a0a 100%)', 
              border: '2px solid var(--color-gold)', 
              cursor: 'pointer', 
              position: 'relative',
              padding: '4rem',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ background: 'var(--color-gold)', color: 'var(--color-bg)', padding: '0.4rem 1.2rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 800, position: 'absolute', top: '2rem', left: '50%', transform: 'translateX(-50%)' }}>{t('guides.tdac.badge')}</div>
            <Star size={48} className="text-gold" style={{ marginTop: '1.5rem', marginBottom: '2rem' }} />
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{t('guides.tdac.t')}</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
              {t('guides.tdac.d')}
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-gold)', fontWeight: 800, fontSize: '1.2rem', borderBottom: '2px solid' }}>
              {t('guides.tdac.cta')} <ArrowRight size={24} />
            </div>
          </div>
        </div>
      </section>

      {/* Workers / Team Section */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.2rem' }}>{t('team.title')}</h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>{t('team.subtitle')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 1.5rem', overflow: 'hidden', border: '2px solid var(--color-gold)' }}>
                  <img src={`/w${i}.png`} alt={t(`team.w${i}.n`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{t(`team.w${i}.n`)}</h4>
                <div style={{ color: 'var(--color-gold)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.2rem' }}>{t(`team.w${i}.r`)}</div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{t(`team.w${i}.d`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem' }}>{t('reviews.title')}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ color: 'var(--color-gold)' }}>
                  <Quote size={32} style={{ opacity: 0.3 }} />
                </div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} fill="var(--color-gold)" className="text-gold" />)}
                </div>
                <h4 style={{ fontSize: '1.1rem' }}>"{t(`reviews.${i}.t`)}"</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic', flex: 1 }}>{t(`reviews.${i}.d`)}</p>
                <div style={{ fontWeight: 600 }}>{t(`reviews.${i}.n`)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Segment */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '3.5rem' }}>{t('compare.title')}</h2>
          <div className="compare-container">
            <table>
              <thead>
                <tr><th>{t('compare.th1')}</th><th>{t('compare.th2')}</th><th style={{ color: 'var(--color-gold)' }}>{t('compare.th3')}</th></tr>
              </thead>
               <tbody>
                 {[1, 2, 3, 4, 5, 6, 7].map(i => (
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
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card">
                <h4 style={{ color: 'var(--color-gold)', marginBottom: '0.8rem', fontSize: '1.1rem' }}>{t(`faq.${i}.q`)}</h4>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{t(`faq.${i}.a`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reduced Payment Methods (Moved Up) */}

      {/* Simplified Footer */}
      <footer style={{ padding: '5rem 0', background: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: '1.6rem', fontFamily: 'var(--font-heading)', marginBottom: '2rem' }}>
            FAST<span className="text-gold">TRACK</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '2.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            <button onClick={() => setActiveModal('terms')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 600 }}>{t('footer.terms')}</button>
            <button onClick={() => setActiveModal('privacy')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 600 }}>{t('footer.privacy')}</button>
          </div>
          <p style={{ opacity: 0.4, fontSize: '0.75rem', letterSpacing: '1px' }}>{t('footer.legal')}</p>
        </div>
      </footer>
      
      {/* Bottom Marquee */}
      <div style={{ backgroundColor: 'var(--color-gold)', color: 'var(--color-bg)', padding: '0.6rem 0', fontWeight: 700, fontSize: '0.85rem', zIndex: 110, position: 'relative', letterSpacing: '1px', textTransform: 'uppercase' }}>
        <div className="marquee-container">
          <div className="marquee-content">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="marquee-item">{t('nav.badge')}</div>
            ))}
          </div>
          <div className="marquee-content">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="marquee-item">{t('nav.badge')}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <SimpleModal isOpen={activeModal === 'tdac'} onClose={() => setActiveModal(null)} title={t("tdac_modal.title")} highlight={true}>
        <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#fff' }}>{t("tdac_modal.p1")}</p>
          <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-gold)' }}>
            <h4 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }}>{t("tdac_modal.scam_title")}</h4>
            <p>{t("tdac_modal.scam_desc")}</p>
          </div>
          <h4 style={{ color: '#fff', marginBottom: '1rem' }}>{t("tdac_modal.guide_title")}</h4>
          <ol style={{ paddingLeft: '1.5rem', display: 'grid', gap: '0.8rem' }}>
            <li>{t("tdac_modal.step1")}</li>
            <li>{t("tdac_modal.step2")}</li>
            <li>{t("tdac_modal.step3")}</li>
            <li>{t("tdac_modal.step4")}</li>
          </ol>
        </div>
      </SimpleModal>

      <SimpleModal isOpen={activeModal === 'terms'} onClose={() => setActiveModal(null)} title={t("modal.terms.title")}>
        <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          {t("modal.terms.desc").split('\n').map((line: string, i: number) => (
             <p key={i} style={{ marginBottom: line.trim() === "" ? "0.5rem" : "1rem" }}>{line}</p>
          ))}
        </div>
      </SimpleModal>

      <SimpleModal isOpen={activeModal === 'privacy'} onClose={() => setActiveModal(null)} title={t("modal.privacy.title")}>
        <div style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
          {t("modal.privacy.desc").split('\n').map((line: string, i: number) => (
             <p key={i} style={{ marginBottom: line.trim() === "" ? "0.5rem" : "1rem" }}>{line}</p>
          ))}
        </div>
      </SimpleModal>

      {/* Floating Chat Buttons */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 1000 }}>
         <motion.a 
            href={ctaLinks.phone}
            whileHover={{ scale: 1.1 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            style={{ width: '60px', height: '60px', background: 'var(--color-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', boxShadow: '0 8px 25px rgba(212, 175, 55, 0.4)', textDecoration: 'none' }}
         >
           <Phone size={32} />
         </motion.a>
         <motion.a 
            href={ctaLinks.whatsapp} target="_blank" rel="noreferrer"
            whileHover={{ scale: 1.1 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
            style={{ width: '60px', height: '60px', background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4)', textDecoration: 'none' }}
         >
           <MessageCircle size={32} />
         </motion.a>
         <motion.a 
            href={ctaLinks.telegram} target="_blank" rel="noreferrer"
            whileHover={{ scale: 1.1 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 2 }}
            style={{ width: '60px', height: '60px', background: '#2AABEE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 8px 25px rgba(42, 171, 238, 0.4)', textDecoration: 'none' }}
         >
           <Send size={32} />
         </motion.a>
      </div>

    </div>
  );
}

export default App;
