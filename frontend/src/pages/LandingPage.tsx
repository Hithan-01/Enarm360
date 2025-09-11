import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Card, 
  Text, 
  Title, 
  Group, 
  Stack, 
  Badge, 
  Button, 
  ThemeIcon,
  SimpleGrid,
  Center,
  useMantineColorScheme,
  Box,
  Divider,
  List,
  Image,
  Anchor
} from '@mantine/core';
import TypewriterText from '../components/animations/TypewriterText';
import MedicalButton from '../components/animations/MedicalButton';
import PageTransition from '../components/animations/PageTransition';
import { 
  IconMedicalCross, 
  IconStethoscope,
  IconBrain,
  IconChartBar,
  IconAward,
  IconUsers,
  IconClock,
  IconShieldCheck,
  IconTrendingUp,
  IconTarget,
  IconBook,
  IconSchool,
  IconChecks,
  IconStar,
  IconDeviceLaptop,
  IconSun,
  IconMoon
} from '@tabler/icons-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const features = [
    {
      icon: IconBrain,
      title: 'Simulacros Inteligentes',
      description: 'Exámenes que se adaptan a tu nivel de conocimiento con preguntas actualizadas del ENARM.',
      color: 'blue'
    },
    {
      icon: IconChartBar,
      title: 'Análisis Detallado',
      description: 'Reportes completos de tu rendimiento con identificación de áreas de oportunidad.',
      color: 'teal'
    },
    {
      icon: IconTarget,
      title: 'Estudio Personalizado',
      description: 'Plan de estudios adaptado a tus fortalezas y debilidades por especialidad médica.',
      color: 'green'
    },
    {
      icon: IconUsers,
      title: 'Comunidad Médica',
      description: 'Conecta con otros aspirantes y comparte experiencias de preparación.',
      color: 'violet'
    },
    {
      icon: IconClock,
      title: 'Disponible 24/7',
      description: 'Estudia cuando quieras, desde donde quieras, con acceso total a la plataforma.',
      color: 'orange'
    },
    {
      icon: IconShieldCheck,
      title: 'Contenido Verificado',
      description: 'Todas nuestras preguntas son revisadas por médicos especialistas certificados.',
      color: 'indigo'
    }
  ];

  const stats = [
    { label: 'Aspirantes Registrados', value: '5,000+', icon: IconUsers, color: 'blue' },
    { label: 'Preguntas Disponibles', value: '15,000+', icon: IconBook, color: 'teal' },
    { label: 'Especialidades Cubiertas', value: '25+', icon: IconMedicalCross, color: 'green' },
    { label: 'Tasa de Aprobación', value: '87%', icon: IconAward, color: 'orange' }
  ];

  const specialties = [
    'Medicina Interna', 'Cirugía General', 'Pediatría', 'Ginecobstetricia',
    'Medicina Familiar', 'Urgencias', 'Anestesiología', 'Radiología',
    'Cardiología', 'Neurología', 'Dermatología', 'Psiquiatría'
  ];

  return (
    <PageTransition type="medical" duration={800}>
      <Box
        style={{
          minHeight: '100vh',
          background: colorScheme === 'dark' 
            ? 'linear-gradient(135deg, #1a1b23 0%, #2d3142 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
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

        {/* Header */}
        <Card 
          withBorder={false}
          mb="xl" 
          p="lg"
          style={{
            background: colorScheme === 'dark' 
              ? 'rgba(30, 30, 40, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderTop: '3px solid #0ea5e9',
            borderBottom: colorScheme === 'dark' 
              ? '1px solid rgba(55, 65, 81, 0.6)'
              : '1px solid rgba(226, 232, 240, 0.6)',
            position: 'sticky',
            top: 0,
            zIndex: 100
          }}
        >
          <Container size="lg">
            <Group justify="space-between" align="center">
              <Group align="center">
                <ThemeIcon size="xl" radius="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                  <IconMedicalCross size={28} />
                </ThemeIcon>
                <div>
                  <Title order={2} size="h1" style={{ 
                    background: 'linear-gradient(135deg, #1e293b 0%, #0ea5e9 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 700
                  }}>
                    ENARM360
                  </Title>
                  <Text size="sm" c="dimmed" fw={500}>
                    Plataforma de Simulación Médica
                  </Text>
                </div>
              </Group>
              
              <Group gap="md">
                <Button
                  variant="subtle"
                  leftSection={colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
                  onClick={toggleColorScheme}
                >
                  {colorScheme === 'dark' ? 'Claro' : 'Oscuro'}
                </Button>
                
                <MedicalButton 
                  variant="outline" 
                  color="blue"
                  onClick={() => navigate('/login')}
                  rippleEffect={true}
                >
                  Iniciar Sesión
                </MedicalButton>
                
                <MedicalButton 
                  variant="filled" 
                  color="blue"
                  onClick={() => navigate('/login')}
                  rippleEffect={true}
                  heartbeatHover={true}
                >
                  Registrarse
                </MedicalButton>
              </Group>
            </Group>
          </Container>
        </Card>

        <Container size="lg" py="xl">
          {/* Hero Section */}
          <Stack gap="xl" mb={80} ta="center">
            <Center>
              <Stack gap="lg" align="center">
                <TypewriterText
                  text="Tu Camino Hacia la Especialización Médica"
                  component="title"
                  order={1}
                  size="h1"
                  speed={80}
                  delay={300}
                  cursor={false}
                  style={{ 
                    textAlign: 'center',
                    fontSize: '3rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                />
                
                <TypewriterText
                  text="Prepárate para el ENARM con la plataforma más completa de simulacros médicos. Más de 15,000 preguntas actualizadas, análisis personalizado y herramientas inteligentes para maximizar tu éxito."
                  component="text"
                  size="xl"
                  speed={30}
                  delay={3000}
                  cursor={false}
                  style={{ 
                    textAlign: 'center', 
                    maxWidth: '800px',
                    color: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'
                  }}
                />
              </Stack>
            </Center>

            <Group justify="center" mt="xl">
              <MedicalButton 
                size="lg"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                onClick={() => navigate('/login')}
                rippleEffect={true}
                heartbeatHover={true}
                morphOnClick={true}
                leftSection={<IconStethoscope size={20} />}
              >
                Comenzar Ahora Gratis
              </MedicalButton>
              
              <MedicalButton 
                size="lg"
                variant="outline"
                color="blue"
                onClick={() => navigate('/login')}
                rippleEffect={true}
                leftSection={<IconDeviceLaptop size={20} />}
              >
                Ver Demo
              </MedicalButton>
            </Group>
          </Stack>

          {/* Stats Section */}
          <SimpleGrid cols={{ base: 2, md: 4 }} spacing="lg" mb={80}>
            {stats.map((stat, index) => (
              <Card 
                key={index}
                withBorder 
                p="lg" 
                radius="lg"
                style={{
                  background: colorScheme === 'dark' 
                    ? 'rgba(30, 30, 40, 0.95)'
                    : 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  textAlign: 'center',
                  border: colorScheme === 'dark' 
                    ? '1px solid rgba(55, 65, 81, 0.6)'
                    : '1px solid rgba(226, 232, 240, 0.6)'
                }}
              >
                <ThemeIcon 
                  size="xl" 
                  radius="xl" 
                  variant="light" 
                  color={stat.color}
                  mx="auto"
                  mb="md"
                >
                  <stat.icon size={28} />
                </ThemeIcon>
                <Text size="xl" fw={700} mb="xs">
                  {stat.value}
                </Text>
                <Text size="sm" c="dimmed" fw={500}>
                  {stat.label}
                </Text>
              </Card>
            ))}
          </SimpleGrid>

          {/* Features Section */}
          <Stack gap="xl" mb={80}>
            <Center>
              <Stack gap="sm" align="center">
                <Title order={2} ta="center" size="h1">
                  ¿Por Qué Elegir ENARM360?
                </Title>
                <Text size="lg" c="dimmed" ta="center" maw={600}>
                  Nuestra plataforma ha sido diseñada específicamente para aspirantes a residencias médicas, 
                  con herramientas avanzadas y contenido actualizado.
                </Text>
              </Stack>
            </Center>

            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  withBorder 
                  p="lg" 
                  radius="lg"
                  style={{
                    background: colorScheme === 'dark' 
                      ? 'rgba(30, 30, 40, 0.95)'
                      : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderLeft: `4px solid ${
                      feature.color === 'blue' ? '#0ea5e9' :
                      feature.color === 'teal' ? '#10b981' :
                      feature.color === 'green' ? '#22c55e' :
                      feature.color === 'violet' ? '#8b5cf6' :
                      feature.color === 'orange' ? '#f59e0b' : '#6366f1'
                    }`,
                    border: colorScheme === 'dark' 
                      ? '1px solid rgba(55, 65, 81, 0.6)'
                      : '1px solid rgba(226, 232, 240, 0.6)',
                    transition: 'transform 0.2s ease',
                    cursor: 'pointer'
                  }}
                  className="hover-lift"
                >
                  <Group align="flex-start">
                    <ThemeIcon 
                      size="lg" 
                      radius="md" 
                      variant="light" 
                      color={feature.color}
                    >
                      <feature.icon size={20} />
                    </ThemeIcon>
                    <Stack gap="xs" style={{ flex: 1 }}>
                      <Text fw={600} size="md">
                        {feature.title}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {feature.description}
                      </Text>
                    </Stack>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Stack>

          {/* Specialties Section */}
          <Stack gap="xl" mb={80}>
            <Center>
              <Stack gap="sm" align="center">
                <Title order={2} ta="center">
                  Especialidades Disponibles
                </Title>
                <Text size="lg" c="dimmed" ta="center" maw={600}>
                  Cubre todas las áreas del conocimiento médico con preguntas actualizadas y casos clínicos reales.
                </Text>
              </Stack>
            </Center>

            <Card 
              withBorder 
              p="xl" 
              radius="lg"
              style={{
                background: colorScheme === 'dark' 
                  ? 'rgba(30, 30, 40, 0.95)'
                  : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: colorScheme === 'dark' 
                  ? '1px solid rgba(55, 65, 81, 0.6)'
                  : '1px solid rgba(226, 232, 240, 0.6)'
              }}
            >
              <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
                {specialties.map((specialty, index) => (
                  <Badge 
                    key={index}
                    size="lg" 
                    variant="light" 
                    color={['blue', 'teal', 'green', 'violet', 'orange', 'indigo'][index % 6]}
                    style={{ textTransform: 'none' }}
                  >
                    {specialty}
                  </Badge>
                ))}
              </SimpleGrid>
            </Card>
          </Stack>

          {/* CTA Section */}
          <Card 
            withBorder 
            p="xl" 
            radius="lg"
            mb={40}
            style={{
              background: colorScheme === 'dark' 
                ? 'linear-gradient(135deg, rgba(30, 30, 40, 0.95), rgba(45, 49, 66, 0.95))'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))',
              backdropFilter: 'blur(20px)',
              border: colorScheme === 'dark' 
                ? '1px solid rgba(55, 65, 81, 0.6)'
                : '1px solid rgba(226, 232, 240, 0.6)',
              textAlign: 'center'
            }}
          >
            <Stack gap="lg" align="center">
              <ThemeIcon size={60} radius="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                <IconAward size={36} />
              </ThemeIcon>
              
              <Stack gap="sm" align="center">
                <Title order={2}>
                  ¿Listo para Aprobar el ENARM?
                </Title>
                <Text size="lg" c="dimmed" maw={600}>
                  Únete a miles de médicos que han logrado su especialización con nuestra ayuda. 
                  Comienza tu preparación hoy mismo y da el siguiente paso en tu carrera médica.
                </Text>
              </Stack>

              <Group justify="center">
                <MedicalButton 
                  size="lg"
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan' }}
                  onClick={() => navigate('/login')}
                  rippleEffect={true}
                  heartbeatHover={true}
                  morphOnClick={true}
                  leftSection={<IconTrendingUp size={20} />}
                >
                  Comenzar Mi Preparación
                </MedicalButton>
              </Group>
            </Stack>
          </Card>

          {/* Footer */}
          <Divider mb="xl" />
          
          <Stack gap="md" align="center">
            <Group align="center" gap="md">
              <ThemeIcon size="lg" radius="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                <IconMedicalCross size={20} />
              </ThemeIcon>
              <div style={{ textAlign: 'center' }}>
                <Text fw={700} size="lg" style={{ 
                  background: 'linear-gradient(135deg, #1e293b 0%, #0ea5e9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  ENARM360
                </Text>
                <Text size="sm" c="dimmed">Tu Plataforma de Preparación Médica</Text>
              </div>
            </Group>
            
            <Text size="xs" c="dimmed" ta="center">
              © 2024 ENARM360. Plataforma especializada en simulacros para el Examen Nacional de Aspirantes a Residencias Médicas.
            </Text>
            
            <Group gap="xs">
              <Text size="xs" c="dimmed">Versión 1.0.0</Text>
              <Text size="xs" c="dimmed">•</Text>
              <Text size="xs" c="dimmed">Hecho con ❤️ para la comunidad médica</Text>
            </Group>
          </Stack>
        </Container>
      </Box>
    </PageTransition>
  );
};

export default LandingPage;