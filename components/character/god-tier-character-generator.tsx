'use client'
import React, { useState } from 'react';
import { Save, RefreshCw, Upload, HelpCircle } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { saveGodTierCharacter } from '@/app/actions/character'

type Skill = {
  name: string;
  question: string;
  answer: string;
};

type Proficiency = {
  name: string;
  question: string;
  answer: string;
  interestQuestion: string;
  interestAnswer: string;
};

const GodTierCharacterSheet: React.FC = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [background, setBackground] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  
  const [creatorSkills, setCreatorSkills] = useState<Skill[]>([
    { name: 'Content Creation', question: "In the grand tapestry of digital realms, how do you weave your content to captivate the masses? Speak of your methods, your inspirations, and the challenges you've overcome.", answer: '' },
    { name: 'Audience Building', question: "The faceless crowd awaits your call. How do you breathe life into your audience, transforming them from mere spectators to loyal followers? Share your strategies and the connections you've forged.", answer: '' },
    { name: 'Storytelling', question: "In the cacophony of the internet, how do you ensure your voice rings true and clear? Regale us with tales of how you craft narratives that resonate with the hearts of your audience.", answer: '' },
    { name: 'Visual Design', question: "The eyes are the windows to the soul, they say. How do you dress your creations to catch the eye and stir the soul? Describe your approach to the visual arts in your content.", answer: '' },
    { name: 'Personal Branding', question: "In a world of endless noise, how do you ensure your signal stands out? Tell us of the unique essence you've distilled into your personal brand.", answer: '' },
  ]);

  const [indieHackerSkills, setIndieHackerSkills] = useState<Skill[]>([
    { name: 'Product Development', question: "In the forge of innovation, how do you hammer out your ideas into tangible creations? Describe your approach to breathing life into your product concepts.", answer: '' },
    { name: 'Marketing', question: "The market is a vast ocean, teeming with potential. How do you cast your net to catch the attention of those who would benefit most from your creations?", answer: '' },
    { name: 'Sales', question: "The art of persuasion is a delicate dance. How do you lead your prospects through the steps, from curiosity to commitment? Share your techniques for closing the deal.", answer: '' },
    { name: 'Financial Management', question: "In the ebbs and flows of the entrepreneurial tide, how do you keep your ship afloat? Enlighten us on your methods for managing the lifeblood of your ventures.", answer: '' },
    { name: 'Technical Skills', question: "The digital world speaks in many tongues. Which languages do you command, and how do you wield them to shape reality to your will? Expound on your technical prowess.", answer: '' },
  ]);

  const [creatorProficiencies, setCreatorProficiencies] = useState<Proficiency[]>([
    { name: 'YouTube', question: "How do you harness the power of the tube to broadcast your message to the world? Describe your experience with long-form video content.", answer: '', interestQuestion: "Does the allure of YouTube's reach ignite a fire in your soul, or is it merely a tool in your arsenal?", interestAnswer: '' },
    { name: 'Podcasting', question: "In the realm of auditory delights, how do you ensure your voice echoes in the minds of your listeners? Share your podcasting journey.", answer: '', interestQuestion: "Does the intimate nature of podcasting call to you, or is it a distant shore on your content map?", interestAnswer: '' },
    { name: 'Newsletter', question: "How do you distill your wisdom into bite-sized morsels that land in the inboxes of your eager audience? Tell us of your newsletter strategy.", answer: '', interestQuestion: "Is curating a newsletter a joy that fuels your creativity, or a necessary evil in your content kingdom?", interestAnswer: '' },
    { name: 'Blogging', question: "In the vast library of the internet, how do you ensure your written words stand out as tomes of wisdom? Describe your blogging expertise.", answer: '', interestQuestion: "Does the act of blogging set your fingers alight with passion, or is it simply another tool in your belt?", interestAnswer: '' },
    { name: 'TikTok', question: "In the fast-paced world of short-form content, how do you capture attention in mere moments? Share your TikTok tactics.", answer: '', interestQuestion: "Does the challenge of creating bite-sized content excite you, or does it feel like a fleeting trend?", interestAnswer: '' },
  ]);

  const [indieHackerProficiencies, setIndieHackerProficiencies] = useState<Proficiency[]>([
    { name: 'Coding', question: "In the matrix of zeroes and ones, how do you weave your will into existence? Speak of your coding prowess and the languages you command.", answer: '', interestQuestion: "Does the act of coding set your soul ablaze with possibility, or is it merely a means to an end?", interestAnswer: '' },
    { name: 'No-code tools', question: "Even in the absence of code, creation persists. How do you leverage no-code tools to bring your visions to life?", answer: '', interestQuestion: "Do no-code solutions intrigue you as a path to rapid creation, or do you view them with skepticism?", interestAnswer: '' },
    { name: 'Automation', question: "In a world of repetitive tasks, how do you free yourself and others from the shackles of mundanity? Describe your automation expertise.", answer: '', interestQuestion: "Does the prospect of automating the world around you fill you with excitement, or is it simply a necessary step in your journey?", interestAnswer: '' },
    { name: 'AI integration', question: "As artificial minds join our ranks, how do you harness their power to augment your creations? Share your experience with AI integration.", answer: '', interestQuestion: "Does the frontier of AI beckon you with its endless possibilities, or does it feel like an intimidating unknown?", interestAnswer: '' },
    { name: 'Product Design', question: "In the intersection of form and function, how do you craft experiences that delight and empower your users? Enlighten us on your product design philosophy.", answer: '', interestQuestion: "Does the challenge of designing intuitive, beautiful products ignite your creativity, or is it a puzzle you're still learning to solve?", interestAnswer: '' },
  ]);

  const handleSkillChange = (index: number, value: string, setSkills: React.Dispatch<React.SetStateAction<Skill[]>>) => {
    setSkills(prevSkills => prevSkills.map((skill, i) => 
      i === index ? { ...skill, answer: value } : skill
    ));
  };

  const handleProficiencyChange = (index: number, field: 'answer' | 'interestAnswer', value: string, setProficiencies: React.Dispatch<React.SetStateAction<Proficiency[]>>) => {
    setProficiencies(prevProf => prevProf.map((prof, i) => 
      i === index ? { ...prof, [field]: value } : prof
    ));
  };

  const handleSave = async () => {
    const characterData = {
      name,
      age,
      background,
      profilePicture,
      creatorSkills,
      indieHackerSkills,
      creatorProficiencies,
      indieHackerProficiencies,
    }

    const result = await saveGodTierCharacter(characterData)

    if (result.success) {
      alert(`God-Tier Character saved! Character ID: ${result.characterId}`)
    } else {
      alert(`Error saving God-Tier Character: ${result.error}`)
    }
  }

  const generateName = () => {
    const names = ['Alex Streamer', 'Sam Coder', 'Jordan Blogger', 'Taylor Podcaster', 'Casey Developer'];
    setName(names[Math.floor(Math.random() * names.length)]);
  };

  const generateProfilePicture = () => {
    setProfilePicture(`https://picsum.photos/200?random=${Date.now()}`);
  };

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6">God-Tier Character Creation</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border rounded flex-grow"
            />
            <button onClick={generateName} className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              <RefreshCw size={20} />
            </button>
          </div>
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <textarea
          placeholder="Share the epic tale of your background, brave creator and innovator!"
          value={background}
          onChange={(e) => setBackground(e.target.value)}
          className="w-full p-2 border rounded mt-4"
          rows={5}
        />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Profile Picture</h2>
        <div className="flex items-center space-x-4">
          {profilePicture && (
            <img src={profilePicture} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="hidden"
              id="profile-picture-upload"
            />
            <label
              htmlFor="profile-picture-upload"
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-flex items-center mr-2"
            >
              <Upload size={20} className="mr-2" />
              Upload Picture
            </label>
            <button
              onClick={generateProfilePicture}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-flex items-center"
            >
              <RefreshCw size={20} className="mr-2" />
              Generate Picture
            </button>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Creator Skills</h2>
        {creatorSkills.map((skill, index) => (
          <div key={skill.name} className="mb-4">
            <label className="block text-lg font-medium mb-2">{skill.name}</label>
            <p className="text-sm text-gray-600 mb-2">{skill.question}</p>
            <textarea
              value={skill.answer}
              onChange={(e) => handleSkillChange(index, e.target.value, setCreatorSkills)}
              className="w-full p-2 border rounded"
              rows={4}
            />
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Indie Hacker Skills</h2>
        {indieHackerSkills.map((skill, index) => (
          <div key={skill.name} className="mb-4">
            <label className="block text-lg font-medium mb-2">{skill.name}</label>
            <p className="text-sm text-gray-600 mb-2">{skill.question}</p>
            <textarea
              value={skill.answer}
              onChange={(e) => handleSkillChange(index, e.target.value, setIndieHackerSkills)}
              className="w-full p-2 border rounded"
              rows={4}
            />
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Creator Proficiencies</h2>
        {creatorProficiencies.map((prof, index) => (
          <div key={prof.name} className="mb-6">
            <label className="block text-lg font-medium mb-2">{prof.name}</label>
            <p className="text-sm text-gray-600 mb-2">{prof.question}</p>
            <textarea
              value={prof.answer}
              onChange={(e) => handleProficiencyChange(index, 'answer', e.target.value, setCreatorProficiencies)}
              className="w-full p-2 border rounded mb-2"
              rows={4}
            />
            <p className="text-sm text-gray-600 mb-2">{prof.interestQuestion}</p>
            <textarea
              value={prof.interestAnswer}
              onChange={(e) => handleProficiencyChange(index, 'interestAnswer', e.target.value, setCreatorProficiencies)}
              className="w-full p-2 border rounded"
              rows={2}
            />
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Indie Hacker Proficiencies</h2>
        {indieHackerProficiencies.map((prof, index) => (
          <div key={prof.name} className="mb-6">
            <label className="block text-lg font-medium mb-2">{prof.name}</label>
            <p className="text-sm text-gray-600 mb-2">{prof.question}</p>
            <textarea
              value={prof.answer}
              onChange={(e) => handleProficiencyChange(index, 'answer', e.target.value, setIndieHackerProficiencies)}
              className="w-full p-2 border rounded mb-2"
              rows={4}
            />
            <p className="text-sm text-gray-600 mb-2">{prof.interestQuestion}</p>
            <textarea
              value={prof.interestAnswer}
              onChange={(e) => handleProficiencyChange(index, 'interestAnswer', e.target.value, setIndieHackerProficiencies)}
              className="w-full p-2 border rounded"
              rows={2}
            />
          </div>
        ))}
      </section>

      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 flex items-center justify-center w-full md:w-auto transition duration-300 ease-in-out transform hover:scale-105"
      >
        <Save className="mr-2" size={20} />
        Inscribe Your Legend
      </button>
    </div>
  );
};

export default GodTierCharacterSheet;
