import React, { useState, useEffect } from 'react';
import { ChevronRight, FileText, Languages, Volume2, Upload, Zap, Users, Download, HelpCircle, FileAudio } from 'lucide-react';

// For React Router navigation
const useNavigate = () => {
  const navigate = (path) => {
    window.location.href = path; // Simple redirect - replace with actual router navigation
  };
  return navigate;
};

const LandingPage = () => {
  const [tickerText, setTickerText] = useState(0);
  const tickerWords = ['Translate', 'Summarize', 'Listen'];
  const navigate = useNavigate();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerText((prev) => (prev + 1) % tickerWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Languages,
      title: "Multi-language Support",
      description: "Translate in Hindi, Tamil, Bengali, and more with high accuracy.",
      color: "from-blue-500 to-cyan-500",
      bgAccent: "rgba(59, 130, 246, 0.1)"
    },
    {
      icon: FileText,
      title: "Text & Document Extraction",
      description: "Upload PDFs, images, or paste text for instant processing.",
      color: "from-purple-500 to-pink-500",
      bgAccent: "rgba(147, 51, 234, 0.1)"
    },
    {
      icon: Zap,
      title: "Intelligent Summarization",
      description: "Condense lengthy content into concise, meaningful summaries.",
      color: "from-orange-500 to-yellow-500",
      bgAccent: "rgba(249, 115, 22, 0.1)"
    },
    {
      icon: Volume2,
      title: "Text-to-Speech",
      description: "Listen to translations in natural, clear voices.",
      color: "from-green-500 to-emerald-500",
      bgAccent: "rgba(34, 197, 94, 0.1)"
    },
    {
      icon: Download,
      title: "Export & Download",
      description: "Save your translations as text files, audio, or Word documents.",
      color: "from-red-500 to-rose-500",
      bgAccent: "rgba(239, 68, 68, 0.1)"
    },
    {
      icon: HelpCircle,
      title: "Word Tooltips",
      description: "Hover over words for instant definitions and pronunciation guides.",
      color: "from-indigo-500 to-purple-500",
      bgAccent: "rgba(99, 102, 241, 0.1)"
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Upload or Type",
      description: "Add text, document, or image.",
      icon: Upload
    },
    {
      step: "02",
      title: "Translate & Summarize",
      description: "Process instantly with one click.",
      icon: Zap
    },
    {
      step: "03",
      title: "Listen & Share",
      description: "Hear the output or share it with others.",
      icon: Volume2
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: `
        radial-gradient(1200px 600px at 20% 0%, rgba(31, 41, 55, 0.4), transparent),
        radial-gradient(1200px 600px at 80% 100%, rgba(59, 130, 246, 0.2), transparent),
        radial-gradient(800px 400px at 50% 50%, rgba(147, 51, 234, 0.15), transparent),
        linear-gradient(135deg, #0b0f1a 0%, #111827 50%, #0f172a 100%)
      `,
      color: '#f3f4f6',
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif'
    }}>
      
      {/* Floating particles background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 6 + 3 + 'px',
              height: Math.random() * 6 + 3 + 'px',
              background: `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 150}, 255, ${Math.random() * 0.6 + 0.2})`,
              borderRadius: '50%',
              left: Math.random() * 100 + '%',
              animationName: 'float',
              animationDuration: (Math.random() * 15 + 15) + 's',
              animationIterationCount: 'infinite',
              animationTimingFunction: 'ease-in-out',
              animationDelay: Math.random() * 8 + 's',
              filter: 'blur(0.5px)'
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10%, 90% { opacity: 1; }
          50% { transform: translateY(-10vh) rotate(180deg); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes glow {
          0%, 100% { filter: brightness(1) blur(0px); }
          50% { filter: brightness(1.1) blur(0.5px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(0.5deg); }
        }
        .animate-slideUp { animation: slideUp 0.8s ease-out; }
        .animate-slideDown { animation: slideDown 0.8s ease-out; }
        .animate-fadeIn { animation: fadeIn 1s ease-out; }
        .animate-pulse { animation: pulse 3s ease-in-out infinite; }
        .animate-glow { animation: glow 4s ease-in-out infinite; }
        .animate-cardFloat { animation: cardFloat 6s ease-in-out infinite; }
      `}</style>

      {/* Hero Section */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '80px 20px', 
        textAlign: 'center' 
      }}>
        <div className="animate-slideUp">
          <div style={{
            position: 'relative',
            marginBottom: '32px'
          }}>
            <div style={{
              content: '',
              position: 'absolute',
              top: '-30px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '120px',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #60a5fa, #a855f7, #34d399, transparent)',
              borderRadius: '2px',
              opacity: 0.9
            }} />
            
            <h1 style={{
              fontSize: 'clamp(36px, 5vw, 72px)',
              fontWeight: '900',
              letterSpacing: '-0.03em',
              margin: '0 0 16px 0',
              lineHeight: '1.1'
            }} className="animate-glow">
              <span style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 40%, #f59e0b 80%, #34d399 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 40px rgba(96, 165, 250, 0.3)'
              }}>
                Your Smart Companion for{' '}
              </span>
              <br />
              <div style={{
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                <span 
                  key={tickerText}
                  style={{
                    background: 'linear-gradient(135deg, #34d399 0%, #60a5fa 50%, #a855f7 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                    minWidth: '280px',
                    textAlign: 'center',
                    animation: 'slideDown 0.6s ease-out'
                  }}
                >
                  {tickerWords[tickerText]}
                </span>
              </div>
            </h1>
          </div>
          
          <p style={{
            color: '#cbd5e1',
            fontSize: '20px',
            fontWeight: '600',
            letterSpacing: '0.02em',
            margin: '0 0 16px 0'
          }}>
            Effortless Indian language translation, summarization, and listening in one place.
          </p>
          
          <p style={{
            color: '#9ca3af',
            maxWidth: '600px',
            margin: '0 auto 50px auto',
            lineHeight: '1.6',
            fontSize: '16px'
          }}>
            Transform the way you communicate across languages with our intelligent platform designed for modern India.
          </p>
          
          <div style={{
            display: 'inline-block',
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
            padding: '4px',
            borderRadius: '60px',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <button 
              onClick={() => navigate('/signup')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                padding: '18px 36px',
                borderRadius: '56px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                transform: 'translateY(0)',
                position: 'relative',
                overflow: 'hidden'
              }}
              className="animate-pulse"
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-6px) scale(1.05)';
                e.target.style.boxShadow = '0 20px 50px rgba(59, 130, 246, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
              }}>
              <span style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                Get Started for Free
                <ChevronRight size={22} />
              </span>
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                animation: 'shimmer 2s infinite'
              }} />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '100px 20px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }} className="animate-fadeIn">
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '30px',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#60a5fa',
            letterSpacing: '0.05em'
          }}>
            POWERFUL FEATURES
          </div>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 56px)',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #f3f4f6, #cbd5e1)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px',
            letterSpacing: '-0.02em'
          }}>
            Everything You Need
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Break language barriers and process content efficiently with our comprehensive suite of AI-powered tools.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          marginTop: '60px'
        }}>
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                style={{
                  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04))`,
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '32px',
                  padding: '40px',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  transformStyle: 'preserve-3d'
                }}
                className="animate-slideUp animate-cardFloat"
                style={{
                  ...{
                    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04))`,
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '32px',
                    padding: '40px',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    transformStyle: 'preserve-3d'
                  },
                  animationDelay: `${index * 0.2}s`
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px) rotateX(5deg) rotateY(5deg)';
                  e.currentTarget.style.boxShadow = '0 40px 80px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg)';
                  e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                {/* Background accent */}
                <div style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  width: '150px',
                  height: '150px',
                  background: feature.bgAccent,
                  borderRadius: '50%',
                  transform: 'translate(50%, -50%)',
                  opacity: 0.6,
                  filter: 'blur(40px)'
                }} />
                
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '24px',
                  background: `linear-gradient(135deg, ${feature.color})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  boxShadow: `0 10px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)`,
                  position: 'relative',
                  zIndex: 2
                }}>
                  <IconComponent size={36} color="white" />
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    borderRadius: '24px',
                    background: `linear-gradient(135deg, ${feature.color})`,
                    opacity: 0.3,
                    filter: 'blur(10px)',
                    zIndex: -1
                  }} />
                </div>
                
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#f3f4f6',
                  marginBottom: '16px',
                  position: 'relative',
                  zIndex: 2
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#a1a1aa',
                  lineHeight: '1.6',
                  margin: 0,
                  fontSize: '16px',
                  position: 'relative',
                  zIndex: 2
                }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '100px 20px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }} className="animate-fadeIn">
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '30px',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#60a5fa',
            letterSpacing: '0.05em'
          }}>
            HOW IT WORKS
          </div>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 56px)',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #f3f4f6, #cbd5e1)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px',
            letterSpacing: '-0.02em'
          }}>
            Simple & Effective
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            Three simple steps to transform your content experience and break language barriers effortlessly.
          </p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '60px',
          alignItems: 'center'
        }}>
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '60px',
                  maxWidth: '900px',
                  width: '100%',
                  flexDirection: index % 2 === 0 ? 'row' : 'row-reverse'
                }}
                className="animate-slideUp"
                style={{
                  ...{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '60px',
                    maxWidth: '900px',
                    width: '100%',
                    flexDirection: index % 2 === 0 ? 'row' : 'row-reverse'
                  },
                  animationDelay: `${index * 0.3}s`
                }}
              >
                <div style={{
                  flex: '1',
                  textAlign: index % 2 === 0 ? 'left' : 'right'
                }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#60a5fa',
                    marginBottom: '12px',
                    letterSpacing: '0.1em',
                    display: 'inline-block',
                    padding: '6px 16px',
                    background: 'rgba(96, 165, 250, 0.1)',
                    borderRadius: '20px',
                    border: '1px solid rgba(96, 165, 250, 0.2)'
                  }}>
                    STEP {step.step}
                  </div>
                  <h3 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#f3f4f6',
                    marginBottom: '16px',
                    letterSpacing: '-0.01em'
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    color: '#9ca3af',
                    fontSize: '18px',
                    lineHeight: '1.6'
                  }}>
                    {step.description}
                  </p>
                </div>
                
                <div style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))',
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(20px)',
                  flexShrink: 0,
                  position: 'relative',
                  boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)',
                  transition: 'all 0.4s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.1) rotate(5deg)';
                  e.target.style.boxShadow = '0 30px 60px rgba(59, 130, 246, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1) rotate(0deg)';
                  e.target.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.2)';
                }}>
                  <IconComponent size={48} color="#60a5fa" />
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    height: '80%',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
                    filter: 'blur(20px)',
                    zIndex: -1
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final CTA Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '100px 20px 140px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04))',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '40px',
          padding: '100px 60px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}
        className="animate-slideUp">
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.6), rgba(168, 85, 247, 0.6), rgba(52, 211, 153, 0.6), transparent)',
            borderRadius: '40px 40px 0 0'
          }} />
          
          <h2 style={{
            fontSize: 'clamp(36px, 4vw, 60px)',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #60a5fa, #a855f7, #34d399)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '20px',
            letterSpacing: '-0.02em'
          }}>
            Ready to start translating?
          </h2>
          
          <p style={{
            color: '#9ca3af',
            fontSize: '20px',
            marginBottom: '50px',
            maxWidth: '700px',
            margin: '0 auto 50px auto',
            lineHeight: '1.6'
          }}>
            Join thousands of users who simplify communication with Smart Translator. Experience seamless translation, summarization, and audio features.
          </p>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-block',
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
              padding: '4px',
              borderRadius: '60px',
              border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
              <button 
                onClick={() => navigate('/signup')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '18px 40px',
                  borderRadius: '56px',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 15px 35px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-4px) scale(1.02)';
                  e.target.style.boxShadow = '0 25px 50px rgba(59, 130, 246, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 15px 35px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                }}>
                <span style={{
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  Sign Up Now
                  <ChevronRight size={20} />
                </span>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                  animation: 'shimmer 3s infinite'
                }} />
              </button>
            </div>
            
            <button 
              onClick={() => navigate('/login')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#f3f4f6',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                padding: '16px 32px',
                borderRadius: '56px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
              }}>
              <Users size={20} />
              Login
            </button>
          </div>
          
          <div style={{
            marginTop: '40px',
            padding: '20px',
            background: 'rgba(52, 211, 153, 0.1)',
            border: '1px solid rgba(52, 211, 153, 0.2)',
            borderRadius: '20px',
            display: 'inline-block'
          }}>
            <p style={{
              color: '#10b981',
              fontSize: '16px',
              margin: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontWeight: '600'
            }}>
              <span style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#34d399',
                boxShadow: '0 0 10px rgba(52, 211, 153, 0.5)',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
              Free to start • No credit card required 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;