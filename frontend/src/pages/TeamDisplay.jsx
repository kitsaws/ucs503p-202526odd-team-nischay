import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../layouts/Layout';
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
    if (!user) return toast.error('You need to login first.');
    try {
      const res = await api.post(`/teams/${team._id}/request`);
      toast.success(res.data.message);
    } catch (err) {
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
        setTeam(res.data);
      } catch (err) {
        console.error('Could not fetch team info', err.response?.data || err.message);
        toast.error('Could not fetch team info');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <section className="w-full max-w-5xl mx-auto py-6 md:py-10">
          <p className="text-muted-foreground">Loading team...</p>
        </section>
      </Layout>
    );
  }

  if (!team) {
    return (
      <Layout>
        <section className="w-full max-w-5xl mx-auto py-6 md:py-10">
          <p className="text-muted-foreground">Team not found.</p>
        </section>
      </Layout>
    );
  }

  const isLeader = (team.leaderId?._id || team.leaderId) === user?._id;
  const isMember = user && team.members.some((member) => member._id === user._id);
  const isTeamFull = team.teamSize === team.members.length;

  return (
    <Layout>
      <section className="w-full">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* LEFT SIDE: Team info + members */}
          <div className="left-div w-full lg:w-2/3 flex flex-col gap-4">
            {/* TEAM HEADER CARD */}
            <div className="rounded-2xl border border-border bg-background/60 p-5 md:p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center gap-4">
                <div className="min-w-0">
                  <h2 className="text-2xl md:text-3xl font-bold mb-1 break-words">
                    {team.teamName}
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground truncate">
                    {team.eventId?.title}
                  </p>
                </div>
                <span className="rounded-xl text-white gradient-secondary p-3 md:p-4 flex items-center justify-center">
                  <Users size={20} />
                </span>
              </div>
              {team.description && (
                <p className="text-sm md:text-md text-muted-foreground leading-relaxed line-clamp-2">
                  {team.description}
                </p>
              )}
            </div>

            {/* MEMBERS CARD */}
            <div className="rounded-2xl border border-border bg-background/60 p-5 md:p-6 flex flex-col gap-4">
              <h3 className="text-lg md:text-xl font-semibold">Team Members</h3>
              <div className="flex flex-col gap-3">
                {team.members.map((member) => (
                  <div
                    key={member._id}
                    className="rounded-xl bg-muted/60 border border-border p-4 md:p-5 flex flex-col sm:flex-row gap-4"
                  >
                    <div className="pfp flex justify-center items-start sm:items-center">
                      <Avatar member={member} size={'size-16'} />
                    </div>

                    <div className="flex flex-1 flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-center">
                      {/* Member info */}
                      <div className="flex flex-col gap-1 min-w-0 text-center sm:text-start">
                        <span className="flex flex-wrap gap-2 mx-auto sm:mx-0 items-center">
                          <p className="font-semibold text-base md:text-lg break-words">
                            {member.name}
                          </p>
                          {team.leaderId._id === member._id && (
                            <p className="w-fit rounded-full text-white bg-accent text-xs px-2 py-1">
                              Leader
                            </p>
                          )}
                        </span>

                        {member.bio && (
                          <p className="text-xs md:text-sm text-muted-foreground break-words">
                            {member.bio}
                          </p>
                        )}

                        {member.skills && member.skills.length > 0 && (
                          <div className="mt-1 flex flex-wra justify-center items-center gap-1 w-full">
                            {member.skills.map((skill, index) => (
                              <p
                                key={index}
                                className="w-fit rounded-full font-medium text-[10px] md:text-xs text-muted-foreground bg-muted px-2 py-1 border"
                              >
                                {skill}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Socials */}
                      <div className="socials h-fit flex gap-2 flex-shrink-0">
                        {/* Email */}
                        {member.socials?.email && (
                          <Button
                            onClick={() => {
                              navigator.clipboard
                                .writeText(member.socials.email)
                                .then(() => toast.success('Email copied!'))
                                .catch((err) => {
                                  toast.error("Couldn't copy email");
                                  console.error('Failed to copy: ', err);
                                });
                            }}
                            variant="outline"
                            className="p-2 hover:bg-secondary text-secondary border-secondary"
                          >
                            <Mail size={18} />
                          </Button>
                        )}

                        {/* LinkedIn */}
                        {member.socials?.linkedin && (
                          <Button
                            variant="outline"
                            className="p-2 hover:bg-secondary text-secondary border-secondary"
                            onClick={() => {
                              const link = member.socials.linkedin.startsWith('http')
                                ? member.socials.linkedin
                                : `https://${member.socials.linkedin}`;
                              window.open(link, '_blank', 'noopener,noreferrer');
                            }}
                          >
                            <Linkedin size={18} />
                          </Button>
                        )}

                        {/* GitHub */}
                        {member.socials?.github && (
                          <Button
                            variant="outline"
                            className="p-2 hover:bg-secondary text-secondary border-secondary"
                            onClick={() => {
                              const link = member.socials.github.startsWith('http')
                                ? member.socials.github
                                : `https://${member.socials.github}`;
                              window.open(link, '_blank', 'noopener,noreferrer');
                            }}
                          >
                            <Github size={18} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Leader panel / Join panel */}
          <div className="right-div-leader w-full lg:flex-1 rounded-2xl border border-border bg-background/60 p-5 md:p-6 h-fit flex flex-col gap-4">
            {user ? (
              isLeader ? (
                <>
                  <p className="text-xl font-bold text-center mb-2">Manage Team</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-2">
                    <Button
                      variant="default"
                      className="w-full sm:w-auto justify-center"
                      onClick={() => navigate(`/team/${id}/requests`)}
                    >
                      Review Requests
                    </Button>
                    <Button
                      variant="default"
                      className="w-full sm:w-auto justify-center"
                      onClick={() => navigate(`/team/${id}/edit`)}
                    >
                      Edit Team Info
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold">Roles Needed</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {team.rolesNeeded?.map((role, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-lg border border-border text-sm"
                      >
                        {role}
                      </span>
                    ))}
                  </div>

                  <p className="text-lg font-bold text-center mb-2">Want to join?</p>

                  {isMember ? (
                    <Button
                      variant="ghost"
                      className="justify-center bg-muted-foreground text-muted hover:bg-muted-foreground cursor-not-allowed"
                    >
                      Already in the team
                    </Button>
                  ) : isTeamFull ? (
                    <Button
                      variant="outline"
                      className="justify-center bg-muted text-muted-foreground cursor-not-allowed"
                    >
                      Team Full
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      className="mx-auto w-full sm:w-auto justify-center"
                      onClick={handleRequestToJoin}
                    >
                      Request to Join
                    </Button>
                  )}
                </>
              )
            ) : (
              <>
                <p className="text-lg font-bold">Roles Needed</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {team.rolesNeeded?.map((role, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-lg border border-border text-sm"
                    >
                      {role}
                    </span>
                  ))}
                </div>

                <p className="text-lg font-bold text-center mb-2">Want to join?</p>

                {isTeamFull ? (
                  <Button
                    variant="outline"
                    className="justify-center bg-muted text-muted-foreground cursor-not-allowed"
                  >
                    Team Full
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    className="mx-auto w-full sm:w-auto justify-center"
                    onClick={() => {
                      toast.info('Please log in first');
                    }}
                  >
                    Request to Join
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TeamDisplay;