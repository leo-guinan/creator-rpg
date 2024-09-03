import CharacterSheet from "@/components/character/character-generator";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CharacterSheet />
    </main>
  );
}
