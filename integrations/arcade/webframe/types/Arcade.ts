interface ArcadeEmbedStep {
    id: string;
    name: string;
    description?: string;
    type: number;
    order: number;
    isActive: boolean;
}

interface Arcade {
    id: string;
    name: string;
    description: string;
    steps: Array<ArcadeEmbedStep>;
}
