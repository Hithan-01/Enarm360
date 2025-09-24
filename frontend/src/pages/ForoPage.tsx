import React, { useMemo, useState } from 'react';
import {
  Box,
  Title,
  Text,
  Group,
  Stack,
  Badge,
  Button,
  TextInput,
  ActionIcon,
  useMantineColorScheme,
  Avatar,
  Divider,
} from '@mantine/core';
import { IconMessages, IconPlus, IconSearch, IconMessage2 } from '@tabler/icons-react';

interface Topic {
  id: string;
  title: string;
  author: string;
  avatarColor?: string;
  replies: number;
  views: number;
  lastActivity: string;
  tags: string[];
}

const mockTopics: Topic[] = [
  {
    id: 't1',
    title: 'Mejores estrategias para preguntas de Cardiología',
    author: 'Ana Martínez',
    avatarColor: '#10b981',
    replies: 24,
    views: 412,
    lastActivity: 'hace 2 h',
    tags: ['Cardiología', 'Estrategia'],
  },
  {
    id: 't2',
    title: 'Casos clínicos tipo ENARM: ¿cómo abordarlos?',
    author: 'Luis Pérez',
    avatarColor: '#0ea5e9',
    replies: 15,
    views: 298,
    lastActivity: 'hace 5 h',
    tags: ['Casos Clínicos', 'Tips'],
  },
  {
    id: 't3',
    title: 'Recursos gratuitos recomendados para Pediatría',
    author: 'María González',
    avatarColor: '#f59e0b',
    replies: 9,
    views: 180,
    lastActivity: 'ayer',
    tags: ['Pediatría', 'Recursos'],
  },
];

const ForoPage: React.FC = () => {
  const { colorScheme } = useMantineColorScheme();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockTopics;
    return mockTopics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.author.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <Box
      style={{
        flex: 1,
        padding: '16px 48px',
        overflow: 'hidden',
        overflowY: 'auto',
      }}
    >
      {/* Encabezado de página */}
      <Box mb="xl" ta="left">
        <Group gap="sm" align="center">
          <Box
            style={{
              backgroundColor:
                colorScheme === 'dark' ? 'rgba(14, 165, 233, 0.2)' : 'rgba(14, 165, 233, 0.12)',
              padding: 12,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconMessages size={22} style={{ color: '#0ea5e9' }} />
          </Box>
          <Stack gap={2}>
            <Title
              order={2}
              size="1.5rem"
              fw={600}
              style={{
                color: colorScheme === 'dark' ? '#e2e8f0' : '#1e293b',
                fontFamily: 'Space Grotesk, Inter, sans-serif',
                marginBottom: 0,
              }}
            >
              Foro
            </Title>
            <Text
              size="sm"
              style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b', fontFamily: 'Inter, sans-serif' }}
            >
              Comparte y aprende con la comunidad ENARM360
            </Text>
          </Stack>
          <Box style={{ flex: 1 }} />
          {/* Botón crear tema - placeholder */}
          <Button
            leftSection={<IconPlus size={16} />}
            styles={{
              root: {
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              },
            }}
          >
            Crear tema
          </Button>
        </Group>
      </Box>

      {/* Buscador */}
      <Box mb="md" style={{ maxWidth: 520 }}>
        <TextInput
          placeholder="Buscar temas, autores o etiquetas"
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          leftSection={<IconSearch size={16} />}
          styles={{
            input: {
              backgroundColor:
                colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(247, 243, 238, 0.9)',
              border:
                colorScheme === 'dark'
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : '1px solid rgba(221, 216, 209, 0.8)',
              borderRadius: 12,
            },
          }}
        />
      </Box>

      {/* Lista de temas */}
      <Stack gap="sm">
        {filtered.map((topic) => (
          <Box
            key={topic.id}
            p="md"
            style={{
              backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(247, 243, 238, 0.9)',
              border: `1px solid ${
                colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'
              }`,
              borderRadius: 16,
              transition: 'transform .2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}
          >
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Group align="flex-start" gap="sm" wrap="nowrap">
                <Avatar radius="xl" size={36} style={{ backgroundColor: topic.avatarColor || '#64748b' }}>
                  {topic.author.charAt(0)}
                </Avatar>
                <Stack gap={4} style={{ minWidth: 0 }}>
                  <Group gap={8} wrap="wrap">
                    <Text fw={600} size="sm" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#1f2937' }}>
                      {topic.title}
                    </Text>
                    {topic.tags.map((tag) => (
                      <Badge key={tag} size="xs" variant="light" color="blue" radius="sm">
                        {tag}
                      </Badge>
                    ))}
                  </Group>
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                    Por {topic.author} • Última actividad {topic.lastActivity}
                  </Text>
                </Stack>
              </Group>

              <Group gap="lg" wrap="nowrap" align="center">
                <Group gap={4}>
                  <IconMessage2 size={16} style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }} />
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#2d2a26' }}>
                    {topic.replies}
                  </Text>
                </Group>
                <Divider orientation="vertical" style={{ opacity: 0.3 }} />
                <Group gap={4}>
                  <Text size="xs" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
                    {topic.views} vistas
                  </Text>
                </Group>
              </Group>
            </Group>
          </Box>
        ))}

        {filtered.length === 0 && (
          <Box
            p="xl"
            style={{
              backgroundColor: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(247, 243, 238, 0.9)',
              border: `1px solid ${
                colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(221, 216, 209, 0.8)'
              }`,
              borderRadius: 16,
              textAlign: 'center',
            }}
          >
            <Text size="sm" style={{ color: colorScheme === 'dark' ? '#94a3b8' : '#64748b' }}>
              No se encontraron resultados para "{query}".
            </Text>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default ForoPage;
