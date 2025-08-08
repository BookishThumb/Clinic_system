import React, { useState, useEffect, createContext, useContext } from 'react';

// --- API Configuration ---
const API_URL = 'http://localhost:3001';

// --- Auth Context ---
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            setUser({ name: 'Front Desk Staff' });
        } else {
            setUser(null);
        }
    }, [token]);

    const login = async (email, password) => {
        const response = await fetch(`${API_URL}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) throw new Error('Login failed');
        const data = await response.json();
        localStorage.setItem('token', data.accessToken);
        setToken(data.accessToken);
    };

    const signup = async (email, password) => {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Signup failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    const authHeader = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    });

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, authHeader, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
        );
}

export const useAuth = () => useContext(AuthContext);

// --- Main App Component ---
export default function App() {
    return (
        <AuthProvider>
            <ClinicApp />
        </AuthProvider>
    );
}

const ClinicApp = () => {
    const { isAuthenticated, login, signup, logout, user } = useAuth();
    
    if (!isAuthenticated) {
        return <LoginScreen onLogin={login} onSignup={signup} />;
    }

    return <Dashboard onLogout={logout} user={user} />;
};

// --- Helper Functions ---
const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

// --- SVG Icons ---
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const AppointmentsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const QueueIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M8 6h13"></path><path d="M8 12h13"></path><path d="M8 18h13"></path><path d="M3 6h.01"></path><path d="M3 12h.01"></path><path d="M3 18h.01"></path></svg>;
const DoctorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"/><circle cx="12" cy="10" r="3"/><circle cx="12" cy="12" r="10"/></svg>;
const AlertsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const WelcomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 mr-4"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

// --- Components ---
const Modal = ({ children, onClose, title }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg border border-gray-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors"><XIcon /></button>
        <div className="p-6">{children}</div>
      </div>
    </div>
</div>
);

const StatCard = ({ title, value, icon, color, onClick }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center ${onClick ? 'cursor-pointer hover:shadow-lg hover:border-purple-300 transition-all' : ''}`} onClick={onClick}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-gray-500">{title}</p>
        </div>
    </div>
);

const PatientDashboard = ({ user, patients, appointments, setActiveTab }) => (
    <div>
        <div className="bg-purple-600 text-white p-8 rounded-lg shadow-lg mb-8 flex items-center">
            <WelcomeIcon />
            <div>
                <h2 className="text-3xl font-bold">Welcome, {user.name}!</h2>
                <p className="mt-1 text-purple-200">Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Patients in queue" value={patients.filter(p => p.status === 'Waiting').length} icon={<QueueIcon />} color="bg-blue-100 text-blue-600" onClick={() => setActiveTab('Queues')} />
            <StatCard title="Patients with Doctor" value={patients.filter(p => p.status === 'With Doctor').length} icon={<DoctorIcon />} color="bg-green-100 text-green-600" />
            <StatCard title="Appointments Today" value={appointments.length} icon={<AppointmentsIcon />} color="bg-yellow-100 text-yellow-600" onClick={() => setActiveTab('Appointments')} />
        </div>
    </div>
);

const AppointmentsList = ({ appointments, onAdd, onReschedule, onCancel }) => {
    const getStatusClass = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Canceled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Manage Appointments</h3>
                <button onClick={onAdd} className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">Add Appointment</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b text-gray-500">
                            <th className="py-2 px-3">Patient Name</th>
                            <th className="py-2 px-3">Date/Time</th>
                            <th className="py-2 px-3">Status</th>
                            <th className="py-2 px-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(app => (
                            <tr key={app.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-3 font-medium text-gray-800">{app.patientName}</td>
                                <td className="py-3 px-3 text-gray-600">{new Date(app.time).toLocaleString()}</td>
                                <td className="py-3 px-3"><span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(app.status)}`}>{app.status}</span></td>
                                <td className="py-3 px-3 flex justify-center items-center gap-2">
                                    <button onClick={() => onReschedule(app)} className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-100 rounded-full transition-colors"><EditIcon /></button>
                                    <button onClick={() => onCancel(app.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const QueueManagement = ({ patients, onAdd, onStatusChange }) => {
    const activePatients = patients.filter(p => p.status !== 'Completed');
    const completedPatients = patients.filter(p => p.status === 'Completed');

    const getStatusClass = (status) => {
        switch (status) {
            case 'Waiting': return 'bg-yellow-100 text-yellow-700';
            case 'With Doctor': return 'bg-blue-100 text-blue-700';
            case 'Completed': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const PatientTable = ({ patientList, title }) => (
        <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">{title}</h4>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b text-gray-500">
                            <th className="py-2 px-3">Queue No</th>
                            <th className="py-2 px-3">Patient</th>
                            <th className="py-2 px-3">Arrival Time</th>
                            <th className="py-2 px-3">Priority</th>
                            <th className="py-2 px-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patientList.map(p => (
                            <tr key={p.id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-3 font-bold text-purple-700">{p.queueNumber}</td>
                                <td className="py-3 px-3 font-medium text-gray-800">{p.name}</td>
                                <td className="py-3 px-3 text-gray-600">{formatTime(p.arrival)}</td>
                                <td className="py-3 px-3 text-gray-600">{p.priority}</td>
                                <td className="py-3 px-3">
                                    <select value={p.status} onChange={(e) => onStatusChange(p.id, e.target.value)} className={`px-3 py-1 text-sm font-semibold rounded-full border-none focus:ring-0 ${getStatusClass(p.status)}`}>
                                        <option value="Waiting">Waiting</option>
                                        <option value="With Doctor">With Doctor</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-8">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Manage Queue</h3>
                <button onClick={onAdd} className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">Add Patient to Queue</button>
            </div>
            <PatientTable patientList={activePatients} title="Active Queue" />
            {completedPatients.length > 0 && <PatientTable patientList={completedPatients} title="Completed Today" />}
        </div>
    );
};

const AddPatientToQueueModal = ({ onClose, onConfirm }) => {
    const [formData, setFormData] = useState({ name: '', priority: 'Normal' });
    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(formData);
    };

    return (
        <Modal title="Add Patient to Queue" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Patient Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Priority</label>
                    <select name="priority" value={formData.priority} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" required>
                        <option value="Normal">Normal</option>
                        <option value="Urgent">Urgent</option>
                    </select>
                </div>
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg">Cancel</button>
                    <button type="submit" className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg">Add to Queue</button>
                </div>
            </form>
        </Modal>
    );
};

const ScheduleAppointmentModal = ({ onClose, onConfirm, appointment, doctors }) => {
    const [formData, setFormData] = useState({
        patientName: appointment?.patientName || '',
        reason: appointment?.reason || '',
        doctorId: appointment?.doctorId || '',
        time: appointment ? new Date(new Date(appointment.time).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16) : ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(formData);
    };

    return (
        <Modal title={appointment ? "Reschedule Appointment" : "Schedule New Appointment"} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">Patient Information</h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Patient Name</label>
                            <input type="text" name="patientName" value={formData.patientName} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Reason</label>
                            <input type="text" name="reason" value={formData.reason} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">Appointment Details</h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Doctor</label>
                            <select name="doctorId" value={formData.doctorId} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" required>
                                <option value="">Select a doctor</option>
                                {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Date & Time</label>
                            <input type="datetime-local" name="time" value={formData.time} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" required />
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg">Cancel</button>
                    <button type="submit" className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg">Confirm Appointment</button>
                </div>
            </form>
        </Modal>
    );
};

const Dashboard = ({ onLogout, user }) => {
    const [activeTab, setActiveTab] = useState('Patient');
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [modal, setModal] = useState({ type: null, data: null });
    const { authHeader } = useAuth();

    const fetchData = async () => {
        try {
            const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
                fetch(`${API_URL}/patients`, { headers: authHeader() }),
                fetch(`${API_URL}/doctors`, { headers: authHeader() }),
                fetch(`${API_URL}/appointments`, { headers: authHeader() }),
            ]);
            setPatients(await patientsRes.json());
            setDoctors(await doctorsRes.json());
            setAppointments(await appointmentsRes.json());
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleAddPatientToQueue = async (patientData) => {
        await fetch(`${API_URL}/patients`, {
            method: 'POST', headers: authHeader(), body: JSON.stringify(patientData),
        });
        fetchData();
        setModal({ type: null });
    };

    const handleConfirmAppointment = async (formData) => {
        const url = modal.data ? `${API_URL}/appointments/${modal.data.id}` : `${API_URL}/appointments`;
        const method = modal.data ? 'PATCH' : 'POST';
        const body = {
            ...formData,
            doctorId: parseInt(formData.doctorId)
        }
        await fetch(url, { method, headers: authHeader(), body: JSON.stringify(body) });
        fetchData();
        setModal({ type: null });
    };

    const handleCancelAppointment = async (appointmentId) => {
        await fetch(`${API_URL}/appointments/${appointmentId}`, { method: 'DELETE', headers: authHeader() });
        fetchData();
    };
    
    const handlePatientStatusChange = async (patientId, newStatus) => {
        await fetch(`${API_URL}/patients/${patientId}/status`, {
            method: 'PATCH', headers: authHeader(), body: JSON.stringify({ status: newStatus }),
        });
        fetchData();
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Patient': return <PatientDashboard user={user} patients={patients} appointments={appointments} setActiveTab={setActiveTab} />;
            case 'Appointments': return <AppointmentsList appointments={appointments} onAdd={() => setModal({ type: 'appointment' })} onReschedule={(app) => setModal({ type: 'appointment', data: app })} onCancel={handleCancelAppointment} />;
            case 'Queues': return <QueueManagement patients={patients} onAdd={() => setModal({ type: 'add_queue' })} onStatusChange={handlePatientStatusChange} />;
            default: return <PatientDashboard user={user} patients={patients} appointments={appointments} setActiveTab={setActiveTab} />;
        }
    };

    const NavItem = ({ icon, label, name }) => (
        <button onClick={() => setActiveTab(name)} className={`w-full flex items-center py-3 px-4 rounded-lg transition-colors ${activeTab === name ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-600 hover:bg-purple-100 hover:text-purple-700'}`}>
            {icon}
            <span className="ml-3 font-semibold">{label}</span>
        </button>
    );

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <aside className="w-64 bg-white p-6 border-r flex flex-col justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-purple-700 mb-10">ClinicFrontDes</h1>
                    <nav className="space-y-2">
                        <NavItem icon={<HomeIcon />} label="Patient" name="Patient" />
                        <NavItem icon={<AppointmentsIcon />} label="Appointments" name="Appointments" />
                        <NavItem icon={<QueueIcon />} label="Queues" name="Queues" />
                        <NavItem icon={<DoctorIcon />} label="Doctors" name="Doctors" />
                        <NavItem icon={<AlertsIcon />} label="Alerts" name="Alerts" />
                    </nav>
                </div>
                <div>
                    <button onClick={onLogout} className="w-full flex items-center py-3 px-4 rounded-lg text-gray-600 hover:bg-purple-100 hover:text-purple-700">
                        <LogOutIcon />
                        <span className="ml-3 font-semibold">Log out</span>
                    </button>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                 <header className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-700">Home / {activeTab}</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <img src="https://placehold.co/40x40/E2E8F0/4A5568?text=U" alt="User" className="w-10 h-10 rounded-full" />
                            <span className="font-semibold text-gray-700">{user.name}</span>
                        </div>
                    </div>
                </header>
                {renderContent()}
            </main>
            {modal.type === 'appointment' && <ScheduleAppointmentModal onClose={() => setModal({ type: null })} onConfirm={handleConfirmAppointment} appointment={modal.data} doctors={doctors} />}
            {modal.type === 'add_queue' && <AddPatientToQueueModal onClose={() => setModal({ type: null })} onConfirm={handleAddPatientToQueue} />}
        </div>
    );
};

const LoginScreen = ({ onLogin, onSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            await onLogin(email, password);
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        try {
            await onSignup(email, password);
            setSuccess('Sign up successful! You can now log in.');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg border">
                <h1 className="text-3xl font-bold text-purple-700 text-center mb-8">ClinicFrontDes</h1>
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" required />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {success && <p className="text-green-500 text-sm text-center">{success}</p>}
                    <div className="flex gap-4">
                        <button onClick={handleLogin} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700">
                            Log In
                        </button>
                        <button onClick={handleSignup} className="w-full flex justify-center py-2 px-4 border border-purple-600 rounded-md shadow-sm text-sm font-medium text-purple-600 bg-white hover:bg-purple-50">
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};