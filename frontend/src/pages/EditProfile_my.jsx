import { useUser } from '../context/userContext';
import Layout from '../layouts/Layout';
import Avatar from '../components/ui/Avatar';
import { Label, Input } from '../components/ui/FormElements';
import { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Github, Linkedin, Image, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { toast } from 'react-toastify';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [basicInfoForm, setBasicInfoForm] = useState({
    fullName: "",
    email: "",
    university: "",
    branch: "",
    year: "",
    bio: "",
    resumeUrl: "",
    profilePic: "",
    skills: [],
    socials: {},
  });

  // Initialize form values from user
  useEffect(() => {
    if (user) {
      const filteredSocials = { ...user.socials };
      delete filteredSocials.email; // remove email from socials

      setBasicInfoForm({
        fullName: user.name || "",
        email: user.email || "",
        university: user.university || "",
        branch: user.branch || "",
        year: user.year || "",
        bio: user.bio || "",
        resumeUrl: user.resumeUrl || "",
        profilePic: user.profilePic || "",
        skills: user.skills || [],
        socials: filteredSocials || {},
      });
    }
  }, [user]);

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfoForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(",").map((s) => s.trim());
    setBasicInfoForm((prev) => ({
      ...prev,
      skills: skillsArray,
    }));
  };

  const handleSocialChange = (key, value) => {
    setBasicInfoForm((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [key]: value,
      },
    }));
  };

  const handleAddSocial = () => {
    const newKey = `social${Object.keys(basicInfoForm.socials).length + 1}`;
    setBasicInfoForm((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [newKey]: "",
      },
    }));
  };

  const handleRemoveSocial = (key) => {
    // prevent removal of LinkedIn and GitHub
    if (key.toLowerCase() === "linkedin" || key.toLowerCase() === "github") return;
    const updated = { ...basicInfoForm.socials };
    delete updated[key];
    setBasicInfoForm((prev) => ({
      ...prev,
      socials: updated,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/user/${user._id}/update`, basicInfoForm);
      toast.success("Profile Updated Successfully");
      setTimeout(() => navigate(`/user/${user._id}`), 3000);
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating profile");
    }
  };

  const renderSocialIcon = (key) => {
    switch (key.toLowerCase()) {
      case "linkedin":
        return <Linkedin className="text-blue-600" size={18} />;
      case "github":
        return <Github className="text-gray-800" size={18} />;
      default:
        return null;
    }
  };

  const prettifyKey = (key) => {
    if (key.toLowerCase() === "linkedin") return "LinkedIn";
    if (key.toLowerCase() === "github") return "GitHub";
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <Layout>
      <section className="px-50 flex flex-col gap-4">
        <h2 className="text-4xl font-bold mb-4">My Profile</h2>

        {/* PROFILE HEADER */}
        <div className="flex gap-2 rounded-xl border-2 border-border bg-background/60 px-8 py-6">
          <div className="pfp flex justify-center items-center">
            <Avatar member={user} size={"size-26"} />
          </div>
          <div className="min-h-[95%] border border-muted mx-4" />
          <div className="flex flex-col gap-2 justify-center">
            <h3 className="text-2xl font-semibold">{user?.name}</h3>
            <div className="university text-lg text-muted-foreground">
              {user?.university && <p>{user.university}</p>}
              <p>
                {user?.branch && <span>{user.branch}</span>}
                {user?.year && <span> • {user.year}</span>}
              </p>
            </div>
          </div>
        </div>

        {/* BASIC INFO */}
        <div className="rounded-xl border-2 border-border bg-background/60 px-10 py-8 space-y-4">
          <h3 className="text-xl font-semibold">Basic Information</h3>

          <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
            <Label htmlFor="fullName">
              Full Name
              <Input
                name="fullName"
                id="fullName"
                value={basicInfoForm.fullName}
                onChange={handleBasicInfoChange}
              />
            </Label>

            <Label htmlFor="email">
              Email
              <Input
                name="email"
                id="email"
                value={basicInfoForm.email}
                onChange={handleBasicInfoChange}
              />
            </Label>

            <Label htmlFor="university">
              University
              <Input
                name="university"
                id="university"
                value={basicInfoForm.university}
                onChange={handleBasicInfoChange}
              />
            </Label>

            <Label htmlFor="branch">
              Branch
              <Input
                name="branch"
                id="branch"
                value={basicInfoForm.branch}
                onChange={handleBasicInfoChange}
              />
            </Label>

            <Label htmlFor="year">
              Year
              <Input
                name="year"
                id="year"
                value={basicInfoForm.year}
                onChange={handleBasicInfoChange}
              />
            </Label>

            <Label htmlFor="bio" className="col-span-2">
              Bio
              <textarea
                name="bio"
                id="bio"
                value={basicInfoForm.bio}
                onChange={handleBasicInfoChange}
                className="block border border-border w-full min-h-25 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 ring-primary1"
              ></textarea>
            </Label>

            <Label htmlFor="skills" className="col-span-2">
              Skills (comma separated)
              <Input
                name="skills"
                id="skills"
                value={basicInfoForm.skills.join(", ")}
                onChange={handleSkillsChange}
              />
            </Label>

            <Label htmlFor="resumeUrl">
              <div className="flex items-center gap-2">
                <FileText size={16} /> Resume Link
              </div>
              <Input
                name="resumeUrl"
                id="resumeUrl"
                placeholder="https://..."
                value={basicInfoForm.resumeUrl}
                onChange={handleBasicInfoChange}
              />
            </Label>

            <Label htmlFor="profilePic">
              <div className="flex items-center gap-2">
                <Image size={16} /> Profile Picture URL
              </div>
              <Input
                name="profilePic"
                id="profilePic"
                placeholder="https://..."
                value={basicInfoForm.profilePic}
                onChange={handleBasicInfoChange}
              />
            </Label>

            {/* SOCIALS */}
            <div className="col-span-2 space-y-4 mt-4">
              <h3 className="text-xl font-semibold flex items-center justify-between">
                Socials
                <button
                  type="button"
                  onClick={handleAddSocial}
                  className="flex items-center text-primary1 hover:underline"
                >
                  <PlusCircle size={18} className="mr-1" /> Add More
                </button>
              </h3>

              {Object.entries(basicInfoForm.socials).map(([key, value]) => (
                <div key={key} className="flex gap-4 items-center">
                  <div className="flex items-center gap-2 w-1/3">
                    {renderSocialIcon(key)}
                    <span className="font-medium text-gray-800">{prettifyKey(key)}</span>
                  </div>
                  <Input
                    placeholder="Profile URL"
                    value={value}
                    onChange={(e) => handleSocialChange(key, e.target.value)}
                    className="w-2/3"
                  />
                  {key.toLowerCase() !== "linkedin" && key.toLowerCase() !== "github" && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSocial(key)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* SAVE BUTTON */}
            <div className="col-span-2 pt-6 flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default EditProfile;
