'use server'

import { revalidatePath } from 'next/cache'
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

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!)

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

type GodTierCharacterData = {
  name: string
  age: string
  background: string
  profilePicture: string | null
  creatorSkills: Skill[]
  indieHackerSkills: Skill[]
  creatorProficiencies: Proficiency[]
  indieHackerProficiencies: Proficiency[]
}

export async function saveCharacter(data: CharacterData) {
  try {
    // Save character
    const character = await base('Characters').create({
        CharacterId: nanoid(),
      Name: data.name,
      Age: parseInt(data.age),
      Background: data.background,
      ProfilePicture: data.profilePicture ? [{ url: data.profilePicture }] : undefined,
      Email: data.email, // Use the email from character data
    })
    console.log('Character saved:', character.id)

    // Save skills
    const skillRecords = await Promise.all([
      ...data.creatorSkills.map(skill => 
        base('Skills').create({
            SkillId: nanoid(),
          Character: [character.id],
          "Skill Type": "Creator",
          "Skill Name": skill.name,
          "Skill Value": skill.value
        })
      ),
      ...data.indieHackerSkills.map(skill => 
        base('Skills').create({
            SkillId: nanoid(),
          Character: [character.id],
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
        base('Proficiencies').create({
            ProficiencyId: nanoid(),
          Character: [character.id],
          "Proficiency Type": "Creator",
          "Proficiency Name": prof.name,
          Interest: prof.interest,
          Priority: index + 1,
        })
      ),
      ...data.indieHackerProficiencies.map((prof, index) => 
        base('Proficiencies').create({
            ProficiencyId: nanoid(),
          Character: [character.id],
          "Proficiency Type": "Indie Hacker",
          "Proficiency Name": prof.name,
          Interest: prof.interest,
          Priority: index + 1

        })
      )
    ])
    console.log("proficiencies created: ")

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
    // Save character
    const character = await base('Characters').create({
      CharacterId: nanoid(),
      Name: data.name,
      Age: parseInt(data.age),
      Background: data.background,
      ProfilePicture: data.profilePicture ? [{ url: data.profilePicture }] : undefined,
    })

    // Save God Tier Creator Skills
    const creatorSkillRecords = await Promise.all(
      data.creatorSkills.map(skill =>
        base('God Tier Creator Skills').create({
          CreatorSkillId: nanoid(),
          Name: skill.name,
          Character: [character.id],
          Question: skill.question,
          Answer: skill.answer,
        })
      )
    )

    // Save God Tier Hacker Skills
    const hackerSkillRecords = await Promise.all(
      data.indieHackerSkills.map(skill =>
        base('God Tier Hacker Skills').create({
          HackerSkillId: nanoid(),
          Name: skill.name,
          Character: [character.id],
          Question: skill.question,
          Answer: skill.answer,
        })
      )
    )

    // Save God Tier Creator Proficiencies
    const creatorProficiencyRecords = await Promise.all(
      data.creatorProficiencies.map(prof =>
        base('God Tier Creator Proficiencies').create({
          CreatorProficiencyId: nanoid(),
          Name: prof.name,
          Character: [character.id],
          Question: prof.question,
          Answer: prof.answer,
          'Interest Question': prof.interestQuestion,
          'Interest Answer': prof.interestAnswer,
        })
      )
    )

    // Save God Tier Hacker Proficiencies
    const hackerProficiencyRecords = await Promise.all(
      data.indieHackerProficiencies.map(prof =>
        base('God Tier Hacker Proficiencies').create({
          HackerProficiencyId: nanoid(),
          Name: prof.name,
          Character: [character.id],
          Question: prof.question,
          Answer: prof.answer,
          'Interest Question': prof.interestQuestion,
          'Interest Answer': prof.interestAnswer,
        })
      )
    )

    // Update character with linked skills and proficiencies
    await base('Characters').update(character.id, {
      'God Tier Creator Skills': creatorSkillRecords.map(record => record.id),
      'God Tier Hacker Skills': hackerSkillRecords.map(record => record.id),
      'God Tier Creator Proficiencies': creatorProficiencyRecords.map(record => record.id),
      'God Tier Hacker Proficiencies': hackerProficiencyRecords.map(record => record.id),
    })

    return { success: true, characterId: character.id }
  } catch (error) {
    console.error('Error saving God Tier character:', error)
    return { success: false, error: 'Failed to save God Tier character' }
  }
}