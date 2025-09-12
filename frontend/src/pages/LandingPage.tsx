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
  Image
} from '@mantine/core';
import MedicalButton from '../components/animations/MedicalButton';
import PageTransition from '../components/animations/PageTransition';
import Navbar from '../components/Navbar';
import { IconTrendingUp, IconChecks } from '@tabler/icons-react';
import enarmLogo from '../assets/enarm_logo.png';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();

  return (
    <PageTransition type="medical" duration={800}>
      <Box
        style={{
          minHeight: '100vh',
          background: colorScheme === 'dark' 
            ? 'rgb(54, 71, 91)'
            : 'rgb(246, 248, 250)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: colorScheme === 'dark'
            ? `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'><path d='M 20 0 L 0 0 0 20' fill='none' stroke='%23374151' stroke-width='0.5' opacity='0.2'/></pattern></defs><rect width='100' height='100' fill='url(%23grid)'/></svg>")`
            : `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'><path d='M 20 0 L 0 0 0 20' fill='none' stroke='%23e2e8f0' stroke-width='0.5' opacity='0.3'/></pattern></defs><rect width='100' height='100' fill='url(%23grid)'/></svg>")`,
          opacity: 0.3,
          pointerEvents: 'none'
        }} />

        <Navbar />

        {/* Hero Section */}
        <div style={{ 
          width: '100vw', 
          marginLeft: 'calc(-50vw + 50%)', 
          background: 'rgb(54, 71, 91)', 
          color: 'white',
          padding: '8rem 0',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Container size="lg">
            <Stack gap="xl" align="center" ta="center">
              <Title 
                order={1} 
                size="4.5rem" 
                fw={800}
                c="white"
                style={{ 
                  lineHeight: 1.1,
                  maxWidth: '900px'
                }}
              >
                Aquí comienza el camino de tu especialización
              </Title>
              
              <Text 
                size="xl" 
                c="rgba(255, 255, 255, 0.9)" 
                ta="center" 
                maw={800}
                fw={500}
                style={{ fontSize: '1.4rem', lineHeight: 1.6 }}
              >
                Más de 27 especialidades, simuladores personalizables, medición de progreso, 
                asistencia y recomendaciones con base en tus necesidades.
              </Text>

              <Button 
                size="xl"
                onClick={() => navigate('/login')}
                style={{ 
                  fontSize: '1.2rem',
                  padding: '1.2rem 3rem',
                  backgroundColor: 'rgb(196, 213, 70)',
                  color: 'rgb(54, 71, 91)',
                  border: 'none',
                  fontWeight: 600
                }}
              >
                Conoce Tus Planes
              </Button>
            </Stack>
          </Container>
        </div>

        {/* About Platform Section */}
        <div style={{ 
          width: '100vw', 
          marginLeft: 'calc(-50vw + 50%)', 
          background: 'white',
          padding: '8rem 0'
        }}>
          <Container size="lg">
            <Stack gap="xl" align="center" ta="center">
              <Title order={2} size="3rem" style={{ color: 'rgb(54, 71, 91)' }}>
                Tu preparación, nuestra prioridad
              </Title>
              
              <Text 
                size="lg" 
                c="rgb(100, 100, 100)"
                ta="center" 
                maw={1000}
                style={{ fontSize: '1.2rem', lineHeight: 1.8 }}
              >
                Imagina una plataforma donde cada paso de tu preparación para el ENARM está cuidadosamente diseñado 
                para llevarte al éxito. En ENARM 360, no solo te ofrecemos contenido actualizado y dinámico; te proporcionamos una 
                experiencia de aprendizaje personalizada. Recibe asistencia individualizada, toma exámenes adaptados a tu nivel, y 
                disfruta de clases enfocadas en tu especialidad.
              </Text>

              <Text 
                size="lg" 
                c="rgb(100, 100, 100)"
                ta="center" 
                maw={1000}
                style={{ fontSize: '1.2rem', lineHeight: 1.8 }}
              >
                Con ENARM 360, puedes compartir notas con compañeros, participar en modos competitivos y medir tu progreso en 
                tiempo real. Transforma tu camino hacia la especialización médica con la mejor tecnología y recursos a tu disposición. 
                ¡Únete a ENARM 360 y da el primer paso hacia tu futuro médico!
              </Text>
            </Stack>
          </Container>
        </div>

        {/* Motivational Quotes Section */}
        <div style={{ 
          width: '100vw', 
          marginLeft: 'calc(-50vw + 50%)', 
          background: 'rgb(196, 213, 70)',
          padding: '6rem 0'
        }}>
          <Container size="lg">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={80}>
              <div style={{ textAlign: 'center' }}>
                <Text 
                  size="xl" 
                  fw={700} 
                  ta="center"
                  style={{ 
                    color: 'rgb(54, 71, 91)',
                    fontSize: '2rem',
                    lineHeight: 1.4
                  }}
                >
                  "Haz que cada minuto de estudio cuente."
                </Text>
              </div>

              <div style={{ textAlign: 'center' }}>
                <Text 
                  size="xl" 
                  fw={700} 
                  ta="center"
                  style={{ 
                    color: 'rgb(54, 71, 91)',
                    fontSize: '2rem',
                    lineHeight: 1.4
                  }}
                >
                  "Domina cada tema, conquista cada examen."
                </Text>
              </div>
            </SimpleGrid>
          </Container>
        </div>

        {/* Features Section */}
        <div style={{ 
          width: '100vw', 
          marginLeft: 'calc(-50vw + 50%)', 
          background: 'rgb(248, 250, 252)',
          padding: '8rem 0'
        }}>
          <Container size="lg">
            <Stack gap="xl" align="center" ta="center">
              <Title order={2} ta="center" size="3rem" style={{ color: 'rgb(54, 71, 91)', maxWidth: '1000px' }}>
                Responde nuestros exámenes o genera un compendio personalizado de los temas que más te interesen
              </Title>
              
              <Text 
                size="lg" 
                c="rgb(100, 100, 100)"
                ta="center" 
                maw={1100}
                style={{ fontSize: '1.2rem', lineHeight: 1.8 }}
              >
                Contamos con cada una de las áreas ofertadas dentro del padrón oficial del ENARM, por lo que encontrarás la 
                gama completa de especialidades a las cuáles estés interesado.
              </Text>

              <Text 
                size="lg" 
                c="rgb(100, 100, 100)"
                ta="center" 
                maw={1100}
                style={{ fontSize: '1.2rem', lineHeight: 1.8 }}
              >
                Nuestra plataforma está enfocada en que puedas adaptar cada espacio de tu perfil conforme a tus 
                necesidades, intereses y objetivos.
              </Text>

              <Text 
                size="lg" 
                c="rgb(100, 100, 100)"
                ta="center" 
                maw={1100}
                style={{ fontSize: '1.2rem', lineHeight: 1.8 }}
              >
                Clases grabadas, asesorías en línea, exámenes personalizables, sección de medición de progreso con 
                asistencia y sistema de recomendaciones personal en pro de tu desempeño, libreta digital que puedas 
                compartir con otros usuarios para sesiones de estudio en grupo, entre muchas otras opciones que podrás 
                consultar a lo largo de tu paso en ENARM 360.
              </Text>
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
            <Stack gap="xl">
              <Center>
                <Title order={2} ta="center" size="3rem" style={{ color: 'rgb(54, 71, 91)' }}>
                  Preguntas Frecuentes
                </Title>
              </Center>

              <SimpleGrid cols={{ base: 1, md: 1 }} spacing="xl" maw={900} mx="auto">
                <div 
                  style={{
                    background: 'white',
                    border: '2px solid rgb(54, 71, 91)',
                    borderRadius: '12px',
                    padding: '2rem'
                  }}
                >
                  <Stack gap="md">
                    <Text fw={700} size="lg" style={{ color: 'rgb(54, 71, 91)' }}>
                      ¿PUEDO SOLICITAR UN PERIODO DE PRUEBA?
                    </Text>
                    <Text size="md" c="rgb(100, 100, 100)" style={{ lineHeight: 1.6 }}>
                      Así es, al momento de ser un nuevo usuario, se te brinda un periodo de prueba de 15 días para que 
                      conozcas la plataforma, te puedas familiarizar y estructures los espacios que te servirán para tu 
                      estudio y desarrollo al ENARM.
                    </Text>
                  </Stack>
                </div>

                <div 
                  style={{
                    background: 'white',
                    border: '2px solid rgb(196, 213, 70)',
                    borderRadius: '12px',
                    padding: '2rem'
                  }}
                >
                  <Stack gap="md">
                    <Text fw={700} size="lg" style={{ color: 'rgb(54, 71, 91)' }}>
                      ¿QUÉ AVAL TIENE EL MATERIAL EDUCATIVO?
                    </Text>
                    <Text size="md" c="rgb(100, 100, 100)" style={{ lineHeight: 1.6 }}>
                      Ofrecemos material educativo basado en las guías oficiales de ediciones anteriores del 
                      ENARM, de la misma manera, se busca asesoramiento con especialistas y alianzas con 
                      instituciones que nos permitan generar todo el contenido necesario para una preparación más 
                      completa, integral, interactiva y propositiva a tu perfil.
                    </Text>
                  </Stack>
                </div>
              </SimpleGrid>
            </Stack>
          </Container>
        </div>

        {/* CTA Section */}
        <div style={{ 
          width: '100vw', 
          marginLeft: 'calc(-50vw + 50%)', 
          background: 'white',
          padding: '6rem 0'
        }}>
          <Container size="lg">
            <Stack gap="lg" align="center" ta="center">
              <Title order={2} size="2.5rem" style={{ color: 'rgb(54, 71, 91)' }}>
                ¿Listo para Aprobar el ENARM?
              </Title>
              <Text size="lg" c="rgb(100, 100, 100)" ta="center" maw={600} style={{ fontSize: '1.1rem' }}>
                Únete a miles de médicos que han logrado su especialización con nuestra ayuda. 
                Comienza tu preparación hoy mismo y da el siguiente paso en tu carrera médica.
              </Text>

              <MedicalButton 
                size="lg"
                onClick={() => navigate('/login')}
                rippleEffect={true}
                heartbeatHover={true}
                morphOnClick={true}
                leftSection={<IconTrendingUp size={20} />}
                style={{
                  background: 'rgb(54, 71, 91)',
                  color: 'white',
                  border: 'none'
                }}
              >
                Comenzar Mi Preparación
              </MedicalButton>
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
            <Stack gap="xl">
              {/* Main Footer Content */}
              <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
                {/* Logo and Slogan */}
                <Stack gap="lg">
                  <Group align="center" gap="md">
                    <Image 
                      src={enarmLogo} 
                      alt="ENARM360 Logo" 
                      height={60}
                      fit="contain"
                      style={{ borderRadius: '8px' }}
                    />
                  </Group>
                  <Text size="lg" fw={600} c="white">
                    El futuro de la medicina empieza con tu preparación hoy.
                  </Text>
                </Stack>

                {/* Contact Info */}
                <Stack gap="md">
                  <Text size="xl" fw={700} c="white">
                    Contacto
                  </Text>
                  <Stack gap="xs">
                    <Text c="rgba(255, 255, 255, 0.8)">ENARM360</Text>
                    <Text c="rgba(255, 255, 255, 0.8)">@ENARM360</Text>
                    <Text c="rgba(255, 255, 255, 0.8)">enarm360@server.com.mx</Text>
                  </Stack>
                  
                  <Stack gap="xs" mt="md">
                    <Text fw={600} c="white">Redes Sociales:</Text>
                    <Text c="rgba(255, 255, 255, 0.8)">Instagram</Text>
                    <Text c="rgba(255, 255, 255, 0.8)">Facebook</Text>
                    <Text c="rgba(255, 255, 255, 0.8)">Twitter</Text>
                  </Stack>
                </Stack>

                {/* Office Info */}
                <Stack gap="md">
                  <Text size="xl" fw={700} c="white">
                    Oficinas
                  </Text>
                  <Text c="rgba(255, 255, 255, 0.8)" style={{ lineHeight: 1.6 }}>
                    BOULEVARD ATLIXCÁYOTL.<br />
                    PUEBLA DE ZARAGOZA. 3517
                  </Text>
                </Stack>
              </SimpleGrid>

              {/* Divider */}
              <Divider color="rgba(255, 255, 255, 0.2)" />

              {/* Bottom Footer */}
              <Group justify="space-between" align="center" style={{ flexWrap: 'wrap' }}>
                <Text size="sm" c="rgba(255, 255, 255, 0.7)">
                  © 2024 ENARM360. Plataforma especializada en simulacros para el Examen Nacional de Aspirantes a Residencias Médicas.
                </Text>
                
                <Group gap="xs">
                  <Text size="sm" c="rgba(255, 255, 255, 0.7)">Versión 1.0.0</Text>
                  <Text size="sm" c="rgba(255, 255, 255, 0.7)">•</Text>
                  <Text size="sm" c="rgba(255, 255, 255, 0.7)">Hecho con ❤️ para la comunidad médica</Text>
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