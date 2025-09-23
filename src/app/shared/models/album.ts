export enum AlbumTiers {
    S = 'S',
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
    E = 'E',
    F = 'F'
}

export interface JSONAlbumData {
    readonly id: string;
    readonly spotifyLink: string | null;
    readonly youtubeLink: string | null;
}

export interface MinimalAlbumData extends JSONAlbumData {
    readonly thumbnailLarge?: string;
}

export interface AlbumData extends MinimalAlbumData {
    readonly title?: string;
    readonly artist?: string;
    readonly release?: Date;
    readonly genres?: ReadonlyArray<string>;
}

export interface TieredAlbums {
    tieredAlbums: Partial<Record<AlbumTiers, MinimalAlbumData[]>>;
}