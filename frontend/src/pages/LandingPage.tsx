import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Text, 
  Title, 
  Group, 
  Stack, 
  Badge, 
  Button, 
  SimpleGrid,
  Center,
  useMantineColorScheme,
  Box,
  Divider,
  List,
  Image,
  Accordion,
  Grid
} from '@mantine/core';
import PageTransition from '../components/animations/PageTransition';
import Navbar from '../components/Navbar';
import { IconChecks } from '@tabler/icons-react';
import enarmLogo from '../assets/enarm_logo.png';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();

  return (
    <PageTransition type="medical" duration={800}>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes expandWidth {
            from {
              width: 0;
            }
            to {
              width: 100%;
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          .elegant-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }
          
          .elegant-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(196, 213, 70, 0.1), transparent);
            transition: left 0.5s ease;
          }
          
          .elegant-card:hover {
            transform: translateY(-12px) scale(1.02);
            box-shadow: 0 30px 60px rgba(54, 71, 91, 0.2);
          }
          
          .elegant-card:hover::before {
            left: 100%;
          }
          
          .premium-gradient {
            background: linear-gradient(135deg, 
              rgb(54, 71, 91) 0%, 
              rgb(45, 58, 75) 50%, 
              rgb(54, 71, 91) 100%);
            position: relative;
          }
          
          .premium-gradient::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, 
              rgba(196, 213, 70, 0.1) 0%, 
              transparent 50%, 
              rgba(196, 213, 70, 0.05) 100%);
            pointer-events: none;
          }
          
          .section-reveal {
            opacity: 0;
            animation: fadeInUp 0.8s ease-out forwards;
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
      <Box
        style={{
          minHeight: '100vh',
          background: 'rgb(54, 71, 91)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Advanced Background Elements */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(196, 213, 70, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(196, 213, 70, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.05) 0%, transparent 30%)
          `,
          opacity: 0.6,
          pointerEvents: 'none'
        }} />
        
        {/* Geometric Pattern Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c4d546' fill-opacity='0.03'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.4,
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <Navbar />
        </div>

        {/* Hero Section */}
        <div style={{ 
          width: '100vw', 
          marginLeft: 'calc(-50vw + 50%)', 
          background: 'transparent', 
          color: 'white',
          padding: '8rem 0 10rem 0',
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Advanced Decorative Elements */}
          <div style={{
            position: 'absolute',
            top: '10%',
            right: '-20%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(196, 213, 70, 0.2), rgba(196, 213, 70, 0.05))',
            filter: 'blur(60px)',
            animation: 'float 8s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '10%',
            left: '-15%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02))',
            filter: 'blur(40px)',
            animation: 'float 6s ease-in-out infinite reverse'
          }} />
          
          
          <Container size="lg" style={{ position: 'relative', zIndex: 2 }}>
            <Stack gap={50} align="center" ta="center">
              <div style={{ 
                animation: 'fadeInUp 1s ease-out',
                animationFillMode: 'both'
              }}>
                <Title 
                  order={1} 
                  size="5.5rem" 
                  fw={800}
                  c="white"
                  style={{ 
                    lineHeight: 1.05,
                    maxWidth: '1000px',
                    letterSpacing: '-0.02em',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                >
                  Aquí comienza el camino de tu{' '}
                  <span style={{ 
                    color: 'rgb(196, 213, 70)',
                    display: 'inline-block',
                    position: 'relative'
                  }}>
                    especialización
                    <div style={{
                      position: 'absolute',
                      bottom: '-8px',
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background: 'rgb(196, 213, 70)',
                      borderRadius: '2px',
                      animation: 'expandWidth 1.5s ease-out 0.5s both'
                    }} />
                  </span>
                </Title>
              </div>
              
              <div style={{ 
                animation: 'fadeInUp 1s ease-out 0.3s both',
                maxWidth: '850px'
              }}>
                <Text 
                  size="xl" 
                  c="rgba(255, 255, 255, 0.85)" 
                  ta="center"
                  fw={400}
                  style={{ 
                    fontSize: '1.5rem', 
                    lineHeight: 1.7,
                    letterSpacing: '-0.01em'
                  }}
                >
                  Más de <strong style={{ color: 'rgb(196, 213, 70)' }}>27 especialidades</strong>, simuladores personalizables, medición de progreso, 
                  asistencia y recomendaciones con base en tus necesidades.
                </Text>
              </div>

              <div style={{ 
                animation: 'fadeInUp 1s ease-out 0.6s both',
                marginTop: '2rem'
              }}>
                <Group gap="lg" justify="center" style={{ flexWrap: 'wrap' }}>
                  <Button 
                    size="xl"
                    onClick={() => navigate('/login')}
                    style={{ 
                      fontSize: '1.3rem',
                      padding: '1.8rem 4.5rem',
                      backgroundColor: 'rgb(196, 213, 70)',
                      color: 'rgb(54, 71, 91)',
                      border: 'none',
                      fontWeight: 700,
                      borderRadius: '60px',
                      boxShadow: `
                        0 10px 40px rgba(196, 213, 70, 0.4),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2)
                      `,
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      letterSpacing: '0.02em',
                      textTransform: 'none',
                      position: 'relative',
                      overflow: 'hidden',
                      height: 'auto',
                      minHeight: '64px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                      e.currentTarget.style.boxShadow = `
                        0 20px 60px rgba(196, 213, 70, 0.6),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3)
                      `;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = `
                        0 10px 40px rgba(196, 213, 70, 0.4),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2)
                      `;
                    }}
                  >
                    <span style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px'
                    }}>
                      Conoce Tus Planes
                      <span style={{
                        fontSize: '1.1rem',
                        transform: 'translateX(0)',
                        transition: 'transform 0.3s ease'
                      }}>→</span>
                    </span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="xl"
                    style={{ 
                      fontSize: '1.2rem',
                      padding: '1.8rem 3.5rem',
                      backgroundColor: 'transparent',
                      color: 'white',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      fontWeight: 600,
                      borderRadius: '60px',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      letterSpacing: '0.01em',
                      minHeight: '64px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(196, 213, 70, 0.8)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Ver Demo Gratis
                  </Button>
                </Group>
              </div>
            </Stack>
          </Container>
        </div>

        {/* About Platform Section */}
        <div style={{ 
          width: '100vw', 
          marginLeft: 'calc(-50vw + 50%)', 
          background: `
            linear-gradient(135deg, 
              rgb(248, 250, 252) 0%, 
              rgb(255, 255, 255) 50%, 
              rgb(248, 250, 252) 100%
            )
          `,
          padding: '12rem 0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Floating Elements */}
          <div style={{
            position: 'absolute',
            top: '15%',
            right: '5%',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(196, 213, 70, 0.1), rgba(196, 213, 70, 0.02))',
            animation: 'float 8s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '8%',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(54, 71, 91, 0.08), rgba(54, 71, 91, 0.02))',
            animation: 'float 6s ease-in-out infinite reverse'
          }} />

          <Container size="lg" style={{ position: 'relative', zIndex: 2 }}>
            <Grid align="center" gutter={80}>
              {/* Left Content */}
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap={40} style={{ animation: 'slideInLeft 1s ease-out' }}>
                  <div>
                    <Text 
                      size="sm" 
                      fw={700} 
                      style={{ 
                        color: 'rgb(196, 213, 70)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        marginBottom: '1.5rem',
                        position: 'relative'
                      }}
                    >
                      <span style={{ position: 'relative' }}>
                        NUESTRA FILOSOFÍA
                        <div style={{
                          position: 'absolute',
                          bottom: '-4px',
                          left: 0,
                          width: '60px',
                          height: '2px',
                          background: 'rgb(196, 213, 70)',
                          borderRadius: '1px'
                        }} />
                      </span>
                    </Text>
                    <Title 
                      order={2} 
                      size="4.5rem" 
                      fw={900}
                      style={{ 
                        color: 'rgb(54, 71, 91)',
                        lineHeight: 1.1,
                        letterSpacing: '-0.03em',
                        marginBottom: '2rem'
                      }}
                    >
                      Tu preparación,{' '}
                      <span style={{ 
                        color: 'rgb(196, 213, 70)',
                        position: 'relative',
                        display: 'inline-block'
                      }}>
                        nuestra prioridad
                        <div style={{
                          position: 'absolute',
                          bottom: '8px',
                          left: 0,
                          right: 0,
                          height: '8px',
                          background: 'rgba(196, 213, 70, 0.3)',
                          borderRadius: '4px',
                          zIndex: -1
                        }} />
                      </span>
                    </Title>
                  </div>

                  <Stack gap={25}>
                    <Text 
                      size="lg"
                      c="rgb(70, 70, 70)"
                      style={{ 
                        fontSize: '1.3rem', 
                        lineHeight: 1.7,
                        letterSpacing: '-0.005em'
                      }}
                    >
                      Imagina una plataforma donde cada paso de tu preparación para el ENARM está{' '}
                      <span style={{ 
                        color: 'rgb(54, 71, 91)', 
                        fontWeight: 600,
                        background: 'linear-gradient(120deg, transparent 0%, rgba(196, 213, 70, 0.1) 50%, transparent 100%)',
                        padding: '0 4px',
                        borderRadius: '3px'
                      }}>cuidadosamente diseñado</span>{' '}
                      para llevarte al éxito.
                    </Text>

                    <Text 
                      size="lg"
                      c="rgb(70, 70, 70)"
                      style={{ 
                        fontSize: '1.3rem', 
                        lineHeight: 1.7,
                        letterSpacing: '-0.005em'
                      }}
                    >
                      No solo te ofrecemos contenido actualizado y dinámico; te proporcionamos una{' '}
                      <span style={{ 
                        color: 'rgb(196, 213, 70)', 
                        fontWeight: 600,
                        background: 'linear-gradient(120deg, transparent 0%, rgba(54, 71, 91, 0.08) 50%, transparent 100%)',
                        padding: '0 4px',
                        borderRadius: '3px'
                      }}>experiencia de aprendizaje personalizada</span>.
                    </Text>
                  </Stack>

                  {/* Feature Highlights */}
                  <Stack gap={15} mt={20}>
                    {[
                      { text: 'Contenido personalizado según tu perfil' },
                      { text: 'Medición de progreso en tiempo real' },
                      { text: 'Colaboración con otros aspirantes' }
                    ].map((item, index) => (
                      <Group key={index} gap="md" align="flex-start" style={{
                        animation: `slideInLeft 0.8s ease-out ${0.3 + index * 0.1}s both`
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          background: 'rgb(196, 213, 70)',
                          borderRadius: '50%',
                          marginTop: '8px',
                          minWidth: '6px'
                        }} />
                        <Text size="md" c="rgb(80, 80, 80)" fw={500} style={{ flex: 1 }}>
                          {item.text}
                        </Text>
                      </Group>
                    ))}
                  </Stack>
                </Stack>
              </Grid.Col>

              {/* Right Stats Grid */}
              <Grid.Col span={{ base: 12, md: 6 }}>
                <div style={{ animation: 'slideInRight 1s ease-out 0.2s both' }}>
                  <SimpleGrid cols={2} spacing={40}>
                    {[
                      { number: '27+', label: 'Especialidades', color: 'rgb(54, 71, 91)' },
                      { number: '15K+', label: 'Reactivos', color: 'rgb(196, 213, 70)' },
                      { number: '87%', label: 'Aprobación', color: 'rgb(54, 71, 91)' },
                      { number: '24/7', label: 'Soporte', color: 'rgb(196, 213, 70)' }
                    ].map((stat, index) => (
                      <div key={index} 
                        className="elegant-card"
                        style={{
                          background: 'white',
                          borderRadius: '24px',
                          padding: '2.5rem 1.5rem',
                          textAlign: 'center',
                          boxShadow: '0 10px 40px rgba(54, 71, 91, 0.08)',
                          border: '1px solid rgba(54, 71, 91, 0.05)',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: stat.color,
                          borderRadius: '24px 24px 0 0'
                        }} />
                        <Text 
                          size="3rem" 
                          fw={900} 
                          style={{ 
                            color: stat.color,
                            lineHeight: 1,
                            marginBottom: '0.8rem',
                            fontFamily: 'system-ui, -apple-system, sans-serif'
                          }}
                        >
                          {stat.number}
                        </Text>
                        <Text 
                          size="md" 
                          fw={600} 
                          c="rgb(100, 100, 100)"
                          tt="uppercase"
                          style={{ letterSpacing: '0.1em' }}
                        >
                          {stat.label}
                        </Text>
                      </div>
                    ))}
                  </SimpleGrid>
                </div>
              </Grid.Col>
            </Grid>
          </Container>
        </div>

        {/* Motivational Quotes Section */}
        <div style={{ 
          width: '100vw', 
          marginLeft: 'calc(-50vw + 50%)', 
          background: 'rgb(196, 213, 70)',
          padding: '8rem 0',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '-5%',
            width: '300px',
            height: '300px',
            background: 'rgba(54, 71, 91, 0.08)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '10%',
            right: '-10%',
            width: '400px',
            height: '400px',
            background: 'rgba(54, 71, 91, 0.05)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse'
          }} />

          <Container size="lg" style={{ position: 'relative', zIndex: 2 }}>
            <Stack gap="4rem" align="center">
              {/* Section Label */}
              <div style={{ textAlign: 'center', animation: 'fadeInUp 0.8s ease-out' }}>
                <Text
                  size="sm"
                  fw={600}
                  ta="center"
                  tt="uppercase"
                  style={{
                    color: 'rgb(54, 71, 91)',
                    letterSpacing: '0.2em',
                    marginBottom: '1.5rem',
                    opacity: 0.8
                  }}
                >
                  MOTIVACIÓN • ÉXITO • DETERMINACIÓN
                </Text>
                <Title 
                  order={2} 
                  size="3.5rem" 
                  fw={800}
                  ta="center"
                  style={{ 
                    color: 'rgb(54, 71, 91)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    maxWidth: '900px',
                    margin: '0 auto'
                  }}
                >
                  Palabras que{' '}
                  <span style={{ 
                    color: 'white',
                    position: 'relative',
                    display: 'inline-block'
                  }}>
                    inspiran
                    <div style={{
                      position: 'absolute',
                      bottom: '10%',
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: 'white',
                      animation: 'expandWidth 1.2s ease-out 0.5s both'
                    }} />
                  </span>
                </Title>
              </div>

              {/* Quotes Grid */}
              <SimpleGrid 
                cols={{ base: 1, md: 2 }} 
                spacing={60}
                style={{ width: '100%', maxWidth: '1200px' }}
              >
                <div style={{ 
                  textAlign: 'center',
                  animation: 'fadeInUp 0.8s ease-out 0.2s both'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '20px',
                    padding: '3rem 2.5rem',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  className="quote-card"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(54, 71, 91, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    <div style={{
                      fontSize: '3rem',
                      color: 'white',
                      marginBottom: '1rem',
                      fontWeight: 300
                    }}>
                      "
                    </div>
                    <Text 
                      size="xl" 
                      fw={600} 
                      ta="center"
                      style={{ 
                        color: 'white',
                        fontSize: '1.8rem',
                        lineHeight: 1.4,
                        letterSpacing: '-0.01em',
                        marginBottom: '1.5rem'
                      }}
                    >
                      Haz que cada minuto de estudio cuente.
                    </Text>
                    <Text
                      size="sm"
                      fw={500}
                      ta="center"
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase'
                      }}
                    >
                      Eficiencia • Disciplina
                    </Text>
                  </div>
                </div>

                <div style={{ 
                  textAlign: 'center',
                  animation: 'fadeInUp 0.8s ease-out 0.4s both'
                }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '20px',
                    padding: '3rem 2.5rem',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  className="quote-card"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(54, 71, 91, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    <div style={{
                      fontSize: '3rem',
                      color: 'white',
                      marginBottom: '1rem',
                      fontWeight: 300
                    }}>
                      "
                    </div>
                    <Text 
                      size="xl" 
                      fw={600} 
                      ta="center"
                      style={{ 
                        color: 'white',
                        fontSize: '1.8rem',
                        lineHeight: 1.4,
                        letterSpacing: '-0.01em',
                        marginBottom: '1.5rem'
                      }}
                    >
                      Domina cada tema, conquista cada examen.
                    </Text>
                    <Text
                      size="sm"
                      fw={500}
                      ta="center"
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase'
                      }}
                    >
                      Maestría • Victoria
                    </Text>
                  </div>
                </div>
              </SimpleGrid>

              {/* Additional motivational element */}
              <div style={{ 
                textAlign: 'center', 
                maxWidth: '700px',
                animation: 'fadeInUp 0.8s ease-out 0.6s both'
              }}>
                <Text
                  size="lg"
                  fw={500}
                  ta="center"
                  style={{
                    color: 'rgb(54, 71, 91)',
                    fontSize: '1.3rem',
                    lineHeight: 1.6,
                    letterSpacing: '-0.005em'
                  }}
                >
                  La diferencia entre el éxito y el fracaso está en los{' '}
                  <strong style={{ color: 'white' }}>pequeños detalles</strong>{' '}
                  que practicas cada día.
                </Text>
              </div>
            </Stack>
          </Container>
        </div>

        {/* Features Section */}
        <div style={{ 
          width: '100vw', 
          marginLeft: 'calc(-50vw + 50%)', 
          background: 'rgb(248, 250, 252)',
          padding: '8rem 0',
          position: 'relative'
        }}>
          <Container size="lg">
            <Stack gap="5rem" align="center">
              {/* Section Header */}
              <div style={{ textAlign: 'center', animation: 'fadeInUp 0.8s ease-out' }}>
                <Text
                  size="sm"
                  fw={600}
                  ta="center"
                  tt="uppercase"
                  style={{
                    color: 'rgb(196, 213, 70)',
                    letterSpacing: '0.15em',
                    marginBottom: '1rem'
                  }}
                >
                  FUNCIONALIDADES PREMIUM
                </Text>
                <Title 
                  order={2} 
                  size="4rem" 
                  fw={800}
                  ta="center"
                  style={{ 
                    color: 'rgb(54, 71, 91)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    maxWidth: '1100px',
                    margin: '0 auto'
                  }}
                >
                  Exámenes personalizados y{' '}
                  <span style={{ color: 'rgb(196, 213, 70)' }}>
                    contenido especializado
                  </span>
                </Title>
              </div>

              {/* Features Grid */}
              <SimpleGrid cols={{ base: 1, md: 3 }} spacing={40} style={{ width: '100%' }}>
                {/* Feature 1 */}
                <div style={{ 
                  animation: 'fadeInUp 0.8s ease-out 0.2s both'
                }}>
                  <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '2.5rem 2rem',
                    height: '100%',
                    boxShadow: '0 10px 30px rgba(54, 71, 91, 0.08)',
                    border: '1px solid rgba(196, 213, 70, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(54, 71, 91, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(54, 71, 91, 0.08)';
                  }}
                  >
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: 'rgb(196, 213, 70)',
                      borderRadius: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem'
                    }}>
                      <Text size="2rem" fw={600} style={{ color: 'rgb(54, 71, 91)' }}>27+</Text>
                    </div>
                    <Title order={3} size="1.5rem" fw={700} style={{ 
                      color: 'rgb(54, 71, 91)', 
                      marginBottom: '1rem',
                      letterSpacing: '-0.01em'
                    }}>
                      Especialidades Completas
                    </Title>
                    <Text size="md" c="rgb(100, 100, 100)" style={{ 
                      lineHeight: 1.6,
                      fontSize: '1rem'
                    }}>
                      Toda la gama completa de especialidades del padrón oficial del ENARM. 
                      Contenido actualizado y estructurado por expertos.
                    </Text>
                  </div>
                </div>

                {/* Feature 2 */}
                <div style={{ 
                  animation: 'fadeInUp 0.8s ease-out 0.4s both'
                }}>
                  <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '2.5rem 2rem',
                    height: '100%',
                    boxShadow: '0 10px 30px rgba(54, 71, 91, 0.08)',
                    border: '1px solid rgba(196, 213, 70, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(54, 71, 91, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(54, 71, 91, 0.08)';
                  }}
                  >
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: 'rgb(54, 71, 91)',
                      borderRadius: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem'
                    }}>
                      <Text size="1.3rem" fw={600} style={{ color: 'white' }}>⚡</Text>
                    </div>
                    <Title order={3} size="1.5rem" fw={700} style={{ 
                      color: 'rgb(54, 71, 91)', 
                      marginBottom: '1rem',
                      letterSpacing: '-0.01em'
                    }}>
                      Personalización Total
                    </Title>
                    <Text size="md" c="rgb(100, 100, 100)" style={{ 
                      lineHeight: 1.6,
                      fontSize: '1rem'
                    }}>
                      Adapta cada espacio de tu perfil conforme a tus necesidades, 
                      intereses y objetivos específicos de preparación.
                    </Text>
                  </div>
                </div>

                {/* Feature 3 */}
                <div style={{ 
                  animation: 'fadeInUp 0.8s ease-out 0.6s both'
                }}>
                  <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '2.5rem 2rem',
                    height: '100%',
                    boxShadow: '0 10px 30px rgba(54, 71, 91, 0.08)',
                    border: '1px solid rgba(196, 213, 70, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(54, 71, 91, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(54, 71, 91, 0.08)';
                  }}
                  >
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: 'rgb(196, 213, 70)',
                      borderRadius: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.5rem'
                    }}>
                      <Text size="1.3rem" fw={600} style={{ color: 'rgb(54, 71, 91)' }}>📊</Text>
                    </div>
                    <Title order={3} size="1.5rem" fw={700} style={{ 
                      color: 'rgb(54, 71, 91)', 
                      marginBottom: '1rem',
                      letterSpacing: '-0.01em'
                    }}>
                      Herramientas Avanzadas
                    </Title>
                    <Text size="md" c="rgb(100, 100, 100)" style={{ 
                      lineHeight: 1.6,
                      fontSize: '1rem'
                    }}>
                      Clases grabadas, asesorías en línea, medición de progreso, 
                      sistema de recomendaciones y libreta digital colaborativa.
                    </Text>
                  </div>
                </div>
              </SimpleGrid>

              {/* Additional CTA */}
              <div style={{ 
                textAlign: 'center',
                animation: 'fadeInUp 0.8s ease-out 0.8s both'
              }}>
                <Text 
                  size="lg"
                  fw={500}
                  ta="center"
                  style={{
                    color: 'rgb(80, 80, 80)',
                    fontSize: '1.3rem',
                    lineHeight: 1.6,
                    letterSpacing: '-0.005em',
                    maxWidth: '800px'
                  }}
                >
                  Descubre todo lo que puedes lograr durante tu preparación en{' '}
                  <strong style={{ color: 'rgb(54, 71, 91)' }}>ENARM 360</strong>
                </Text>
              </div>
            </Stack>
          </Container>
        </div>

        {/* Pricing Section */}
        <div style={{ 
          width: '100vw', 
          marginLeft: 'calc(-50vw + 50%)', 
          background: 'white',
          padding: '8rem 0'
        }}>
          <Container size="lg">
            <Stack gap="xl">
              <Center>
                <Stack gap="sm" align="center">
                  <Title order={2} ta="center" size="3rem" style={{ color: 'rgb(54, 71, 91)' }}>
                    Planes de Suscripción
                  </Title>
                  <Text size="lg" c="rgb(100, 100, 100)" ta="center" maw={700} style={{ fontSize: '1.2rem' }}>
                    Elige el plan que mejor se adapte a tus necesidades de preparación para el ENARM.
                  </Text>
                </Stack>
              </Center>

              <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" style={{ marginTop: '3rem' }}>
                {/* Plan Básico */}
                <div 
                  style={{
                    background: 'white',
                    border: '3px solid rgb(196, 213, 70)',
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Stack gap="md" align="center" style={{ flex: 1 }}>
                    <Badge size="lg" style={{ background: 'rgb(196, 213, 70)', color: 'rgb(54, 71, 91)', border: 'none' }}>
                      Básico
                    </Badge>
                    <Title order={2} size="3rem" style={{ color: 'rgb(54, 71, 91)' }}>
                      $299
                      <Text span size="lg" c="rgb(100, 100, 100)">/mes</Text>
                    </Title>
                    <List spacing="sm" size="sm" center icon={<IconChecks size={16} color="rgb(196, 213, 70)" />}>
                      <List.Item>5,000 preguntas</List.Item>
                      <List.Item>10 simulacros mensuales</List.Item>
                      <List.Item>Análisis básico</List.Item>
                      <List.Item>Soporte por email</List.Item>
                    </List>
                  </Stack>
                  <Button 
                    fullWidth
                    size="lg"
                    style={{ 
                      background: 'rgb(196, 213, 70)',
                      color: 'rgb(54, 71, 91)',
                      border: 'none',
                      marginTop: '2rem'
                    }}
                    onClick={() => navigate('/login')}
                  >
                    Comenzar
                  </Button>
                </div>

                {/* Plan Estándar */}
                <div 
                  style={{
                    background: 'white',
                    border: '3px solid rgb(54, 71, 91)',
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Badge 
                    size="md" 
                    style={{ 
                      background: 'rgb(54, 71, 91)', 
                      color: 'white',
                      position: 'absolute',
                      top: '-10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 10,
                      whiteSpace: 'nowrap',
                      fontSize: '11px',
                      padding: '6px 16px',
                      borderRadius: '12px',
                      border: 'none'
                    }}
                  >
                    Más Popular
                  </Badge>
                  <Stack gap="md" align="center" mt="md" style={{ flex: 1 }}>
                    <Badge size="lg" style={{ background: 'rgb(54, 71, 91)', color: 'white', border: 'none' }}>
                      Estándar
                    </Badge>
                    <Title order={2} size="3rem" style={{ color: 'rgb(54, 71, 91)' }}>
                      $499
                      <Text span size="lg" c="rgb(100, 100, 100)">/mes</Text>
                    </Title>
                    <List spacing="sm" size="sm" center icon={<IconChecks size={16} color="rgb(54, 71, 91)" />}>
                      <List.Item>15,000 preguntas</List.Item>
                      <List.Item>Simulacros ilimitados</List.Item>
                      <List.Item>Análisis detallado</List.Item>
                      <List.Item>Plan personalizado</List.Item>
                      <List.Item>Soporte prioritario</List.Item>
                    </List>
                  </Stack>
                  <Button 
                    fullWidth
                    size="lg"
                    style={{ 
                      background: 'rgb(54, 71, 91)',
                      color: 'white',
                      border: 'none',
                      marginTop: '2rem'
                    }}
                    onClick={() => navigate('/login')}
                  >
                    Comenzar
                  </Button>
                </div>

                {/* Plan Premium */}
                <div 
                  style={{
                    background: 'white',
                    border: '3px solid rgb(196, 213, 70)',
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Stack gap="md" align="center" style={{ flex: 1 }}>
                    <Badge size="lg" style={{ background: 'rgb(196, 213, 70)', color: 'rgb(54, 71, 91)', border: 'none' }}>
                      Premium
                    </Badge>
                    <Title order={2} size="3rem" style={{ color: 'rgb(54, 71, 91)' }}>
                      $799
                      <Text span size="lg" c="rgb(100, 100, 100)">/mes</Text>
                    </Title>
                    <List spacing="sm" size="sm" center icon={<IconChecks size={16} color="rgb(196, 213, 70)" />}>
                      <List.Item>Acceso completo</List.Item>
                      <List.Item>Simulacros ilimitados</List.Item>
                      <List.Item>IA personalizada</List.Item>
                      <List.Item>Mentoría 1 a 1</List.Item>
                      <List.Item>Soporte 24/7</List.Item>
                      <List.Item>Garantía de aprobación</List.Item>
                    </List>
                  </Stack>
                  <Button 
                    fullWidth
                    size="lg"
                    style={{ 
                      background: 'rgb(196, 213, 70)',
                      color: 'rgb(54, 71, 91)',
                      border: 'none',
                      marginTop: '2rem'
                    }}
                    onClick={() => navigate('/login')}
                  >
                    Comenzar
                  </Button>
                </div>
              </SimpleGrid>
            </Stack>
          </Container>
        </div>

        {/* FAQ Section */}
        <div style={{ 
          width: '100vw', 
          marginLeft: 'calc(-50vw + 50%)', 
          background: 'rgb(248, 250, 252)',
          padding: '8rem 0'
        }}>
          <Container size="lg">
            <Stack gap="4rem" align="center">
              {/* Section Header */}
              <div style={{ textAlign: 'center', animation: 'fadeInUp 0.8s ease-out' }}>
                <Text
                  size="sm"
                  fw={600}
                  ta="center"
                  tt="uppercase"
                  style={{
                    color: 'rgb(196, 213, 70)',
                    letterSpacing: '0.15em',
                    marginBottom: '1rem'
                  }}
                >
                  DUDAS FRECUENTES
                </Text>
                <Title 
                  order={2} 
                  size="4rem" 
                  fw={800}
                  ta="center"
                  style={{ 
                    color: 'rgb(54, 71, 91)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    maxWidth: '800px',
                    margin: '0 auto'
                  }}
                >
                  Resolvemos tus{' '}
                  <span style={{ color: 'rgb(196, 213, 70)' }}>
                    principales dudas
                  </span>
                </Title>
              </div>

              {/* FAQ Accordion */}
              <Accordion 
                variant="separated" 
                radius="xl"
                style={{ width: '100%', maxWidth: '900px' }}
                styles={{
                  root: {
                    animation: 'fadeInUp 0.8s ease-out 0.2s both'
                  },
                  item: {
                    backgroundColor: 'white',
                    border: '2px solid rgba(196, 213, 70, 0.3)',
                    borderRadius: '20px',
                    marginBottom: '1rem',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(54, 71, 91, 0.08)',
                    transition: 'all 0.3s ease',
                    '&[data-active]': {
                      borderColor: 'rgb(196, 213, 70)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 20px 40px rgba(54, 71, 91, 0.12)'
                    }
                  },
                  control: {
                    padding: '2rem',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'rgb(54, 71, 91)',
                    '&:hover': {
                      backgroundColor: 'rgba(196, 213, 70, 0.05)'
                    }
                  },
                  content: {
                    padding: '0 2rem 2rem 2rem',
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    color: 'rgb(80, 80, 80)'
                  },
                  chevron: {
                    color: 'rgb(196, 213, 70)',
                    width: '24px',
                    height: '24px'
                  }
                }}
              >
                <Accordion.Item value="trial-period">
                  <Accordion.Control>¿Puedo solicitar un período de prueba?</Accordion.Control>
                  <Accordion.Panel>
                    <Text>
                      Así es, al momento de ser un nuevo usuario, se te brinda un <strong>período de prueba de 15 días</strong> para que 
                      conozcas la plataforma, te puedas familiarizar y estructures los espacios que te servirán para tu 
                      estudio y desarrollo al ENARM.
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="educational-material">
                  <Accordion.Control>¿Qué aval tiene el material educativo?</Accordion.Control>
                  <Accordion.Panel>
                    <Text>
                      Ofrecemos material educativo basado en las <strong>guías oficiales</strong> de ediciones anteriores del 
                      ENARM. De la misma manera, buscamos asesoramiento con especialistas y alianzas con 
                      instituciones que nos permitan generar todo el contenido necesario para una preparación más 
                      completa, integral, interactiva y propositiva a tu perfil.
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="platform-access">
                  <Accordion.Control>¿Cómo accedo a la plataforma después de suscribirme?</Accordion.Control>
                  <Accordion.Panel>
                    <Text>
                      Una vez completado tu registro y pago, recibirás inmediatamente tus credenciales de acceso por email. 
                      Podrás acceder desde cualquier dispositivo las <strong>24 horas del día, 7 días a la semana</strong>.
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="support">
                  <Accordion.Control>¿Qué tipo de soporte técnico ofrecen?</Accordion.Control>
                  <Accordion.Panel>
                    <Text>
                      Contamos con un equipo de soporte dedicado disponible por email, chat en vivo y videollamadas. 
                      Los usuarios Premium tienen acceso a <strong>soporte prioritario 24/7</strong> con tiempo de respuesta 
                      menor a 2 horas.
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Stack>
          </Container>
        </div>


        {/* Footer */}
        <div 
          style={{
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            background: 'rgb(54, 71, 91)',
            color: 'white',
            padding: '4rem 0 2rem 0'
          }}
        >
          <Container size="lg">
            <Stack gap={50}>
              {/* Main Footer Content */}
              <Grid>
                {/* Logo and Company Info - Left Side */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Stack gap="lg">
                    <Group align="flex-start" gap="md">
                      <Image 
                        src={enarmLogo} 
                        alt="ENARM360 Logo" 
                        height={60}
                        fit="contain"
                        style={{ borderRadius: '8px' }}
                      />
                    </Group>
                    <Text size="lg" fw={500} c="rgba(255, 255, 255, 0.9)" style={{ lineHeight: 1.6 }}>
                      El futuro de la medicina empieza con tu preparación hoy.
                    </Text>
                    <Text size="md" c="rgba(255, 255, 255, 0.7)" style={{ lineHeight: 1.7 }}>
                      Plataforma líder en preparación para el ENARM, con más de 15,000 reactivos 
                      actualizados y herramientas de última tecnología para tu éxito.
                    </Text>
                  </Stack>
                </Grid.Col>

                {/* Contact Info - Center */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Stack gap="lg">
                    <Text size="xl" fw={700} c="white" style={{ letterSpacing: '0.02em' }}>
                      Contacto
                    </Text>
                    <Stack gap="md">
                      <div>
                        <Text size="sm" fw={600} c="rgba(196, 213, 70, 1)" tt="uppercase" 
                              style={{ letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                          Email
                        </Text>
                        <Text c="rgba(255, 255, 255, 0.9)" fw={500}>
                          enarm360@server.com.mx
                        </Text>
                      </div>
                      
                      <div>
                        <Text size="sm" fw={600} c="rgba(196, 213, 70, 1)" tt="uppercase" 
                              style={{ letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                          Redes Sociales
                        </Text>
                        <Stack gap="xs">
                          <Text c="rgba(255, 255, 255, 0.8)" style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(196, 213, 70)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}>
                            @ENARM360_Instagram
                          </Text>
                          <Text c="rgba(255, 255, 255, 0.8)" style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(196, 213, 70)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}>
                            @ENARM360_Facebook
                          </Text>
                          <Text c="rgba(255, 255, 255, 0.8)" style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(196, 213, 70)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}>
                            @ENARM360_Twitter
                          </Text>
                        </Stack>
                      </div>
                    </Stack>
                  </Stack>
                </Grid.Col>

                {/* Office Info and Quick Links - Right Side */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Stack gap="lg">
                    <Text size="xl" fw={700} c="white" style={{ letterSpacing: '0.02em' }}>
                      Oficinas
                    </Text>
                    <div>
                      <Text size="sm" fw={600} c="rgba(196, 213, 70, 1)" tt="uppercase" 
                            style={{ letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                        Ubicación
                      </Text>
                      <Text c="rgba(255, 255, 255, 0.9)" style={{ lineHeight: 1.7 }}>
                        Boulevard Atlixcáyotl<br />
                        Puebla de Zaragoza, 72810<br />
                        Puebla, México
                      </Text>
                    </div>
                    
                    <div>
                      <Text size="sm" fw={600} c="rgba(196, 213, 70, 1)" tt="uppercase" 
                            style={{ letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                        Enlaces Rápidos
                      </Text>
                      <Stack gap="xs">
                        <Text c="rgba(255, 255, 255, 0.8)" style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                              onClick={() => navigate('/login')}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(196, 213, 70)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}>
                          Iniciar Sesión
                        </Text>
                        <Text c="rgba(255, 255, 255, 0.8)" style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(196, 213, 70)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}>
                          Términos y Condiciones
                        </Text>
                        <Text c="rgba(255, 255, 255, 0.8)" style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(196, 213, 70)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}>
                          Política de Privacidad
                        </Text>
                      </Stack>
                    </div>
                  </Stack>
                </Grid.Col>
              </Grid>

              {/* Divider */}
              <Divider color="rgba(255, 255, 255, 0.2)" />

              {/* Bottom Footer */}
              <Group justify="space-between" align="center" style={{ 
                flexWrap: 'wrap', 
                gap: '1rem',
                '@media (max-width: 768px)': {
                  justifyContent: 'center',
                  textAlign: 'center'
                }
              }}>
                <Stack gap="xs" style={{ flex: 1 }}>
                  <Text size="sm" c="rgba(255, 255, 255, 0.7)" style={{ lineHeight: 1.4 }}>
                    © 2024 ENARM360. Plataforma especializada en simulacros para el 
                    Examen Nacional de Aspirantes a Residencias Médicas.
                  </Text>
                  <Text size="xs" c="rgba(255, 255, 255, 0.5)">
                    Todos los derechos reservados • Hecho con amor para la comunidad médica mexicana
                  </Text>
                </Stack>
                
                <Group gap="md" style={{ alignSelf: 'flex-end' }}>
                  <Badge 
                    variant="light" 
                    color="lime"
                    style={{ 
                      background: 'rgba(196, 213, 70, 0.2)',
                      color: 'rgb(196, 213, 70)',
                      border: '1px solid rgba(196, 213, 70, 0.3)'
                    }}
                  >
                    v1.0.0
                  </Badge>
                </Group>
              </Group>
            </Stack>
          </Container>
        </div>
      </Box>
    </PageTransition>
  );
};

export default LandingPage;