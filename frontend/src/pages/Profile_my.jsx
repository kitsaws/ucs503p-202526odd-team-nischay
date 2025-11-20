import Layout from '../layouts/Layout'
import { useUser } from '../context/userContext'
import { Button } from '../components/ui/Button'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Avatar from '../components/ui/Avatar'
import { Mail, Linkedin, Github, Code, LogOut, Users, SquareArrowOutUpRight, SquarePen } from 'lucide-react'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import api from '../services/api'

const Profile = () => {
    const navigate = useNavigate();
    const { user: userAuth } = useUser();
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleLogout = async () => {
        try {
            const res = await api.get('/auth/logout');
            setUser(null);
            navigate('/');
            window.location.reload();
        } catch (err) {
            toast.error('Logout failed');
            console.error('Logout Failed', err.response?.data || err.message);
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/user/${id}`);
                // console.log(res.data);
                setUser(res.data);
            } catch (err) {
                alert('User not found.');
                setUser(null);
                console.error('User not found.', err.response?.data || err.message);
            } finally {
                setLoading(false)
            }
        }
        fetchUser();
    }, []);

    if (loading) return <p>Loading...</p>
    return (
        <Layout>
            <section className='grid grid-cols-3 gap-10 w-full'>
                <div className="leftDiv col-span-1 space-y-4">
                    <div className="aboutMe border border-border rounded-xl p-6 w-full flex flex-col justify-center items-center gap-4">
                        <div className="pfp flex justify-center items-center">
                            <Avatar member={user} size={'size-26'} />
                        </div>
                        <h2 className='text-2xl font-bold'>{user.name}</h2>
                        {
                            userAuth && userAuth._id === id && (
                                <div className='space-x-2'>
                                    <Button
                                        variant={'outline'}
                                        onClick={() => navigate(`/profile/${id}/edit-profile`)}
                                    >
                                        <SquarePen /> Edit Profile
                                    </Button>
                                    <Button variant={'outline'} onClick={handleLogout} className={'text-red-500 border-red-500 hover:bg-red-500'}>
                                        <LogOut /> Logout
                                    </Button>
                                </div>
                            )}
                        <div className="w-[95%] h-0 border border-muted mx-auto my-2" />
                        <div className='w-full text-md space-y-2 text-muted-foreground'>
                            {/* Email */}
                            {user.socials?.email && (
                                <div className="flex gap-2 cursor-pointer items-center">
                                    <Mail size={20} />
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(user.socials.email)
                                                .then(() => toast.success('Email Copied!'))
                                                .catch(err => {
                                                    toast.error("Couldn't copy email")
                                                    console.error('Failed to copy: ', err)
                                                });
                                        }}
                                        className="hover:underline cursor-pointer"
                                    >
                                        {user.socials.email}
                                    </button>
                                </div>
                            )}

                            {/* LinkedIn */}
                            {user.socials?.linkedin && (
                                <div className="flex gap-2 cursor-pointer items-center">
                                    <Linkedin size={20} />
                                    <a
                                        href={user.socials.linkedin.startsWith("http")
                                            ? user.socials.linkedin
                                            : `https://${user.socials.linkedin}`}
                                        className="hover:underline"
                                        target="_blank"
                                    >
                                        LinkedIn
                                    </a>
                                </div>
                            )}

                            {/* GitHub */}
                            {user.socials?.github && (
                                <div className="flex gap-2 cursor-pointer items-center">
                                    <Github size={20} />
                                    <a
                                        href={user.socials.github.startsWith("http")
                                            ? user.socials.github
                                            : `https://${user.socials.github}`}
                                        className="hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        GitHub
                                    </a>
                                </div>
                            )}
                        </div>
                        {user.bio.length !== 0 && (
                            <>
                                <div className="w-[95%] h-0 border border-muted mx-auto my-2" />
                                <div className='w-full text-muted-foreground'>
                                    <p className='text-lg font-semibold'>About</p>
                                    <p>{user.bio}</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="rightDiv col-span-2 space-y-4">
                    <div className='skills rounded-xl border border-border p-6'>
                        <h3 className='flex gap-2 mb-2 justify-center items-center w-fit text-xl font-semibold'>
                            <Code />
                            Skills
                        </h3>
                        <div className='flex gap-2'>
                            {user.skills.length === 0 ? (<p className='text-muted-foreground'>No skills added...</p>) : (
                                user.skills.map((skill, index) => (
                                    <p key={index} className='text-sm font-semibold text-muted-foreground px-2 py-1 rounded-full bg-muted'>{skill}</p>
                                ))
                            )}
                        </div>
                        {user.interest && user.interest.length !== 0 && (
                            <>
                                <div className="w-[95%] h-0 border border-muted mx-auto my-2" />
                                < h3 className='flex gap-2 mb-2 justify-center items-center w-fit text-xl font-semibold'>
                                    Interests
                                </h3>
                                <div className='flex gap-2'>
                                    {
                                        user.skills.map((skill, index) => (
                                            <p key={index} className='text-sm font-semibold text-muted-foreground px-2 py-1 rounded-full bg-muted'>{skill}</p>
                                        ))
                                    }
                                </div>
                            </>
                        )}
                    </div>

                    <div className='teams rounded-xl border border-border p-6'>
                        <h3 className='flex gap-2 mb-4 justify-center items-center w-fit text-xl font-semibold'>
                            <Users />
                            Teams
                        </h3>
                        <div className='flex flex-col gap-2'>
                            {user.teams.length === 0 ? (<p className='text-muted-foreground'>Not a part of any team...</p>) : (
                                user.teams.map((team, index) => (
                                    <div key={index} className="teamCard rounded-lg px-6 py-2 bg-muted w-full flex justify-between items-center">
                                        <div>
                                            <p className='text-lg font-semibold'>{team.teamName}</p>
                                            <p className='text-sm text-muted-foreground'>{team.eventId.title}</p>
                                        </div>
                                        <div className='flex gap-2 justify-center items-center'>
                                            {user._id === team.leaderId ? (
                                                <Button variant={'outline'} size={'sm'} onClick={() => navigate(`/team/${team._id}/edit`)}>
                                                    Manage Team
                                                </Button>
                                            ) : (
                                                <Link to={`/team/${team._id}`}>
                                                    <SquareArrowOutUpRight />
                                                </Link>
                                            )}

                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {user.interest && user.interest.length !== 0 && (
                            <>
                                <div className="w-[95%] h-0 border border-muted mx-auto my-2" />
                                < h3 className='flex gap-2 mb-2 justify-center items-center w-fit text-xl font-semibold'>
                                    Interests
                                </h3>
                                <div className='flex gap-2'>
                                    {
                                        user.skills.map((skill, index) => (
                                            <p key={index} className='text-sm font-semibold text-muted-foreground px-2 py-1 rounded-full bg-muted'>{skill}</p>
                                        ))
                                    }
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </Layout >
    )
}

export default Profile
