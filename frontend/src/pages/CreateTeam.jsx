import Layout from "../layouts/Layout";
import { Button } from "../components/ui/Button";
import { Label, Input } from "../components/ui/FormElements";
import Dropdown from "../components/ui/Dropdown";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useUser } from "../context/userContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useEvent } from "../context/eventContext";

const CreateTeam = () => {
    const { events, loading } = useEvent();
    const navigate = useNavigate();

    const eventNames = events?.map((event) => event.title) || [];
    const { user } = useUser();

    const [teamName, setTeamName] = useState("");
    const [teamDescription, setTeamDescription] = useState("");
    const [event, setEvent] = useState(null);
    const [teamSize, setTeamSize] = useState(0);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [customRole, setCustomRole] = useState("");

    const roles = [
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "Software Engineer",
        "Data Scientist",
        "Machine Learning Engineer",
        "DevOps Engineer",
        "Cloud Engineer",
        "UI/UX Designer",
        "Cybersecurity Specialist",
    ];

    const handleAddRole = (role) => {
        if (!role) return;
        const normalized = role.trim();
        if (!normalized) return;
        if (!selectedRoles.includes(normalized)) {
            setSelectedRoles((prev) => [...prev, normalized]);
        }
    };

    const handleRemoveRole = (role) => {
        setSelectedRoles((prev) => prev.filter((r) => r !== role));
    };

    const handleTeamSize = (size) => {
        if (size === "" || /^\d+$/.test(size)) {
            setTeamSize(size === "" ? 0 : Number(size));
        }
    };

    const handleSubmit = async () => {
        if (!user) return alert("You must be logged in!");

        if (!teamName || !event || selectedRoles.length === 0) {
            return alert("Please fill in all required fields");
        }

        if (teamSize === 0) {
            return alert("Team size must be greater than 0");
        }

        try {
            const payload = {
                teamName,
                teamSize,
                description: teamDescription,
                event,
                roles: selectedRoles,
            };

            const res = await api.post(`/teams/${user._id}/create-team`, payload);
            alert("Team created successfully!");
            navigate(`/team/${res.data._id}`);
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert("Failed to create team");
        }
    };

    if (loading) {
        return (
            <Layout>
                <section className="w-full max-w-5xl mx-auto py-6 md:py-10">
                    <p className="text-muted-foreground">Loading...</p>
                </section>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="w-full max-w-5xl mx-auto">
                {/* HEADER */}
                <div className="text-center md:text-start">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">Create a Team</h2>
                    <p className="text-sm md:text-base text-muted-foreground">
                        Find teammates who share your passion and skills
                    </p>
                </div>

                {/* FORM CARD */}
                <div className="mt-6 rounded-2xl border border-border bg-background/60 p-4 md:p-6 lg:p-8 flex flex-col gap-4">
                    {/* TOP FIELDS */}
                    <Label htmlFor="team-name">
                        Team Name <span className="text-red-500">*</span>
                        <Input
                            type="text"
                            name="team-name"
                            id="team-name"
                            placeholder="Enter your team name"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                        />
                    </Label>

                    <div className="flex flex-col md:flex-row gap-2 w-full">
                        <Label htmlFor="team-size" className="flex-1">
                            Team Size <span className="text-red-500">*</span>
                            <Input
                                type="text"
                                name="team-size"
                                id="team-size"
                                placeholder="Enter your team size"
                                value={teamSize === 0 ? "" : teamSize}
                                onChange={(e) => handleTeamSize(e.target.value)}
                            />
                        </Label>
                        <Label htmlFor="event">
                            Event <span className="text-red-500">*</span>
                            <Dropdown
                                options={eventNames}
                                defaultDisplay="Select an Event"
                                onSelect={(title) => {
                                    const selected = events.find((e) => e.title === title);
                                    if (selected) setEvent(selected._id);
                                }}
                            />
                        </Label>
                    </div>

                    <Label htmlFor="team-description" className="md:col-span-2">
                        Team Description
                        <textarea
                            name="team-description"
                            id="team-description"
                            value={teamDescription}
                            onChange={(e) => setTeamDescription(e.target.value)}
                            className="block border border-border w-full min-h-[120px] rounded-xl px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 ring-primary1 bg-background"
                        />
                    </Label>

                    {/* ROLES SECTION */}
                    <div className="mt-2">
                        <Label htmlFor="roles" className="w-full">
                            <div className="flex items-center justify-between">
                                <div>
                                    Roles Needed <span className="text-red-500">*</span>
                                    <p className="text-sm md:text-md text-muted-foreground font-normal">
                                        Add roles you're looking for in your team
                                    </p>
                                </div>
                            </div>

                            {/* Custom role input */}
                            <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                <Input
                                    type="text"
                                    name="roles"
                                    id="roles"
                                    placeholder="Add custom roles..."
                                    value={customRole}
                                    onChange={(e) => setCustomRole(e.target.value)}
                                />
                                <Button
                                    type="button"
                                    className="flex items-center justify-center gap-1 sm:px-3"
                                    onClick={() => {
                                        const trimmed = customRole.trim();
                                        if (!trimmed) return;
                                        const formatted =
                                            trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
                                        handleAddRole(formatted);
                                        setCustomRole("");
                                    }}
                                >
                                    <Plus size={16} />
                                    <span className="hidden sm:inline">Add</span>
                                </Button>
                            </div>

                            {/* Suggested roles */}
                            <div className="mt-4">
                                <p className="text-sm md:text-base">Suggested Roles:</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {roles.map((role, index) => (
                                        <Button
                                            key={index}
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => handleAddRole(role)}
                                        >
                                            <Plus size={14} />
                                            <span className="text-xs md:text-sm">{role}</span>
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Selected roles */}
                            {selectedRoles.length !== 0 && (
                                <>
                                    <p className="mt-4 text-sm md:text-base">Selected Roles:</p>
                                    <div
                                        id="selected-roles"
                                        className="mt-2 flex flex-wrap gap-2"
                                    >
                                        {selectedRoles.map((role, index) => (
                                            <Button
                                                key={index}
                                                type="button"
                                                variant="default"
                                                size="sm"
                                                className="flex items-center gap-1"
                                                onClick={() => handleRemoveRole(role)}
                                            >
                                                <span className="text-xs md:text-sm">{role}</span>
                                                <X size={14} />
                                            </Button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </Label>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="pt-2 flex justify-end">
                        <Button
                            size="lg"
                            className="w-full flex justify-center items-center"
                            onClick={handleSubmit}
                        >
                            Create Team
                        </Button>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default CreateTeam;
