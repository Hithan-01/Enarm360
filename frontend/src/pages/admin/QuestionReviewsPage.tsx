import React, { useState } from 'react';
import {
  Container,
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
  Textarea,
  Modal,
  Select,
  ScrollArea,
} from '@mantine/core';
import PageTransition from '../../components/animations/PageTransition';
import Sidebar from '../../components/Sidebar';
import TopHeader from '../../components/TopHeader';
import {
  IconClipboardList,
  IconCheck,
  IconX,
  IconEdit,
  IconEye,
  IconClock,
  IconAlertCircle,
} from '@tabler/icons-react';
import { authService } from '../../services/authService';

const QuestionReviewsPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [reviewAction, setReviewAction] = useState<string>('');
  const [reviewComments, setReviewComments] = useState<string>('');
  const { colorScheme } = useMantineColorScheme();
  const user = authService.getCurrentUserFromStorage();

  const handleLogout = () => {
    authService.logout();
  };

  // Datos de ejemplo para preguntas pendientes de revisión
  const pendingQuestions = [
    {
      id: 1,
      question: 'A 65-year-old patient presents with chest pain and shortness of breath. What is the most appropriate initial diagnostic test?',
      submittedBy: 'Dr. Maria Garcia',
      category: 'Cardiology',
      difficulty: 'Intermediate',
      submittedDate: '2024-01-15',
      status: 'Pending',
      options: [
        'ECG',
        'Chest X-ray',
        'Echocardiogram',
        'Cardiac catheterization'
      ],
      correctAnswer: 'ECG',
      explanation: 'ECG is the first-line diagnostic test for acute chest pain to rule out myocardial infarction.'
    },
    {
      id: 2,
      question: 'Which medication is contraindicated in patients with severe renal impairment?',
      submittedBy: 'Dr. Carlos Rodriguez',
      category: 'Nephrology',
      difficulty: 'Advanced',
      submittedDate: '2024-01-14',
      status: 'Needs Correction',
      options: [
        'Metformin',
        'Acetaminophen',
        'Insulin',
        'Lisinopril'
      ],
      correctAnswer: 'Metformin',
      explanation: 'Metformin is contraindicated in severe renal impairment due to risk of lactic acidosis.'
    },
  ];

  const handleReviewQuestion = (question: any) => {
    setSelectedQuestion(question);
    setReviewModalOpen(true);
  };

  const handleSubmitReview = () => {
    // Aquí iría la lógica para enviar la revisión
    console.log('Review submitted:', {
      questionId: selectedQuestion?.id,
      action: reviewAction,
      comments: reviewComments
    });
    setReviewModalOpen(false);
    setReviewComments('');
    setReviewAction('');
  };

  return (
    <PageTransition type="medical" duration={800}>
      <Box
        style={{
          minHeight: '100vh',
          background: colorScheme === 'dark'
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          display: 'flex',
        }}
      >
        {/* Sidebar */}
        <Sidebar
          user={{
            username: user?.username || '',
            email: user?.email || '',
            roles: user?.roles || []
          }}
          onLogout={handleLogout}
          onCollapseChange={setSidebarCollapsed}
        />

        {/* Right Side Container */}
        <Box
          style={{
            marginLeft: sidebarCollapsed ? '80px' : '280px',
            flex: 1,
            transition: 'margin-left 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
          }}
        >
          {/* Top Header */}
          <TopHeader
            user={{
              username: user?.username || '',
              email: user?.email || '',
              roles: user?.roles || [],
              nombre: user?.nombre,
              apellidos: user?.apellidos,
            }}
            onLogout={handleLogout}
            sidebarWidth={0}
          />

          {/* Main Content */}
          <Box
            style={{
              flex: 1,
              padding: '32px',
              overflow: 'hidden',
              overflowY: 'auto',
            }}
          >
            <Stack gap="xl">
              {/* Header */}
              <div>
                <Title order={2} mb="xs">Question Reviews</Title>
                <Text c="dimmed">Review and approve questions submitted by students</Text>
              </div>

              {/* Stats Cards */}
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
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
                      <IconClock size={28} />
                    </ThemeIcon>
                    <div>
                      <Text size="xl" fw={700}>23</Text>
                      <Text size="sm" c="dimmed">Pending Reviews</Text>
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
                      <IconCheck size={28} />
                    </ThemeIcon>
                    <div>
                      <Text size="xl" fw={700}>156</Text>
                      <Text size="sm" c="dimmed">Approved This Month</Text>
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
                    <ThemeIcon size="xl" variant="light" color="red" radius="xl">
                      <IconX size={28} />
                    </ThemeIcon>
                    <div>
                      <Text size="xl" fw={700}>12</Text>
                      <Text size="sm" c="dimmed">Rejected This Month</Text>
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
                    <ThemeIcon size="xl" variant="light" color="yellow" radius="xl">
                      <IconAlertCircle size={28} />
                    </ThemeIcon>
                    <div>
                      <Text size="xl" fw={700}>8</Text>
                      <Text size="sm" c="dimmed">Need Corrections</Text>
                    </div>
                  </Group>
                </Card>
              </SimpleGrid>

              {/* Pending Questions List */}
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
                <Title order={3} mb="lg">Questions Awaiting Review</Title>

                <Stack gap="md">
                  {pendingQuestions.map((question) => (
                    <Card
                      key={question.id}
                      radius="lg"
                      p="lg"
                      style={{
                        backgroundColor: colorScheme === 'dark'
                          ? 'rgba(30, 41, 59, 0.5)'
                          : 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
                      }}
                    >
                      <Stack gap="md">
                        <Group justify="space-between">
                          <Badge
                            color={question.status === 'Pending' ? 'orange' : 'yellow'}
                            variant="light"
                          >
                            {question.status}
                          </Badge>
                          <Text size="sm" c="dimmed">
                            Submitted: {question.submittedDate}
                          </Text>
                        </Group>

                        <Text fw={600} size="md">
                          {question.question}
                        </Text>

                        <Group gap="lg">
                          <Text size="sm" c="dimmed">
                            <strong>Category:</strong> {question.category}
                          </Text>
                          <Text size="sm" c="dimmed">
                            <strong>Difficulty:</strong> {question.difficulty}
                          </Text>
                          <Text size="sm" c="dimmed">
                            <strong>Submitted by:</strong> {question.submittedBy}
                          </Text>
                        </Group>

                        <Group gap="xs" mt="md">
                          <Button
                            variant="light"
                            size="sm"
                            leftSection={<IconEye size={14} />}
                            onClick={() => handleReviewQuestion(question)}
                          >
                            Review
                          </Button>
                          <Button
                            variant="light"
                            color="green"
                            size="sm"
                            leftSection={<IconCheck size={14} />}
                          >
                            Quick Approve
                          </Button>
                          <Button
                            variant="light"
                            color="red"
                            size="sm"
                            leftSection={<IconX size={14} />}
                          >
                            Quick Reject
                          </Button>
                        </Group>
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              </Card>
            </Stack>
          </Box>
        </Box>

        {/* Review Modal */}
        <Modal
          opened={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          title="Review Question"
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
          {selectedQuestion && (
            <Stack gap="md">
              <Card p="md" radius="md" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                <Text fw={600} mb="sm">Question:</Text>
                <Text>{selectedQuestion.question}</Text>
              </Card>

              <Group>
                <Text fw={600}>Options:</Text>
              </Group>
              <Stack gap="xs">
                {selectedQuestion.options?.map((option: string, index: number) => (
                  <Text
                    key={index}
                    style={{
                      padding: '8px',
                      backgroundColor: option === selectedQuestion.correctAnswer
                        ? 'rgba(34, 197, 94, 0.1)'
                        : 'rgba(0,0,0,0.05)',
                      borderRadius: '6px'
                    }}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                    {option === selectedQuestion.correctAnswer && ' ✓'}
                  </Text>
                ))}
              </Stack>

              <Card p="md" radius="md" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                <Text fw={600} mb="sm">Explanation:</Text>
                <Text>{selectedQuestion.explanation}</Text>
              </Card>

              <Select
                label="Review Action"
                placeholder="Select an action"
                value={reviewAction}
                onChange={(value) => setReviewAction(value || '')}
                data={[
                  { value: 'approve', label: 'Approve and Publish' },
                  { value: 'needs_correction', label: 'Needs Corrections' },
                  { value: 'reject', label: 'Reject' }
                ]}
              />

              <Textarea
                label="Comments (Optional)"
                placeholder="Add your review comments here..."
                value={reviewComments}
                onChange={(event) => setReviewComments(event.currentTarget.value)}
                minRows={3}
              />

              <Group justify="flex-end" mt="md">
                <Button variant="light" onClick={() => setReviewModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitReview} disabled={!reviewAction}>
                  Submit Review
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>
      </Box>
    </PageTransition>
  );
};

export default QuestionReviewsPage;