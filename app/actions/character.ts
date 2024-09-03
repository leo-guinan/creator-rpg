'use server'

import Airtable from 'airtable'
import { nanoid } from '@/lib/utils'

type CharacterData = {
    name: string
    age: string
    background: string
    profilePicture: string | null
    email: string // Add email to CharacterData type
    creatorSkills: Skill[]
    indieHackerSkills: Skill[]
    creatorProficiencies: Proficiency[]
    indieHackerProficiencies: Proficiency[]
}

type CharacterRecordFields = {
    id: string
    Name: string
    Age: number
    Background: string
    ProfilePicture: { url: string }[]
    Email: string
}

type Skill = {
    name: string
    value: number
}

type Proficiency = {
    id: string
    name: string
    value: number
    interest: 'Passionate' | 'Curious' | 'Indifferent'
}

type SkillRecordFields = {
    SkillId: string
    Character: string[]
    "Skill Type": string
    "Skill Name": string
    "Skill Value": number
}

type ProficiencyRecordFields = {
    ProficiencyId: string
    Character: string[]
    "Proficiency Type": string
    "Proficiency Name": string
    Interest: string
    Priority: number
}


const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY! });
const base = airtable.base(process.env.AIRTABLE_BASE_ID!);

type CharacterRecord = {
    id: string
    fields: {
        Name: string
        Age: number
        Background: string
        ProfilePicture: { url: string }[]
        Email: string
    }
}

type SkillRecord = {
    id: string
    fields: {
        Character: string[]
        "Skill Type": string
        "Skill Name": string
        "Skill Value": number
    }
    getId: () => string
}

type ProficiencyRecord = {
    id: string
    fields: {
        Character: string[]
        "Proficiency Type": string
        "Proficiency Name": string
        Interest: string
        Priority: number
        ProficiencyId: string
    }
    getId: () => string
}

export type GodTierCharacterData = {
    name: string
    age: string
    background: string
    profilePicture: string | null
    email: string
    creatorSkills: GodTierSkillData[]
    indieHackerSkills: GodTierSkillData[]
    creatorProficiencies: GodTierProficiencyData[]
    indieHackerProficiencies: GodTierProficiencyData[]
}

export type GodTierSkillData = {
    name: string
    question: string
    answer: string
}

export type GodTierProficiencyData = {
    name: string
    question: string
    answer: string
    interestQuestion: string
    interestAnswer: string
}

type GodTierSkillRecord = {
  id: string;
  fields: GTSRecordFields
};

type GTSRecordFields = {
    Name: string;
    Character: string[];
    Question: string;
    Answer: string;
}

type GodTierProficiencyRecord = {
  id: string;
  fields: GTPRecordFields
};

type GTPRecordFields = {
    Name: string;
    Character: string[];
    Question: string;
    Answer: string;
    'Interest Question': string;
    'Interest Answer': string;
}
export async function saveCharacter(data: CharacterData) {
    try {
        // Save character
        // @ts-ignore
        const character = base.table('Characters').create({
            CharacterId: nanoid(),
            Name: data.name,
            Age: parseInt(data.age),
            Background: data.background,
            // @ts-ignore
            ProfilePicture: data.profilePicture ? [{ 
                url: data.profilePicture,
                
            }] : [],
            Email: data.email,
        }, async (err: any, record: any) => {
            if (err) {
                console.error('Error saving character:', err)
            }
            // Save skills
        const skillRecords = await Promise.all([
            ...data.creatorSkills.map(skill =>
                base.table('Skills').create({
                    SkillId: nanoid(),
                    Character: [record.id],
                    "Skill Type": "Creator",
                    "Skill Name": skill.name,
                    "Skill Value": skill.value
                })
            ),
            ...data.indieHackerSkills.map(skill =>
                base.table('Skills').create({
                    SkillId: nanoid(),
                    Character: [record.id],
                    "Skill Type": "Indie Hacker",
                    "Skill Name": skill.name,
                    "Skill Value": skill.value
                })
            )
        ])
        console.log("skills created: ")

        // Save proficiencies
        const proficiencyRecords = await Promise.all([
            ...data.creatorProficiencies.map((prof, index) =>
                base.table('Proficiencies').create({
                    ProficiencyId: nanoid(),
                    Character: [record.id],
                    "Proficiency Type": "Creator",
                    "Proficiency Name": prof.name,
                    Interest: prof.interest,
                    Priority: index + 1,
                })
            ),
            ...data.indieHackerProficiencies.map((prof, index) =>
                base.table('Proficiencies').create({
                    ProficiencyId: nanoid(),
                    Character: [record.id],
                    "Proficiency Type": "Indie Hacker",
                    "Proficiency Name": prof.name,
                    Interest: prof.interest,
                    Priority: index + 1

                })
            )

        ])
        });
        

        

        // // Update character with linked skills and proficiencies
        // await base('Characters').update(character.id, {
        //   Skills: skillRecords.map((record: SkillRecord) => record.getId()),
        //   Proficiencies: proficiencyRecords.map((record: ProficiencyRecord) => record.getId())
        // })

        return { success: true }
    } catch (error) {
        console.error('Error saving character:', error)
        return { success: false, error: 'Failed to save character' }
    }
}

export async function saveGodTierCharacter(data: GodTierCharacterData) {
  try {
    const character = base.table('Characters').create({
      CharacterId: nanoid(),
      Name: data.name,
      Age: parseInt(data.age),
      Background: data.background,
      Email: data.email,
      // @ts-ignore
      ProfilePicture: data.profilePicture ? [{ 
        url: data.profilePicture
    }] : [],
    }, async (err: any, record: any) => {
      if (err) {
        console.error('Error saving character:', err)
      }
      const creatorSkillRecords = await Promise.all(
        data.creatorSkills.map(skill =>
          base.table('God Tier Creator Skills').create({
            CreatorSkillId: nanoid(),
            Name: skill.name,
            Character: [record.id],
            Question: skill.question,
            Answer: skill.answer,
          })
        )
      );
  
      const hackerSkillRecords = await Promise.all(
        data.indieHackerSkills.map(skill =>
          base.table('God Tier Hacker Skills').create({
            HackerSkillId: nanoid(),
            Name: skill.name,
            Character: [record.id],
            Question: skill.question,
            Answer: skill.answer,
          })
        )
      );
  
      const creatorProficiencyRecords = await Promise.all(
        data.creatorProficiencies.map(prof =>
          base.table('God Tier Creator Proficiencies').create({
            CreatorProficiencyId: nanoid(),
            Name: prof.name,
            Character: [record.id],
            Question: prof.question,
            Answer: prof.answer,
            'Interest Question': prof.interestQuestion,
            'Interest Answer': prof.interestAnswer,
          })
        )
      );
  
      const hackerProficiencyRecords = await Promise.all(
        data.indieHackerProficiencies.map(prof =>
          base.table('God Tier Hacker Proficiencies').create({
            HackerProficiencyId: nanoid(),
            Name: prof.name,
            Character: [record.id],
            Question: prof.question,
            Answer: prof.answer,
            'Interest Question': prof.interestQuestion,
            'Interest Answer': prof.interestAnswer,
          })
        )
      );

    });

    


    return { success: true };
  } catch (error) {
    console.error('Error saving God Tier character:', error);
    return { success: false, error: 'Failed to save God Tier character' };
  }
}