import React, { useState } from 'react';
import {
  Text,
  Title,
  Stack,
  useMantineColorScheme,
  Box,
  SimpleGrid,
  Card,
  Group,
  RingProgress,
  Progress,
  Tabs,
  Badge,
  Alert,
  ThemeIcon,
} from '@mantine/core';
import {
  IconChartBar,
  IconTarget,
  IconUsers,
  IconAlertTriangle,
  IconBulb,
  IconTrophy,
  IconBrain,
  IconArrowUp,
  IconArrowDown,
  IconFlame,
  IconStar,
  IconChevronRight,
  IconTrendingUp,
  IconTrendingDown,
} from '@tabler/icons-react';

const EstadisticasPage: React.FC = () => {
  const { colorScheme } = useMantineColorScheme();
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Datos simulados más realistas y detallados
  const performanceData = {
    overall: {
      score: 87.3,
      percentile: 95,
      improvement: 15.7,
      streak: 12,
      totalHours: 127,
      questionsAnswered: 2847,
      accuracy: 78.5
    },
    weeklyProgress: [
      { week: 'Sem 1', score: 72, hours: 8, questions: 156 },
      { week: 'Sem 2', score: 76, hours: 12, questions: 234 },
      { week: 'Sem 3', score: 82, hours: 15, questions: 312 },
      { week: 'Sem 4', score: 87, hours: 18, questions: 398 }
    ],
    predictions: {
      enarmProbability: 92,
      projectedScore: 89.2,
      hoursToGoal: 23,
      questionsNeeded: 450
    },
    subjects: [
      { name: 'Medicina Interna', score: 91, questions: 623, color: '#10b981' },
      { name: 'Cirugía', score: 78, questions: 445, color: '#3b82f6' },
      { name: 'Pediatría', score: 94, questions: 456, color: '#8b5cf6' },
      { name: 'Ginecología', score: 89, questions: 234, color: '#f59e0b' },
      { name: 'Neurología', score: 61, questions: 234, color: '#ef4444' },
      { name: 'Cardiología', score: 85, questions: 312, color: '#06b6d4' }
    ]
  };

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Box
        style={{
          padding: '16px 32px',
          overflow: 'hidden',
          overflowY: 'auto',
          flex: 1,
          width: '100%',
        }}
      >
        {/* Page Header */}
        <Box mb="xs" ta="left">
          <Title
            order={3}
            size="1.1rem"
            fw={600}
            ta="left"
            style={{
              color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
              fontFamily: 'Space Grotesk, Inter, sans-serif',
              marginBottom: '2px',
            }}
          >
            Analytics de Rendimiento
          </Title>
          <Text
            size="xs"
            ta="left"
            style={{
              color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
            }}
          >
            Análisis profundo con insights accionables para tu preparación ENARM
          </Text>
        </Box>

        {/* Main Layout - Grid Template Style */}
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'auto auto auto auto',
            gap: '16px',
            height: 'calc(100vh - 140px)',
            width: '100%',
            maxWidth: 'none',
            minWidth: 0,
          }}
        >
          {/* Card 1: Puntuación Total */}
          <Card
            padding="sm"
            radius="md"
            style={{
              gridColumn: '1',
              gridRow: '1',
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(255, 255, 255, 0.9)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            }}
          >
            <Stack gap="xs" h="100%">
              <Group justify="space-between" align="flex-start">
                <Text size="xs" fw={600} ta="left" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                  Puntuación Total
                </Text>
                <Group gap={2} align="center">
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#64748b' : '#94a3b8', fontSize: '10px' }}>Ver más</Text>
                  <IconChevronRight size={12} style={{ color: colorScheme === 'dark' ? '#64748b' : '#94a3b8' }} />
                </Group>
              </Group>
              <Text
                size="xl"
                fw={700}
                style={{
                  color: '#10b981',
                  fontFamily: 'Space Grotesk',
                  lineHeight: 1,
                }}
              >
                {performanceData.overall.score}%
              </Text>
              <Badge variant="light" color="green" size="xs">+{performanceData.overall.improvement}%</Badge>
            </Stack>
          </Card>

          {/* Card 2: Precisión */}
          <Card
            padding="sm"
            radius="md"
            style={{
              gridColumn: '2',
              gridRow: '1',
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(255, 255, 255, 0.9)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            }}
          >
            <Stack gap="xs" h="100%">
              <Group justify="space-between" align="flex-start">
                <Text size="xs" fw={600} ta="left" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                  Probabilidad ENARM
                </Text>
                <Group gap={2} align="center">
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#64748b' : '#94a3b8', fontSize: '10px' }}>Ver más</Text>
                  <IconChevronRight size={12} style={{ color: colorScheme === 'dark' ? '#64748b' : '#94a3b8' }} />
                </Group>
              </Group>
              <Text
                size="xl"
                fw={700}
                style={{
                  color: '#10b981',
                  fontFamily: 'Space Grotesk',
                  lineHeight: 1,
                }}
              >
                {performanceData.predictions.enarmProbability}%
              </Text>
              <Badge variant="light" color="green" size="xs">Proyección</Badge>
            </Stack>
          </Card>

          {/* Card 3: Probabilidad ENARM */}
          <Card
            padding="sm"
            radius="md"
            style={{
              gridColumn: '3',
              gridRow: '1 / 3',
              height: '160px',
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(255, 255, 255, 0.9)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            }}
          >
            <Stack gap="xs" h="100%">
              <Group justify="space-between" align="flex-start">
                <Text size="xs" fw={600} ta="left" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                  Precisión
                </Text>
                <Group gap={2} align="center">
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#64748b' : '#94a3b8', fontSize: '10px' }}>Ver más</Text>
                  <IconChevronRight size={12} style={{ color: colorScheme === 'dark' ? '#64748b' : '#94a3b8' }} />
                </Group>
              </Group>
              <Box style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1
              }}>
                {/* Diana de Precisión */}
                <Box style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Círculos concéntricos de la diana */}
                  <svg width="90" height="90" viewBox="0 0 90 90" style={{ position: 'absolute' }}>
                    {/* Círculo exterior - Blanco */}
                    <circle
                      cx="45"
                      cy="45"
                      r="42"
                      fill="#ffffff"
                      stroke="#000000"
                      strokeWidth="1"
                    />
                    {/* Círculo negro */}
                    <circle
                      cx="45"
                      cy="45"
                      r="32"
                      fill="#000000"
                      stroke="none"
                    />
                    {/* Círculo blanco */}
                    <circle
                      cx="45"
                      cy="45"
                      r="24"
                      fill="#ffffff"
                      stroke="none"
                    />
                    {/* Círculo azul */}
                    <circle
                      cx="45"
                      cy="45"
                      r="16"
                      fill="#3b82f6"
                      stroke="none"
                    />
                    {/* Círculo rojo */}
                    <circle
                      cx="45"
                      cy="45"
                      r="8"
                      fill="#ef4444"
                      stroke="none"
                    />
                    {/* Centro dorado */}
                    <circle
                      cx="45"
                      cy="45"
                      r="3"
                      fill="#fbbf24"
                      stroke="none"
                    />

                    {/* Flecha apuntando según la precisión */}
                    {(() => {
                      const accuracy = performanceData.overall.accuracy;
                      // Calcular la distancia del centro basada en la precisión
                      // 100% = centro (radio 0), 0% = borde exterior (radio 42)
                      const maxRadius = 38; // Radio máximo donde puede estar la flecha
                      const distance = maxRadius * (1 - (accuracy / 100));
                      // Ángulo fijo hacia arriba
                      const angle = -Math.PI / 2; // -90 grados (apuntando hacia arriba)
                      const x = 45 + distance * Math.cos(angle);
                      const y = 45 + distance * Math.sin(angle);

                      return (
                        <g>
                          {/* Sombra de la flecha para dar profundidad */}
                          <ellipse
                            cx={x - 2}
                            cy={y + 2}
                            rx="12"
                            ry="2"
                            fill="rgba(0,0,0,0.15)"
                          />

                          {/* Cuerpo de la flecha en perspectiva */}
                          <polygon
                            points={`${x - 18},${y - 2} ${x - 18},${y + 2} ${x + 2},${y + 1} ${x + 2},${y - 1}`}
                            fill="#d97706"
                            stroke="#b45309"
                            strokeWidth="0.5"
                          />

                          {/* Gradiente de profundidad en el cuerpo */}
                          <polygon
                            points={`${x - 18},${y - 2} ${x + 2},${y - 1} ${x + 2},${y} ${x - 18},${y - 1}`}
                            fill="#f59e0b"
                          />
                          <polygon
                            points={`${x - 18},${y + 1} ${x + 2},${y} ${x + 2},${y + 1} ${x - 18},${y + 2}`}
                            fill="#b45309"
                          />

                          {/* Punta metálica de la flecha con perspectiva */}
                          <polygon
                            points={`${x + 2},${y - 1} ${x + 2},${y + 1} ${x + 8},${y}`}
                            fill="#64748b"
                            stroke="#475569"
                            strokeWidth="0.5"
                          />

                          {/* Highlight metálico en 3D */}
                          <polygon
                            points={`${x + 2},${y - 1} ${x + 6},${y - 0.3} ${x + 8},${y} ${x + 6},${y + 0.3} ${x + 2},${y + 1}`}
                            fill="#94a3b8"
                          />
                          <polygon
                            points={`${x + 2},${y - 1} ${x + 6},${y - 0.3} ${x + 7},${y} ${x + 2},${y}`}
                            fill="#cbd5e1"
                          />

                          {/* Empuñadura con perspectiva */}
                          <polygon
                            points={`${x - 20},${y - 1.5} ${x - 20},${y + 1.5} ${x - 18},${y + 2} ${x - 18},${y - 2}`}
                            fill="#92400e"
                            stroke="#78350f"
                            strokeWidth="0.5"
                          />

                          {/* Plumas realistas más grandes */}
                          {/* Pluma superior izquierda */}
                          <polygon
                            points={`${x - 20},${y - 2} ${x - 11},${y - 5} ${x - 9},${y - 3} ${x - 15},${y - 1.5} ${x - 18},${y - 1.8}`}
                            fill="#dc2626"
                            stroke="#b91c1c"
                            strokeWidth="0.5"
                          />
                          {/* Pluma superior derecha */}
                          <polygon
                            points={`${x - 20},${y - 2} ${x - 11},${y - 5.5} ${x - 8},${y - 4} ${x - 14},${y - 2.2} ${x - 17},${y - 2}`}
                            fill="#ef4444"
                            stroke="#dc2626"
                            strokeWidth="0.5"
                          />

                          {/* Pluma inferior izquierda */}
                          <polygon
                            points={`${x - 20},${y + 2} ${x - 11},${y + 5} ${x - 9},${y + 3} ${x - 15},${y + 1.5} ${x - 18},${y + 1.8}`}
                            fill="#dc2626"
                            stroke="#b91c1c"
                            strokeWidth="0.5"
                          />
                          {/* Pluma inferior derecha */}
                          <polygon
                            points={`${x - 20},${y + 2} ${x - 11},${y + 5.5} ${x - 8},${y + 4} ${x - 14},${y + 2.2} ${x - 17},${y + 2}`}
                            fill="#ef4444"
                            stroke="#dc2626"
                            strokeWidth="0.5"
                          />

                          {/* Venas de las plumas para realismo */}
                          <line
                            x1={x - 18}
                            y1={y - 2}
                            x2={x - 10}
                            y2={y - 4.5}
                            stroke="#b91c1c"
                            strokeWidth="0.3"
                          />
                          <line
                            x1={x - 18}
                            y1={y + 2}
                            x2={x - 10}
                            y2={y + 4.5}
                            stroke="#b91c1c"
                            strokeWidth="0.3"
                          />

                          {/* Líneas de detalle en las plumas */}
                          <line
                            x1={x - 16}
                            y1={y - 1.8}
                            x2={x - 11}
                            y2={y - 3.5}
                            stroke="#7f1d1d"
                            strokeWidth="0.2"
                          />
                          <line
                            x1={x - 16}
                            y1={y + 1.8}
                            x2={x - 11}
                            y2={y + 3.5}
                            stroke="#7f1d1d"
                            strokeWidth="0.2"
                          />

                          {/* Punto de impacto brillante con efecto 3D */}
                          <circle
                            cx={x + 8}
                            cy={y}
                            r="2.5"
                            fill="#fbbf24"
                            stroke="#f59e0b"
                            strokeWidth="1"
                          />
                          <circle
                            cx={x + 8.5}
                            cy={y - 0.5}
                            r="1"
                            fill="#fef3c7"
                          />
                          <circle
                            cx={x + 9}
                            cy={y - 1}
                            r="0.3"
                            fill="#ffffff"
                          />
                        </g>
                      );
                    })()}
                  </svg>
                </Box>

                {/* Porcentaje debajo */}
                <Text
                  size="sm"
                  fw={600}
                  style={{
                    color: '#3b82f6',
                    fontFamily: 'Space Grotesk',
                    fontSize: '12px',
                    marginTop: '4px'
                  }}
                >
                  {performanceData.overall.accuracy}%
                </Text>
              </Box>
            </Stack>
          </Card>

          {/* Card 4: Tiempo Total */}
          <Card
            padding="sm"
            radius="md"
            style={{
              gridColumn: '4',
              gridRow: '1 / 3',
              height: '160px',
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(255, 255, 255, 0.9)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            }}
          >
            <Stack gap="xs" h="100%">
              <Group justify="space-between" align="flex-start">
                <Text size="xs" fw={600} ta="left" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                  Tiempo Total
                </Text>
                <Group gap={2} align="center">
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#64748b' : '#94a3b8', fontSize: '10px' }}>Ver más</Text>
                  <IconChevronRight size={12} style={{ color: colorScheme === 'dark' ? '#64748b' : '#94a3b8' }} />
                </Group>
              </Group>
              <Group justify="space-between" align="center">
                <Box>
                  <Box style={{ position: 'relative', width: '90px', height: '90px' }}>
                    <svg width="90" height="90" viewBox="0 0 90 90" style={{ position: 'absolute', left: '-1px' }}>
                      <defs>
                        <mask id="centerMask">
                          <rect width="90" height="90" fill="white"/>
                          <circle cx="45" cy="45" r="28" fill="black"/>
                        </mask>
                      </defs>

                      {/* Círculo base gris */}
                      <circle
                        cx="45"
                        cy="45"
                        r="37"
                        fill="none"
                        stroke={colorScheme === 'dark' ? '#374151' : '#e5e7eb'}
                        strokeWidth="8"
                        mask="url(#centerMask)"
                      />

                      {/* Segmentos de colores - Círculo completo pegado con roundCaps */}
                      {/* Lunes - 16% (AZUL) - Arriba */}
                      <circle
                        cx="45"
                        cy="45"
                        r="37"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`37 195`}
                        strokeDashoffset="0"
                        transform="rotate(-90 45 45)"
                        mask="url(#centerMask)"
                      />

                      {/* Martes - 12% (VERDE) */}
                      <circle
                        cx="45"
                        cy="45"
                        r="37"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`28 204`}
                        strokeDashoffset="-37"
                        transform="rotate(-90 45 45)"
                        mask="url(#centerMask)"
                      />

                      {/* Miércoles - 20% (NARANJA) */}
                      <circle
                        cx="45"
                        cy="45"
                        r="37"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`46 186`}
                        strokeDashoffset="-65"
                        transform="rotate(-90 45 45)"
                        mask="url(#centerMask)"
                      />

                      {/* Jueves - 8% (ROJO) */}
                      <circle
                        cx="45"
                        cy="45"
                        r="37"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`19 213`}
                        strokeDashoffset="-111"
                        transform="rotate(-90 45 45)"
                        mask="url(#centerMask)"
                      />

                      {/* Viernes - 18% (MORADO) */}
                      <circle
                        cx="45"
                        cy="45"
                        r="37"
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`42 190`}
                        strokeDashoffset="-130"
                        transform="rotate(-90 45 45)"
                        mask="url(#centerMask)"
                      />

                      {/* Sábado - 14% (AZUL CLARO) */}
                      <circle
                        cx="45"
                        cy="45"
                        r="37"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`32 200`}
                        strokeDashoffset="-172"
                        transform="rotate(-90 45 45)"
                        mask="url(#centerMask)"
                      />

                      {/* Domingo - 12% (VERDE LIMA) */}
                      <circle
                        cx="45"
                        cy="45"
                        r="37"
                        fill="none"
                        stroke="#84cc16"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`28 204`}
                        strokeDashoffset="-204"
                        transform="rotate(-90 45 45)"
                        mask="url(#centerMask)"
                      />
                    </svg>

                    {/* Texto central */}
                    <Box
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                      }}
                    >
                      <Text ta="center" fw={700} size="md" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                        {performanceData.overall.totalHours}h
                      </Text>
                    </Box>
                  </Box>
                </Box>

                <Stack gap={3} style={{ flex: 1, marginLeft: '12px' }}>
                  <Group gap="xs" align="center">
                    <Box style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
                    <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: '9px' }}>Lunes 16%</Text>
                  </Group>
                  <Group gap="xs" align="center">
                    <Box style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                    <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: '9px' }}>Martes 12%</Text>
                  </Group>
                  <Group gap="xs" align="center">
                    <Box style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                    <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: '9px' }}>Miércoles 20%</Text>
                  </Group>
                  <Group gap="xs" align="center">
                    <Box style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                    <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: '9px' }}>Jueves 8%</Text>
                  </Group>
                  <Group gap="xs" align="center">
                    <Box style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8b5cf6' }} />
                    <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: '9px' }}>Viernes 18%</Text>
                  </Group>
                  <Group gap="xs" align="center">
                    <Box style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06b6d4' }} />
                    <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: '9px' }}>Sábado 14%</Text>
                  </Group>
                  <Group gap="xs" align="center">
                    <Box style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#84cc16' }} />
                    <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: '9px' }}>Domingo 12%</Text>
                  </Group>
                </Stack>
              </Group>
            </Stack>
          </Card>

          {/* Card 5: Gráfica Principal */}
          <Card
            padding="md"
            radius="md"
            style={{
              gridColumn: '1 / 3',
              gridRow: '2',
              height: 'calc(100% - 35px)',
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(255, 255, 255, 0.9)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            }}
          >
            <Stack gap="xs" h="100%">
              <Group justify="space-between" align="flex-start">
                <Text size="xs" fw={600} ta="left" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                  Racha de Estudio
                </Text>
                <Group gap={2} align="center">
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#64748b' : '#94a3b8', fontSize: '10px' }}>Ver más</Text>
                  <IconChevronRight size={12} style={{ color: colorScheme === 'dark' ? '#64748b' : '#94a3b8' }} />
                </Group>
              </Group>
              <Box style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <Stack align="center" gap="xs">
                  <Group justify="center" gap="sm">
                    {[...Array(7)].map((_, i) => (
                      <Stack key={i} align="center" gap="xs">
                        <IconFlame
                          size={24}
                          style={{
                            color: i < 5 ? '#f59e0b' : '#94a3b8',
                            fill: i < 5 ? '#f59e0b' : 'transparent'
                          }}
                        />
                        <Text
                          size="xs"
                          style={{
                            color: i < 5 ? '#f59e0b' : '#94a3b8',
                            fontSize: '10px',
                            fontWeight: i < 5 ? 600 : 400
                          }}
                        >
                          {['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}
                        </Text>
                      </Stack>
                    ))}
                  </Group>
                </Stack>
                <Text
                  size="xs"
                  style={{
                    color: colorScheme === 'dark' ? '#94a3b8' : '#64748b',
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px'
                  }}
                >
                  Record personal: 18 días
                </Text>
              </Box>
            </Stack>
          </Card>

          {/* Card 6: Parámetros de Estudio */}
          <Card
            padding="md"
            radius="md"
            style={{
              gridColumn: '3 / 5',
              gridRow: '2',
              minHeight: '140px',
              marginTop: '60px',
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(255, 255, 255, 0.9)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            }}
          >
            <Stack gap="md">
              <Group justify="space-between" align="flex-start">
                <Text size="xs" fw={600} ta="left" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                  Progreso por especialidad
                </Text>
                <Group gap={2} align="center">
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#64748b' : '#94a3b8', fontSize: '10px' }}>Ver más</Text>
                  <IconChevronRight size={12} style={{ color: colorScheme === 'dark' ? '#64748b' : '#94a3b8' }} />
                </Group>
              </Group>
              <Group justify="center" align="center" gap="xs">
                <Stack align="center" gap="xs">
                  <RingProgress
                    size={65}
                    thickness={7}
                    roundCaps
                    sections={[{ value: 91, color: '#10b981' }]}
                    label={
                      <Stack align="center" gap={1}>
                        <Text ta="center" fw={400} size="xs" style={{ color: '#000000', fontSize: '11px' }}>91%</Text>
                        <IconTrendingUp size={16} style={{ color: '#10b981' }} />
                      </Stack>
                    }
                  />
                  <Text size="xs" ta="center" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: '10px' }}>
                    Medicina Interna
                  </Text>
                </Stack>
                <Stack align="center" gap="xs">
                  <RingProgress
                    size={65}
                    thickness={7}
                    roundCaps
                    sections={[{ value: 78, color: '#3b82f6' }]}
                    label={
                      <Stack align="center" gap={1}>
                        <Text ta="center" fw={400} size="xs" style={{ color: '#000000', fontSize: '11px' }}>78%</Text>
                        <IconTrendingDown size={16} style={{ color: '#ef4444' }} />
                      </Stack>
                    }
                  />
                  <Text size="xs" ta="center" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: '10px' }}>
                    Cirugía
                  </Text>
                </Stack>
                <Stack align="center" gap="xs">
                  <RingProgress
                    size={65}
                    thickness={7}
                    roundCaps
                    sections={[{ value: 94, color: '#8b5cf6' }]}
                    label={
                      <Stack align="center" gap={1}>
                        <Text ta="center" fw={400} size="xs" style={{ color: '#000000', fontSize: '11px' }}>94%</Text>
                        <IconTrendingUp size={16} style={{ color: '#10b981' }} />
                      </Stack>
                    }
                  />
                  <Text size="xs" ta="center" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: '10px' }}>
                    Pediatría
                  </Text>
                </Stack>
                <Stack align="center" gap="xs">
                  <RingProgress
                    size={65}
                    thickness={7}
                    roundCaps
                    sections={[{ value: 89, color: '#f59e0b' }]}
                    label={
                      <Stack align="center" gap={1}>
                        <Text ta="center" fw={400} size="xs" style={{ color: '#000000', fontSize: '11px' }}>89%</Text>
                        <IconTrendingUp size={16} style={{ color: '#10b981' }} />
                      </Stack>
                    }
                  />
                  <Text size="xs" ta="center" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: '10px' }}>
                    Ginecología
                  </Text>
                </Stack>
                <Stack align="center" gap="xs">
                  <RingProgress
                    size={65}
                    thickness={7}
                    roundCaps
                    sections={[{ value: 61, color: '#ef4444' }]}
                    label={
                      <Stack align="center" gap={1}>
                        <Text ta="center" fw={400} size="xs" style={{ color: '#000000', fontSize: '11px' }}>61%</Text>
                        <IconTrendingDown size={16} style={{ color: '#ef4444' }} />
                      </Stack>
                    }
                  />
                  <Text size="xs" ta="center" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontSize: '10px' }}>
                    Neurología
                  </Text>
                </Stack>
              </Group>
            </Stack>
          </Card>

          {/* Card 7: Racha */}
          <Card
            padding="md"
            radius="md"
            style={{
              gridColumn: '3',
              gridRow: '3',
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(255, 255, 255, 0.9)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            }}
          >
            <Stack gap="sm" h="100%">
              <Group justify="space-between" align="flex-start">
                <Text size="xs" fw={600} ta="left" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                  Sesiones de Estudio
                </Text>
                <Group gap={2} align="center">
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#64748b' : '#94a3b8', fontSize: '10px' }}>Ver más</Text>
                  <IconChevronRight size={12} style={{ color: colorScheme === 'dark' ? '#64748b' : '#94a3b8' }} />
                </Group>
              </Group>

              <Stack gap="xs">
                <Group justify="space-between" align="center">
                  <Group gap="xs">
                    <IconBrain size={14} style={{ color: '#06b6d4' }} />
                    <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                      Hoy
                    </Text>
                  </Group>
                  <Text size="sm" fw={600} style={{ color: '#06b6d4' }}>
                    3.2h
                  </Text>
                </Group>

                <Group justify="space-between" align="center">
                  <Group gap="xs">
                    <IconStar size={14} style={{ color: '#10b981' }} />
                    <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                      Esta semana
                    </Text>
                  </Group>
                  <Text size="sm" fw={600} style={{ color: '#10b981' }}>
                    18.5h
                  </Text>
                </Group>

                <Group justify="space-between" align="center">
                  <Group gap="xs">
                    <IconTrophy size={14} style={{ color: '#f59e0b' }} />
                    <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                      Total
                    </Text>
                  </Group>
                  <Text size="sm" fw={600} style={{ color: '#f59e0b' }}>
                    {performanceData.overall.totalHours}h
                  </Text>
                </Group>
              </Stack>

              <Text size="xs" ta="center" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                +2.1h vs. semana pasada
              </Text>
            </Stack>
          </Card>

          {/* Card 8: Meta y Progreso */}
          <Card
            padding="md"
            radius="md"
            style={{
              gridColumn: '4',
              gridRow: '3',
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(255, 255, 255, 0.9)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            }}
          >
            <Stack gap="sm">
              <Group justify="space-between" align="flex-start">
                <Text size="xs" fw={600} ta="left" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                  Meta y Progreso
                </Text>
                <Group gap={2} align="center">
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#64748b' : '#94a3b8', fontSize: '10px' }}>Ver más</Text>
                  <IconChevronRight size={12} style={{ color: colorScheme === 'dark' ? '#64748b' : '#94a3b8' }} />
                </Group>
              </Group>
              <Group justify="space-between">
                <Group gap="xs">
                  <IconTarget size={16} style={{ color: '#8b5cf6' }} />
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                    Meta 90%
                  </Text>
                </Group>
                <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                  Faltan {performanceData.predictions.hoursToGoal}h
                </Text>
              </Group>
              <Progress value={87.3 / 90 * 100} size="md" color="violet" />
              <Group justify="space-between" mt="xs">
                <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                  Progreso actual: {performanceData.overall.score}%
                </Text>
                <Text size="xs" fw={600} style={{ color: '#8b5cf6' }}>
                  96.9%
                </Text>
              </Group>
            </Stack>
          </Card>

          {/* Card 9: Progreso Semanal */}
          <Card
            padding="md"
            radius="md"
            style={{
              gridColumn: '1 / 3',
              gridRow: '3 / 4',
              height: 'calc(100% + 35px)',
              marginTop: '-36px',
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(255, 255, 255, 0.9)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            }}
          >
            <Stack gap="sm">
              <Group justify="space-between" align="flex-start">
                <Text size="xs" fw={600} ta="left" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b' }}>
                  Progreso Semanal ENARM
                </Text>
                <Group gap={2} align="center">
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#64748b' : '#94a3b8', fontSize: '10px' }}>Ver más</Text>
                  <IconChevronRight size={12} style={{ color: colorScheme === 'dark' ? '#64748b' : '#94a3b8' }} />
                </Group>
              </Group>
              <Badge variant="light" color="blue" size="xs" style={{ alignSelf: 'flex-start' }}>Últimas 4 semanas</Badge>

              {/* Gráfico de líneas simulado */}
              <Box style={{ height: '120px', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 300 120">
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8"/>
                    </linearGradient>
                    <linearGradient id="accuracyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/>
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8"/>
                    </linearGradient>
                  </defs>

                  {/* Grid lines */}
                  {[30, 60, 90].map((y, i) => (
                    <line
                      key={i}
                      x1="20"
                      y1={y}
                      x2="280"
                      y2={y}
                      stroke={colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                      strokeWidth="1"
                    />
                  ))}

                  {/* Línea 1 - Puntuación promedio */}
                  <path
                    d="M 40 85 Q 80 75, 120 60 Q 160 55, 200 45 Q 240 40, 260 35"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="3"
                  />

                  {/* Línea 2 - Precisión */}
                  <path
                    d="M 40 90 Q 80 85, 120 75 Q 160 70, 200 60 Q 240 55, 260 50"
                    fill="none"
                    stroke="url(#accuracyGradient)"
                    strokeWidth="3"
                  />

                  {/* Puntos de datos */}
                  {[40, 120, 200, 260].map((x, i) => (
                    <g key={i}>
                      <circle cx={x} cy={85 - i * 12} r="4" fill="#3b82f6"/>
                      <circle cx={x} cy={90 - i * 10} r="4" fill="#10b981"/>
                    </g>
                  ))}

                  {/* Etiquetas de semanas */}
                  {['S1', 'S2', 'S3', 'S4'].map((week, i) => (
                    <text
                      key={i}
                      x={40 + i * 55}
                      y="110"
                      textAnchor="middle"
                      fill={colorScheme === 'dark' ? '#94a3b8' : '#64748b'}
                      fontSize="10"
                      fontFamily="Inter"
                    >
                      {week}
                    </text>
                  ))}
                </svg>
              </Box>

              <Group justify="space-between" mt="xs">
                <Group gap="xs">
                  <Box style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                    Puntuación (72% → 87%)
                  </Text>
                </Group>
                <Group gap="xs">
                  <Box style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                    Precisión (65% → 78%)
                  </Text>
                </Group>
              </Group>
            </Stack>
          </Card>

        </Box>
      </Box>

      {/* Sticky Footer */}
      <Box
        style={{
          borderTop: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.5)'}`,
          textAlign: 'center',
          padding: '1rem',
          backgroundColor: colorScheme === 'dark'
            ? 'rgba(15, 23, 42, 0.8)'
            : 'rgba(247, 243, 238, 0.8)',
          marginTop: 'auto',
        }}
      >
        <Text
          size="xs"
          style={{
            color: colorScheme === 'dark' ? '#94a3b8' : '#5a5550',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          © 2024 ENARM360. Todos los derechos reservados.
        </Text>
      </Box>
    </Box>
  );
};

export default EstadisticasPage;