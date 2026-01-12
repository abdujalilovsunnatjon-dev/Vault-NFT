export interface NFTItem {
    id: string
    name: string
    image: string
    price: number
    collection: string
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
    views: number
    likes: number
}

export interface Gift {
    id: string
    name: string
    image: string
    from: string
    value: number
    opened: boolean
}

export interface Collection {
    id: string
    name: string
    image: string
    floorPrice: number
    volume: number
    items: number
}

export const mockItems: NFTItem[] = [
    {
        id: '1',
        name: 'Cyber Samurai #042',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CyberSamurai',
        price: 4.2,
        collection: 'Cyber Samurai',
        rarity: 'epic',
        views: 1242,
        likes: 89
    },
    {
        id: '2',
        name: 'Galactic Ape #789',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GalacticApe',
        price: 12.5,
        collection: 'Galactic Apes',
        rarity: 'legendary',
        views: 5421,
        likes: 324
    },
    {
        id: '3',
        name: 'Neon Cat #156',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NeonCat',
        price: 2.8,
        collection: 'Neon Cats',
        rarity: 'rare',
        views: 842,
        likes: 56
    },
    {
        id: '4',
        name: 'Pixel Wizard #023',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PixelWizard',
        price: 3.5,
        collection: 'Pixel Wizards',
        rarity: 'common',
        views: 621,
        likes: 42
    },
    {
        id: '5',
        name: 'Astro Dog #417',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AstroDog',
        price: 6.7,
        collection: 'Astro Dogs',
        rarity: 'rare',
        views: 1521,
        likes: 124
    },
    {
        id: '6',
        name: 'Mystic Fox #308',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MysticFox',
        price: 8.9,
        collection: 'Mystic Foxes',
        rarity: 'epic',
        views: 2314,
        likes: 187
    }
]

export const mockGifts: Gift[] = [
    {
        id: 'gift-1',
        name: 'Mystery Box #1',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=Gift1',
        from: '@crypto_friend',
        value: 5.2,
        opened: false
    },
    {
        id: 'gift-2',
        name: 'Starter Pack',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=Gift2',
        from: 'Vault Team',
        value: 2.5,
        opened: false
    },
    {
        id: 'gift-3',
        name: 'Season Reward',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=Gift3',
        from: 'Season #1',
        value: 8.7,
        opened: true
    }
]

export const mockCollections: Collection[] = [
    {
        id: 'col-1',
        name: 'Cyber Samurai',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CyberCollection',
        floorPrice: 3.8,
        volume: 245.2,
        items: 420
    },
    {
        id: 'col-2',
        name: 'Galactic Apes',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GalacticCollection',
        floorPrice: 10.5,
        volume: 1245.7,
        items: 1000
    },
    {
        id: 'col-3',
        name: 'Neon Cats',
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NeonCollection',
        floorPrice: 1.2,
        volume: 89.4,
        items: 250
    }
]