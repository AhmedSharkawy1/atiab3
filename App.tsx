
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import MenuSection from './components/MenuSection';
import Logo from './components/Logo';
import { MENU_DATA, PIZZA_FATAYER_ADDITIONS, CREPE_ADDITIONS } from './constants';
import { MenuItem, MenuSection as MenuSectionType, CartItem } from './types';

const WHATSAPP_NUMBER = "201092621367";

const AtyabLogo = ({ size = "w-16 h-16" }: { size?: string }) => (
  <div className={`${size} relative flex items-center justify-center overflow-hidden rounded-full border-[3px] border-[#eab308] shadow-md bg-white dark:bg-zinc-900 mb-4 transform transition-all duration-700 hover:rotate-6 active:scale-95 cursor-pointer p-1`}>
    <Logo />
  </div>
);

const App: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true;
  });
  const [activeSection, setActiveSection] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<{ item: MenuItem, section: MenuSectionType } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showBottomCallMenu, setShowBottomCallMenu] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Modal Selection States
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<{ name: string, price: number, quantity: number }[]>([]);
  const [itemNotes, setItemNotes] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);

  // Checkout Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const navRef = useRef<HTMLDivElement>(null);
  const isManualScrolling = useRef(false);

  const navItems = [...MENU_DATA.slice(0, 4), PIZZA_FATAYER_ADDITIONS, ...MENU_DATA.slice(4, 8), CREPE_ADDITIONS];

  useEffect(() => {
    setCurrentUrl(window.location.href);
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-180px 0px -40% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isManualScrolling.current) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [navItems]);

  useEffect(() => {
    if (activeSection && navRef.current) {
      const activeButton = navRef.current.querySelector(`[data-section-id="${activeSection}"]`);
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeSection]);

  const triggerHaptic = (pattern = 10) => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      isManualScrolling.current = true;
      setActiveSection(id);
      const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - 170;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setShowCategoriesMenu(false);
      setTimeout(() => { isManualScrolling.current = false; }, 800);
    }
  };

  const scrollNav = (direction: 'left' | 'right') => {
    if (navRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      navRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      triggerHaptic(5);
    }
  };

  const resetItemStates = () => {
    setSelectedSizeIdx(0);
    setSelectedAddons([]);
    setItemNotes("");
    setItemQuantity(1);
  };

  const updateAddonQty = (addon: { name: string, price: number }, delta: number) => {
    triggerHaptic(5);
    setSelectedAddons(prev => {
      const existing = prev.find(a => a.name === addon.name);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) return prev.filter(a => a.name !== addon.name);
        return prev.map(a => a.name === addon.name ? { ...a, quantity: newQty } : a);
      }
      if (delta > 0) return [...prev, { ...addon, quantity: 1 }];
      return prev;
    });
  };

  const addToCart = () => {
    if (!selectedItem) return;
    const priceStr = selectedItem.item.prices[selectedSizeIdx] || "0";
    const basePrice = parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
    
    const newItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: selectedItem.item.name,
      categoryName: selectedItem.section.title,
      price: basePrice,
      size: selectedItem.item.labels?.[selectedSizeIdx] || selectedItem.section.subtitles?.[selectedSizeIdx],
      quantity: itemQuantity,
      notes: itemNotes,
      addons: [...selectedAddons]
    };
    
    setCart([...cart, newItem]);
    setSelectedItem(null);
    triggerHaptic(20);
    resetItemStates();
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(i => i.id !== id));
    triggerHaptic(5);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const addonsPrice = item.addons.reduce((sum, a) => sum + (a.price * a.quantity), 0);
      return total + (item.price + addonsPrice) * item.quantity;
    }, 0);
  };

  const sendOrderToWhatsApp = () => {
    if (!customerName || !customerPhone || !customerAddress) {
      alert("⚠️ يرجى إدخال البيانات كاملة للمتابعة.");
      return;
    }

    setIsSending(true);
    triggerHaptic(50);

    const total = calculateTotal();
    const orderId = Math.floor(Math.random() * 90000) + 10000;
    const securityHash = btoa(`${total}-${orderId}`).substring(0, 8).toUpperCase();

    let message = `🔴 *[نظام طلبات أطياب الآلي]*\n`;
    message += `⚠️ *تنبيه: أي تعديل في الرسالة سيؤدي لإلغاء الطلب*\n`;
    message += `━━━━━━━━━━━━━━\n`;
    message += `🔢 *كود الأمان:* ${securityHash}\n`;
    message += `🔢 *أوردر رقم:* #${orderId}\n`;
    message += `👤 *العميل:* ${customerName}\n`;
    message += `📍 *العنوان:* ${customerAddress}\n`;
    message += `━━━━━━━━━━━━━━\n\n`;

    cart.forEach((item, idx) => {
      const singleItemAddonsPrice = item.addons.reduce((s, a) => s + (a.price * a.quantity), 0);
      const singleRowTotal = (item.price + singleItemAddonsPrice) * item.quantity;
      message += `${idx + 1}. *${item.name}* [${item.categoryName}] ${item.size ? `(${item.size})` : ''} x${item.quantity}\n`;
      if (item.addons.length > 0) {
        message += `   ➕ إضافات: ${item.addons.map(a => `${a.quantity}x ${a.name} (+${a.price * a.quantity}ج)`).join(' + ')}\n`;
      }
      if (item.notes) message += `   📝 ملاحظة: ${item.notes}\n`;
      message += `   💰 السعر: ${singleRowTotal} ج\n\n`;
    });

    message += `━━━━━━━━━━━━━━\n`;
    message += `💰 *الإجمالي النهائي: ${total} جنيه*\n`;
    message += `━━━━━━━━━━━━━━\n`;
    message += `✅ *[برجاء الضغط على إرسال مباشرة]*`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsSending(false);
      setIsCheckoutOpen(false);
      setCart([]);
    }, 2000);
  };

  const additionsGroup = (() => {
    if (!selectedItem) return null;
    const sectionId = selectedItem.section.id;
    if (['fatayer-savory', 'pizza-oriental', 'pizza-italian'].includes(sectionId)) return PIZZA_FATAYER_ADDITIONS;
    if (['crepe-savory', 'rolls', 'syrian'].includes(sectionId)) return CREPE_ADDITIONS;
    return null;
  })();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-200 antialiased selection:bg-yellow-500/30">
      <Header isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} onAction={() => triggerHaptic()} />
      
      <nav className="sticky top-0 z-40 bg-white/95 dark:bg-[#050505]/95 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10 shadow-sm">
        <div className="max-w-2xl mx-auto relative flex items-center group">
          <button onClick={() => scrollNav('right')} className="absolute right-0 z-10 w-10 h-full bg-gradient-to-l from-white dark:from-[#050505] to-transparent flex items-center justify-center text-zinc-400 active:text-yellow-600 transition-all">
            <span className="text-xl rotate-180">‹</span>
          </button>
          <div ref={navRef} className="flex gap-2 overflow-x-auto no-scrollbar px-10 py-4 scroll-smooth">
            {navItems.map((item) => (
              <button
                key={item.id}
                data-section-id={item.id}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-2xl text-[12px] font-black border transition-all duration-300 ${
                  activeSection === item.id 
                  ? 'bg-yellow-600 text-black border-yellow-500 scale-105 shadow-lg shadow-yellow-600/20' 
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 text-zinc-500 hover:border-yellow-500/30'
                }`}
              >
                <span className="animate-emoji">{(item as any).emoji || '✨'}</span> {item.title}
              </button>
            ))}
          </div>
          <button onClick={() => scrollNav('left')} className="absolute left-0 z-10 w-10 h-full bg-gradient-to-r from-white dark:from-[#050505] to-transparent flex items-center justify-center text-zinc-400 active:text-yellow-600 transition-all">
            <span className="text-xl">‹</span>
          </button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-5 py-8 pb-48">
        <div className="mb-8 rounded-[1.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 relative overflow-hidden text-right shadow-md reveal-item">
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-1 leading-none italic uppercase tracking-tighter">ATYAB</h2>
            <p className="text-yellow-600 dark:text-yellow-500 text-[10px] font-black uppercase mb-2 tracking-widest">فطاطري أطياب</p>
            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-[9px] font-bold">
              <span>📍 البدرشين - برج أنس الوجود</span>
            </div>
          </div>
          <div className="absolute -left-4 -bottom-4 text-[80px] opacity-[0.03] rotate-12 animate-emoji">🥨</div>
        </div>

        {MENU_DATA.map((section) => (
          <MenuSection key={section.id} section={section} onItemSelect={(item, sec) => { triggerHaptic(); setSelectedItem({ item, section: sec }); resetItemStates(); }} />
        ))}

        <footer className="mt-16 pb-12 flex flex-col items-center gap-6 reveal-item">
            <div className="w-full bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-lg border border-zinc-200 dark:border-white/10 flex flex-col items-center gap-5 text-center">
               <AtyabLogo />
               <div className="relative p-3 bg-white rounded-2xl border-2 border-zinc-100 shadow-inner">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentUrl)}`} alt="QR Code" className="w-24 h-24" />
               </div>
            </div>
        </footer>
      </main>

      {/* Item Selection Modal (Optimized & Compact) */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={() => setSelectedItem(null)}>
          <div className="w-full max-w-[340px] bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl animate-slide-up border border-white/10 flex flex-col max-h-[82vh]" onClick={e => e.stopPropagation()}>
            
            {/* Header - Compact */}
            <div className="relative px-6 pt-7 pb-4 border-b border-zinc-100 dark:border-white/5 text-right">
              <button onClick={() => setSelectedItem(null)} className="absolute left-6 top-7 w-8 h-8 bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white rounded-full font-black text-sm transition-all active:scale-90 flex items-center justify-center shadow-sm">✕</button>
              <div className="space-y-0.5">
                <span className="text-yellow-600 text-[8px] font-black uppercase tracking-widest">{selectedItem.section.title}</span>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white leading-tight italic uppercase">{selectedItem.item.name}</h3>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7 no-scrollbar">
              {/* Sizes */}
              {selectedItem.item.prices.length > 1 && (
                <div className="space-y-3">
                  <p className="font-black text-[9px] text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 flex-row-reverse"><span>📐</span> حدد الحجم</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedItem.item.prices.map((p, i) => (
                      <button key={i} onClick={() => { triggerHaptic(); setSelectedSizeIdx(i); }}
                        className={`py-3 px-2 rounded-xl font-black border-2 transition-all flex flex-col items-center gap-0.5 ${selectedSizeIdx === i ? 'bg-yellow-600 border-yellow-600 text-black shadow-md shadow-yellow-600/20' : 'bg-zinc-50 dark:bg-white/[0.03] border-zinc-100 dark:border-white/5 text-zinc-500'}`}
                      >
                        <span className="opacity-60 text-[7px] font-black uppercase">{selectedItem.item.labels?.[i] || selectedItem.section.subtitles?.[i]}</span>
                        <span className="text-lg tabular-nums leading-none font-black">{p}<span className="text-[9px] mr-1">ج</span></span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons with Quantity Counter */}
              {additionsGroup && (
                <div className="space-y-3">
                  <p className="font-black text-[9px] text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 flex-row-reverse"><span>✨</span> الإضافات</p>
                  <div className="flex flex-col gap-2">
                    {additionsGroup.items.map((add, i) => {
                      const price = parseInt(add.prices[0]) || 0;
                      const currentAddon = selectedAddons.find(a => a.name === add.name);
                      const qty = currentAddon?.quantity || 0;
                      return (
                        <div key={i} className={`p-2.5 rounded-xl border-2 flex items-center justify-between transition-all ${qty > 0 ? 'bg-yellow-600/10 border-yellow-600/40 text-yellow-700 dark:text-yellow-500' : 'bg-zinc-50 dark:bg-white/[0.02] border-zinc-100 dark:border-white/5 text-zinc-500'}`}>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateAddonQty({ name: add.name, price }, 1)} className="w-7 h-7 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-lg flex items-center justify-center font-black text-lg active:scale-90 shadow-sm">+</button>
                            <span className={`min-w-[18px] text-center tabular-nums font-black text-sm ${qty > 0 ? 'opacity-100' : 'opacity-20'}`}>{qty}</span>
                            <button onClick={() => updateAddonQty({ name: add.name, price }, -1)} className="w-7 h-7 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-lg flex items-center justify-center font-black text-lg active:scale-90 shadow-sm">-</button>
                          </div>
                          <div className="text-right flex-1 pr-3">
                            <span className="text-[11px] font-black leading-tight block">{add.name}</span>
                            <span className="text-[8px] font-bold opacity-60">+{price}ج / الحبة</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-3">
                <p className="font-black text-[9px] text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 flex-row-reverse"><span>📝</span> الملاحظات</p>
                <textarea value={itemNotes} onChange={e => setItemNotes(e.target.value)} placeholder="مثلاً: حار زيادة..."
                  className="w-full bg-zinc-50 dark:bg-white/[0.03] border-2 border-zinc-100 dark:border-white/5 rounded-xl p-4 text-right font-bold text-[11px] h-20 outline-none focus:border-yellow-600 transition-all resize-none shadow-inner"
                />
              </div>
            </div>

            {/* Bottom Footer - Compact */}
            <div className="p-5 bg-zinc-50 dark:bg-white/[0.05] border-t border-zinc-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white dark:bg-zinc-800 rounded-lg p-0.5 gap-1.5 border border-zinc-100 dark:border-white/10 shadow-sm">
                  <button onClick={() => { triggerHaptic(); setItemQuantity(q => q + 1); }} className="w-8 h-8 bg-zinc-50 dark:bg-zinc-700 rounded-md font-black text-lg active:scale-90 shadow-sm">+</button>
                  <span className="font-black text-xl min-w-[24px] text-center tabular-nums text-zinc-900 dark:text-white leading-none">{itemQuantity}</span>
                  <button onClick={() => { triggerHaptic(); setItemQuantity(q => Math.max(1, q - 1)); }} className="w-8 h-8 bg-zinc-50 dark:bg-zinc-700 rounded-md font-black text-lg active:scale-90 shadow-sm">-</button>
                </div>
                <button onClick={addToCart} className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-black font-black py-3 rounded-lg text-base shadow-md active:scale-[0.97] transition-all">
                  إضافة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal (Receipt View) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-lg p-4" onClick={() => setIsCheckoutOpen(false)}>
          <div className="w-full max-w-[340px] bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl animate-slide-up relative flex flex-col max-h-[85vh] border border-white/10" onClick={e => e.stopPropagation()}>
            
            {/* Header - Invoice */}
            <div className="p-6 pb-3 border-b-2 border-dashed border-zinc-100 dark:border-white/5 text-right flex justify-between items-center flex-row-reverse relative">
              <div className="flex flex-col">
                <h3 className="text-xl font-black text-zinc-900 dark:text-white italic tracking-tighter uppercase leading-none">ORDER</h3>
                <p className="text-yellow-600 text-[9px] font-black uppercase tracking-[0.3em] mt-0.5">تأكيد طلب أطياب</p>
              </div>
              <button onClick={() => setIsCheckoutOpen(false)} className="w-8 h-8 bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white rounded-full font-black text-sm active:scale-90 transition-all flex items-center justify-center shadow-md">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-7 no-scrollbar">
              {/* Customer Form */}
              <div className="space-y-3">
                <p className="font-black text-[8px] text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 flex-row-reverse mb-0.5"><span>🛵</span> العنوان</p>
                <div className="space-y-2">
                  <input type="text" placeholder="الاسم" value={customerName} onChange={e => setCustomerName(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-white/[0.03] border-2 border-zinc-100 dark:border-white/5 rounded-xl py-2.5 px-4 text-right font-bold text-xs outline-none focus:border-yellow-600 transition-all shadow-sm"
                  />
                  <input type="tel" placeholder="رقم الموبايل" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-white/[0.03] border-2 border-zinc-100 dark:border-white/5 rounded-xl py-2.5 px-4 text-right font-bold text-xs outline-none focus:border-yellow-600 transition-all shadow-sm"
                  />
                  <textarea placeholder="العنوان بالتحديد..." value={customerAddress} onChange={e => setCustomerAddress(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-white/[0.03] border-2 border-zinc-100 dark:border-white/5 rounded-xl py-2.5 px-4 text-right font-bold text-xs outline-none focus:border-yellow-600 h-16 transition-all shadow-sm resize-none"
                  />
                </div>
              </div>

              {/* Basket Items List */}
              <div className="bg-zinc-50 dark:bg-white/[0.03] rounded-[1.5rem] p-5 border-2 border-dashed border-zinc-200 dark:border-white/10 relative shadow-inner">
                <div className="flex justify-between items-center mb-5 flex-row-reverse border-b border-zinc-200 dark:border-white/10 pb-3">
                   <p className="font-black text-[9px] text-zinc-400 uppercase tracking-widest">السلة</p>
                   <span className="text-lg">📋</span>
                </div>
                
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex flex-col gap-2 relative border-b last:border-0 border-zinc-100 dark:border-white/5 pb-4 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white rounded-md text-[8px] transition-all flex items-center justify-center">✕</button>
                          <span className="font-black text-base tabular-nums text-yellow-600">
                            {(item.price + item.addons.reduce((s,a)=>s+(a.price * a.quantity),0)) * item.quantity}ج
                          </span>
                        </div>
                        <div className="text-right flex-1 pr-2">
                           <span className="text-[7px] font-black uppercase bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded w-fit mb-0.5">{item.categoryName}</span>
                           <h4 className="font-black text-xs text-zinc-800 dark:text-zinc-100 leading-tight">
                             {item.name} <span className="text-yellow-600 ml-1">x{item.quantity}</span>
                           </h4>
                           {item.size && <span className="text-[8px] text-zinc-400 font-bold block italic">{item.size}</span>}
                        </div>
                      </div>
                      
                      {/* Multi-Addon Display */}
                      {item.addons.length > 0 && (
                        <div className="flex flex-wrap justify-end gap-1 px-1">
                          {item.addons.map((a, i) => (
                            <span key={i} className="text-[7px] bg-yellow-500/10 text-yellow-700 dark:text-yellow-500/80 px-2 py-0.5 rounded-md font-black border border-yellow-500/10 flex items-center gap-1">
                               <span>{a.quantity}x {a.name}</span>
                               <span className="opacity-40">(+{a.price * a.quantity}ج)</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Total Section */}
                <div className="mt-6 pt-5 border-t-2 border-dotted border-zinc-200 dark:border-white/20">
                  <div className="flex justify-between items-center flex-row-reverse">
                    <span className="font-black text-zinc-900 dark:text-white text-sm tracking-tight">إجمالي الفاتورة</span>
                    <div className="flex items-baseline gap-1">
                       <span className="text-3xl font-black text-yellow-600 tabular-nums leading-none">{calculateTotal()}</span>
                       <span className="text-sm font-black text-yellow-600/60">ج</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="p-6 bg-white dark:bg-zinc-900 border-t-2 border-zinc-100 dark:border-white/5">
              <button 
                disabled={isSending}
                onClick={sendOrderToWhatsApp} 
                className={`w-full ${isSending ? 'bg-zinc-400' : 'bg-[#25D366] shadow-lg'} text-white font-black py-4 rounded-xl text-lg active:scale-[0.98] flex items-center justify-center gap-3 transition-all`}
              >
                <span>{isSending ? 'جاري التحويل...' : 'تأكيد عبر واتساب'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-[60] px-4 pb-10 pt-2 md:hidden">
        <div className="max-w-xl mx-auto glass border border-zinc-200 dark:border-white/10 rounded-[2.5rem] p-1 flex items-center justify-around shadow-xl relative">
          {(showBottomCallMenu || showCategoriesMenu) && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-[6px] z-[61]" onClick={() => { setShowBottomCallMenu(false); setShowCategoriesMenu(false); }}></div>
          )}
          
          {/* Cart Indicator */}
          {cart.length > 0 && !isCheckoutOpen && !selectedItem && (
            <button onClick={() => { triggerHaptic(); setIsCheckoutOpen(true); }}
              className="absolute -top-14 left-3 right-3 bg-zinc-900 dark:bg-white text-white dark:text-black py-4 px-6 rounded-[1.5rem] shadow-xl flex justify-between items-center animate-slide-up border border-white/20 active:scale-95 transition-transform"
            >
              <div className="flex flex-col items-start">
                 <span className="font-black tabular-nums text-lg leading-none">{calculateTotal()}ج</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-xs uppercase tracking-tight">مراجعة الفاتورة</span>
                <div className="bg-yellow-600 text-black w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-black">{cart.length}</div>
              </div>
            </button>
          )}

          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="flex-1 flex flex-col items-center py-2 text-[#25D366] active:scale-90 transition-transform">
            <span className="text-xl animate-emoji">💬</span>
            <span className="text-[8px] font-black text-zinc-400 mt-0.5">واتساب</span>
          </a>
          <button onClick={() => { setShowBottomCallMenu(!showBottomCallMenu); setShowCategoriesMenu(false); }} className={`flex-1 flex flex-col items-center py-2 active:scale-90 transition-all ${showBottomCallMenu ? 'text-yellow-600' : 'text-zinc-500'}`}>
            <span className="text-xl animate-emoji">📞</span>
            <span className="text-[8px] font-black text-zinc-400 mt-0.5">اتصال</span>
          </button>
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="bg-yellow-600 w-14 h-14 rounded-full flex items-center justify-center text-black shadow-lg -mt-10 border-4 border-white dark:border-[#050505] active:scale-90 z-[63] transition-all">
            <span className="text-lg animate-emoji">🔝</span>
          </button>
          <a href={`https://www.google.com/maps/search/R7XC+FC7+برج+أنس+الوجود`} target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col items-center py-2 text-zinc-500 active:scale-90 transition-transform">
            <span className="text-xl animate-emoji">📍</span>
            <span className="text-[8px] font-black text-zinc-400 mt-0.5">الموقع</span>
          </a>
          <button onClick={() => { setShowCategoriesMenu(!showCategoriesMenu); setShowBottomCallMenu(false); }} className={`flex-1 flex flex-col items-center py-2 active:scale-90 transition-all ${showCategoriesMenu ? 'text-yellow-600' : 'text-zinc-500'}`}>
            <span className="text-xl animate-emoji">📋</span>
            <span className="text-[8px] font-black text-zinc-400 mt-0.5">المنيو</span>
          </button>

          {/* Call Menu */}
          {showBottomCallMenu && (
             <div className="absolute bottom-[calc(100%+1.5rem)] left-0 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up mx-2 z-[62]">
               <div className="px-5 py-3 bg-zinc-50 dark:bg-white/5 border-b border-zinc-100 dark:border-white/5 text-right flex justify-between items-center flex-row-reverse">
                  <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">تواصل</span>
                  <span className="text-lg">📞</span>
               </div>
               {[{n: "01044168230", l: "رقم 1"}, {n: "01124005181", l: "رقم 2"}].map((p, i) => (
                 <a key={i} href={`tel:${p.n}`} className="flex items-center justify-between px-6 py-4 border-b last:border-0 border-zinc-100 dark:border-white/5 active:bg-yellow-50 transition-colors"><span className="text-[9px] font-black text-zinc-400">{p.l}</span><span className="text-base font-black tabular-nums text-yellow-600">{p.n}</span></a>
               ))}
             </div>
          )}

          {/* Categories Menu */}
          {showCategoriesMenu && (
            <div className="absolute bottom-[calc(100%+1.5rem)] left-0 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up mx-2 z-[62]">
              <div className="px-5 py-3 bg-zinc-50 dark:bg-white/5 border-b border-zinc-100 dark:border-white/5 text-right flex justify-between items-center flex-row-reverse">
                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">الأقسام</span>
                <span className="text-lg">📋</span>
              </div>
              <div className="max-h-[45vh] overflow-y-auto no-scrollbar">
                {navItems.map((item) => (
                  <button key={item.id} onClick={(e) => handleNavClick(e, item.id)} className={`w-full flex items-center justify-between px-6 py-4 border-b last:border-0 border-zinc-100 dark:border-white/5 transition-all text-right ${activeSection === item.id ? 'bg-yellow-50 dark:bg-yellow-500/5' : ''}`}>
                    <span className="text-lg animate-emoji">{(item as any).emoji || '✨'}</span>
                    <span className={`text-[13px] font-black ${activeSection === item.id ? 'text-yellow-600' : 'text-zinc-800 dark:text-zinc-200'}`}>{item.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default App;
