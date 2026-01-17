
import React, { useState } from 'react';
import Logo from './Logo';

interface Props {
  isDark: boolean;
  onToggleTheme: () => void;
  onAction?: () => void;
}

const AtyabLogo = ({ size = "w-16 h-16" }: { size?: string }) => (
  <div className={`${size} relative flex items-center justify-center overflow-hidden rounded-full border-2 border-[#eab308] shadow-xl bg-white dark:bg-zinc-900 transition-transform group-hover:rotate-12 duration-500 p-1`}>
    <Logo />
  </div>
);

const Header: React.FC<Props> = ({ isDark, onToggleTheme, onAction }) => {
  const [showCallMenu, setShowCallMenu] = useState(false);
  const phoneNumbers = [
    { label: "رقم 1", number: "01044168230", color: "#eab308" },
    { label: "رقم 2", number: "01124005181", color: "#eab308" }
  ];

  const handleCallClick = () => {
    onAction?.();
    setShowCallMenu(!showCallMenu);
  };

  const whatsappLink = "https://wa.me/201124005181?text=" + encodeURIComponent("حابب اعمل اوردر");

  return (
    <header className="relative z-50 bg-white dark:bg-[#050505] border-b border-zinc-200 dark:border-white/10 pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-2xl mx-auto px-5 py-4 md:py-6 text-right">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={onAction}>
            <div className="relative transform group-hover:scale-105 transition-transform duration-300">
               <AtyabLogo />
               <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none italic uppercase -mb-1">
                ATYAB
              </h1>
              <span className="text-yellow-600 dark:text-yellow-500 text-[11px] font-black uppercase tracking-[0.1em] mt-1">
                فطاطري أطياب - البدرشين
              </span>
            </div>
          </div>

          <button
            onClick={onToggleTheme}
            className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl transition-all active:scale-90 border border-zinc-200 dark:border-white/10 shadow-sm"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>

        <div className="flex w-full gap-3 relative">
          <div className="flex-1 relative">
            <button
              onClick={handleCallClick}
              className={`w-full font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.96] shadow-xl text-[14px] border ${showCallMenu ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border-zinc-200 dark:border-white/10'}`}
            >
              <span className="text-xl" aria-hidden="true">📞</span>
              <span>اتصل بنا</span>
            </button>
            
            {showCallMenu && (
              <>
                <div className="fixed inset-0 z-[-1] bg-black/40 backdrop-blur-[4px]" onClick={() => setShowCallMenu(false)}></div>
                <div className="absolute top-full mt-3 left-0 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[1.5rem] shadow-2xl overflow-hidden animate-slide-up z-50">
                  <div className="px-4 py-2 bg-zinc-50 dark:bg-white/5 border-b border-zinc-100 dark:border-white/5">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">خطوط الطلبات</span>
                  </div>
                  {phoneNumbers.map((phone, idx) => (
                    <a
                      key={idx}
                      href={`tel:${phone.number}`}
                      onClick={() => setShowCallMenu(false)}
                      className="flex items-center justify-between px-5 py-3.5 hover:bg-yellow-50 dark:hover:bg-yellow-500/5 border-b last:border-0 border-zinc-100 dark:border-white/5 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: phone.color }}></div>
                        <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">{phone.label}</span>
                      </div>
                      <span className="text-[15px] font-black text-zinc-900 dark:text-white tabular-nums tracking-tighter">{phone.number}</span>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>

          <a
            href={whatsappLink}
            className="flex-1 bg-[#25D366] hover:bg-[#22c35e] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.96] shadow-xl text-[14px] border border-white/10"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <span>واتساب</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
