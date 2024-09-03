import CharacterSheet from "@/components/character/character-generator";
import GodTierCharacterSheet from "@/components/character/god-tier-character-generator";
import Image from "next/image";
import { Suspense } from "react";
export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Suspense fallback={<div>Loading...</div>}>
                <GodTierCharacterSheet />
            </Suspense>
        </main>
    );
}
