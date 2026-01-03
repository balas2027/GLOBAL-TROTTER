import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion } from 'framer-motion';
import { getUserTrips } from '../services/trip.service';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Grid, List } from 'lucide-react';
import { IconButton, Button, ButtonGroup } from '@mui/material';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CustomToolbar = (toolbar) => {
    const goToBack = () => {
        toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
        toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
        toolbar.onNavigate('TODAY');
    };

    const setMonthView = () => {
        toolbar.onView('month');
    };

    const setAgendaView = () => {
        toolbar.onView('agenda');
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 p-2">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
                <Button 
                    variant="outlined" 
                    onClick={goToCurrent}
                    startIcon={<CalendarIcon size={16}/>}
                    sx={{ borderRadius: '12px', textTransform: 'none', borderColor: '#e2e8f0', color: '#475569' }}
                >
                    Today
                </Button>
                <div className="flex bg-white rounded-xl border border-slate-200 shadow-sm ml-2">
                    <IconButton onClick={goToBack} size="small">
                        <ChevronLeft size={20} className="text-slate-600"/>
                    </IconButton>
                    <IconButton onClick={goToNext} size="small">
                        <ChevronRight size={20} className="text-slate-600"/>
                    </IconButton>
                </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-slate-800 capitalize">
                {toolbar.label}
            </h2>

            <div className="flex gap-2 mt-4 md:mt-0">
                <ButtonGroup variant="outlined" sx={{ borderRadius: '12px', boxShadow: 'none' }}>
                    <Button 
                        onClick={setMonthView}
                        variant={toolbar.view === 'month' ? 'contained' : 'outlined'}
                        startIcon={<Grid size={16}/>}
                        sx={{ borderRadius: '12px 0 0 12px', textTransform: 'none' }}
                    >
                        Month
                    </Button>
                    <Button 
                        onClick={setAgendaView}
                        variant={toolbar.view === 'agenda' ? 'contained' : 'outlined'}
                        startIcon={<List size={16}/>}
                        sx={{ borderRadius: '0 12px 12px 0', textTransform: 'none' }}
                    >
                        Agenda
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
};

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState('month');
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const onNavigate = (newDate) => {
        setDate(newDate);
    };

    const onView = (newView) => {
        setView(newView);
    };

    // Generate consistent pastel color from string
    const stringToColor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return '#' + '00000'.substring(0, 6 - c.length) + c;
    };

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const trips = await getUserTrips();
                const calendarEvents = trips.map(trip => {
                    // Slight randomization or consistent hashing for color
                    const baseColor = stringToColor(trip.title);
                    return {
                        id: trip.id,
                        title: trip.title,
                        start: new Date(trip.start_date),
                        end: new Date(trip.end_date),
                        allDay: true,
                        resource: trip,
                        color: baseColor
                    };
                });
                setEvents(calendarEvents);
            } catch (error) {
                console.error("Error fetching trips for calendar", error);
            }
        };

        if (isAuthenticated) {
            fetchTrips();
        }
    }, [isAuthenticated]);

    const handleSelectEvent = (event) => {
        navigate(`/trip/${event.id}`);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="p-6 md:p-12 min-h-screen bg-slate-50 relative overflow-hidden"
        >
             {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -right-20 w-80 h-80 bg-purple-100/50 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="mb-8">
                     <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Travel Calendar</span>
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">Visualise your upcoming adventures.</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-2xl border border-white/50 h-[750px] transition-all duration-300 hover:shadow-blue-900/5">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 650, fontFamily: "'Inter', sans-serif" }}
                        onSelectEvent={handleSelectEvent}
                        views={['month', 'agenda']}
                        date={date}
                        view={view}
                        onNavigate={onNavigate}
                        onView={onView}
                        components={{
                            toolbar: CustomToolbar
                        }}
                        eventPropGetter={(event) => {
                            const isAgenda = view === 'agenda';
                            return {
                                style: {
                                    backgroundColor: isAgenda ? 'transparent' : (event.color || '#3b82f6'),
                                    color: isAgenda ? '#1e293b' : 'white',
                                    border: 'none',
                                    borderLeft: isAgenda ? `4px solid ${event.color || '#3b82f6'}` : 'none',
                                    borderRadius: isAgenda ? '0' : '8px',
                                    padding: '4px 8px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    boxShadow: isAgenda ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
                                    cursor: 'pointer',
                                    opacity: 0.9,
                                    // Fix for Agenda View unevenness
                                    display: isAgenda ? 'flex' : 'block',
                                    alignItems: isAgenda ? 'center' : 'unset'
                                }
                            };
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default CalendarPage;
