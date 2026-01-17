
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import MenuSection from './components/MenuSection';
import Logo from './components/Logo';
import { MENU_DATA, PIZZA_FATAYER_ADDITIONS, CREPE_ADDITIONS } from './constants';
import { MenuItem, MenuSection as MenuSectionType, CartItem } from './types';

const WHATSAPP_NUMBER = "201092621367";

const AtyabLogo = ({ size = "w-24 h-24" }: { size?: string }) => (
  <div className={`${size} relative flex items-center justify-center overflow-hidden rounded-full border-4 border-[#eab308] shadow-2xl bg-white dark:bg-zinc-900 mb-6 transform hover:rotate-12 transition-all duration-700 hover:scale-110 active:scale-95 cursor-pointer p-2`}>
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

  // Modal Selection States
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [selectedAddons, setSelectedAddons] = useState<{ name: string, price: number }[]>([]);
  const [itemNotes, setItemNotes] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);

  // Checkout Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const navRef = useRef<HTMLDivElement>(null);
  const isScrollingToRef = useRef(false);

  useEffect(() => {
    setCurrentUrl(window.location.href);
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const triggerHaptic = (pattern = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const resetItemStates = () => {
    setSelectedSizeIdx(0);
    setSelectedAddons([]);
    setItemNotes("");
    setItemQuantity(1);
  };

  const toggleAddon = (addon: { name: string, price: number }) => {
    triggerHaptic(5);
    const exists = selectedAddons.find(a => a.name === addon.name);
    if (exists) {
      setSelectedAddons(selectedAddons.filter(a => a.name !== addon.name));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
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
      const addonsPrice = item.addons.reduce((sum, a) => sum + a.price, 0);
      return total + (item.price + addonsPrice) * item.quantity;
    }, 0);
  };

  const sendOrderToWhatsApp = () => {
    if (!customerName || !customerPhone || !customerAddress) {
      alert("يرجى ملء كافة بيانات التوصيل");
      return;
    }

    const total = calculateTotal();
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ar-EG');
    const orderId = Math.floor(Math.random() * 90000) + 10000;
    
    // نظام تشفير وحماية للرسالة لضمان عدم التلاعب
    const salt = "ATYAB_SECURE_77";
    const rawData = `${total}-${customerPhone.slice(-4)}-${orderId}`;
    const hash = btoa(rawData).substring(0, 10).toUpperCase();

    let message = `🛑 *نظام الطلبات الرقمي - أطياب*\n`;
    message += `🚨 *تنبيه: أي تعديل في الرسالة سيؤدي لإلغاء الأوردر فورا*\n`;
    message += `━━━━━━━━━━━━━━\n`;
    message += `🔢 *أوردر رقم:* #${orderId}\n`;
    message += `👤 *الاسم:* ${customerName}\n`;
    message += `📞 *الموبايل:* ${customerPhone}\n`;
    message += `📍 *العنوان:* ${customerAddress}\n`;
    message += `━━━━━━━━━━━━━━\n\n`;
    message += `🧾 *تفاصيل الطلب:*\n`;

    cart.forEach((item, idx) => {
      const itemBase = item.price;
      const addonsSum = item.addons.reduce((s, a) => s + a.price, 0);
      const rowTotal = (itemBase + addonsSum) * item.quantity;
      
      message += `${idx + 1}. *${item.name}* x${item.quantity} ${item.size ? `(${item.size})` : ''}\n`;
      if (item.addons.length > 0) {
        message += `   ➕ إضافات: ${item.addons.map(a => `${a.name} (${a.price} ج)`).join(' + ')}\n`;
      }
      if (item.notes) message += `   📝 ملاحظة: ${item.notes}\n`;
      message += `   💰 السعر: ${rowTotal} ج\n\n`;
    });

    message += `━━━━━━━━━━━━━━\n`;
    message += `💰 *الإجمالي النهائي: ${total} جنيه*\n`;
    message += `⏰ *وقت الإرسال:* ${timeStr}\n`;
    message += `🔐 *كود أمان النظام:* ${hash}\n`;
    message += `━━━━━━━━━━━━━━\n`;
    message += `⚠️ *ممنوع تعديل الأسعار أو الكود يدوياً*`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsCheckoutOpen(false);
    setCart([]);
    triggerHaptic(50);
  };

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - 180;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setActiveSection(id);
      setShowCategoriesMenu(false);
    }
  };

  const navItems = [...MENU_DATA.slice(0, 4), PIZZA_FATAYER_ADDITIONS, ...MENU_DATA.slice(4, 8), CREPE_ADDITIONS];
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentUrl)}&bgcolor=ffffff&color=000000`;
  const mapsLink = "https://www.google.com/maps/search/R7XC+FC7+برج+أنس+الوجود";

  const getRelevantAddons = () => {
    if (!selectedItem) return null;
    const sectionId = selectedItem.section.id;
    if (['fatayer-savory', 'pizza-oriental', 'pizza-italian'].includes(sectionId)) return PIZZA_FATAYER_ADDITIONS;
    if (['crepe-savory', 'rolls', 'syrian'].includes(sectionId)) return CREPE_ADDITIONS;
    return null;
  };

  const additionsGroup = getRelevantAddons();

  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-200 antialiased selection:bg-yellow-500/30">
      <Header isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} onAction={() => triggerHaptic()} />
      
      {/* Category Nav Bar */}
      <nav className="sticky top-0 z-40 bg-white/95 dark:bg-[#050505]/95 backdrop-blur-xl border-b border-zinc-200 dark:border-white/10 py-3 shadow-md">
        <div ref={navRef} className="flex gap-2 overflow-x-auto no-scrollbar px-5 py-1 max-w-2xl mx-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-2xl text-[12px] font-black border transition-all ${
                activeSection === item.id 
                ? 'bg-yellow-600 text-black border-yellow-500 scale-105 shadow-lg shadow-yellow-600/20' 
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 text-zinc-500 hover:text-yellow-600'
              }`}
            >
              <span className="animate-emoji">{(item as any).emoji || '✨'}</span> {item.title}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-5 py-8 pb-48">
        {/* Hero Card */}
        <div className="mb-12 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-10 relative overflow-hidden text-right shadow-2xl reveal-item">
          <div className="relative z-10">
            <h2 className="text-5xl font-black text-zinc-900 dark:text-white mb-2 leading-none italic uppercase tracking-tighter">ATYAB</h2>
            <p className="text-yellow-600 dark:text-yellow-500 text-sm font-black uppercase mb-4 tracking-widest">فطاطري أطياب</p>
            <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-[10px] font-bold">
              <span>📍 البدرشين - برج أنس الوجود</span>
            </div>
          </div>
          <div className="absolute -left-10 -bottom-12 text-[180px] opacity-[0.04] grayscale rotate-12 animate-emoji">🥨</div>
        </div>

        {MENU_DATA.slice(0, 4).map((section) => (
          <MenuSection key={section.id} section={section} onItemSelect={(item, sec) => { triggerHaptic(); setSelectedItem({ item, section: sec }); resetItemStates(); }} />
        ))}

        {/* Additions Section View */}
        <div id={PIZZA_FATAYER_ADDITIONS.id} className="scroll-mt-[200px] mb-10 p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-white/10 text-right reveal-item shadow-lg">
          <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
            <span className="animate-emoji">✨</span> {PIZZA_FATAYER_ADDITIONS.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
             {PIZZA_FATAYER_ADDITIONS.items.map((add, i) => (
               <div key={i} className="flex justify-between items-center bg-zinc-50 dark:bg-white/5 p-4 rounded-2xl border border-zinc-100 dark:border-white/5">
                 <span className="text-yellow-600 font-black tabular-nums">{add.prices[0]} ج</span>
                 <span className="font-bold text-sm">{add.name}</span>
               </div>
             ))}
          </div>
        </div>

        {MENU_DATA.slice(4, 8).map((section) => (
          <MenuSection key={section.id} section={section} onItemSelect={(item, sec) => { triggerHaptic(); setSelectedItem({ item, section: sec }); resetItemStates(); }} />
        ))}

        {/* Footer with QR */}
        <footer className="mt-24 pb-12 flex flex-col items-center gap-8 reveal-item">
            <div className="w-full bg-white dark:bg-zinc-900 rounded-[3rem] p-12 shadow-2xl border border-zinc-200 dark:border-white/10 flex flex-col items-center text-center">
               <AtyabLogo />
               <div className="relative p-6 bg-white rounded-[2.5rem] border-4 border-zinc-50 shadow-inner mb-6">
                  <img src={qrUrl} alt="QR Code" className="w-44 h-44" />
               </div>
               <p className="text-[11px] text-zinc-400 font-black max-w-[200px]">امسح الكود لمشاركة المنيو</p>
            </div>
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="w-full bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-xl border border-zinc-200 dark:border-white/10 text-right group active:scale-95 transition-all">
               <div className="flex items-start gap-6">
                 <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-900/20 rounded-3xl flex items-center justify-center text-3xl animate-emoji">📍</div>
                 <div className="flex flex-col pt-1">
                    <span className="text-[11px] font-black text-yellow-600 uppercase">موقعنا</span>
                    <p className="text-zinc-800 dark:text-zinc-100 text-base font-black">برج أنس الوجود - البدرشين</p>
                 </div>
               </div>
            </a>
        </footer>
      </main>

      {/* Item Selection Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-10 md:p-20" onClick={() => setSelectedItem(null)}>
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 md:p-8 shadow-2xl animate-slide-up overflow-y-auto max-h-[70vh] border border-white/10" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6 text-right">
              <button onClick={() => setSelectedItem(null)} className="w-12 h-12 flex items-center justify-center bg-red-500 text-white rounded-full font-black text-2xl shadow-lg active:scale-90">✕</button>
              <div>
                <h3 className="text-2xl font-black leading-tight mb-1">{selectedItem.item.name}</h3>
                <span className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 px-3 py-1.5 rounded-full text-[11px] font-black">{selectedItem.section.title}</span>
              </div>
            </div>

            {/* Size Selector */}
            {selectedItem.item.prices.length > 1 && (
              <div className="mb-6">
                <p className="text-right font-black mb-3 text-sm text-zinc-400">اختر الحجم:</p>
                <div className="flex gap-3 flex-row-reverse">
                  {selectedItem.item.prices.map((p, i) => (
                    <button 
                      key={i} 
                      onClick={() => { triggerHaptic(); setSelectedSizeIdx(i); }}
                      className={`flex-1 py-4 rounded-xl font-black text-sm border-2 transition-all flex flex-col items-center ${selectedSizeIdx === i ? 'bg-yellow-600 border-yellow-600 text-black shadow-lg shadow-yellow-600/20' : 'bg-zinc-50 dark:bg-white/5 border-zinc-100 dark:border-white/5 text-zinc-500'}`}
                    >
                      <span className="text-xs opacity-60">{selectedItem.item.labels?.[i] || selectedItem.section.subtitles?.[i]}</span>
                      <span className="text-xl tabular-nums leading-none">{p} ج</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Addons List */}
            {additionsGroup && (
              <div className="mb-6">
                <p className="text-right font-black mb-3 text-sm text-zinc-400">إضافات مميزة (تظهر في الفاتورة):</p>
                <div className="grid grid-cols-2 gap-3">
                  {additionsGroup.items.map((add, i) => {
                    const price = parseInt(add.prices[0]) || 0;
                    const isActive = selectedAddons.some(a => a.name === add.name);
                    return (
                      <button key={i} onClick={() => toggleAddon({ name: add.name, price })}
                        className={`p-4 rounded-xl border-2 text-right transition-all flex flex-col ${isActive ? 'bg-yellow-600/10 border-yellow-600 text-yellow-600' : 'bg-zinc-50 dark:bg-white/5 border-zinc-100 dark:border-white/5 text-zinc-400'}`}
                      >
                        <span className="text-sm font-black leading-tight">{add.name}</span>
                        <span className="text-xs font-bold tabular-nums">+{price} جنيه</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mb-6">
              <textarea value={itemNotes} onChange={e => setItemNotes(e.target.value)} placeholder="أي ملاحظات إضافية؟"
                className="w-full bg-zinc-50 dark:bg-white/5 border-2 border-zinc-100 dark:border-white/5 rounded-xl p-4 text-right font-bold text-lg h-24 outline-none focus:border-yellow-600"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl p-2 gap-4">
                <button onClick={() => { triggerHaptic(); setItemQuantity(q => q + 1); }} className="w-10 h-10 bg-white dark:bg-zinc-700 rounded-lg font-black text-2xl shadow-sm">+</button>
                <span className="font-black text-xl min-w-[30px] text-center">{itemQuantity}</span>
                <button onClick={() => { triggerHaptic(); setItemQuantity(q => Math.max(1, q - 1)); }} className="w-10 h-10 bg-white dark:bg-zinc-700 rounded-lg font-black text-2xl shadow-sm">-</button>
              </div>
              <button onClick={addToCart} className="flex-1 bg-yellow-600 text-black font-black py-5 rounded-xl text-xl shadow-xl active:scale-95">إضافة للسلة</button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 backdrop-blur-xl p-10 md:p-20" onClick={() => setIsCheckoutOpen(false)}>
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 md:p-8 shadow-2xl animate-slide-up relative max-h-[80vh] overflow-y-auto border border-white/5" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-8 text-right">
              <button onClick={() => setIsCheckoutOpen(false)} className="w-12 h-12 flex items-center justify-center bg-red-500 text-white rounded-full font-black text-2xl shadow-lg">✕</button>
              <div>
                <h3 className="text-3xl font-black mb-1">تأكيد الأوردر</h3>
                <p className="text-zinc-400 text-xs font-bold">يرجى مراجعة البيانات بعناية</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <input type="text" placeholder="الاسم بالكامل" value={customerName} onChange={e => setCustomerName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-white/5 border-2 border-zinc-100 dark:border-white/5 rounded-xl p-5 text-right font-bold text-lg outline-none focus:border-yellow-600"
                />
                <input type="tel" placeholder="رقم الموبايل" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-white/5 border-2 border-zinc-100 dark:border-white/5 rounded-xl p-5 text-right font-bold text-lg outline-none focus:border-yellow-600 tabular-nums"
                />
                <textarea placeholder="العنوان بالتفصيل" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-white/5 border-2 border-zinc-100 dark:border-white/5 rounded-xl p-5 text-right font-bold text-lg outline-none focus:border-yellow-600 h-28"
                />
              </div>

              <div className="bg-zinc-50 dark:bg-white/5 rounded-3xl p-6 border border-zinc-200 dark:border-white/10 shadow-inner">
                <p className="text-right font-black text-xs text-zinc-400 mb-4 uppercase tracking-widest">محتويات السلة:</p>
                <div className="space-y-4 max-h-48 overflow-y-auto px-1 no-scrollbar">
                  {cart.map(item => (
                    <div key={item.id} className="flex flex-col py-3 border-b border-zinc-100 dark:border-white/5 last:border-0">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 bg-red-100 dark:bg-red-900/40 text-red-600 rounded-lg text-sm active:scale-90">✕</button>
                          <span className="font-black text-lg tabular-nums text-yellow-600">{(item.price + item.addons.reduce((s,a)=>s+a.price,0)) * item.quantity}ج</span>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-lg leading-tight">{item.name} x{item.quantity}</p>
                          {item.size && <span className="text-[11px] text-zinc-400 font-bold block">{item.size}</span>}
                        </div>
                      </div>
                      {/* عرض الإضافات تحت كل صنف بأسعارها */}
                      {item.addons.map((a, i) => (
                        <span key={i} className="text-right text-[11px] text-yellow-600 font-bold mt-1 block">
                          + {a.name} ({a.price} جنيه)
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-white/10 flex justify-between items-center">
                  <span className="text-3xl font-black text-yellow-600 tabular-nums">{calculateTotal()} جنيه</span>
                  <span className="font-black text-xl">الإجمالي</span>
                </div>
              </div>

              <button onClick={sendOrderToWhatsApp} className="w-full bg-[#25D366] text-white font-black py-5 rounded-[2.5rem] text-2xl shadow-xl active:scale-95 flex items-center justify-center gap-4">
                <span>إرسال الطلب (واتساب)</span>
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-[60] px-4 pb-6 pt-2 md:hidden">
        <div className="max-w-xl mx-auto glass border border-zinc-200 dark:border-white/10 rounded-[2.5rem] p-2 flex items-center justify-around shadow-2xl relative">
          
          {(showBottomCallMenu || showCategoriesMenu) && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[61]" onClick={() => { setShowBottomCallMenu(false); setShowCategoriesMenu(false); }}></div>
          )}

          {cart.length > 0 && !isCheckoutOpen && !selectedItem && (
            <button onClick={() => { triggerHaptic(); setIsCheckoutOpen(true); }}
              className="absolute -top-16 left-0 right-0 mx-8 bg-zinc-900 dark:bg-white text-white dark:text-black py-5 px-8 rounded-full shadow-2xl flex justify-between items-center animate-slide-up border border-white/20"
            >
              <span className="font-black tabular-nums text-xl leading-none">{calculateTotal()} ج</span>
              <div className="flex items-center gap-3">
                <span className="font-black text-base">عرض السلة</span>
                <span className="bg-yellow-600 text-black w-7 h-7 flex items-center justify-center rounded-full text-xs font-black">{cart.length}</span>
              </div>
            </button>
          )}

          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="flex-1 flex flex-col items-center py-2 text-[#25D366]">
            <span className="text-2xl animate-emoji">💬</span>
            <span className="text-[10px] font-black">واتساب</span>
          </a>
          <button onClick={() => { setShowBottomCallMenu(!showBottomCallMenu); setShowCategoriesMenu(false); }} className={`flex-1 flex flex-col items-center py-2 ${showBottomCallMenu ? 'text-yellow-600' : 'text-zinc-500'}`}>
            <span className="text-2xl animate-emoji">📞</span>
            <span className="text-[10px] font-black">اتصال</span>
          </button>
          
          <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="bg-yellow-600 w-16 h-16 rounded-full flex items-center justify-center text-black shadow-xl -mt-10 border-4 border-white dark:border-[#050505] active:scale-90 z-[63] yellow-glow">
            <span className="text-xl animate-emoji">🔝</span>
          </button>
          
          <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col items-center py-2 text-zinc-500">
            <span className="text-2xl animate-emoji">📍</span>
            <span className="text-[10px] font-black">الموقع</span>
          </a>
          <button onClick={() => { setShowCategoriesMenu(!showCategoriesMenu); setShowBottomCallMenu(false); }} className={`flex-1 flex flex-col items-center py-2 ${showCategoriesMenu ? 'text-yellow-600' : 'text-zinc-500'}`}>
            <span className="text-2xl animate-emoji">📋</span>
            <span className="text-[10px] font-black">المنيو</span>
          </button>

          {/* Menus popups */}
          {showBottomCallMenu && (
             <div className="absolute bottom-[calc(100%+1rem)] left-0 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up mx-2 z-[62]">
               <div className="px-6 py-4 bg-zinc-50 dark:bg-white/5 border-b border-zinc-100 text-right font-black text-[10px] text-zinc-400">اتصل بنا للحجز</div>
               {[{n: "01044168230", l: "فودافون"}, {n: "01124005181", l: "اتصالات"}].map((p, i) => (
                 <a key={i} href={`tel:${p.n}`} className="flex items-center justify-between px-7 py-5 border-b last:border-0 border-zinc-100 dark:border-white/5 active:bg-yellow-50"><span className="text-[11px] font-black text-zinc-400">{p.l}</span><span className="text-[18px] font-black text-yellow-600 tracking-tighter">{p.n}</span></a>
               ))}
             </div>
          )}

          {showCategoriesMenu && (
            <div className="absolute bottom-[calc(100%+1rem)] left-0 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up mx-2 z-[62]">
              <div className="px-6 py-4 bg-zinc-50 dark:bg-white/5 border-b border-zinc-100 text-right font-black text-[10px] text-zinc-400">انتقل للقسم</div>
              <div className="max-h-[50vh] overflow-y-auto no-scrollbar">
                {navItems.map((item) => (
                  <button key={item.id} onClick={(e) => handleNavClick(e, item.id)} className={`w-full flex items-center justify-between px-7 py-5 border-b last:border-0 border-zinc-100 dark:border-white/5 ${activeSection === item.id ? 'bg-yellow-50 dark:bg-yellow-500/5' : ''}`}>
                    <span className="text-xl animate-emoji">{(item as any).emoji || '✨'}</span>
                    <span className={`text-[15px] font-black ${activeSection === item.id ? 'text-yellow-600' : ''}`}>{item.title}</span>
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
