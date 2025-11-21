import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../layouts/Layout';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { ExternalLink, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/Button';
import Card from '../components/TeamsPage/Card';

const EventDisplay = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/events/${id}`);
                // console.log(res.data);
                setEvent(res.data);
            } catch (err) {
                console.error('Could not fetch team info', err.response?.data || err.message);
                toast.error('Could not fetch team info');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <section className="w-full max-w-5xl mx-auto py-6 md:py-10">
                    <p className="text-muted-foreground">Fetching event details...</p>
                </section>
            </Layout>
        );
    }

    if (!event) {
        return (
            <Layout>
                <section className="w-full max-w-5xl mx-auto py-6 md:py-10">
                    <p className="text-muted-foreground">Event not found.</p>
                </section>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="w-full">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                    <div className="left-div w-full lg:w-2/3 flex flex-col gap-4">
                        <div className="rounded-2xl border border-border bg-background/60 p-5 md:p-6 flex flex-col gap-4">
                            <div className="flex justify-between items-center gap-4">
                                <div className="min-w-0">
                                    <h2 className="text-2xl md:text-3xl font-bold mb-1 break-words">
                                        {event.title}
                                    </h2>
                                </div>
                                <Button
                                    variant={'outline'}
                                    onClick={() => window.open(event.registrationLink, "_blank")}
                                    className={'p-1'}
                                    size={'sm'}
                                >
                                    <ExternalLink />
                                </Button>
                            </div>
                            {event.organizer && (
                                <p className="text-sm md:text-md text-muted-foreground leading-relaxed line-clamp-2">
                                    {event.organizer}
                                </p>
                            )}
                            {event.description && (
                                <p className="text-sm md:text-md text-muted-foreground leading-relaxed line-clamp-2">
                                    {event.description}
                                </p>
                            )}
                        </div>

                        <div className="rounded-2xl border border-border bg-background/60 p-5 md:p-6 flex flex-col gap-4">
                            <h3 className="text-lg md:text-2xl font-bold">Listed Teams</h3>
                            {event.teams.length == 0 ? (<p className='text-muted-foreground'>No teams listed yet...</p>) :
                                (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {event.teams.map((team) => (
                                        <Card key={team._id} team={team} />
                                    ))}
                                </div>)
                            }
                        </div>
                    </div>

                    {/* RIGHT SIDE: Leader panel / Join panel */}
                    <div className="right-div-leader w-full lg:flex-1 rounded-2xl border border-border bg-background/60 p-5 md:p-6 h-fit flex flex-col gap-4">
                        <p className='text-2xl font-bold text-center'>Interested?</p>
                        <Button
                            variant="default"
                            className="w-full sm:w-auto justify-center"
                            onClick={() => window.open(event.registrationLink, "_blank")}
                        >
                            <ExternalLink size={20} />
                            Go to Event
                        </Button>
                        <Button
                            variant="default"
                            className="w-full sm:w-auto justify-center"
                            onClick={() => navigate(`/create-team`)}
                        >
                            <Users size={20} />
                            Form a Team
                        </Button>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default EventDisplay;