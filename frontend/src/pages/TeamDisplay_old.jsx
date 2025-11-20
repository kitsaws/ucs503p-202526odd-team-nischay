import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../layouts/Layout'
import { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, Github, Linkedin, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import { useUser } from '../context/userContext';

const TeamDisplay = () => {
    const { id } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleRequestToJoin = async () => {
        if (!user) return toast.error('You need to Login first.')
        try {
            const res = await api.post(`/teams/${team._id}/request`);
            toast.success(res.data.message); // show success message
        } catch (err) {
            // If server sends a JSON error message
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error('Something went wrong');
            }
        }
    };

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await api.get(`/teams/${id}`);
                // console.log(res.data);
                setTeam(res.data);
            } catch (err) {
                console.error('Could not fetch team info', err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchTeam();
    }, [id])
    // console.log({ team });

    if (loading) return <p>Loading...</p>;
    if (!team) return <p>Team not found.</p>;

    return (
        <Layout>
            <div className='flex gap-4'>
                <div className='left-div w-2/3 flex flex-col gap-4'>
                    <div className="rounded-xl border flex flex-col gap-4 border-border p-8">
                        <div className='flex justify-between items-center'>
                            <div>
                                <h2 className='text-3xl font-bold mb-2'>{team.teamName}</h2>
                                <p className="text-muted-foreground">{team.eventId.title}</p>
                            </div>
                            <span className='rounded-xl text-white gradient-secondary p-4'>
                                <Users size={20} />
                            </span>
                        </div>
                        <p className="text-md text-muted-foreground">{team.description}</p>
                    </div>
                    <div className="rounded-xl border flex flex-col gap-4 border-border p-8">
                        <h3 className='text-xl font-semibold mb-2'>Team Members</h3>
                        <div className='flex flex-col gap-2 justify-between items-center'>
                            {team.members.map(member => (
                                <div key={member.id} className='rounded-xl flex gap-5 bg-muted p-5 w-full'>
                                    <div className="pfp flex justify-center items-center">
                                        <Avatar member={member} size={'size-16'} />
                                    </div>
                                    <div className='flex flex-1 justify-between'>
                                        <div className='flex flex-col gap-1 max-w-1/2'>
                                            <span className='flex gap-2 items-center'>
                                                <p className='font-semibold text-lg'>{member.name}</p>
                                                {team.leaderId._id == member._id && <p className='w-fit rounded-full text-white bg-accent text-xs px-2 py-1'>Leader</p>}
                                            </span>
                                            {member.bio && <p className='text-muted-foreground'>{member.bio}</p>}
                                            {member.skills.length !== 0 &&
                                                <div className='mt-1 flex flex-wrap gap-1 w-full'>
                                                    {member.skills.map((skill, index) => (
                                                        <p key={index} className='w-fit rounded-full font-medium text-xs text-muted-foreground bg-muted px-2 py-1 border'>{skill}</p>
                                                    ))}
                                                </div>
                                            }
                                        </div>
                                        <div className='socials h-fit flex gap-2'>
                                            {/* Email */}
                                            {member.socials?.email && (
                                                <Button

                                                    onClick={() => {
                                                        navigator.clipboard.writeText(member.socials.email)
                                                            .then(() => toast.success('Email Copied!'))
                                                            .catch(err => {
                                                                toast.error("Couldn't copy email")
                                                                console.error('Failed to copy: ', err)
                                                            });
                                                    }}
                                                    variant='outline'
                                                    className='p-2 hover:bg-secondary text-secondary border-secondary'
                                                >
                                                    <Mail size={20} />
                                                </Button>
                                            )}

                                            {/* LinkedIn */}
                                            {member.socials?.linkedin && (
                                                <Button
                                                    variant='outline'
                                                    className='p-2 hover:bg-secondary text-secondary border-secondary'
                                                    onClick={() => {
                                                        const link = member.socials.linkedin.startsWith('http')
                                                            ? member.socials.linkedin
                                                            : `https://${member.socials.linkedin}`;
                                                        window.open(link, '_blank', 'noopener,noreferrer');
                                                    }}
                                                >
                                                    <Linkedin size={20} />
                                                </Button>
                                            )}

                                            {/* GitHub */}
                                            {member.socials?.github && (
                                                <Button
                                                    variant='outline'
                                                    className='p-2 hover:bg-secondary text-secondary border-secondary'
                                                    onClick={() => {
                                                        const link = member.socials.github.startsWith('http')
                                                            ? member.socials.github
                                                            : `https://${member.socials.github}`;
                                                        window.open(link, '_blank', 'noopener,noreferrer');
                                                    }}
                                                >
                                                    <Github size={20} />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='right-div-leader rounded-xl border h-fit flex-1 flex flex-col gap-4 border-border p-8'>
                    {user ? (
                        (team.leaderId?._id || team.leaderId) === user._id ? (
                            <>
                                <p className="text-xl font-bold text-center mb-2">Manage Team</p>
                                <div className='flex justify-center gap-2'>
                                    <Button
                                        variant="default"
                                        onClick={() => navigate(`/team/${id}/requests`)}
                                    >
                                        Review Requests
                                    </Button>
                                    <Button
                                        variant="default"
                                        onClick={() => navigate(`/team/${id}/edit`)}
                                    >
                                        Edit Team Info
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className='text-lg font-bold'>Roles Needed</p>
                                <div className='flex flex-wrap gap-2 mb-8'>
                                    {team.rolesNeeded.map((role, index) => (
                                        <span key={index} className='px-3 py-1 rounded-lg border border-border'>{role}</span>
                                    ))
                                    }
                                </div>
                                <p className="text-lg font-bold text-center">Want to join?</p>
                                {team.members.some(member => member._id === user._id) ? (
                                    <Button
                                        variant="ghost"
                                        className="justify-center bg-muted-foreground text-muted hover:bg-muted-foreground cursor-not-allowed"
                                    >
                                        Already in the team
                                    </Button>
                                ) : (
                                    <>
                                    {
                                        team.teamSize == team.members.length ?
                                            (
                                                <Button
                                                    variant='border'
                                                    className='bg-muted justify-center cursor-not-allowed'
                                                >
                                                    Team Full
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="default"
                                                    className='mx-auto'
                                                    onClick={() => {
                                                        toast.info('Please log in first');
                                                    }}
                                                >
                                                    Request to Join
                                                </Button>
                                            )
                                    }
                                    </> 
                                )}

                            </>
                        )
                    ) : (
                        <>
                            <p className='text-lg font-bold'>Roles Needed</p>
                            <div className='flex flex-wrap gap-2 mb-8'>
                                {team.rolesNeeded.map((role, index) => (
                                    <span key={index} className='px-3 py-1 rounded-lg border border-border'>{role}</span>
                                ))
                                }
                            </div>
                            <p className="text-lg font-bold text-center">Want to join?</p>
                            {team.teamSize == team.members.length ?
                                (
                                    <Button
                                        variant='border'
                                        className=''
                                    >
                                        Team Full
                                    </Button>
                                ) : (
                                    <Button
                                        variant="default"
                                        className='mx-auto'
                                        onClick={() => {
                                            toast.info('Please log in first');
                                        }}
                                    >
                                        Request to Join
                                    </Button>
                                )
                            }

                        </>
                    )}
                </div>
            </div>
        </Layout >
    )
}

export default TeamDisplay
