import { useEffect, useState } from 'react';
import { useTask } from '../context/TaskContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Box, Flex, Text, Heading, VStack, HStack,
    Grid, Badge, Button, Input, Textarea, Select
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiHome, FiList, FiCpu, FiLogOut, FiPlus, FiTrash2, FiClock } from 'react-icons/fi';
import Avatar from '../components/Avatar';

const MotionBox = motion(Box);

const Sidebar = ({ user, onLogout }) => (
    <Box w="240px" minH="100vh"
        bg="linear-gradient(180deg, #0a0a2e 0%, #0d0d3e 50%, #0a0a2e 100%)"
        borderRight="1px solid rgba(255,255,255,0.08)"
        position="fixed" left={0} top={0}
        display="flex" flexDirection="column"
        py={6} px={4} zIndex={100}
    >
        <Heading fontSize="xl" fontWeight="900" mb={10} px={3}
            bgGradient="linear(to-r, #7c5cfc, #00e5ff)" bgClip="text">
            MindFlow
        </Heading>
        <VStack spacing={1} align="stretch" flex={1}>
            {[
                { icon: FiHome, label: 'Dashboard', to: '/dashboard' },
                { icon: FiList, label: 'Tareas', to: '/tasks' },
                { icon: FiCpu, label: 'Decisiones', to: '/decisions' },
            ].map((item) => (
                <Link to={item.to} key={item.label}>
                    <Flex align="center" gap={3} px={3} py={3} borderRadius="12px"
                        color="whiteAlpha.600"
                        _hover={{ bg: 'rgba(124,92,252,0.15)', color: 'white' }}
                        transition="all 0.2s"
                        bg={window.location.pathname === item.to ? 'rgba(124,92,252,0.2)' : 'transparent'}
                        style={{ color: window.location.pathname === item.to ? '#7c5cfc' : undefined }}
                    >
                        <Box as={item.icon} size={18} />
                        <Text fontSize="sm" fontWeight="500">{item.label}</Text>
                    </Flex>
                </Link>
            ))}
        </VStack>
        <VStack spacing={2} align="stretch">
            <Flex align="center" gap={3} p={3}
                bg="rgba(255,255,255,0.05)" borderRadius="12px"
                border="1px solid rgba(255,255,255,0.08)">
                <Flex w="36px" h="36px" borderRadius="full"
                    bgGradient="linear(to-r, #7c5cfc, #00e5ff)"
                    align="center" justify="center"
                    fontWeight="700" fontSize="sm" color="white" flexShrink={0}>
                    {user?.username?.charAt(0).toUpperCase()}
                </Flex>
                <Box overflow="hidden">
                    <Text fontSize="sm" fontWeight="600" color="white" isTruncated>{user?.username}</Text>
                    <Text fontSize="xs" color="whiteAlpha.500" isTruncated>{user?.email}</Text>
                </Box>
            </Flex>
            <Flex align="center" gap={3} px={3} py={3} borderRadius="12px"
                color="whiteAlpha.500" cursor="pointer"
                _hover={{ bg: 'rgba(255,77,109,0.1)', color: '#ff4d6d' }}
                transition="all 0.2s" onClick={onLogout}>
                <Box as={FiLogOut} size={18} />
                <Text fontSize="sm" fontWeight="500">Cerrar Sesión</Text>
            </Flex>
        </VStack>
    </Box>
);

const Tasks = () => {
    const { tasks, fetchTasks, createTask, updateTask, deleteTask, loading } = useTask();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        title: '', description: '', priority: 'medium', status: 'pending', deadline: ''
    });

    useEffect(() => { fetchTasks(); }, []);

    const handleLogout = () => { logout(); navigate('/login'); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { ...form };
        if (!data.deadline) delete data.deadline;
        await createTask(data);
        setShowForm(false);
        setForm({ title: '', description: '', priority: 'medium', status: 'pending', deadline: '' });
    };

    const handleStatus = async (task) => {
        const next = task.status === 'pending' ? 'in_progress' : task.status === 'in_progress' ? 'completed' : 'pending';
        await updateTask(task.id, { status: next });
    };

    const priorityColor = { critical: '#ff4d6d', high: '#ffb800', medium: '#7c5cfc', low: '#00e096' };
    const statusColor = { pending: '#7c5cfc', in_progress: '#ffb800', completed: '#00e096' };
    const statusLabel = { pending: '⏳ Pendiente', in_progress: '🔄 En progreso', completed: '✅ Completada' };

    const inputStyle = {
        bg: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        color: 'white',
        _hover: { borderColor: '#7c5cfc' },
        _focus: { borderColor: '#7c5cfc', boxShadow: '0 0 0 1px #7c5cfc' },
        _placeholder: { color: 'whiteAlpha.400' },
    };

    return (
        <Flex minH="100vh" bg="#070711">
            <Sidebar user={user} onLogout={handleLogout} />
            <Box ml="240px" flex={1} p={8}>

                <MotionBox initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} mb={6}>
                    <Flex justify="space-between" align="center">
                        <Box>
                            <Heading fontSize="2xl" fontWeight="800" color="white">📋 Mis Tareas</Heading>
                            <Text color="whiteAlpha.500" mt={1} fontSize="sm">
                                Ordenadas automáticamente por prioridad e importancia
                            </Text>
                        </Box>
                        <Button
                            leftIcon={<FiPlus />}
                            bgGradient="linear(to-r, #7c5cfc, #00e5ff)"
                            color="white" fontWeight="700"
                            borderRadius="12px" px={6}
                            _hover={{ opacity: 0.9, transform: 'translateY(-2px)' }}
                            transition="all 0.2s"
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? 'Cancelar' : 'Nueva Tarea'}
                        </Button>
                    </Flex>
                </MotionBox>

                {showForm && (
                    <MotionBox
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        mb={6}
                    >
                        <Box bg="rgba(255,255,255,0.04)" border="1px solid rgba(124,92,252,0.4)"
                            borderRadius="20px" p={6} backdropFilter="blur(10px)">
                            <Heading fontSize="md" color="white" mb={5}>✨ Nueva Tarea</Heading>
                            <form onSubmit={handleSubmit}>
                                <VStack spacing={4}>
                                    <Input placeholder="Título de la tarea" value={form.title}
                                        onChange={(e) => setForm({...form, title: e.target.value})}
                                        {...inputStyle} required />
                                    <Textarea placeholder="Descripción (opcional)" value={form.description}
                                        onChange={(e) => setForm({...form, description: e.target.value})}
                                        {...inputStyle} rows={3} />
                                    <Grid templateColumns="1fr 1fr" gap={4} w="100%">
                                        <Select value={form.priority}
                                            onChange={(e) => setForm({...form, priority: e.target.value})}
                                            {...inputStyle}>
                                            <option value="low" style={{background:'#0f0f1a'}}>🟢 Baja</option>
                                            <option value="medium" style={{background:'#0f0f1a'}}>🟣 Media</option>
                                            <option value="high" style={{background:'#0f0f1a'}}>🟡 Alta</option>
                                            <option value="critical" style={{background:'#0f0f1a'}}>🔴 Crítica</option>
                                        </Select>
                                        <Input type="datetime-local" value={form.deadline}
                                            onChange={(e) => setForm({...form, deadline: e.target.value})}
                                            {...inputStyle} />
                                    </Grid>
                                    <Button type="submit" w="full" h="48px"
                                        bgGradient="linear(to-r, #7c5cfc, #00e5ff)"
                                        color="white" fontWeight="700" borderRadius="12px"
                                        _hover={{ opacity: 0.9 }}>
                                        Crear Tarea
                                    </Button>
                                </VStack>
                            </form>
                        </Box>
                    </MotionBox>
                )}

                {loading ? (
                    <Flex align="center" justify="center" h="200px">
                        <Text color="whiteAlpha.400">Cargando tareas...</Text>
                    </Flex>
                ) : tasks.length === 0 ? (
                    <Flex align="center" justify="center" h="300px" direction="column" gap={4}>
                        <Text fontSize="4xl">📭</Text>
                        <Text color="whiteAlpha.400" fontSize="lg">No tienes tareas aún</Text>
                        <Button leftIcon={<FiPlus />}
                            bgGradient="linear(to-r, #7c5cfc, #00e5ff)"
                            color="white" borderRadius="12px"
                            onClick={() => setShowForm(true)}>
                            Crear primera tarea
                        </Button>
                    </Flex>
                ) : (
                    <VStack spacing={4} align="stretch">
                        {tasks.map((task, i) => (
                            <MotionBox
                                key={task.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                            >
                                <Box
                                    bg="rgba(255,255,255,0.04)"
                                    border="1px solid rgba(255,255,255,0.08)"
                                    borderRadius="16px" p={5}
                                    backdropFilter="blur(10px)"
                                    opacity={task.status === 'completed' ? 0.6 : 1}
                                    _hover={{ border: '1px solid rgba(124,92,252,0.4)', transform: 'translateY(-2px)' }}
                                    transition="all 0.2s"
                                >
                                    <Flex justify="space-between" align="start" mb={3}>
                                        <HStack spacing={2}>
                                            <Badge
                                                bg={`${priorityColor[task.priority]}20`}
                                                color={priorityColor[task.priority]}
                                                borderRadius="6px" fontSize="xs" px={2} textTransform="capitalize">
                                                {task.priority}
                                            </Badge>
                                            <Badge
                                                bg={`${statusColor[task.status]}20`}
                                                color={statusColor[task.status]}
                                                borderRadius="6px" fontSize="xs" px={2}>
                                                {statusLabel[task.status]}
                                            </Badge>
                                        </HStack>
                                        <HStack>
                                            <Badge bg="rgba(0,229,255,0.1)" color="#00e5ff"
                                                borderRadius="6px" fontSize="xs" px={2}>
                                                ⚡ Score: {parseFloat(task.final_score).toFixed(1)}
                                            </Badge>
                                        </HStack>
                                    </Flex>

                                    <Text fontSize="md" fontWeight="700" color="white" mb={1}>{task.title}</Text>
                                    {task.description && (
                                        <Text fontSize="sm" color="whiteAlpha.500" mb={3}>{task.description}</Text>
                                    )}

                                    <Flex justify="space-between" align="center" mt={3}>
                                        <HStack spacing={2}>
                                            {task.deadline && (
                                                <HStack>
                                                    <Box as={FiClock} size={12} color="rgba(255,255,255,0.4)" />
                                                    <Text fontSize="xs" color="whiteAlpha.400">
                                                        {new Date(task.deadline).toLocaleDateString()}
                                                    </Text>
                                                </HStack>
                                            )}
                                        </HStack>
                                        <HStack spacing={2}>
                                            <Button size="sm" borderRadius="8px"
                                                bg={`${statusColor[task.status]}15`}
                                                color={statusColor[task.status]}
                                                border={`1px solid ${statusColor[task.status]}40`}
                                                _hover={{ bg: `${statusColor[task.status]}25` }}
                                                onClick={() => handleStatus(task)}
                                                fontSize="xs">
                                                {statusLabel[task.status]}
                                            </Button>
                                            <Button size="sm" borderRadius="8px"
                                                bg="rgba(255,77,109,0.1)"
                                                color="#ff4d6d"
                                                border="1px solid rgba(255,77,109,0.3)"
                                                _hover={{ bg: 'rgba(255,77,109,0.2)' }}
                                                onClick={() => deleteTask(task.id)}>
                                                <Box as={FiTrash2} size={14} />
                                            </Button>
                                        </HStack>
                                    </Flex>
                                </Box>
                            </MotionBox>
                        ))}
                    </VStack>
                )}
            </Box>
            <Avatar />
        </Flex>
    );
};

export default Tasks;