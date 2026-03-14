import { useEffect, useRef, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { GooeyText } from '@/components/ui/gooey-text-morphing';
import { Header } from './Header';

const FEATURES = [
  {
    n: '01',
    title: 'Simulated IoT Hardware',
    body: '100s of bots emit current, temperature & pressure data in real-time. No physical devices needed — pure software simulation.',
    chip: 'Bot Simulation',
  },
  {
    n: '02',
    title: 'Kafka Data Streaming',
    body: 'Stream live sensor telemetry to a central server at scale. Reliable ingestion with zero data loss across all devices.',
    chip: 'Kafka / AWS',
  },
  {
    n: '03',
    title: 'Anomaly Detection',
    body: 'Analytics engine scans every stream for high-consumption zones and critical safety patterns — flagged in milliseconds.',
    chip: 'Real-time Analytics',
  },
  {
    n: '04',
    title: 'ML Failure Prediction',
    body: 'Trained models detect early warning signs before equipment fails. Cut downtime before it costs you.',
    chip: 'Predictive ML',
  },
  {
    n: '05',
    title: 'Remote Relay Control',
    body: 'Toggle factory devices on or off remotely via simulated relays. Full actuator control with a single click.',
    chip: 'Control Layer',
  },
  {
    n: '06',
    title: 'Live Grafana Dashboard',
    body: 'Charts, alerts, device status and energy trends in one view. Built on React + Grafana. Smart assistant integration coming.',
    chip: 'React + Grafana',
  },
] as const;

const PLANS = [
  {
    name: 'Starter',
    price: '0',
    period: 'Forever free',
    features: ['1 factory simulation', 'Basic sensor dashboard', 'Overlay (watermark)', 'Basic analytics'] as string[],
    highlights: [] as string[],
    cta: 'Get Started',
    hot: false,
  },
  {
    name: 'Day Pass',
    price: '199',
    period: 'per day - unlimited sensors',
    features: ['Unlimited sensors', 'No watermark', '3 live operators', 'Full Grafana overlay', 'WhatsApp support'] as string[],
    highlights: ['Unlimited sensors', 'No watermark', '3 live operators'] as string[],
    cta: 'Buy Day Pass',
    hot: false,
  },
  {
    name: 'Pro',
    price: '2,999',
    period: 'per month - cancel anytime',
    features: ['Unlimited simulations', 'White-label brand', 'ML failure prediction', 'Relay control panels', '3 operators at once', 'WhatsApp support'] as string[],
    highlights: ['Unlimited simulations', 'White-label brand', 'ML failure prediction', 'Relay control panels'] as string[],
    cta: 'Start Pro',
    hot: true,
  },
  {
    name: 'Elite',
    price: '4,999',
    period: 'per month - full platform',
    features: ['5 live dashboards', 'Sponsor PDF report', 'Custom domain', 'Data export', 'Priority support', 'Onboarding call'] as string[],
    highlights: ['5 live dashboards', 'Sponsor PDF report', 'Custom domain'] as string[],
    cta: 'Contact Us',
    hot: false,
  },
] as const;

const HERO_ROTATING_TEXTS = [
  'Bleeding Energy.',
  'At Risk.',
  'Unpredictable.',
  'Now Controlled.',
] as const;

export default function LandingPage() {
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const setRevealRef = (index: number) => (el: HTMLElement | null) => {
    revealRefs.current[index] = el;
  };

  const revealStyle: CSSProperties = { opacity: 0, transform: 'translateY(28px)' };

  return (
    <div style={{ fontFamily: "'Barlow', sans-serif", background: '#ffffff', color: '#0a0b0d', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Bebas+Neue&family=JetBrains+Mono:wght@400;600;700&display=swap');
        @keyframes heroUp {
          from { opacity: 0; transform: translateY(26px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroGlow {
          0%,100% { opacity:.5; transform:scale(1) translateX(-50%); }
          50%     { opacity:.75; transform:scale(1.08) translateX(-46%); }
        }
        @keyframes heroBadgeSweep {
          0%   { background-position: -200% center; }
          100% { background-position: 300% center; }
        }
        @keyframes marqueeLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .hero-e0 { animation: heroUp .55s cubic-bezier(.22,1,.36,1) .05s both; }
        .hero-e1 { animation: heroUp .62s cubic-bezier(.22,1,.36,1) .17s both; }
        .hero-e2 { animation: heroUp .6s cubic-bezier(.22,1,.36,1) .30s both; }
        .hero-e3 { animation: heroUp .55s cubic-bezier(.22,1,.36,1) .42s both; }
        .hero-e4 { animation: heroUp .5s cubic-bezier(.22,1,.36,1) .54s both; }
        .badge-sweep {
          background: linear-gradient(105deg, rgba(30,64,175,0.06) 40%, rgba(30,64,175,0.18) 50%, rgba(30,64,175,0.06) 60%);
          background-size: 200% 100%;
          animation: heroBadgeSweep 3s ease-in-out infinite;
        }
        .cta-primary { transition: all .22s ease !important; }
        .cta-primary:hover { background:#1d4ed8 !important; transform:translateY(-2px) !important; box-shadow:0 10px 32px rgba(30,64,175,.18) !important; }
        .reveal { transition: opacity .65s cubic-bezier(.22,1,.36,1), transform .65s cubic-bezier(.22,1,.36,1); }
        .reveal.is-visible { opacity: 1 !important; transform: translateY(0) !important; }
        .feature-card { transition: all .3s cubic-bezier(.22,1,.36,1); }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(30,64,175,.08), 0 4px 12px rgba(0,0,0,.04); border-color: rgba(30,64,175,.18) !important; }
        .feature-card:hover [data-accent] { transform: scaleX(1) !important; }
        .pricing-card { transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease; }
        .pricing-card:hover { transform: translateY(-8px); box-shadow: 0 24px 64px rgba(0,0,0,.10), 0 6px 20px rgba(0,0,0,.04); }
        .pricing-card-hot:hover { transform: translateY(-12px) scale(1.01); box-shadow: 0 32px 90px rgba(30,64,175,.22), 0 0 80px rgba(30,64,175,.06); }
        .hero-marquee {
          background: linear-gradient(90deg, #eff6ff 0%, #f8fbff 50%, #eff6ff 100%);
          padding: 22px 0;
          overflow: hidden;
          position: relative;
          border-top: 1px solid rgba(30,64,175,.12);
          border-bottom: 1px solid rgba(10,11,13,.08);
        }
        @media (max-width: 920px) {
          .features-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .hero-e1 { font-size: clamp(46px, 10.5vw, 68px) !important; }
          .hero-e2 { font-size: 17px !important; line-height: 1.7 !important; }
        }
        @media (max-width: 640px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Header />

      {/* HERO */}
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: '52px',
          paddingBottom: '54px',
          position: 'relative',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Grid background */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: `linear-gradient(rgba(10,11,13,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(10,11,13,0.055) 1px, transparent 1px)`, backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse 42% 38% at 50% 44%, transparent 45%, rgba(0,0,0,0.5) 55%, black 65%, transparent 90%)', WebkitMaskImage: 'radial-gradient(ellipse 42% 38% at 50% 44%, transparent 45%, rgba(0,0,0,0.5) 55%, black 65%, transparent 90%)' }} />

        {/* Glow orb */}
        <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', width: '850px', height: '600px', pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(ellipse 55% 50% at 50% 45%, rgba(255,240,225,0.45) 0%, rgba(255,245,235,0.12) 45%, transparent 70%)', animation: 'heroGlow 5.5s ease-in-out infinite' }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '960px', width: '100%', padding: '0 24px' }}>

          {/* Badge */}
          <div
            className="hero-e0 badge-sweep"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: "'JetBrains Mono', monospace", fontSize: '9.5px', fontWeight: 700, letterSpacing: '2.8px', color: '#1e40af', textTransform: 'uppercase', border: '1px solid rgba(30,64,175,0.2)', padding: '7px 18px', borderRadius: '100px', marginBottom: '10px' }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1e40af', display: 'inline-block' }} />
            ⚡ LIVE CHALLENGE · DATA PIPELINES TRACK
          </div>

          {/* Headline */}
          <div style={{ width: '100%', maxWidth: '1180px', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2% auto' }}>
            <h1
              className="hero-e1"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(58px, 6.2vw, 100px)', lineHeight: 0.9, letterSpacing: '1px', margin: 0, color: '#0a0b0d', textTransform: 'uppercase', textAlign: 'center' }}
            >
              Your Factory Is
            </h1>

            <div style={{ width: 'min(100%, 1140px)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '6px', animation: 'heroUp .6s cubic-bezier(.22,1,.36,1) .30s both' }}>
              <GooeyText
                texts={[...HERO_ROTATING_TEXTS]}
                morphTime={0.42}
                cooldownTime={1.4}
                className="h-full w-full font-bold"
                textClassName="!text-[clamp(36px,5vw,90px)] !leading-[0.9] whitespace-nowrap text-[#1e40af] drop-shadow-[0_0_10px_rgba(30,64,175,0.16)] font-['Bebas_Neue'] tracking-[1px]"
              />
            </div>
          </div>

          <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #1e40af, rgba(30,64,175,0.2))', margin: '0 0 14px', borderRadius: '2px' }} />

          <p
            className="hero-e2"
            style={{ fontSize: '20px', lineHeight: 1.7, letterSpacing: '.02em', color: 'rgba(10,11,13,0.5)', fontWeight: 400, maxWidth: '760px', margin: '0 0 18px 0' }}
          >
            Simulate 100s of industrial IoT sensors, stream real-time data, detect anomalies with ML, and remotely control factory equipment — all in a unified platform.
          </p>

          {/* CTA */}
          <Link
            to="/login"
            className="cta-primary"
            style={{ display: 'inline-block', margin: '18px 0 18px', padding: '12px 34px', fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(22px, 2vw, 20px)', letterSpacing: '1.2px', color: '#fff', background: '#1e40af', borderRadius: '100px', fontWeight: 700, textTransform: 'uppercase', textDecoration: 'none', boxShadow: '0 4px 24px rgba(30,64,175,.10)' }}
          >
            Log In to Your Dashboard
          </Link>

          <div style={{ width: '52px', height: '1px', background: 'rgba(10,11,13,0.1)', margin: '0 0 16px' }} />

          {/* Stats */}
          <div className="hero-e4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            {[
              { n: '100', unit: '+', label: 'SIMULATED SENSORS' },
              { n: '<50', unit: 'ms', label: 'REAL-TIME LATENCY' },
              { n: '8', unit: '', label: 'PIPELINE MODULES' },
            ].map((p, i) => (
              <div key={p.label} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 36px' }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '60px', lineHeight: 1, letterSpacing: '1px', color: '#0a0b0d', display: 'flex', alignItems: 'baseline' }}>
                    <span>{p.n}</span>
                    {p.unit && <em style={{ fontStyle: 'normal', fontSize: '28px', color: '#1e40af', marginLeft: '2px' }}>{p.unit}</em>}
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(10,11,13,0.38)', letterSpacing: '1px', marginTop: '6px', textTransform: 'uppercase', fontWeight: 600 }}>
                    {p.label}
                  </div>
                </div>
                {i < 2 && <div style={{ width: '1px', height: '44px', background: 'rgba(10,11,13,0.12)' }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="hero-marquee">
        <div style={{ display: 'flex', animation: 'marqueeLeft 35s linear infinite', width: 'max-content', alignItems: 'center' }}>
          {[...Array(2)].map((_, copy) => (
            <div key={copy} style={{ display: 'flex', gap: '16px', paddingRight: '16px', alignItems: 'center' }}>
              {['IOT SIMULATION', 'KAFKA STREAMING', 'ANOMALY DETECTION', 'ML PREDICTION', 'RELAY CONTROL', 'GRAFANA DASHBOARD', 'REAL-TIME ANALYTICS', 'ENERGY OPTIMIZATION'].map((chip, i) => (
                <div key={`${chip}-${i}`} style={{ padding: '8px 20px', borderRadius: '20px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '2px', fontWeight: 600, whiteSpace: 'nowrap', background: i % 3 === 0 ? '#eff6ff' : 'rgba(255,255,255,.7)', color: i % 3 === 0 ? '#1e40af' : '#1f2937', border: i % 3 === 0 ? '1px solid rgba(30,64,175,.25)' : '1px solid rgba(10,11,13,.08)' }}>
                  {chip}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section
        ref={setRevealRef(0)}
        className="reveal"
        style={{ ...revealStyle, padding: '52px 24px', maxWidth: '1280px', margin: '0 auto' }}
      >
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '3.5px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', marginBottom: '18px' }}>
          What You Build
        </div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(42px, 4.5vw, 60px)', lineHeight: .95, letterSpacing: '1px', marginBottom: '40px', color: '#0a0b0d' }}>
          YOUR FACTORY NEVER SLEEPS.{' '}
          <span style={{ display: 'inline-block', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #1e40af 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            NEITHER DO WE.
          </span>
        </h2>
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }}>
          {FEATURES.map((f) => (
            <div key={f.n} className="feature-card" style={{ background: '#fff', padding: '32px 28px', position: 'relative', overflow: 'hidden', borderRadius: '12px', border: '1px solid rgba(10,11,13,.08)' }}>
              <div data-accent="" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #1e40af, #3b82f6, transparent)', transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform .4s cubic-bezier(.22,1,.36,1)' }} />
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 700, letterSpacing: '2px', color: '#1e40af', marginBottom: '16px', opacity: .5 }}>{f.n}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '1.2px', marginBottom: '10px', color: '#0a0b0d' }}>{f.title}</div>
              <p style={{ fontSize: '13.5px', lineHeight: 1.72, color: 'rgba(10,11,13,.5)' }}>{f.body}</p>
              <span style={{ display: 'inline-block', marginTop: '16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#1e40af', background: 'rgba(30,64,175,.06)', border: '1px solid rgba(30,64,175,.12)', padding: '4px 10px', borderRadius: '4px' }}>
                {f.chip}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section
        ref={setRevealRef(1)}
        className="reveal"
        style={{ ...revealStyle, padding: '28px 24px 80px', maxWidth: '1280px', margin: '0 auto' }}
      >
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '3.5px', fontWeight: 700, color: '#1e40af', textTransform: 'uppercase', marginBottom: '18px' }}>
          Pricing
        </div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(42px, 4.5vw, 58px)', lineHeight: .95, letterSpacing: '1px', marginBottom: '30px', color: '#0a0b0d' }}>
          PAY ONLY WHEN <span style={{ color: '#1e40af' }}>YOU GROW</span>
        </h2>
        <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}>
          {PLANS.map((plan) => (
            <div key={plan.name} className={`pricing-card ${plan.hot ? 'pricing-card-hot' : ''}`} style={{ border: plan.hot ? '1px solid rgba(30,64,175,.38)' : '1px solid rgba(10,11,13,.08)', borderRadius: '12px', padding: '22px', background: plan.hot ? 'linear-gradient(180deg, rgba(30,64,175,.06), #fff)' : '#fff' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '1.4px', color: 'rgba(10,11,13,.44)', textTransform: 'uppercase' }}>{plan.name}</div>
              <div style={{ marginTop: '8px' }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '54px', lineHeight: .9, color: '#0a0b0d' }}>Rs {plan.price}</span>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(10,11,13,.45)', marginTop: '6px' }}>{plan.period}</div>
              <ul style={{ marginTop: '14px', display: 'grid', gap: '8px', paddingLeft: '16px', color: 'rgba(10,11,13,.66)', fontSize: '13px', lineHeight: 1.5 }}>
                {plan.features.map((item) => (
                  <li key={item}>
                    {(plan.highlights as readonly string[]).includes(item)
                      ? <strong style={{ color: '#0a0b0d' }}>{item}</strong>
                      : item}
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                style={{ marginTop: '16px', width: '100%', borderRadius: '8px', border: plan.hot ? 'none' : '1px solid rgba(10,11,13,.14)', background: plan.hot ? '#1e40af' : '#fff', color: plan.hot ? '#fff' : '#0a0b0d', padding: '10px 12px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section
        ref={setRevealRef(2)}
        className="reveal"
        style={{ ...revealStyle, padding: '76px 24px', textAlign: 'center', borderTop: '1px solid rgba(10,11,13,.07)' }}
      >
        <div style={{ maxWidth: '540px', margin: '0 auto' }}>
          <p style={{ fontSize: '20px', lineHeight: 1.6, color: '#0a0b0d', fontWeight: 300, marginBottom: '16px' }}>
            "We caught a motor overload{' '}
            <strong style={{ color: '#1e40af', fontWeight: 700 }}>before it failed the entire assembly line.</strong>{' '}
            The prediction fired 40 minutes early. That alone paid for a full year."
          </p>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px', color: 'rgba(10,11,13,.35)', letterSpacing: '.8px' }}>
            Plant Operations Lead, Vasai — Using SmartGrid IoT Monitor in production
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        ref={setRevealRef(3)}
        className="reveal"
        style={{ ...revealStyle, padding: '110px 24px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden', background: '#f8f9fb', borderTop: '1px solid rgba(10,11,13,.07)' }}
      >
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(80px, 8vw, 98px)', lineHeight: .9, letterSpacing: '1px', marginBottom: '18px', color: '#0a0b0d' }}>
          YOUR FACTORY<br />
          <span style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(10,11,13,.15)' }}>NEVER STOPS.</span><br />
          NEITHER DOES <span style={{ color: '#1e40af' }}>SMARTGRID.</span>
        </h2>
        <p style={{ fontSize: '16.5px', color: 'rgba(10,11,13,.5)', fontWeight: 300, maxWidth: '460px', margin: '0 auto', lineHeight: 1.75 }}>
          First simulation is free. No credit card. No hardware needed. Just deploy, connect your bots, and watch your factory come alive.
        </p>
      </section>

      {/* FOOTER */}
      <div style={{ background: '#f8f9fb', paddingTop: '20px' }}>
        <div style={{ background: '#0a0b0d', borderRadius: '28px 28px 0 0' }}>
          <footer style={{ padding: '28px 24px 0' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: 'rgba(255,255,255,.35)', letterSpacing: '0.5px' }}>
                  Copyright 2026 SmartGrid IoT Monitor. All rights reserved.
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: 'rgba(255,255,255,.2)', letterSpacing: '0.5px', marginTop: '4px' }}>
                  Built for every factory floor in India.
                </div>
              </div>
              <a href="mailto:support@smartgrid.io" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.8px', color: '#1e40af', border: '1px solid rgba(30,64,175,.4)', padding: '8px 18px', textDecoration: 'none' }}>
                support@smartgrid.io
              </a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
