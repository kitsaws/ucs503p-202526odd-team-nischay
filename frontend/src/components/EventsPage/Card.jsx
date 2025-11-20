import { Badge, Calendar, Clock, MapPin, Users } from 'lucide-react'
import { Button } from '../ui/Button'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

const Card = ({ event }) => {
    const navigate = useNavigate();
    return (
        <div className="rounded-xl overflow-hidden hover-lift border border-border">
            <div className="h-2 bg-primary"></div>
            <div className="p-6 flex flex-col justify-between">
                <div className='flex flex-col gap-2 mb-4'>
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <p className='text-xs rounded-full px-3 py-1 bg-muted w-fit'>
                                {event.category}
                            </p>
                            <h3 className="text-xl font-semibold">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">{event.organizer}</p>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{moment(event.time).format("DD-MM-YYYY")}</span>
                        </div>
                        {event.time &&
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{moment(event.time).format("DD-MM-YYYY")}</span>
                            </div>
                        }
                        {event.location &&
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                            </div>
                        }
                    </div>
                </div>

                <div className="pt-4 flex flex-col lg:flex-row gap-2 lg:gap-4 mb-2">
                    <Button variant="default" className="justify-center items-center flex-1">
                        View Details
                    </Button>
                    <Button
                        variant="outline"
                        className="justify-center items-center flex-1"
                        onClick={() => navigate('/create-team')}
                    >
                        Join Event
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Card
