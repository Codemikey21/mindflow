import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    Box, Flex, Text, Input, Button, FormControl, FormLabel,
    Alert, AlertIcon, VStack, Heading, InputGroup, InputRightElement,
    IconButton
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const MotionBox = motion(Box);

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(username, email, password);
            navigate('/login');
        } catch {
            setError('Error al registrarse. Verifica los datos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex minH="100vh">
            <Box
                flex={1}
                bgImage="url('/bg-login.jpg')"
                bgSize="cover"
                bgPosition="center"
                position="relative"
                display={{ base: 'none', md: 'flex' }}
                alignItems="center"
                justifyContent="center"
                p={12}
            >
                <Box position="absolute" inset={0}
                    bg="linear-gradient(135deg, rgba(10,10,26,0.85) 0%, rgba(124,92,252,0.5) 100%)" />
                <MotionBox
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    zIndex={1} w="100%"
                >
                    <Text fontSize="xs" letterSpacing="widest" color="whiteAlpha.700" textTransform="uppercase" mb={2}>
                        INSPIRED BY THE FUTURE
                    </Text>
                    <Heading fontSize="3xl" fontWeight="900" color="white" lineHeight="shorter" mb={10}>
                        THE MINDFLOW<br />DASHBOARD
                    </Heading>
                    <VStack align="start" spacing={4}>
                        {[
                            { icon: '🚀', title: 'Configura tu perfil', desc: 'Crea tu cuenta en segundos y empieza a organizar' },
                            { icon: '🔒', title: 'Seguridad con JWT', desc: 'Tus datos protegidos con autenticación segura' },
                            { icon: '📅', title: 'Deadlines inteligentes', desc: 'Alertas automáticas antes de que venzan tus tareas' },
                            { icon: '🤖', title: 'Asistente incluido', desc: 'Avatar inteligente que te guía en cada sección' },
                        ].map((f, i) => (
                            <Flex key={i} align="center" gap={4}
                                bg="rgba(255,255,255,0.05)"
                                backdropFilter="blur(10px)"
                                border="1px solid rgba(255,255,255,0.1)"
                                borderRadius="14px" p={4} w="100%"
                            >
                                <Flex w="44px" h="44px" bg="rgba(124,92,252,0.2)"
                                    border="1px solid rgba(124,92,252,0.4)"
                                    borderRadius="12px" align="center" justify="center"
                                    fontSize="1.3rem" flexShrink={0}>
                                    {f.icon}
                                </Flex>
                                <Box>
                                    <Text fontWeight="700" fontSize="sm" color="white">{f.title}</Text>
                                    <Text fontSize="xs" color="whiteAlpha.600" mt={1}>{f.desc}</Text>
                                </Box>
                            </Flex>
                        ))}
                    </VStack>
                </MotionBox>
            </Box>

            <Flex
                flex={{ base: 1, md: 0.6 }}
                align="center"
                justify="center"
                px={{ base: 8, md: 16 }}
                bg="linear-gradient(135deg, #0a0a1a 0%, #0d0d2b 100%)"
            >
                <MotionBox
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    w="100%" maxW="420px"
                    bg="rgba(255,255,255,0.05)"
                    backdropFilter="blur(20px)"
                    border="1px solid rgba(255,255,255,0.1)"
                    borderRadius="20px"
                    p={10}
                >
                    <Heading fontSize="2xl" fontWeight="900"
                        bgGradient="linear(to-r, #7c5cfc, #00e5ff)"
                        bgClip="text" mb={1}>
                        MindFlow
                    </Heading>
                    <Heading fontSize="xl" fontWeight="800" color="white" mb={2}>
                        Crear Cuenta 🚀
                    </Heading>
                    <Text color="whiteAlpha.600" mb={8} fontSize="sm">
                        Completa los datos para registrarte
                    </Text>

                    {error && (
                        <Alert status="error" borderRadius="10px" mb={4}
                            bg="rgba(255,77,109,0.1)" border="1px solid" borderColor="red.400">
                            <AlertIcon color="red.400" />
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <VStack spacing={5}>
                            <FormControl>
                                <FormLabel fontSize="sm" color="whiteAlpha.700" fontWeight="600">Usuario</FormLabel>
                                <Input
                                    type="text" placeholder="tunombre"
                                    value={username} onChange={(e) => setUsername(e.target.value)}
                                    bg="whiteAlpha.100" border="1px solid"
                                    borderColor="whiteAlpha.200"
                                    _hover={{ borderColor: '#7c5cfc' }}
                                    _focus={{ borderColor: '#7c5cfc', boxShadow: '0 0 0 1px #7c5cfc' }}
                                    color="white" h="48px" required
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel fontSize="sm" color="whiteAlpha.700" fontWeight="600">Email</FormLabel>
                                <Input
                                    type="email" placeholder="tu@email.com"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    bg="whiteAlpha.100" border="1px solid"
                                    borderColor="whiteAlpha.200"
                                    _hover={{ borderColor: '#7c5cfc' }}
                                    _focus={{ borderColor: '#7c5cfc', boxShadow: '0 0 0 1px #7c5cfc' }}
                                    color="white" h="48px" required
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel fontSize="sm" color="whiteAlpha.700" fontWeight="600">Contraseña</FormLabel>
                                <InputGroup>
                                    <Input
                                        type={show ? 'text' : 'password'} placeholder="Mínimo 8 caracteres"
                                        value={password} onChange={(e) => setPassword(e.target.value)}
                                        bg="whiteAlpha.100" border="1px solid"
                                        borderColor="whiteAlpha.200"
                                        _hover={{ borderColor: '#7c5cfc' }}
                                        _focus={{ borderColor: '#7c5cfc', boxShadow: '0 0 0 1px #7c5cfc' }}
                                        color="white" h="48px" required
                                    />
                                    <InputRightElement h="48px">
                                        <IconButton size="sm" variant="ghost"
                                            color="whiteAlpha.600"
                                            icon={show ? <FiEyeOff /> : <FiEye />}
                                            onClick={() => setShow(!show)} />
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <Button
                                type="submit" w="full" isLoading={loading}
                                loadingText="Registrando..."
                                bgGradient="linear(to-r, #7c5cfc, #00e5ff)"
                                color="white" fontWeight="700" fontSize="md"
                                _hover={{ opacity: 0.9, transform: 'translateY(-2px)' }}
                                transition="all 0.2s" h="48px" borderRadius="12px"
                            >
                                REGISTRARSE
                            </Button>
                        </VStack>
                    </form>
                    <Text mt={6} textAlign="center" color="whiteAlpha.600" fontSize="sm">
                        ¿Ya tienes cuenta?{' '}
                        <Link to="/login">
                            <Text as="span" color="#7c5cfc" fontWeight="700">Inicia sesión</Text>
                        </Link>
                    </Text>
                </MotionBox>
            </Flex>
        </Flex>
    );
};

export default Register;