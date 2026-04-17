import { useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box, Flex, Text, Heading, VStack, HStack,
    Grid, Badge, Table, Thead, Tbody, Tr, Th, Td
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { FiHome, FiList, FiCpu, FiLogOut, FiAlertCircle, FiCheckCircle, FiZap } from 'react-icons/fi';
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

const StatCard = ({ icon, label, value, color, delay }) => (
    <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
        <Flex bg="rgba(255,255,255,0.04)" border="1px solid rgba(255,255,255,0.08)"
            borderRadius="16px" p={5} align="center" gap={4}
            backdropFilter="blur(10px)"
            _hover={{ border: '1px solid rgba(124,92,252,0.4)', transform: 'translateY(-2px)' }}
            transition="all 0.2s">
            <Flex w="52px" h="52px" borderRadius="14px" bg={`${color}20`}
                border={`1px solid ${color}40`}
                align="center" justify="center" fontSize="1.4rem" flexShrink={0}>
                {icon}
            </Flex>
            <Box>
                <Text fontSize="xs" color="whiteAlpha.500" textTransform="uppercase" letterSpacing="wider" mb={1}>{label}</Text>
                <Text fontSize="2xl" fontWeight="800" color={color}>{value}</Text>
            </Box>
        </Flex>
    </MotionBox>
);

const Dashboard = () => {
    const { summary, fetchSummary, tasks, fetchTasks } = useTask();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchSummary();
        fetchTasks();
    }, []);

    const handleLogout = () => { logout(); navigate('/login'); };

    const getMentalState = () => {
        const state = summary?.mental_state;
        if (state === 'overloaded') return { icon: '🔥', label: 'Sobrecargado', color: '#ff4d6d' };
        if (state === 'busy') return { icon: '⚡', label: 'Ocupado', color: '#ffb800' };
        return { icon: '🧠', label: 'Balanceado', color: '#00e5ff' };
    };

    const mentalState = getMentalState();

    const getAlerts = () => {
        const alerts = [];
        if (!tasks.length) return [{ type: 'success', msg: '✅ Todo bajo control. ¡Buen trabajo!' }];
        tasks.forEach(task => {
            if (!task.deadline || task.status === 'completed') return;
            const diff = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            if (diff < 0) alerts.push({ type: 'danger', msg: `⛔ "${task.title}" está vencida` });
            else if (diff === 0) alerts.push({ type: 'danger', msg: `🔥 "${task.title}" vence hoy` });
            else if (diff <= 2) alerts.push({ type: 'warning', msg: `⚠️ "${task.title}" vence en ${diff} día(s)` });
        });
        if (summary?.mental_state === 'overloaded') alerts.push({ type: 'danger', msg: '🔥 Sobrecargado. Tienes más de 10 tareas activas.' });
        else if (summary?.mental_state === 'busy') alerts.push({ type: 'warning', msg: '⚡ Ocupado. Tienes entre 5 y 9 tareas activas.' });
        if (!alerts.length) alerts.push({ type: 'success', msg: '✅ Todo bajo control. ¡Buen trabajo!' });
        return alerts.slice(0, 4);
    };

    const alertColors = { danger: '#ff4d6d', warning: '#ffb800', success: '#00e096' };
    const alertBg = { danger: 'rgba(255,77,109,0.1)', warning: 'rgba(255,184,0,0.1)', success: 'rgba(0,224,150,0.1)' };

    const chartData = tasks.slice(0, 7).map(t => ({
        name: t.title.length > 8 ? t.title.substring(0, 8) + '...' : t.title,
        score: parseFloat(t.final_score?.toFixed(1) || 0),
        urgencia: parseFloat(t.urgency_score?.toFixed(1) || 0),
    }));

    const statusCount = {
        pending: tasks.filter(t => t.status === 'pending').length,
        in_progress: tasks.filter(t => t.status === 'in_progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
    };

    const lineData = [
        { name: 'Pendientes', value: statusCount.pending },
        { name: 'En progreso', value: statusCount.in_progress },
        { name: 'Completadas', value: statusCount.completed },
    ];

    const priorityColor = {
        critical: '#ff4d6d', high: '#ffb800', medium: '#7c5cfc', low: '#00e096'
    };

    return (
        <Flex minH="100vh" bg="#070711">
            <Sidebar user={user} onLogout={handleLogout} />
            <Box ml="240px" flex={1} p={8}>

                <MotionBox initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} mb={6}>
                    <Heading fontSize="2xl" fontWeight="800" color="white">Dashboard</Heading>
                    <Text color="whiteAlpha.500" mt={1}>Bienvenido de vuelta, {user?.username} 👋</Text>
                </MotionBox>

                <Grid templateColumns="repeat(3, 1fr)" gap={5} mb={6}>
                    <StatCard icon="📋" label="Tareas Activas" value={summary?.active_tasks ?? 0} color="#7c5cfc" delay={0.1} />
                    <StatCard icon="✅" label="Completadas Hoy" value={summary?.completed_today ?? 0} color="#00e096" delay={0.2} />
                    <StatCard icon={mentalState.icon} label="Estado Mental" value={mentalState.label} color={mentalState.color} delay={0.3} />
                </Grid>

                <Grid templateColumns="1.2fr 0.8fr" gap={5} mb={6}>
                    <MotionBox initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                        <Box borderRadius="20px" overflow="hidden" position="relative" h="200px"
                            bg="linear-gradient(135deg, #0a0a2e 0%, #1a0a3e 100%)"
                            border="1px solid rgba(255,255,255,0.08)">
                            <Box position="absolute" right={0} top={0} bottom={0} w="55%"
                                bgImage="url('/banner.jpg')" bgSize="cover" bgPosition="center"
                                style={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,0.95) 0%, transparent 100%)' }} />
                            <Box position="absolute" inset={0}
                                bg="linear-gradient(to right, rgba(10,10,46,0.98) 45%, transparent 100%)" />
                            <Box position="absolute" left={8} top="50%" transform="translateY(-50%)">
                                <Text color="whiteAlpha.600" fontSize="sm" mb={1}>Bienvenido de vuelta,</Text>
                                <Heading fontSize="xl" fontWeight="900" color="white" mb={2}>{user?.username}</Heading>
                                <Text color="whiteAlpha.500" fontSize="xs">Glad to see you again! Ask me anything.</Text>
                                <Text color="#7c5cfc" fontSize="xs" mt={3} cursor="pointer" fontWeight="600">Tap to record →</Text>
                            </Box>
                        </Box>
                    </MotionBox>

                    <MotionBox initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                        <Box bg="rgba(255,255,255,0.04)" border="1px solid rgba(255,255,255,0.08)"
                            borderRadius="20px" p={5} backdropFilter="blur(10px)" h="200px" overflowY="auto">
                            <HStack mb={4}>
                                <Box as={FiAlertCircle} color="#ffb800" size={16} />
                                <Heading fontSize="sm" color="white">Alertas</Heading>
                            </HStack>
                            <VStack spacing={2} align="stretch">
                                {getAlerts().map((alert, i) => (
                                    <Flex key={i} align="center" gap={2}
                                        bg={alertBg[alert.type]}
                                        border={`1px solid ${alertColors[alert.type]}30`}
                                        borderRadius="10px" p={3}>
                                        <Text fontSize="xs" color={alertColors[alert.type]}>{alert.msg}</Text>
                                    </Flex>
                                ))}
                            </VStack>
                        </Box>
                    </MotionBox>
                </Grid>

                <Grid templateColumns="1.4fr 0.6fr" gap={5} mb={6}>
                    <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
                        <Box bg="rgba(255,255,255,0.04)" border="1px solid rgba(255,255,255,0.08)"
                            borderRadius="20px" p={6} backdropFilter="blur(10px)">
                            <Heading fontSize="sm" color="white" mb={1}>📊 Score de Priorización</Heading>
                            <Text fontSize="xs" color="#00e096" mb={4}>+{tasks.length} tareas este periodo</Text>
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={200}>
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#7c5cfc" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#7c5cfc" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorUrgencia" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                                        <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                                        <Tooltip
                                            contentStyle={{ background: '#0f0f1a', border: '1px solid rgba(124,92,252,0.3)', borderRadius: '10px' }}
                                            labelStyle={{ color: 'white' }}
                                        />
                                        <Area type="monotone" dataKey="score" stroke="#7c5cfc" strokeWidth={2}
                                            fill="url(#colorScore)" name="Score" />
                                        <Area type="monotone" dataKey="urgencia" stroke="#00e5ff" strokeWidth={2}
                                            fill="url(#colorUrgencia)" name="Urgencia" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <Flex h="200px" align="center" justify="center" direction="column" gap={3}>
                                    <Text fontSize="3xl">📭</Text>
                                    <Text color="whiteAlpha.400" fontSize="sm">Crea tareas para ver la gráfica</Text>
                                </Flex>
                            )}
                        </Box>
                    </MotionBox>

                    <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                        <Box bg="rgba(255,255,255,0.04)" border="1px solid rgba(255,255,255,0.08)"
                            borderRadius="20px" p={5} backdropFilter="blur(10px)" h="100%">
                            <Heading fontSize="sm" color="white" mb={1}>📈 Estado</Heading>
                            <Text fontSize="xs" color="whiteAlpha.400" mb={4}>Distribución por estado</Text>
                            <ResponsiveContainer width="100%" height={120}>
                                <LineChart data={lineData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 8 }} />
                                    <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 8 }} />
                                    <Tooltip
                                        contentStyle={{ background: '#0f0f1a', border: '1px solid rgba(0,229,255,0.3)', borderRadius: '10px' }}
                                        labelStyle={{ color: 'white' }}
                                    />
                                    <Line type="monotone" dataKey="value" stroke="#00e5ff" strokeWidth={2} dot={{ fill: '#00e5ff', r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                            <VStack mt={4} spacing={3} align="stretch">
                                {[
                                    { label: 'Pendientes', value: statusCount.pending, color: '#7c5cfc' },
                                    { label: 'En progreso', value: statusCount.in_progress, color: '#ffb800' },
                                    { label: 'Completadas', value: statusCount.completed, color: '#00e096' },
                                ].map((s, i) => (
                                    <Flex key={i} justify="space-between" align="center">
                                        <HStack>
                                            <Box w="8px" h="8px" borderRadius="full" bg={s.color} />
                                            <Text fontSize="xs" color="whiteAlpha.600">{s.label}</Text>
                                        </HStack>
                                        <Text fontSize="sm" fontWeight="700" color={s.color}>{s.value}</Text>
                                    </Flex>
                                ))}
                            </VStack>
                        </Box>
                    </MotionBox>
                </Grid>

                <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
                    <Box bg="rgba(255,255,255,0.04)" border="1px solid rgba(255,255,255,0.08)"
                        borderRadius="20px" p={6} backdropFilter="blur(10px)" mb={6}>
                        <HStack mb={5} justify="space-between">
                            <HStack>
                                <Box as={FiList} color="#7c5cfc" size={16} />
                                <Heading fontSize="sm" color="white">Mis Tareas</Heading>
                                <Badge bg="rgba(124,92,252,0.2)" color="#7c5cfc" borderRadius="6px" px={2} fontSize="xs">
                                    {tasks.length} total
                                </Badge>
                            </HStack>
                            <Link to="/tasks">
                                <Text fontSize="xs" color="#7c5cfc" fontWeight="600" cursor="pointer">Ver todas →</Text>
                            </Link>
                        </HStack>
                        {tasks.length > 0 ? (
                            <Box overflowX="auto">
                                <Table variant="unstyled" size="sm">
                                    <Thead>
                                        <Tr>
                                            {['Tarea', 'Prioridad', 'Estado', 'Score', 'Deadline'].map(h => (
                                                <Th key={h} color="whiteAlpha.400" fontSize="xs" textTransform="uppercase"
                                                    letterSpacing="wider" pb={3} borderBottom="1px solid rgba(255,255,255,0.06)">
                                                    {h}
                                                </Th>
                                            ))}
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {tasks.slice(0, 6).map(task => (
                                            <Tr key={task.id}
                                                _hover={{ bg: 'rgba(255,255,255,0.02)' }}
                                                transition="all 0.2s">
                                                <Td color="white" fontSize="sm" py={3}
                                                    borderBottom="1px solid rgba(255,255,255,0.04)">
                                                    {task.title.length > 30 ? task.title.substring(0, 30) + '...' : task.title}
                                                </Td>
                                                <Td borderBottom="1px solid rgba(255,255,255,0.04)" py={3}>
                                                    <Badge bg={`${priorityColor[task.priority]}20`}
                                                        color={priorityColor[task.priority]}
                                                        borderRadius="6px" fontSize="xs" px={2} textTransform="capitalize">
                                                        {task.priority}
                                                    </Badge>
                                                </Td>
                                                <Td borderBottom="1px solid rgba(255,255,255,0.04)" py={3}>
                                                    <Badge
                                                        bg={task.status === 'completed' ? 'rgba(0,224,150,0.15)' :
                                                            task.status === 'in_progress' ? 'rgba(255,184,0,0.15)' : 'rgba(124,92,252,0.15)'}
                                                        color={task.status === 'completed' ? '#00e096' :
                                                            task.status === 'in_progress' ? '#ffb800' : '#7c5cfc'}
                                                        borderRadius="6px" fontSize="xs" px={2} textTransform="capitalize">
                                                        {task.status.replace('_', ' ')}
                                                    </Badge>
                                                </Td>
                                                <Td borderBottom="1px solid rgba(255,255,255,0.04)" py={3}>
                                                    <Text fontSize="sm" fontWeight="700" color="#00e5ff">
                                                        {parseFloat(task.final_score).toFixed(1)}
                                                    </Text>
                                                </Td>
                                                <Td borderBottom="1px solid rgba(255,255,255,0.04)" py={3}>
                                                    <Text fontSize="xs" color="whiteAlpha.500">
                                                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : '—'}
                                                    </Text>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        ) : (
                            <Flex align="center" justify="center" h="100px" direction="column" gap={2}>
                                <Text fontSize="2xl">📭</Text>
                                <Text color="whiteAlpha.400" fontSize="sm">No hay tareas aún</Text>
                                <Link to="/tasks">
                                    <Text fontSize="xs" color="#7c5cfc" fontWeight="600">Crear primera tarea →</Text>
                                </Link>
                            </Flex>
                        )}
                    </Box>
                </MotionBox>

                <Grid templateColumns="1fr 1fr" gap={5}>
                    <MotionBox initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.9 }}>
                        <Box bg="rgba(255,255,255,0.04)" border="1px solid rgba(255,255,255,0.08)"
                            borderRadius="20px" p={5} backdropFilter="blur(10px)">
                            <HStack mb={4}>
                                <Box as={FiZap} color="#7c5cfc" size={16} />
                                <Heading fontSize="sm" color="white">Deadlines Próximos</Heading>
                            </HStack>
                            <VStack spacing={2} align="stretch">
                                {tasks.filter(t => t.deadline && t.status !== 'completed')
                                    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                                    .slice(0, 5).map(task => {
                                        const diff = Math.ceil((new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                                        const color = diff < 0 ? '#ff4d6d' : diff === 0 ? '#ff4d6d' : diff <= 2 ? '#ffb800' : '#00e5ff';
                                        return (
                                            <Flex key={task.id} align="center" gap={3}
                                                bg="rgba(255,255,255,0.03)" borderRadius="10px" p={3}>
                                                <Box w="8px" h="8px" borderRadius="full" bg={color} flexShrink={0} />
                                                <Text fontSize="xs" color="whiteAlpha.800" flex={1} isTruncated>{task.title}</Text>
                                                <Badge bg={`${color}20`} color={color} borderRadius="6px" fontSize="xs" px={2}>
                                                    {diff < 0 ? 'Vencida' : diff === 0 ? 'Hoy' : `${diff}d`}
                                                </Badge>
                                            </Flex>
                                        );
                                    })}
                                {!tasks.filter(t => t.deadline && t.status !== 'completed').length && (
                                    <Text color="whiteAlpha.400" fontSize="xs">No hay deadlines próximos</Text>
                                )}
                            </VStack>
                        </Box>
                    </MotionBox>

                    <MotionBox initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 1.0 }}>
                        <Box bg="rgba(255,255,255,0.04)" border="1px solid rgba(255,255,255,0.08)"
                            borderRadius="20px" p={5} backdropFilter="blur(10px)">
                            <HStack mb={4}>
                                <Box as={FiCheckCircle} color="#00e096" size={16} />
                                <Heading fontSize="sm" color="white">Actividad Reciente</Heading>
                            </HStack>
                            <VStack spacing={2} align="stretch">
                                {tasks.slice(0, 5).map(task => (
                                    <Flex key={task.id} align="center" gap={3}
                                        bg="rgba(255,255,255,0.03)" borderRadius="10px" p={3}>
                                        <Box w="8px" h="8px" borderRadius="full" bg="#7c5cfc" flexShrink={0} />
                                        <Text fontSize="xs" color="whiteAlpha.800" flex={1} isTruncated>{task.title}</Text>
                                        <Badge bg="rgba(124,92,252,0.2)" color="#7c5cfc" borderRadius="6px" fontSize="xs" px={2} textTransform="capitalize">
                                            {task.status.replace('_', ' ')}
                                        </Badge>
                                    </Flex>
                                ))}
                                {!tasks.length && (
                                    <Text color="whiteAlpha.400" fontSize="xs">No hay actividad reciente</Text>
                                )}
                            </VStack>
                        </Box>
                    </MotionBox>
                </Grid>
            </Box>
            <Avatar />
        </Flex>
    );
};

export default Dashboard;