'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Save, RefreshCw, Upload, GripVertical, HelpCircle } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { saveCharacter } from '@/app/actions/character'

type Skill = {
    name: string;
    value: number;
};

type Proficiency = {
    id: string;
    name: string;
    value: number;
    interest: 'Passionate' | 'Curious' | 'Indifferent';
};

const CharacterSheet: React.FC = () => {
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [isEmailEditable, setIsEmailEditable] = useState(false);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [background, setBackground] = useState('');
    const [profilePicture, setProfilePicture] = useState<string | null>(null);

    const [creatorSkills, setCreatorSkills] = useState<Skill[]>([
        { name: 'Content Creation', value: 5 },
        { name: 'Audience Building', value: 5 },
        { name: 'Storytelling', value: 5 },
        { name: 'Visual Design', value: 5 },
        { name: 'Personal Branding', value: 5 },
    ]);

    const [indieHackerSkills, setIndieHackerSkills] = useState<Skill[]>([
        { name: 'Product Development', value: 5 },
        { name: 'Marketing', value: 5 },
        { name: 'Sales', value: 5 },
        { name: 'Financial Management', value: 5 },
        { name: 'Technical Skills', value: 5 },
    ]);


    const [creatorProficiencies, setCreatorProficiencies] = useState<Proficiency[]>([
        { id: 'youtube', name: 'YouTube', value: 5, interest: 'Curious' },
        { id: 'podcasting', name: 'Podcasting', value: 5, interest: 'Curious' },
        { id: 'newsletter', name: 'Newsletter', value: 5, interest: 'Curious' },
        { id: 'blogging', name: 'Blogging', value: 5, interest: 'Curious' },
        { id: 'tiktok', name: 'TikTok', value: 5, interest: 'Curious' },
    ]);

    const [indieHackerProficiencies, setIndieHackerProficiencies] = useState<Proficiency[]>([
        { id: 'coding', name: 'Coding', value: 5, interest: 'Curious' },
        { id: 'nocode', name: 'No-code tools', value: 5, interest: 'Curious' },
        { id: 'automation', name: 'Automation', value: 5, interest: 'Curious' },
        { id: 'ai', name: 'AI integration', value: 5, interest: 'Curious' },
        { id: 'productdesign', name: 'Product Design', value: 5, interest: 'Curious' },
    ]);

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
            setIsEmailEditable(false);
        } else {
            setIsEmailEditable(true);
        }
    }, [searchParams]);

    const handleSkillChange = (index: number, value: number, setSkills: React.Dispatch<React.SetStateAction<Skill[]>>) => {
        setSkills(prevSkills => prevSkills.map((skill, i) =>
            i === index ? { ...skill, value: Math.min(10, Math.max(0, value)) } : skill
        ));
    };


    const handleSave = async () => {
        const characterData = {
            name,
            age,
            background,
            profilePicture,
            email,
            creatorSkills,
            indieHackerSkills,
            creatorProficiencies,
            indieHackerProficiencies
        }

        const result = await saveCharacter(characterData)
        if (result.success) {
            alert('Character sheet saved!')
            // Clear the form
            setName('')
            setAge('')
            setBackground('')
            setProfilePicture(null)
            // Don't clear the email as it's coming from the URL
            // Reset skills and proficiencies
            setCreatorSkills([
                { name: 'Content Creation', value: 5 },
                { name: 'Audience Building', value: 5 },
                { name: 'Storytelling', value: 5 },
                { name: 'Visual Design', value: 5 },
                { name: 'Personal Branding', value: 5 },
            ])
            setIndieHackerSkills([
                { name: 'Product Development', value: 5 },
                { name: 'Marketing', value: 5 },
                { name: 'Sales', value: 5 },
                { name: 'Financial Management', value: 5 },
                { name: 'Technical Skills', value: 5 },
            ])
            setCreatorProficiencies([
                { id: 'youtube', name: 'YouTube', value: 5, interest: 'Curious' },
                { id: 'podcasting', name: 'Podcasting', value: 5, interest: 'Curious' },
                { id: 'newsletter', name: 'Newsletter', value: 5, interest: 'Curious' },
                { id: 'blogging', name: 'Blogging', value: 5, interest: 'Curious' },
                { id: 'tiktok', name: 'TikTok', value: 5, interest: 'Curious' },
            ])
            setIndieHackerProficiencies([
                { id: 'coding', name: 'Coding', value: 5, interest: 'Curious' },
                { id: 'nocode', name: 'No-code tools', value: 5, interest: 'Curious' },
                { id: 'automation', name: 'Automation', value: 5, interest: 'Curious' },
                { id: 'ai', name: 'AI integration', value: 5, interest: 'Curious' },
                { id: 'productdesign', name: 'Product Design', value: 5, interest: 'Curious' },
            ])
        } else {
            alert('Failed to save character sheet. Please try again.')
        }
    }

    const generateName = () => {
        const names = ['Alex Streamer', 'Sam Coder', 'Jordan Blogger', 'Taylor Podcaster', 'Casey Developer'];
        setName(names[Math.floor(Math.random() * names.length)]);
    };

    const generateProfilePicture = () => {
        // For this example, we're using a placeholder image service
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

    const handleProficiencyChange = (
        id: string,
        field: 'value' | 'interest',
        value: number | string,
        setProficiencies: React.Dispatch<React.SetStateAction<Proficiency[]>>
    ) => {
        setProficiencies(prevProf => prevProf.map(prof =>
            prof.id === id ? { ...prof, [field]: field === 'value' ? Math.min(10, Math.max(0, value as number)) : value } : prof
        ));
    };

    const onDragEnd = (result: any, setProficiencies: React.Dispatch<React.SetStateAction<Proficiency[]>>) => {
        if (!result.destination) return;

        setProficiencies(prevProfs => {
            const newProfs = Array.from(prevProfs);
            const [reorderedItem] = newProfs.splice(result.source.index, 1);
            newProfs.splice(result.destination.index, 0, reorderedItem);
            return newProfs;
        });
    };

    const PrioritizedList: React.FC<{ proficiencies: Proficiency[], setProficiencies: React.Dispatch<React.SetStateAction<Proficiency[]>>, title: string }> = ({ proficiencies, setProficiencies, title }) => {
        console.log("PrioritizedList", proficiencies, setProficiencies, title)
        return (
            <DragDropContext onDragEnd={(result) => onDragEnd(result, setProficiencies)}>
                <Droppable droppableId={title}>
                    {(provided) => (
                        <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                            {proficiencies.map((prof, index) => (
                                <Draggable key={prof.id} draggableId={prof.id} index={index}>
                                    {(provided) => (
                                        <li ref={provided.innerRef} {...provided.draggableProps} className="bg-gray-100 p-4 rounded-lg flex items-center space-x-4">
                                            <span {...provided.dragHandleProps}><GripVertical size={20} /></span>
                                            <span className="w-1/4">{prof.name}</span>
                                            <input
                                                type="range"
                                                min="0"
                                                max="10"
                                                value={prof.value}
                                                onChange={(e) => handleProficiencyChange(prof.id, 'value', parseInt(e.target.value), setProficiencies)}
                                                className="w-1/3 mr-4"
                                            />
                                            <span className="mr-4">{prof.value}</span>
                                            <select
                                                value={prof.interest}
                                                onChange={(e) => handleProficiencyChange(prof.id, 'interest', e.target.value, setProficiencies)}
                                                className="p-2 border rounded"
                                            >
                                                <option value="Passionate">Passionate</option>
                                                <option value="Curious">Curious</option>
                                                <option value="Indifferent">Indifferent</option>
                                            </select>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        )
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg text-black">
            <h1 className="text-3xl font-bold mb-6">RPG Character Sheet</h1>

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
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly={!isEmailEditable}
                    className={`w-full p-2 border rounded mt-4 ${isEmailEditable ? '' : 'bg-gray-100'}`}
                />
                <textarea
                    placeholder="Background"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="w-full p-2 border rounded mt-4"
                    rows={3}
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
                    <div key={skill.name} className="flex items-center mb-2">
                        <span className="w-1/3">{skill.name}</span>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={skill.value}
                            onChange={(e) => handleSkillChange(index, parseInt(e.target.value), setCreatorSkills)}
                            className="w-1/2 mr-4"
                        />
                        <span>{skill.value}</span>
                    </div>
                ))}
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Indie Hacker Skills</h2>
                {indieHackerSkills.map((skill, index) => (
                    <div key={skill.name} className="flex items-center mb-2">
                        <span className="w-1/3">{skill.name}</span>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={skill.value}
                            onChange={(e) => handleSkillChange(index, parseInt(e.target.value), setIndieHackerSkills)}
                            className="w-1/2 mr-4"
                        />
                        <span>{skill.value}</span>
                    </div>
                ))}
            </section>

            <section className="mb-8">

                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    Proficiencies
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <HelpCircle size={20} className="ml-2 text-gray-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="border-2 border-gray-300 rounded-md p-2 bg-gray-100 text-sm">Drag to reorder, adjust sliders to set skill levels, and select interest levels</p>
                            </TooltipContent>

                        </Tooltip>
                    </TooltipProvider>
                </h2>
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                    <p className="font-bold">Hear ye, brave adventurer!</p>
                    <p>
                        The Dungeon Master speaks: "In the realm of creation and innovation, your path is shaped by the skills you hone and the passions you nurture. Before you lies a tapestry of proficiencies, each a thread in the grand design of your journey.
                    </p>
                    <p className="mt-2">
                        Arrange these skills by importance, for they shall guide your quests. Drag the proficiencies to reorder them, and adjust the sliders to set your current skill level from 0 to 10. Your interest in each - be it Passionate, Curious, or Indifferent - will determine the challenges you face and the rewards you reap.
                    </p>
                    <p className="mt-2">
                        Choose wisely, for in this world of Creators and Indie Hackers, your unique combination of skills and interests will forge your destiny!"
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Creator Proficiencies</h3>
                        <PrioritizedList
                            proficiencies={creatorProficiencies}
                            setProficiencies={setCreatorProficiencies}
                            title="creator"
                        />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Indie Hacker Proficiencies</h3>
                        <PrioritizedList
                            proficiencies={indieHackerProficiencies}
                            setProficiencies={setIndieHackerProficiencies}
                            title="indiehacker"
                        />
                    </div>
                </div>
            </section>

            <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
            >
                <Save className="mr-2" size={20} />
                Save Character Sheet
            </button>
        </div>
    );
};

export default CharacterSheet;