import React, { useState } from 'react';
import {
  Text,
  Title,
  Group,
  Stack,
  useMantineColorScheme,
  Box,
  Card,
  SimpleGrid,
  ThemeIcon,
  Button,
  Badge,
  Table,
  Modal,
  TextInput,
  Textarea,
  Select,
  Radio,
  Switch,
  Pagination,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import PageTransition from '../../components/animations/PageTransition';
import CountUpNumber from '../../components/animations/CountUpNumber';
import {
  IconDatabase,
  IconQuestionMark,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconSearch,
  IconFilter,
  IconDownload,
  IconUpload,
  IconBrain,
  IconStethoscope,
  IconBook,
} from '@tabler/icons-react';

const QuestionDatabasePage: React.FC = () => {
  const [questionModalOpen, setQuestionModalOpen] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [activePage, setActivePage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { colorScheme } = useMantineColorScheme();

  // Datos de ejemplo para preguntas
  const questions = [
    {
      id: 1,
      question: 'A 45-year-old patient presents with chest pain. What is the most appropriate initial diagnostic test?',
      category: 'Cardiology',
      difficulty: 'Intermediate',
      correctAnswer: 'A',
      options: ['ECG', 'Chest X-ray', 'Echocardiogram', 'Cardiac catheterization'],
      explanation: 'ECG is the first-line diagnostic test for acute chest pain.',
      status: 'Published',
      createdAt: '2024-01-15',
      attempts: 1234,
      successRate: 78
    },
    {
      id: 2,
      question: 'Which medication is contraindicated in patients with severe renal impairment?',
      category: 'Nephrology',
      difficulty: 'Advanced',
      correctAnswer: 'A',
      options: ['Metformin', 'Acetaminophen', 'Insulin', 'Lisinopril'],
      explanation: 'Metformin is contraindicated in severe renal impairment due to risk of lactic acidosis.',
      status: 'Published',
      createdAt: '2024-01-14',
      attempts: 987,
      successRate: 65
    },
    {
      id: 3,
      question: 'A pediatric patient presents with fever and rash. What is the most likely diagnosis?',
      category: 'Pediatrics',
      difficulty: 'Beginner',
      correctAnswer: 'B',
      options: ['Meningitis', 'Scarlet fever', 'Pneumonia', 'UTI'],
      explanation: 'The combination of fever and rash in pediatrics often suggests scarlet fever.',
      status: 'Draft',
      createdAt: '2024-01-13',
      attempts: 0,
      successRate: 0
    },
  ];

  const categories = [
    'Cardiology', 'Nephrology', 'Pediatrics', 'Neurology', 'Gastroenterology',
    'Pulmonology', 'Endocrinology', 'Hematology', 'Infectious Disease', 'Surgery'
  ];

  const handleEditQuestion = (question: any) => {
    setSelectedQuestion(question);
    setQuestionModalOpen(true);
  };

  const handleNewQuestion = () => {
    setSelectedQuestion(null);
    setQuestionModalOpen(true);
  };

  return (
    <PageTransition type="medical" duration={800}>
      <>
        <Box
        style={{
          minHeight: '100vh',
          background: colorScheme === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '25.6px', /* 80% of 32px */
        }}
      >
            <Stack gap="lg">
              <Group justify="space-between" align="center">
                <div>
                  <Title order={2} mb="xs" style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                    Question Database
                  </Title>
                  <Text style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#64748b' }}>
                    Manage and organize all ENARM questions and clinical scenarios
                  </Text>
                </div>
                <Group>
                  <Button leftSection={<IconUpload size={16} />} variant="light">
                    Import
                  </Button>
                  <Button leftSection={<IconDownload size={16} />} variant="light">
                    Export
                  </Button>
                  <Button leftSection={<IconPlus size={16} />} onClick={handleNewQuestion}>
                    New Question
                  </Button>
                </Group>
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
                <Card
                  radius="xl"
                  p="lg"
                  style={{
                    backgroundColor: colorScheme === 'dark'
                      ? 'rgba(30, 41, 59, 0.7)'
                      : 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(40px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                    border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
                    boxShadow: colorScheme === 'dark'
                      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                      : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <Group>
                    <ThemeIcon size="xl" variant="light" color="blue" radius="xl">
                      <IconDatabase size={28} />
                    </ThemeIcon>
                    <div>
                      <CountUpNumber
                        value={2847}
                        duration={2500}
                        style={{
                          color: colorScheme === 'dark' ? '#ffffff' : '#1e293b',
                          fontSize: '2rem',
                          fontWeight: 700
                        }}
                      />
                      <Text size="sm" fw={500} style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                        Total Questions
                      </Text>
                    </div>
                  </Group>
                </Card>

                <Card
                  radius="xl"
                  p="lg"
                  style={{
                    backgroundColor: colorScheme === 'dark'
                      ? 'rgba(30, 41, 59, 0.7)'
                      : 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(40px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                    border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
                    boxShadow: colorScheme === 'dark'
                      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                      : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <Group>
                    <ThemeIcon size="xl" variant="light" color="green" radius="xl">
                      <IconQuestionMark size={28} />
                    </ThemeIcon>
                    <div>
                      <CountUpNumber
                        value={2534}
                        duration={2500}
                        style={{
                          color: colorScheme === 'dark' ? '#ffffff' : '#1e293b',
                          fontSize: '2rem',
                          fontWeight: 700
                        }}
                      />
                      <Text size="sm" fw={500} style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                        Published
                      </Text>
                    </div>
                  </Group>
                </Card>

                <Card
                  radius="xl"
                  p="lg"
                  style={{
                    backgroundColor: colorScheme === 'dark'
                      ? 'rgba(30, 41, 59, 0.7)'
                      : 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(40px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                    border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
                    boxShadow: colorScheme === 'dark'
                      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                      : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <Group>
                    <ThemeIcon size="xl" variant="light" color="orange" radius="xl">
                      <IconBrain size={28} />
                    </ThemeIcon>
                    <div>
                      <CountUpNumber
                        value={10}
                        duration={2000}
                        style={{
                          color: colorScheme === 'dark' ? '#ffffff' : '#1e293b',
                          fontSize: '2rem',
                          fontWeight: 700
                        }}
                      />
                      <Text size="sm" fw={500} style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                        Categories
                      </Text>
                    </div>
                  </Group>
                </Card>

                <Card
                  radius="xl"
                  p="lg"
                  style={{
                    backgroundColor: colorScheme === 'dark'
                      ? 'rgba(30, 41, 59, 0.7)'
                      : 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(40px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                    border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
                    boxShadow: colorScheme === 'dark'
                      ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                      : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                  }}
                >
                  <Group>
                    <ThemeIcon size="xl" variant="light" color="violet" radius="xl">
                      <IconStethoscope size={28} />
                    </ThemeIcon>
                    <div>
                      <Text size="xl" fw={700} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                        76.8%
                      </Text>
                      <Text size="sm" fw={500} style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                        Avg Success Rate
                      </Text>
                    </div>
                  </Group>
                </Card>
              </SimpleGrid>

              <Card
                radius="xl"
                p="lg"
                style={{
                  backgroundColor: colorScheme === 'dark'
                    ? 'rgba(30, 41, 59, 0.7)'
                    : 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(40px) saturate(200%)',
                  WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                  border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
                  boxShadow: colorScheme === 'dark'
                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                    : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                }}
              >
                <Group>
                  <TextInput
                    placeholder="Search questions..."
                    leftSection={<IconSearch size={16} />}
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.currentTarget.value)}
                    style={{ flex: 1 }}
                  />
                  <Select
                    placeholder="Category"
                    value={categoryFilter}
                    onChange={(value) => setCategoryFilter(value || 'all')}
                    data={[
                      { value: 'all', label: 'All Categories' },
                      ...categories.map(cat => ({ value: cat.toLowerCase(), label: cat }))
                    ]}
                    style={{ width: '200px' }}
                  />
                  <Button leftSection={<IconFilter size={16} />} variant="light">
                    More Filters
                  </Button>
                </Group>
              </Card>

              <Card
                radius="xl"
                p="xl"
                style={{
                  backgroundColor: colorScheme === 'dark'
                    ? 'rgba(30, 41, 59, 0.7)'
                    : 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(40px) saturate(200%)',
                  WebkitBackdropFilter: 'blur(40px) saturate(200%)',
                  border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
                  boxShadow: colorScheme === 'dark'
                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
                    : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                }}
              >
                <Title order={4} mb="lg" style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                  Questions ({questions.length})
                </Title>

                <Table.ScrollContainer minWidth={800}>
                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>Question</Table.Th>
                        <Table.Th style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>Category</Table.Th>
                        <Table.Th style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>Difficulty</Table.Th>
                        <Table.Th style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>Status</Table.Th>
                        <Table.Th style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>Success Rate</Table.Th>
                        <Table.Th style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {questions.map((question) => (
                        <Table.Tr key={question.id}>
                          <Table.Td style={{ maxWidth: '300px' }}>
                            <Text
                              size="sm"
                              fw={500}
                              style={{
                                color: colorScheme === 'dark' ? '#ffffff' : '#1e293b',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {question.question}
                            </Text>
                            <Text size="xs" style={{ color: colorScheme === 'dark' ? '#cbd5e1' : '#64748b' }}>
                              Created: {question.createdAt}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge variant="light" color="blue">
                              {question.category}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Badge
                              variant="light"
                              color={
                                question.difficulty === 'Beginner' ? 'green' :
                                question.difficulty === 'Intermediate' ? 'orange' : 'red'
                              }
                            >
                              {question.difficulty}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Badge
                              variant="light"
                              color={question.status === 'Published' ? 'green' : 'gray'}
                            >
                              {question.status}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" style={{ color: colorScheme === 'dark' ? '#e2e8f0' : '#64748b' }}>
                              {question.successRate}% ({question.attempts} attempts)
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Group gap="xs">
                              <Tooltip label="View">
                                <ActionIcon variant="light" size="sm">
                                  <IconEye size={14} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Edit">
                                <ActionIcon
                                  variant="light"
                                  size="sm"
                                  onClick={() => handleEditQuestion(question)}
                                >
                                  <IconEdit size={14} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Delete">
                                <ActionIcon variant="light" color="red" size="sm">
                                  <IconTrash size={14} />
                                </ActionIcon>
                              </Tooltip>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>

                <Group justify="center" mt="lg">
                  <Pagination
                    value={activePage}
                    onChange={setActivePage}
                    total={10}
                    color="blue"
                  />
                </Group>
              </Card>
            </Stack>
        </Box>

        <Modal
          opened={questionModalOpen}
          onClose={() => setQuestionModalOpen(false)}
          title={selectedQuestion ? "Edit Question" : "Create New Question"}
          size="xl"
          styles={{
            content: {
              backgroundColor: colorScheme === 'dark'
                ? 'rgba(30, 41, 59, 0.9)'
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
            }
          }}
        >
          <Stack gap="md">
            <Textarea
              label="Question"
              placeholder="Enter the question text..."
              defaultValue={selectedQuestion?.question}
              minRows={3}
            />

            <Group grow>
              <Select
                label="Category"
                placeholder="Select category"
                defaultValue={selectedQuestion?.category}
                data={categories.map(cat => ({ value: cat, label: cat }))}
              />
              <Select
                label="Difficulty"
                placeholder="Select difficulty"
                defaultValue={selectedQuestion?.difficulty}
                data={[
                  { value: 'Beginner', label: 'Beginner' },
                  { value: 'Intermediate', label: 'Intermediate' },
                  { value: 'Advanced', label: 'Advanced' },
                  { value: 'Expert', label: 'Expert' }
                ]}
              />
            </Group>

            <Stack gap="sm">
              <Text fw={500} style={{ color: colorScheme === 'dark' ? '#ffffff' : '#1e293b' }}>
                Answer Options
              </Text>
              {['A', 'B', 'C', 'D'].map((letter, index) => (
                <Group key={letter} gap="md">
                  <Radio
                    value={letter}
                    name="correctAnswer"
                    defaultChecked={selectedQuestion?.correctAnswer === letter}
                  />
                  <TextInput
                    placeholder={`Option ${letter}`}
                    defaultValue={selectedQuestion?.options?.[index]}
                    style={{ flex: 1 }}
                  />
                </Group>
              ))}
            </Stack>

            <Textarea
              label="Explanation"
              placeholder="Explain why this is the correct answer..."
              defaultValue={selectedQuestion?.explanation}
              minRows={3}
            />

            <Group grow>
              <Select
                label="Status"
                defaultValue={selectedQuestion?.status || 'Draft'}
                data={[
                  { value: 'Draft', label: 'Draft' },
                  { value: 'Published', label: 'Published' },
                  { value: 'Archived', label: 'Archived' }
                ]}
              />
            </Group>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={() => setQuestionModalOpen(false)}>
                Cancel
              </Button>
              <Button>
                {selectedQuestion ? 'Update Question' : 'Create Question'}
              </Button>
            </Group>
          </Stack>
        </Modal>
      </>
    </PageTransition>
  );
};

export default QuestionDatabasePage;