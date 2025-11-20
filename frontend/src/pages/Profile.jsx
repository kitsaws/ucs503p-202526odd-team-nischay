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
      await api.get('/auth/logout');
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
        setUser(res.data);
      } catch (err) {
        toast.error('User not found.');
        setUser(null);
        console.error('User not found.', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <section className="w-full max-w-5xl mx-auto px-4 py-8">
          <p className="text-muted-foreground">Loading profile...</p>
        </section>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <section className="w-full max-w-5xl mx-auto px-4 py-8">
          <p className="text-muted-foreground">No user data found.</p>
        </section>
      </Layout>
    );
  }

  const skills = user.skills || [];
  const interests = user.interest || [];
  const teams = user.teams || [];

  return (
    <Layout>
      <section className="w-full max-w-5xl mx-auto py-6 md:py-10">
        {/* Top header for mobile: name + avatar */}
        <div className="mb-6 flex items-center justify-center gap-4 md:hidden">
          <Avatar member={user} size={'size-16'} />
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            {user.bio && user.bio.length > 0 && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6 w-full">
          {/* LEFT COLUMN */}
          <div className="leftDiv lg:col-span-1 space-y-4">
            <div className="aboutMe border border-border rounded-2xl p-6 w-full flex flex-col items-center gap-4 bg-background/60 backdrop-blur-sm">
              {/* Avatar + Name (hidden on mobile because we show a compact header above) */}
              <div className="hidden md:flex flex-col items-center gap-3">
                <Avatar member={user} size={'size-26'} />
                <h2 className="text-2xl font-bold text-center break-words">
                  {user.name}
                </h2>
              </div>

              {/* Actions */}
              {userAuth && userAuth._id === id && (
                <div className="w-full flex flex-col xl:flex-row gap-2 justify-center">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto flex justify-center items-center gap-2"
                    onClick={() => navigate(`/profile/${id}/edit-profile`)}
                  >
                    <SquarePen size={16} />
                    <span>Edit Profile</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto flex justify-center items-center gap-2 text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </Button>
                </div>
              )}

              <div className="w-[95%] h-px bg-muted my-3" />

              {/* Socials */}
              <div className="w-full text-sm space-y-3 text-muted-foreground">
                {/* Email */}
                {user.socials?.email && (
                  <div className="flex gap-2 items-center">
                    <Mail size={18} />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(user.socials.email)
                          .then(() => toast.success('Email copied!'))
                          .catch(err => {
                            toast.error("Couldn't copy email");
                            console.error('Failed to copy: ', err);
                          });
                      }}
                      className="hover:underline truncate text-left"
                    >
                      {user.socials.email}
                    </button>
                  </div>
                )}

                {/* LinkedIn */}
                {user.socials?.linkedin && (
                  <div className="flex gap-2 items-center">
                    <Linkedin size={18} />
                    <a
                      href={
                        user.socials.linkedin.startsWith('http')
                          ? user.socials.linkedin
                          : `https://${user.socials.linkedin}`
                      }
                      className="hover:underline truncate"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                  </div>
                )}

                {/* GitHub */}
                {user.socials?.github && (
                  <div className="flex gap-2 items-center">
                    <Github size={18} />
                    <a
                      href={
                        user.socials.github.startsWith('http')
                          ? user.socials.github
                          : `https://${user.socials.github}`
                      }
                      className="hover:underline truncate"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  </div>
                )}
              </div>

              {/* About */}
              {user.bio && user.bio.length > 0 && (
                <>
                  <div className="w-[95%] h-px bg-muted my-3" />
                  <div className="w-full text-muted-foreground space-y-1">
                    <p className="text-base font-semibold">About</p>
                    <p className="text-sm leading-relaxed break-words">
                      {user.bio}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="rightDiv md:col-span-2 space-y-4">
            {/* SKILLS & INTERESTS */}
            <div className="skills rounded-2xl border border-border p-6 bg-background/60 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Code size={20} />
                <h3 className="text-lg md:text-xl font-semibold">Skills</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No skills added yet...
                  </p>
                ) : (
                  skills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs md:text-sm font-medium text-muted-foreground px-3 py-1 rounded-full bg-muted/60 border border-border"
                    >
                      {skill}
                    </span>
                  ))
                )}
              </div>

              {interests.length > 0 && (
                <>
                  <div className="w-[95%] h-px bg-muted my-4" />
                  <h3 className="flex gap-2 mb-3 items-center w-fit text-lg md:text-xl font-semibold">
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest, index) => (
                      <span
                        key={index}
                        className="text-xs md:text-sm font-medium text-muted-foreground px-3 py-1 rounded-full bg-muted"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* TEAMS */}
            <div className="teams rounded-2xl border border-border p-6 bg-background/60 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <Users size={20} />
                <h3 className="text-lg md:text-xl font-semibold">Teams</h3>
              </div>

              <div className="flex flex-col gap-3">
                {teams.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Not a part of any team yet...
                  </p>
                ) : (
                  teams.map((team, index) => (
                    <div
                      key={index}
                      className="teamCard rounded-xl px-4 md:px-6 py-3 bg-muted/60 border border-border flex justify-between gap-3 hover:bg-muted/80 transition"
                    >
                      <div className="min-w-0">
                        <p className="text-base md:text-lg font-semibold truncate">
                          {team.teamName}
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground truncate">
                          {team.eventId?.title}
                        </p>
                      </div>

                      <div className="flex gap-2 items-center justify-start md:justify-end">
                        {user._id === team.leaderId ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/team/${team._id}/edit`)}
                          >
                            Manage Team
                          </Button>
                        ) : (
                          <Link
                            to={`/team/${team._id}`}
                            className="p-2 rounded-full hover:bg-background/60"
                          >
                            <SquareArrowOutUpRight size={18} />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
