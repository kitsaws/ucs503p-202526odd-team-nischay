import { Code, Trophy, Users } from 'lucide-react'
import { Button } from '../ui/Button'
import AvatarContainer from '../../components/ui/AvatarContainer'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { toast } from 'react-toastify'
import { useUser } from '../../context/userContext'

const Card = ({ team }) => {
    const { user } = useUser();
    const navigate = useNavigate();
    const teamStatus = (team.teamSize === team.members.length ? 'Full' : 'Recruiting')
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

    return (
        <div className="rounded-xl overflow-hidden hover-lift border border-border">
            <div className="h-2 bg-primary"></div>
            <div className="p-6 h-full flex flex-col justify-between">
                <div className='flex flex-col gap-2 mb-4'>
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <span className='flex gap-2'>   
                                <Trophy className='text-orange-400' />
                                <h3 className="text-xl font-semibold">{team.teamName}</h3>
                            </span>
                            <p className="text-sm text-muted-foreground">{team.eventId.title}</p>
                        </div>
                        <p className={`text-xs rounded-full font-semibold px-3 py-1  w-fit ${teamStatus === 'Recruiting' ? 'bg-accent text-white' : 'bg-muted'}`}>
                            {teamStatus}
                        </p>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">{team.description}</p>

                    <div className="space-y-2 text-sm  mb-0">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>
                                {team.members.length}/{team.teamSize} Members
                            </span>
                        </div>
                        <AvatarContainer members={team.members} />
                    </div>
                    <div className='font-semibold'>
                        <span>
                            <Code className='text-muted-foreground inline mr-2' />
                            Looking for:
                        </span>
                        <div className='mt-1 flex flex-wrap gap-1 w-full'>
                            {team.rolesNeeded.map((role, index) => (
                                <p key={index} className='w-fit rounded-full font-medium text-sm text-muted-foreground bg-muted px-2 border border-border'>{role}</p>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex flex-col lg:flex-row gap-2 lg:gap-4 mb-2">
                    <Button
                        variant="outline"
                        className="justify-center items-center flex-1"
                        onClick={() => navigate(`/team/${team._id}`)}
                    >
                        View Team
                    </Button>
                    {/* {teamStatus === 'Recruiting' &&
                        // team.request
                        <Button variant="default" onClick={handleRequestToJoin} className="justify-center items-center flex-1">
                            Request to Join
                        </Button>
                    } */}
                </div>
            </div>
        </div>
    )
}

export default Card
