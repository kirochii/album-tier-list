import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlbumData, JSONAlbumData, AlbumTiers, TieredAlbums } from '@src/app/shared/models/album';
import jsonData from '@src/assets/tier-list.json';
import { forkJoin, Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

interface CachedAlbum {
  readonly data: AlbumData;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})

export class GetAlbumService {
  //Cache time to live
  private readonly ttl = 1000 * 60 * 60 * 24;

  //Variables
  lookupById: { [key: string]: JSONAlbumData } = {};

  //Domains
  private readonly musicBrainzUrl = 'https://musicbrainz.org/ws/2';
  private readonly coverArtUrl = 'https://coverartarchive.org';
  private readonly youtubeDomain = 'https://music.youtube.com/playlist?list=';
  private readonly spotifyDomain = 'https://open.spotify.com/album/';

  //Constructors
  constructor(private http: HttpClient) {
    for (const tier of Object.values(jsonData.tier)) {
      for (const album of tier) {
        this.lookupById[album.id] = album;
      }
    }
  }

  //Save album to cache
  private saveToCache(albumId: string, data: AlbumData): void {
    if (typeof localStorage === 'undefined') return;

    const cached: CachedAlbum = {
      data,
      timestamp: Date.now()
    };

    localStorage.setItem(`album_${albumId}`, JSON.stringify(cached));
  }

  //Get album from cache
  private getFromCache(albumId: string): AlbumData | null {
    if (typeof localStorage === 'undefined') return null;

    const item = localStorage.getItem(`album_${albumId}`);
    if (!item) return null;

    const cached: CachedAlbum = JSON.parse(item);
    const now = Date.now();

    if (now - cached.timestamp < this.ttl) {
      return cached.data; // still valid
    } else {
      localStorage.removeItem(`album_${albumId}`); // expired
      return null;
    }
  }

  //Get album details using JSON
  private getJSONAlbumDetails(albumId: string): JSONAlbumData | undefined {
    const album = this.lookupById[albumId];
    if (!album) return undefined;

    return {
      ...album,
      youtubeLink: album.youtubeLink ? this.youtubeDomain + album.youtubeLink : null,
      spotifyLink: album.spotifyLink ? this.spotifyDomain + album.spotifyLink : null
    };

  }

  //Get album details using API
  private getAPIAlbumDetails(albumId: string): Observable<AlbumData> {
    //Return cached data if exists
    const cached = this.getFromCache(albumId);
    if (cached) {
      return of(cached);
    }

    // Get JSON album details
    const jsonAlbumData = this.getJSONAlbumDetails(albumId);
    if (!jsonAlbumData) {
      throw new Error(`Album with ID ${albumId} not found in JSON data`);
    }

    const headers = new HttpHeaders({
      'User-Agent': 'AlbumTierList/1.0 ( example@example.com )'
    });

    const musicBrainz$ = this.http.get<any>(
      `${this.musicBrainzUrl}/release-group/${albumId}?inc=artist-credits+genres&fmt=json`,
      { headers }
    );

    const coverArt$ = this.http.get<any>(
      `${this.coverArtUrl}/release-group/${albumId}`,
      { headers: headers.set('Accept', 'application/json') }
    );

    return forkJoin([musicBrainz$, coverArt$]).pipe(
      map(([musicBrainz, coverArt]) => {
        const albumData: AlbumData = {
          jsonAlbumData, // Data from JSON
          title: musicBrainz.title,
          artist: musicBrainz['artist-credit']?.[0]?.name,
          release: musicBrainz['first-release-date']
            ? new Date(musicBrainz['first-release-date'])
            : undefined,
          genres: musicBrainz.genres?.map((g: any) => g.name) || undefined,
          thumbnailLarge: coverArt?.images?.[0]?.thumbnails?.large || undefined
        };

        return albumData;
      }),
      tap(data => this.saveToCache(albumId, data))
    );
  }

  //Get mapped albums
  getAlbumList(): Observable<TieredAlbums> {
    // Get all tiers
    const tiers = Object.values(AlbumTiers);

    // Map each tier to an Observable that fetches all albums in that tier
    const tierObservables: Partial<Record<AlbumTiers, Observable<AlbumData[]>>> = {};

    tiers.forEach(tier => {
      const albumsInTier: JSONAlbumData[] = jsonData.tier[tier] || [];

      tierObservables[tier] = albumsInTier.length
        ? forkJoin(albumsInTier.map(album => this.getAPIAlbumDetails(album.id)))
        : of([]);
    });

    // Combine all tiers into one object
    return forkJoin(tierObservables).pipe(
      map(allTiers => ({ tieredAlbums: allTiers }))
    );
  }
}
