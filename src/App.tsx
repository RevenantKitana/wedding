import { useState, useEffect, useRef, useCallback } from "react";

// ── Scroll reveal hook ──────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal, .fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}

// ── Countdown hook ──────────────────────────────────────────────────────────
function useCountdown(target: Date) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

// ── Floral SVG ornament ─────────────────────────────────────────────────────
function FloralLine({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 32" className={`w-full max-w-xs ${className} floral-divider`} fill="none">
      <path d="M0 16 Q40 4 80 16 Q120 28 160 16 Q200 4 240 16 Q280 28 320 16" stroke="#c9a96e" strokeWidth="0.8"/>
      <circle cx="160" cy="16" r="3" fill="#c9a96e"/>
      <circle cx="80" cy="16" r="1.5" fill="#c9a96e"/>
      <circle cx="240" cy="16" r="1.5" fill="#c9a96e"/>
      <path d="M155 16 Q160 8 165 16" stroke="#c9a96e" strokeWidth="0.8" fill="none"/>
      <path d="M155 16 Q160 24 165 16" stroke="#c9a96e" strokeWidth="0.8" fill="none"/>
    </svg>
  );
}

function FloralCorner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={`w-16 h-16 opacity-20 ${className}`} fill="none">
      <path d="M4 76 Q4 4 76 4" stroke="#7a9e7e" strokeWidth="1"/>
      <circle cx="4" cy="76" r="2" fill="#c9a96e"/>
      <path d="M4 56 Q16 44 28 56" stroke="#c9a96e" strokeWidth="0.8"/>
      <path d="M24 4 Q36 16 24 28" stroke="#c9a96e" strokeWidth="0.8"/>
      <path d="M14 46 Q10 38 18 34 Q26 30 22 42" stroke="#7a9e7e" strokeWidth="0.6" fill="none"/>
      <path d="M34 14 Q42 10 46 18 Q50 26 38 22" stroke="#7a9e7e" strokeWidth="0.6" fill="none"/>
    </svg>
  );
}

// ── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="lightbox" onClick={onClose}>
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 24, right: 32,
          color: "#f8f3eb", fontSize: "1.5rem", background: "none", border: "none",
          cursor: "pointer", fontFamily: "var(--font-sans)", letterSpacing: "0.1em"
        }}
      >
        ✕
      </button>
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90vw", maxHeight: "90vh",
          objectFit: "contain",
          boxShadow: "0 40px 120px rgba(0,0,0,0.6)"
        }}
      />
    </div>
  );
}

// ── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  useReveal();

  const weddingDate = new Date("2025-03-15T11:00:00");
  const countdown = useCountdown(weddingDate);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const [rsvpChoice, setRsvpChoice] = useState<"attending" | "declined" | null>(null);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({ name: "", guests: "1", message: "" });

  const openLightbox = useCallback((src: string, alt: string) => {
    setLightbox({ src, alt });
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
    document.body.style.overflow = "";
  }, []);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSubmitted(true);
  };

  // Gallery images
  const gallery = [
    { src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=1000&fit=crop&auto=format", alt: "Hoa trang trí lễ cưới", aspect: "portrait" },
    { src: "https://images.unsplash.com/photo-1763553113391-a659bee36e06?w=900&h=600&fit=crop&auto=format", alt: "Bàn tiệc cưới sang trọng", aspect: "landscape" },
    { src: "https://images.unsplash.com/photo-1607357910286-1ff94ac13c24?w=700&h=900&fit=crop&auto=format", alt: "Cô dâu và chú rể hôn nhau", aspect: "portrait" },
    { src: "https://images.unsplash.com/photo-1677768062491-07f280ff830a?w=900&h=600&fit=crop&auto=format", alt: "Ghế trắng lễ cưới ngoài trời", aspect: "landscape" },
    { src: "https://images.unsplash.com/photo-1785339678464-9913f5f54d2c?w=700&h=900&fit=crop&auto=format", alt: "Hoa tươi xanh trắng", aspect: "portrait" },
    { src: "https://images.unsplash.com/photo-1571753217087-980e556e16ea?w=800&h=1000&fit=crop&auto=format", alt: "Khoảnh khắc lãng mạn", aspect: "portrait" },
    { src: "https://images.unsplash.com/photo-1763553113332-800519753e40?w=900&h=600&fit=crop&auto=format", alt: "Tiệc cưới hoa nở", aspect: "landscape" },
    { src: "https://images.unsplash.com/photo-1764380749483-6c52c0541366?w=700&h=900&fit=crop&auto=format", alt: "Khách mời ngoài trời", aspect: "portrait" },
    { src: "https://images.unsplash.com/photo-1519741196428-6a2175fa2557?w=800&h=800&fit=crop&auto=format", alt: "Cặp đôi lãng mạn", aspect: "square" },
    { src: "https://images.unsplash.com/photo-1781004889918-3d98c02f42ec?w=700&h=900&fit=crop&auto=format", alt: "Vòm hoa cưới", aspect: "portrait" },
    { src: "https://images.unsplash.com/photo-1676027647672-1230463791a9?w=800&h=1000&fit=crop&auto=format", alt: "Bàn tiệc hoàng hôn", aspect: "portrait" },
    { src: "https://images.unsplash.com/photo-1535822047914-fce4856dd09f?w=900&h=600&fit=crop&auto=format", alt: "Bóng hoàng hôn", aspect: "landscape" },
  ];

  return (
    <div style={{ background: "#f8f3eb", color: "#1c2e1c", overflowX: "hidden" }}>
      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />}

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", height: "100dvh", minHeight: 600, overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&h=1200&fit=crop&auto=format"
          alt="Cô dâu và chú rể"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center 30%",
            filter: "brightness(0.55) saturate(0.85)"
          }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(28,46,28,0.15) 0%, rgba(28,46,28,0.1) 50%, rgba(28,46,28,0.55) 100%)"
        }}/>

        {/* Corner ornaments */}
        <div style={{ position: "absolute", top: 28, left: 28, opacity: 0.5 }}>
          <FloralCorner />
        </div>
        <div style={{ position: "absolute", top: 28, right: 28, opacity: 0.5, transform: "scaleX(-1)" }}>
          <FloralCorner />
        </div>

        {/* OUR WEDDING label */}
        <div className="fade-in" style={{
          position: "absolute", top: 40, left: 0, right: 0,
          textAlign: "center",
        }}>
          <span className="section-label" style={{ color: "#c9a96e", letterSpacing: "0.35em", fontSize: "0.6rem" }}>
            OUR WEDDING
          </span>
        </div>

        {/* Center text */}
        <div className="fade-in" style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "0 24px"
        }}>
          <p className="couple-name" style={{
            color: "#f8f3eb", fontSize: "clamp(3rem, 9vw, 7rem)",
            lineHeight: 1.05, fontWeight: 500, marginBottom: "0.3em",
            textShadow: "0 2px 40px rgba(0,0,0,0.3)"
          }}>
            Quốc Khánh
          </p>
          <p style={{
            color: "#c9a96e", fontFamily: "var(--font-sans)",
            fontSize: "clamp(0.9rem, 2vw, 1.1rem)", letterSpacing: "0.5em",
            marginBottom: "0.5em", fontWeight: 300
          }}>&amp;</p>
          <p className="couple-name" style={{
            color: "#f8f3eb", fontSize: "clamp(3rem, 9vw, 7rem)",
            lineHeight: 1.05, fontWeight: 500, marginBottom: "2rem",
            textShadow: "0 2px 40px rgba(0,0,0,0.3)"
          }}>
            Kim Liên
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: "1rem" }}>
            <div style={{ width: 48, height: 1, background: "#c9a96e", opacity: 0.7 }}/>
            <span style={{
              color: "#e8dcc8", fontFamily: "var(--font-sans)",
              fontSize: "0.75rem", letterSpacing: "0.25em", fontWeight: 300
            }}>15 · 03 · 2025</span>
            <div style={{ width: 48, height: 1, background: "#c9a96e", opacity: 0.7 }}/>
          </div>
          <p style={{
            color: "rgba(232,220,200,0.7)", fontFamily: "var(--font-sans)",
            fontSize: "0.65rem", letterSpacing: "0.2em", fontWeight: 300
          }}>
            Hội An, Việt Nam
          </p>
        </div>

        {/* Scroll cue */}
        <div className="fade-in reveal-delay-3" style={{
          position: "absolute", bottom: 36, left: 0, right: 0,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8
        }}>
          <span style={{
            color: "rgba(232,220,200,0.6)", fontFamily: "var(--font-sans)",
            fontSize: "0.6rem", letterSpacing: "0.25em"
          }}>CUỘN XUỐNG</span>
          <div style={{
            width: 1, height: 40,
            background: "linear-gradient(to bottom, rgba(201,169,110,0.8), transparent)",
            animation: "pulse 2s ease-in-out infinite"
          }}/>
        </div>

        <style>{`@keyframes pulse { 0%,100%{opacity:0.5;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.1)} }`}</style>
      </section>

      {/* ── 2. INVITATION ───────────────────────────────────────────────── */}
      <section style={{ padding: "120px 24px 100px", textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
        <div className="reveal">
          <span className="section-label" style={{ display: "block", marginBottom: 32 }}>
            Thiệp Mời
          </span>
          <h2 className="font-serif" style={{
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 400,
            letterSpacing: "0.08em", marginBottom: 40, color: "#1c2e1c"
          }}>
            Trân Trọng Kính Mời
          </h2>
        </div>
        <div className="reveal reveal-delay-1" style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
          <FloralLine />
        </div>
        <div className="reveal reveal-delay-2">
          <p className="font-serif" style={{
            fontSize: "clamp(1.3rem, 3vw, 1.8rem)", fontStyle: "italic",
            color: "#7a9e7e", marginBottom: 40, fontWeight: 400
          }}>
            Anh Tuấn &amp; Gia đình
          </p>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "1rem", lineHeight: 2,
            color: "rgba(28,46,28,0.75)", fontWeight: 300, maxWidth: 560, margin: "0 auto 32px"
          }}>
            Với tất cả tình cảm trân trọng và niềm vui khôn tả, chúng tôi — <strong style={{ fontWeight: 400, color: "#1c2e1c" }}>Quốc Khánh &amp; Kim Liên</strong> — trân trọng kính mời bạn đến chung vui và chứng kiến ngày trọng đại trong cuộc đời chúng tôi.
          </p>
          <p style={{
            fontFamily: "var(--font-sans)", fontSize: "0.95rem", lineHeight: 2,
            color: "rgba(28,46,28,0.65)", fontWeight: 300, maxWidth: 520, margin: "0 auto"
          }}>
            Sự hiện diện của bạn sẽ là món quà ý nghĩa nhất mà chúng tôi mong đợi trong ngày đặc biệt này. Hãy cùng chúng tôi viết nên trang đầu tiên của câu chuyện tình yêu dài mãi.
          </p>
        </div>
        <div className="reveal reveal-delay-3" style={{ marginTop: 48, display: "flex", justifyContent: "center" }}>
          <div style={{
            border: "1px solid rgba(201,169,110,0.4)",
            padding: "28px 48px",
            display: "inline-block"
          }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.3em", color: "#7a9e7e", marginBottom: 8 }}>
              NGÀY CƯỚI
            </p>
            <p className="font-serif" style={{ fontSize: "1.3rem", color: "#1c2e1c" }}>
              Thứ Bảy, 15 tháng 3, 2025
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. OUR STORY ────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px 120px", background: "#f0ebe0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 80 }}>
            <span className="section-label" style={{ display: "block", marginBottom: 20 }}>Chuyện Tình Yêu</span>
            <h2 className="font-serif" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 400 }}>
              Hành Trình Của Chúng Tôi
            </h2>
          </div>

          {/* Timeline */}
          <div style={{ position: "relative" }}>
            <div className="timeline-line" />

            {[
              {
                year: "2019", label: "Lần Đầu Gặp Nhau",
                text: "Tháng 9 năm 2019, trong một buổi hội thảo nhỏ ở Đà Nẵng, Khánh vô tình ngồi cạnh Liên. Một cái nhìn thoáng qua, một nụ cười e lệ — và câu chuyện bắt đầu từ đây.",
                img: "https://images.unsplash.com/photo-1715285977619-6d9357168f46?w=500&h=350&fit=crop&auto=format",
                alt: "Cặp đôi gặp nhau lần đầu",
                side: "left"
              },
              {
                year: "2020", label: "Yêu Nhau",
                text: "Mùa hè 2020, sau bao nhiêu tin nhắn và cuộc gọi đêm khuya, Khánh đã nói lên điều mà cả hai đều cảm nhận. Từ đó, mỗi ngày trôi qua đều có nhau.",
                img: "https://images.unsplash.com/photo-1655901856612-a7f76949fb80?w=500&h=350&fit=crop&auto=format",
                alt: "Cặp đôi yêu nhau",
                side: "right"
              },
              {
                year: "2024", label: "Cầu Hôn",
                text: "Một buổi chiều tháng 3 năm 2024 trên bãi biển Hội An, Khánh quỳ gối xuống. Giữa tiếng sóng biển và ánh hoàng hôn vàng rực, Liên nói 'Có'.",
                img: "https://images.unsplash.com/photo-1571753217087-980e556e16ea?w=500&h=350&fit=crop&auto=format",
                alt: "Cầu hôn lãng mạn",
                side: "left"
              },
              {
                year: "2025", label: "Ngày Cưới",
                text: "15 tháng 3 năm 2025 — ngày chúng tôi hứa nguyện bên nhau trọn đời, trước sự chứng kiến của những người thân yêu nhất.",
                img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=350&fit=crop&auto=format",
                alt: "Ngày cưới",
                side: "right"
              }
            ].map((item, i) => (
              <div key={i} className="reveal" style={{
                display: "grid",
                gridTemplateColumns: "1fr 60px 1fr",
                marginBottom: 72,
                alignItems: "center"
              }}>
                {item.side === "left" ? (
                  <>
                    <div style={{ paddingRight: 48, textAlign: "right" }}>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#c9a96e", marginBottom: 8 }}>
                        {item.year}
                      </p>
                      <h3 className="font-serif" style={{ fontSize: "1.3rem", marginBottom: 12, fontWeight: 500 }}>{item.label}</h3>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.88rem", lineHeight: 1.85, color: "rgba(28,46,28,0.65)", fontWeight: 300 }}>
                        {item.text}
                      </p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid #c9a96e", background: "#f0ebe0" }} />
                    </div>
                    <div style={{ paddingLeft: 48 }}>
                      <img src={item.img} alt={item.alt} style={{
                        width: "100%", maxWidth: 280, height: 180, objectFit: "cover",
                        filter: "saturate(0.75)"
                      }} />
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ paddingRight: 48, textAlign: "right" }}>
                      <img src={item.img} alt={item.alt} style={{
                        width: "100%", maxWidth: 280, height: 180, objectFit: "cover",
                        marginLeft: "auto", filter: "saturate(0.75)"
                      }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid #c9a96e", background: "#f0ebe0" }} />
                    </div>
                    <div style={{ paddingLeft: 48 }}>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#c9a96e", marginBottom: 8 }}>
                        {item.year}
                      </p>
                      <h3 className="font-serif" style={{ fontSize: "1.3rem", marginBottom: 12, fontWeight: 500 }}>{item.label}</h3>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.88rem", lineHeight: 1.85, color: "rgba(28,46,28,0.65)", fontWeight: 300 }}>
                        {item.text}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. THE COUPLE ────────────────────────────────────────────────── */}
      <section style={{ padding: "120px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 80 }}>
            <span className="section-label" style={{ display: "block", marginBottom: 20 }}>Cô Dâu &amp; Chú Rể</span>
            <h2 className="font-serif" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 400 }}>
              Hai Con Người, Một Trái Tim
            </h2>
          </div>

          {/* Asymmetric editorial layout */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.6fr 1fr",
            gap: 20,
            alignItems: "end"
          }}>
            {/* Bride */}
            <div className="reveal" style={{ paddingBottom: 60 }}>
              <img
                src="https://images.unsplash.com/photo-1492175742197-ed20dc5a6bed?w=500&h=700&fit=crop&auto=format"
                alt="Cô dâu Phan Kim Liên"
                style={{ width: "100%", height: 420, objectFit: "cover", objectPosition: "top", filter: "saturate(0.8)" }}
              />
              <div style={{ paddingTop: 24, paddingLeft: 8 }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7a9e7e", marginBottom: 8 }}>
                  CÔ DÂU
                </p>
                <h3 className="font-serif" style={{ fontSize: "1.5rem", fontStyle: "italic", marginBottom: 10 }}>
                  Phan Kim Liên
                </h3>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.82rem", lineHeight: 1.8, color: "rgba(28,46,28,0.6)", fontWeight: 300 }}>
                  Người con gái với nụ cười ấm áp và trái tim chứa đầy yêu thương.
                </p>
              </div>
            </div>

            {/* Large couple photo */}
            <div className="reveal reveal-delay-1">
              <img
                src="https://images.unsplash.com/photo-1607357910286-1ff94ac13c24?w=700&h=950&fit=crop&auto=format"
                alt="Quốc Khánh và Kim Liên"
                style={{ width: "100%", height: 580, objectFit: "cover", filter: "saturate(0.8)" }}
              />
              <div style={{ marginTop: 24, textAlign: "center" }}>
                <FloralLine className="mx-auto" />
                <p className="font-serif" style={{ marginTop: 16, fontStyle: "italic", fontSize: "1rem", color: "rgba(28,46,28,0.5)" }}>
                  "Hai mảnh ghép hoàn hảo"
                </p>
              </div>
            </div>

            {/* Groom */}
            <div className="reveal reveal-delay-2" style={{ paddingTop: 60 }}>
              <img
                src="https://images.unsplash.com/photo-1606216769783-a7dbe227a17f?w=500&h=700&fit=crop&auto=format"
                alt="Chú rể Nguyễn Quốc Khánh"
                style={{ width: "100%", height: 420, objectFit: "cover", objectPosition: "top", filter: "saturate(0.8)" }}
              />
              <div style={{ paddingTop: 24, paddingLeft: 8 }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7a9e7e", marginBottom: 8 }}>
                  CHÚ RỂ
                </p>
                <h3 className="font-serif" style={{ fontSize: "1.5rem", fontStyle: "italic", marginBottom: 10 }}>
                  Nguyễn Quốc Khánh
                </h3>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.82rem", lineHeight: 1.8, color: "rgba(28,46,28,0.6)", fontWeight: 300 }}>
                  Người đàn ông trầm lặng nhưng ân cần, luôn là bến bờ bình yên.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. WEDDING DAY ───────────────────────────────────────────────── */}
      <section style={{ background: "#1c2e1c", padding: "120px 24px", color: "#f8f3eb" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div className="reveal">
            <span className="section-label" style={{ display: "block", marginBottom: 20, color: "#7a9e7e" }}>
              Ngày Trọng Đại
            </span>
            <h2 className="font-serif" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 400, color: "#f8f3eb", marginBottom: 16 }}>
              Lễ Thành Hôn
            </h2>
            <p className="font-serif" style={{ fontStyle: "italic", color: "#c9a96e", fontSize: "1.1rem", marginBottom: 60 }}>
              Quốc Khánh &amp; Kim Liên
            </p>
          </div>

          {/* Details grid */}
          <div className="reveal reveal-delay-1" style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1, background: "rgba(255,255,255,0.08)", marginBottom: 72
          }}>
            {[
              { label: "NGÀY", value: "Thứ Bảy", sub: "15 tháng 3, 2025" },
              { label: "GIỜ", value: "11:00 SA", sub: "Lễ hội thành hôn" },
              { label: "ĐỊA ĐIỂM", value: "Nam Hải Resort", sub: "Hội An, Quảng Nam" },
            ].map((d, i) => (
              <div key={i} style={{ padding: "40px 24px", background: "#1c2e1c", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.3em", color: "#7a9e7e", marginBottom: 12 }}>
                  {d.label}
                </p>
                <p className="font-serif" style={{ fontSize: "1.1rem", color: "#f8f3eb", marginBottom: 6 }}>{d.value}</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "rgba(248,243,235,0.5)", fontWeight: 300 }}>{d.sub}</p>
              </div>
            ))}
          </div>

          {/* Address */}
          <div className="reveal reveal-delay-2" style={{ marginBottom: 60 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.25em", color: "#7a9e7e", marginBottom: 12 }}>
              ĐỊA CHỈ
            </p>
            <p className="font-serif" style={{ fontSize: "1rem", color: "rgba(248,243,235,0.8)", fontWeight: 400, lineHeight: 1.8 }}>
              Đường Lạc Long Quân, Phường Cẩm An<br/>
              Hội An, tỉnh Quảng Nam, Việt Nam
            </p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block", marginTop: 20,
                fontFamily: "var(--font-sans)", fontSize: "0.65rem",
                letterSpacing: "0.2em", color: "#c9a96e",
                textDecoration: "none", borderBottom: "1px solid rgba(201,169,110,0.4)",
                paddingBottom: 3, transition: "all 0.3s"
              }}
            >
              XEM BẢN ĐỒ →
            </a>
          </div>

          {/* Countdown */}
          <div className="reveal reveal-delay-3">
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.3em", color: "#7a9e7e", marginBottom: 32 }}>
              ĐẾM NGƯỢC
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {[
                { val: countdown.days, label: "Ngày" },
                { val: countdown.hours, label: "Giờ" },
                { val: countdown.minutes, label: "Phút" },
                { val: countdown.seconds, label: "Giây" },
              ].map((c, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{
                    border: "1px solid rgba(201,169,110,0.3)",
                    padding: "20px 8px",
                    marginBottom: 10
                  }}>
                    <span className="font-serif" style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)", color: "#c9a96e" }}>
                      {String(c.val).padStart(2, "0")}
                    </span>
                  </div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(248,243,235,0.4)" }}>
                    {c.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. A LETTER ─────────────────────────────────────────────────── */}
      <section style={{ padding: "140px 24px", background: "#f8f3eb" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="section-label" style={{ display: "block", marginBottom: 20 }}>Từ Chúng Tôi</span>
            <FloralLine className="mx-auto" />
          </div>
          <div className="reveal reveal-delay-1">
            <p className="font-serif" style={{
              fontSize: "clamp(1.05rem, 2.5vw, 1.3rem)",
              lineHeight: 2.1, fontStyle: "italic",
              color: "#1c2e1c", fontWeight: 400,
              textAlign: "center", marginBottom: 48
            }}>
              "Có những điều không cần nói thành lời — chỉ cần nhìn vào mắt nhau là đủ. Trong suốt những năm tháng đã qua, chúng tôi đã cùng nhau vượt qua bao vui buồn, thử thách và cả những khoảnh khắc bình yên giản dị nhất.
            </p>
            <p className="font-serif" style={{
              fontSize: "clamp(1.05rem, 2.5vw, 1.3rem)",
              lineHeight: 2.1, fontStyle: "italic",
              color: "#1c2e1c", fontWeight: 400,
              textAlign: "center", marginBottom: 48
            }}>
              Ngày hôm nay, chúng tôi không chỉ kết hôn — chúng tôi chọn nhau. Một lần nữa, và mãi mãi sau này.
            </p>
            <p className="font-serif" style={{
              fontSize: "clamp(1.05rem, 2.5vw, 1.3rem)",
              lineHeight: 2.1, fontStyle: "italic",
              color: "#1c2e1c", fontWeight: 400,
              textAlign: "center", marginBottom: 56
            }}>
              Cảm ơn bạn — vì đã là một phần của câu chuyện này, vì đã đồng hành và yêu thương chúng tôi. Chúng tôi không thể hình dung ngày trọng đại này mà không có bạn.&quot;
            </p>
            <div style={{ textAlign: "center" }}>
              <p className="font-serif" style={{ fontStyle: "italic", fontSize: "1.2rem", color: "#7a9e7e" }}>
                Với yêu thương,
              </p>
              <p className="font-serif" style={{ fontSize: "1.5rem", marginTop: 8 }}>
                Quốc Khánh &amp; Kim Liên
              </p>
            </div>
          </div>
          <div className="reveal reveal-delay-2" style={{ display: "flex", justifyContent: "center", marginTop: 64 }}>
            <FloralLine />
          </div>
        </div>
      </section>

      {/* ── 7. PHOTO GALLERY ─────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px 120px", background: "#f0ebe0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="section-label" style={{ display: "block", marginBottom: 20 }}>Khoảnh Khắc</span>
            <h2 className="font-serif" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 400 }}>
              Bộ Sưu Tập Ảnh
            </h2>
          </div>
          <div className="masonry-grid">
            {gallery.map((img, i) => (
              <div key={i} className="masonry-item reveal" style={{ cursor: "pointer" }}
                onClick={() => openLightbox(img.src.replace("w=800&h=1000", "w=1600&h=2000").replace("w=900&h=600", "w=1800&h=1200").replace("w=700&h=900", "w=1400&h=1800").replace("w=800&h=800", "w=1600&h=1600"), img.alt)}
              >
                <div style={{ overflow: "hidden", background: "#d4cbbf" }}>
                  <img
                    src={img.src}
                    alt={img.alt}
                    style={{
                      width: "100%", display: "block",
                      filter: "saturate(0.78)",
                      transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1), filter 0.4s ease"
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)";
                      (e.currentTarget as HTMLImageElement).style.filter = "saturate(0.95)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
                      (e.currentTarget as HTMLImageElement).style.filter = "saturate(0.78)";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. RSVP ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "120px 24px", background: "#f8f3eb" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div className="reveal">
            <span className="section-label" style={{ display: "block", marginBottom: 20 }}>Xác Nhận Tham Dự</span>
            <h2 className="font-serif" style={{
              fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontWeight: 400,
              lineHeight: 1.4, marginBottom: 16
            }}>
              Chúng Tôi Rất Mong<br/>Được Gặp Bạn
            </h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "rgba(28,46,28,0.6)", lineHeight: 1.8, fontWeight: 300, marginBottom: 56 }}>
              Vui lòng xác nhận tham dự trước ngày <strong style={{ fontWeight: 400 }}>1 tháng 3, 2025</strong>
            </p>
          </div>

          {!rsvpSubmitted ? (
            <>
              {/* RSVP choice */}
              {!rsvpChoice && (
                <div className="reveal reveal-delay-1" style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
                  <button className="btn-primary" style={{ width: "100%", maxWidth: 380 }} onClick={() => setRsvpChoice("attending")}>
                    Có, Tôi Sẽ Tham Dự
                  </button>
                  <button className="btn-outline" style={{ width: "100%", maxWidth: 380 }} onClick={() => setRsvpChoice("declined")}>
                    Rất Tiếc, Tôi Không Thể Tham Dự
                  </button>
                </div>
              )}

              {/* Attending form */}
              {rsvpChoice === "attending" && (
                <form className="reveal" onSubmit={handleRsvpSubmit} style={{ textAlign: "left" }}>
                  <div style={{
                    background: "rgba(122,158,126,0.06)",
                    border: "1px solid rgba(201,169,110,0.25)",
                    padding: "40px 40px 48px",
                    marginBottom: 24
                  }}>
                    <p className="font-serif" style={{ fontStyle: "italic", textAlign: "center", color: "#7a9e7e", marginBottom: 36, fontSize: "1.05rem" }}>
                      Tuyệt vời! Chúng tôi rất vui được gặp bạn.
                    </p>
                    <div style={{ marginBottom: 28 }}>
                      <label style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#7a9e7e", display: "block", marginBottom: 4 }}>
                        TÊN CỦA BẠN *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Họ và tên đầy đủ"
                        value={rsvpForm.name}
                        onChange={e => setRsvpForm(f => ({ ...f, name: e.target.value }))}
                      />
                    </div>
                    <div style={{ marginBottom: 28 }}>
                      <label style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#7a9e7e", display: "block", marginBottom: 4 }}>
                        SỐ NGƯỜI THAM DỰ *
                      </label>
                      <select
                        value={rsvpForm.guests}
                        onChange={e => setRsvpForm(f => ({ ...f, guests: e.target.value }))}
                        style={{ fontFamily: "var(--font-sans)", background: "transparent", borderBottom: "1px solid rgba(28,46,28,0.3)", padding: "12px 0", width: "100%", color: "#1c2e1c", fontSize: "0.9rem", outline: "none" }}
                      >
                        {["1", "2", "3", "4"].map(n => <option key={n} value={n}>{n} người</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#7a9e7e", display: "block", marginBottom: 4 }}>
                        LỜI CHÚC (TÙY CHỌN)
                      </label>
                      <textarea
                        placeholder="Gửi lời chúc đến cô dâu và chú rể..."
                        rows={3}
                        value={rsvpForm.message}
                        onChange={e => setRsvpForm(f => ({ ...f, message: e.target.value }))}
                        style={{ resize: "none" }}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                    <button type="button" className="btn-outline" style={{ fontSize: "0.65rem" }} onClick={() => setRsvpChoice(null)}>
                      ← Quay Lại
                    </button>
                    <button type="submit" className="btn-primary">
                      Gửi Xác Nhận
                    </button>
                  </div>
                </form>
              )}

              {/* Declined */}
              {rsvpChoice === "declined" && (
                <div className="reveal" style={{ textAlign: "center" }}>
                  <div style={{
                    border: "1px solid rgba(201,169,110,0.3)",
                    padding: "48px 40px",
                    marginBottom: 24
                  }}>
                    <FloralLine className="mx-auto" />
                    <p className="font-serif" style={{ fontStyle: "italic", fontSize: "1.1rem", marginTop: 24, marginBottom: 12 }}>
                      Chúng tôi hiểu và rất trân trọng...
                    </p>
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "rgba(28,46,28,0.6)", lineHeight: 1.8, fontWeight: 300 }}>
                      Dù không có bạn bên cạnh, chúng tôi vẫn luôn giữ bạn trong tim. Cảm ơn vì đã nghĩ đến chúng tôi.
                    </p>
                  </div>
                  <button type="button" className="btn-outline" onClick={() => setRsvpChoice(null)}>
                    ← Quay Lại
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Success state */
            <div className="reveal" style={{ textAlign: "center" }}>
              <div style={{
                border: "1px solid rgba(122,158,126,0.4)",
                padding: "64px 48px"
              }}>
                <div style={{ marginBottom: 32, display: "flex", justifyContent: "center" }}>
                  <FloralLine />
                </div>
                <p className="font-serif" style={{ fontStyle: "italic", fontSize: "1.5rem", marginBottom: 16, color: "#1c2e1c" }}>
                  Cảm ơn, {rsvpForm.name || "bạn yêu"} !
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.88rem", color: "rgba(28,46,28,0.65)", lineHeight: 1.9, fontWeight: 300, maxWidth: 420, margin: "0 auto 32px" }}>
                  Chúng tôi đã nhận được xác nhận của bạn và vô cùng vui mừng khi biết bạn sẽ có mặt trong ngày đặc biệt này.
                </p>
                <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
                  <FloralLine />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 9. CLOSING ───────────────────────────────────────────────────── */}
      <section style={{ position: "relative", height: "100dvh", minHeight: 560, overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1721401870202-8e2264ecced2?w=1800&h=1200&fit=crop&auto=format"
          alt="Ngọc Anh và Minh Khôi"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center 40%",
            filter: "brightness(0.45) saturate(0.75)"
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(28,46,28,0.7) 0%, transparent 60%)"
        }}/>
        <div className="fade-in" style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "0 24px"
        }}>
          <div style={{ position: "absolute", top: 28, left: 28, opacity: 0.4 }}><FloralCorner /></div>
          <div style={{ position: "absolute", top: 28, right: 28, opacity: 0.4, transform: "scaleX(-1)" }}><FloralCorner /></div>

          <p className="couple-name" style={{
            color: "#f8f3eb", fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            lineHeight: 1.1, fontWeight: 500, marginBottom: "0.2em"
          }}>
            Quốc Khánh
          </p>
          <p style={{
            color: "#c9a96e", fontFamily: "var(--font-sans)",
            fontSize: "1rem", letterSpacing: "0.4em", marginBottom: "0.3em", fontWeight: 300
          }}>&amp;</p>
          <p className="couple-name" style={{
            color: "#f8f3eb", fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            lineHeight: 1.1, fontWeight: 500, marginBottom: "2.5rem"
          }}>
            Kim Liên
          </p>
          <p className="font-serif" style={{
            color: "#c9a96e", fontStyle: "italic",
            fontSize: "clamp(1rem, 2.5vw, 1.4rem)", marginBottom: "1.2rem"
          }}>
            Forever starts here.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 36, height: 1, background: "rgba(201,169,110,0.6)" }}/>
            <p style={{
              color: "rgba(232,220,200,0.7)", fontFamily: "var(--font-sans)",
              fontSize: "0.7rem", letterSpacing: "0.25em", fontWeight: 300
            }}>
              15 · 03 · 2025
            </p>
            <div style={{ width: 36, height: 1, background: "rgba(201,169,110,0.6)" }}/>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: "#141f14", padding: "32px 24px",
        textAlign: "center"
      }}>
        <p style={{
          fontFamily: "var(--font-sans)", fontSize: "0.6rem",
          letterSpacing: "0.25em", color: "rgba(248,243,235,0.3)"
        }}>
          QUỐC KHÁNH &amp; KIM LIÊN · 15.03.2025 · HỘI AN
        </p>
      </footer>
    </div>
  );
}
