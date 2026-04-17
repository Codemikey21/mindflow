import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import decisionService from '../services/decisionService';
import {
    Box, Flex, Text, Heading, VStack, HStack,
    Badge, Button, Input, Textarea
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FiHome, FiList, FiCpu, FiLogOut, FiPlus, FiTrash2 } from 'react-icons/fi';
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

const Decisions = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [decisions, setDecisions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ title: '', description: '' });
    const [options, setOptions] = useState([
        { name: '', weight: 1, impact: 5, risk: 3 },
        { name: '', weight: 1, impact: 5, risk: 3 },
    ]);

    useEffect(() => { fetchDecisions(); }, []);

    const fetchDecisions = async () => {
        setLoading(true);
        try {
            const data = await decisionService.getDecisions();
            setDecisions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    const addOption = () => {
        setOptions([...options, { name: '', weight: 1, impact: 5, risk: 3 }]);
    };

    const updateOption = (index, field, value) => {
        const updated = [...options];
        updated[index][field] = field === 'name' ? value : parseFloat(value);
        setOptions(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await decisionService.createDecision({ ...form, options });
            setDecisions([data, ...decisions]);
            setShowForm(false);
            setForm({ title: '', description: '' });
            setOptions([
                { name: '', weight: 1, impact: 5, risk: 3 },
                { name: '', weight: 1, impact: 5, risk: 3 },
            ]);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        await decisionService.deleteDecision(id);
        setDecisions(decisions.filter(d => d.id !== id));
    };

    const getMaxScore = (options) => Math.max(...options.map(o => o.final_score), 1);

    const inputStyle = {
        bg: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        color: 'white',
        _hover: { borderColor: '#7c5cfc' },
        _focus: { borderColor: '#7c5cfc', boxShadow: '0 0 0 1px #7c5cfc' },
        _placeholder: { color: 'whiteAlpha.400' },
    };

    const barColors = ['#7c5cfc', '#00e5ff', '#ffb800', '#ff4d6d', '#00e096'];

    return (
        <Flex minH="100vh" bg="#070711">
            <Sidebar user={user} onLogout={handleLogout} />
            <Box ml="240px" flex={1} p={8}>

                <MotionBox initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} mb={6}>
                    <Flex justify="space-between" align="center">
                        <Box>
                            <Heading fontSize="2xl" fontWeight="800" color="white">🧠 Motor de Decisiones</Heading>
                            <Text color="whiteAlpha.500" mt={1} fontSize="sm">
                                Evalúa opciones con criterios inteligentes y obtén recomendaciones
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
                            {showForm ? 'Cancelar' : 'Nueva Decisión'}
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
                            <Heading fontSize="md" color="white" mb={5}>✨ Nueva Decisión</Heading>
                            <form onSubmit={handleSubmit}>
                                <VStack spacing={4}>
                                    <Input placeholder="¿Qué decisión necesitas tomar?" value={form.title}
                                        onChange={(e) => setForm({...form, title: e.target.value})}
                                        {...inputStyle} required />
                                    <Textarea placeholder="Describe el contexto" value={form.description}
                                        onChange={(e) => setForm({...form, description: e.target.value})}
                                        {...inputStyle} rows={2} />

                                    <Box w="100%">
                                        <Flex justify="space-between" align="center" mb={3}>
                                            <Text fontSize="xs" color="whiteAlpha.500" textTransform="uppercase" letterSpacing="wider">
                                                Opciones a evaluar
                                            </Text>
                                            <HStack spacing={2}>
                                                {[
                                                    { label: 'Peso', desc: 'Importancia de esta opción para ti (1-10)', color: '#7c5cfc' },
                                                    { label: 'Impacto', desc: 'Qué tan buenos serán los resultados (1-10)', color: '#00e5ff' },
                                                    { label: 'Riesgo', desc: 'Qué tan difícil o peligroso es elegirla (1-10)', color: '#ff4d6d' },
                                                ].map((item, i) => (
                                                    <Flex key={i} align="center" gap={1}
                                                        bg={`${item.color}10`}
                                                        border={`1px solid ${item.color}30`}
                                                        borderRadius="8px" px={2} py={1}
                                                        title={item.desc}
                                                        cursor="help"
                                                    >
                                                        <Box w="6px" h="6px" borderRadius="full" bg={item.color} />
                                                        <Text fontSize="xs" color={item.color} fontWeight="600">{item.label}</Text>
                                                    </Flex>
                                                ))}
                                            </HStack>
                                        </Flex>

                                        {/* INFO CARD */}
                                        <Box bg="rgba(124,92,252,0.05)" border="1px solid rgba(124,92,252,0.2)"
                                            borderRadius="10px" p={3} mb={4}>
                                            <Text fontSize="xs" color="whiteAlpha.600" lineHeight="tall">
                                                💡 <strong style={{color:'white'}}>Cómo funciona:</strong> El sistema calcula{' '}
                                                <span style={{color:'#00e5ff'}}>Score = (Impacto × Peso) - (Riesgo × 0.5)</span>.
                                                Mayor impacto y menor riesgo = mejor opción recomendada.
                                            </Text>
                                        </Box>

                                        <VStack spacing={3}>
                                            {options.map((opt, i) => (
                                                <Box key={i} w="100%" bg="rgba(255,255,255,0.03)"
                                                    borderRadius="12px" p={4}
                                                    border="1px solid rgba(255,255,255,0.06)">
                                                    <Input placeholder={`Opción ${i + 1}`} value={opt.name}
                                                        onChange={(e) => updateOption(i, 'name', e.target.value)}
                                                        {...inputStyle} mb={3} required />
                                                    <HStack spacing={3}>
                                                        <Box flex={1}>
                                                            <Text fontSize="xs" color="#7c5cfc" mb={1} fontWeight="600">⚖️ Peso</Text>
                                                            <Input type="number" min="1" max="10" value={opt.weight}
                                                                onChange={(e) => updateOption(i, 'weight', e.target.value)}
                                                                {...inputStyle} size="sm" />
                                                        </Box>
                                                        <Box flex={1}>
                                                            <Text fontSize="xs" color="#00e5ff" mb={1} fontWeight="600">🎯 Impacto</Text>
                                                            <Input type="number" min="1" max="10" value={opt.impact}
                                                                onChange={(e) => updateOption(i, 'impact', e.target.value)}
                                                                {...inputStyle} size="sm" />
                                                        </Box>
                                                        <Box flex={1}>
                                                            <Text fontSize="xs" color="#ff4d6d" mb={1} fontWeight="600">⚠️ Riesgo</Text>
                                                            <Input type="number" min="1" max="10" value={opt.risk}
                                                                onChange={(e) => updateOption(i, 'risk', e.target.value)}
                                                                {...inputStyle} size="sm" />
                                                        </Box>
                                                    </HStack>
                                                </Box>
                                            ))}
                                        </VStack>
                                    </Box>

                                    <HStack w="100%" spacing={3}>
                                        <Button flex={1} variant="outline" borderRadius="12px"
                                            borderColor="rgba(124,92,252,0.4)" color="#7c5cfc"
                                            _hover={{ bg: 'rgba(124,92,252,0.1)' }}
                                            onClick={addOption} leftIcon={<FiPlus />}>
                                            Agregar Opción
                                        </Button>
                                        <Button flex={2} type="submit" h="48px"
                                            bgGradient="linear(to-r, #7c5cfc, #00e5ff)"
                                            color="white" fontWeight="700" borderRadius="12px"
                                            _hover={{ opacity: 0.9 }}>
                                            ⚡ Evaluar Decisión
                                        </Button>
                                    </HStack>
                                </VStack>
                            </form>
                        </Box>
                    </MotionBox>
                )}

                {loading ? (
                    <Flex align="center" justify="center" h="200px">
                        <Text color="whiteAlpha.400">Cargando decisiones...</Text>
                    </Flex>
                ) : decisions.length === 0 ? (
                    <Flex align="center" justify="center" h="300px" direction="column" gap={4}>
                        <Text fontSize="4xl">🤔</Text>
                        <Text color="whiteAlpha.400" fontSize="lg">No hay decisiones aún</Text>
                        <Button leftIcon={<FiPlus />}
                            bgGradient="linear(to-r, #7c5cfc, #00e5ff)"
                            color="white" borderRadius="12px"
                            onClick={() => setShowForm(true)}>
                            Evaluar primera decisión
                        </Button>
                    </Flex>
                ) : (
                    <VStack spacing={5} align="stretch">
                        {decisions.map((decision, i) => {
                            const maxScore = getMaxScore(decision.options);
                            const chartData = decision.options
                                .sort((a, b) => b.final_score - a.final_score)
                                .map(opt => ({
                                    name: opt.name.length > 12 ? opt.name.substring(0, 12) + '...' : opt.name,
                                    score: parseFloat(opt.final_score.toFixed(2)),
                                    pct: parseFloat(((opt.final_score / maxScore) * 100).toFixed(0)),
                                }));

                            return (
                                <MotionBox key={decision.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: i * 0.1 }}
                                >
                                    <Box bg="rgba(255,255,255,0.04)" border="1px solid rgba(255,255,255,0.08)"
                                        borderRadius="20px" p={6} backdropFilter="blur(10px)"
                                        _hover={{ border: '1px solid rgba(124,92,252,0.3)' }}
                                        transition="all 0.2s">

                                        <Flex justify="space-between" align="start" mb={4}>
                                            <Box>
                                                <Heading fontSize="lg" color="white" mb={1}>{decision.title}</Heading>
                                                {decision.description && (
                                                    <Text fontSize="sm" color="whiteAlpha.500">{decision.description}</Text>
                                                )}
                                            </Box>
                                            <Button size="sm" borderRadius="8px"
                                                bg="rgba(255,77,109,0.1)" color="#ff4d6d"
                                                border="1px solid rgba(255,77,109,0.3)"
                                                _hover={{ bg: 'rgba(255,77,109,0.2)' }}
                                                onClick={() => handleDelete(decision.id)}>
                                                <Box as={FiTrash2} size={14} />
                                            </Button>
                                        </Flex>

                                        <Box bg="rgba(0,229,255,0.05)" border="1px solid rgba(0,229,255,0.2)"
                                            borderRadius="12px" p={4} mb={5}>
                                            <Text fontSize="xs" color="#00e5ff" textTransform="uppercase"
                                                letterSpacing="wider" fontWeight="700" mb={2}>
                                                💡 Recomendación del sistema
                                            </Text>
                                            <Text fontSize="sm" color="white" lineHeight="tall">
                                                {decision.recommendation}
                                            </Text>
                                        </Box>

                                        <Box>
                                            <Text fontSize="xs" color="whiteAlpha.500" textTransform="uppercase"
                                                letterSpacing="wider" mb={4}>Comparación de opciones</Text>
                                            <ResponsiveContainer width="100%" height={180}>
                                                <BarChart data={chartData} layout="vertical">
                                                    <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                                                    <YAxis type="category" dataKey="name"
                                                        tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }} width={100} />
                                                    <Tooltip
                                                        contentStyle={{ background: '#0f0f1a', border: '1px solid rgba(124,92,252,0.3)', borderRadius: '10px' }}
                                                        labelStyle={{ color: 'white' }}
                                                        formatter={(value) => [value, 'Score']}
                                                    />
                                                    <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                                                        {chartData.map((entry, index) => (
                                                            <Cell key={index} fill={barColors[index % barColors.length]} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>

                                            <VStack mt={3} spacing={2} align="stretch">
                                                {chartData.map((opt, idx) => (
                                                    <Flex key={idx} align="center" gap={3}
                                                        bg="rgba(255,255,255,0.03)" borderRadius="10px" p={3}>
                                                        <Box w="10px" h="10px" borderRadius="full"
                                                            bg={barColors[idx % barColors.length]} flexShrink={0} />
                                                        <Text fontSize="sm" color="white" flex={1}>{opt.name}</Text>
                                                        <Badge bg={`${barColors[idx % barColors.length]}20`}
                                                            color={barColors[idx % barColors.length]}
                                                            borderRadius="6px" fontSize="xs" px={2}>
                                                            {opt.pct}%
                                                        </Badge>
                                                    </Flex>
                                                ))}
                                            </VStack>
                                        </Box>
                                    </Box>
                                </MotionBox>
                            );
                        })}
                    </VStack>
                )}
            </Box>
            <Avatar />
        </Flex>
    );
};

export default Decisions;