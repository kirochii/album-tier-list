import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlbumData, JSONAlbumData, AlbumTiers, TieredAlbums, MinimalAlbumData } from '@src/app/shared/models/album';
import { LocalStorageCacheService } from '@src/app/core/services/LocalStorageCache/local-storage-cache.service';
import jsonData from '@src/assets/tier-list.json';
import { forkJoin, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class GetAlbumService {
  //Variables
  lookupById: { [key: string]: MinimalAlbumData } = {};

  //Domains
  private readonly musicBrainzUrl = 'https://musicbrainz.org/ws/2';
  private readonly coverArtUrl = 'https://coverartarchive.org';
  private readonly youtubeDomain = 'https://music.youtube.com/playlist?list=';
  private readonly spotifyDomain = 'https://open.spotify.com/album/';

  //Constructors
  constructor(private http: HttpClient, private cacheService: LocalStorageCacheService) {
    for (const tier of Object.values(jsonData.tier)) {
      for (const album of tier) {
        this.lookupById[album.id] = album;
      }
    }
  }

  //Get album details from JSON
  private getJSONAlbumDetails(albumId: string): JSONAlbumData | undefined {
    const album = this.lookupById[albumId];
    if (!album) return undefined;

    return {
      ...album,
      youtubeLink: album.youtubeLink ? this.youtubeDomain + album.youtubeLink : null,
      spotifyLink: album.spotifyLink ? this.spotifyDomain + album.spotifyLink : null
    };

  }

  private getMinimalAlbumDetails(albumId: string): Observable<MinimalAlbumData> {
    //Return cached data if exists
    const cachedData = this.cacheService.get<MinimalAlbumData>(albumId);
    if (cachedData) {
      return of(cachedData);
    }

    // Get JSON album details
    const jsonAlbumData = this.getJSONAlbumDetails(albumId);
    if (!jsonAlbumData) {
      throw new Error(`Album with ID ${albumId} not found in JSON data`);
    }

    const headers = new HttpHeaders({
      'User-Agent': 'AlbumTierList/1.0 ( example@example.com )',
      'Accept': 'application/json'
    });

    const coverArt$ = this.http.get<any>(`${this.coverArtUrl}/release-group/${albumId}`, { headers });

    return forkJoin([coverArt$]).pipe(
      map(([coverArt]) => {
        const rawImageUrl = coverArt?.images?.[0]?.thumbnails?.large;
        const secureImageUrl = rawImageUrl ? rawImageUrl.replace(/^http:/, 'https:') : undefined;

        const albumData: MinimalAlbumData = {
          ...jsonAlbumData,
          thumbnailLarge: secureImageUrl
        };

        // Save to cache
        this.cacheService.save(albumId, albumData);

        return albumData;
      })
    );
  }

  //Get full album details using API
  getAPIAlbumDetails(albumId: string): Observable<AlbumData> {
    return this.getMinimalAlbumDetails(albumId).pipe(
      switchMap(minimalAlbumData => {
        if (!minimalAlbumData) {
          throw new Error(`Album with ID ${albumId} not found in JSON data`);
        }

        const headers = new HttpHeaders({
          'User-Agent': 'AlbumTierList/1.0 ( example@example.com )'
        });

        const musicBrainz$ = this.http.get<any>(
          `${this.musicBrainzUrl}/release-group/${albumId}?inc=artist-credits+genres&fmt=json`,
          { headers }
        );

        return musicBrainz$.pipe(
          map(musicBrainz => {
            const albumData: AlbumData = {
              ...minimalAlbumData,
              title: musicBrainz.title,
              artist: musicBrainz['artist-credit']?.[0]?.name,
              release: musicBrainz['first-release-date']
                ? new Date(musicBrainz['first-release-date'])
                : undefined,
              genres: musicBrainz.genres?.map((g: any) => g.name) || undefined
            };

            return albumData;
          })
        );
      })
    );
  }

  //Get mapped minimal albums
  getAlbumList(): Observable<TieredAlbums> {
    // Get all tiers
    const tiers = Object.values(AlbumTiers);

    // Map each tier to an Observable that fetches all albums in that tier
    const tierObservables: Partial<Record<AlbumTiers, Observable<MinimalAlbumData[]>>> = {};

    tiers.forEach(tier => {
      const albumsInTier: JSONAlbumData[] = jsonData.tier[tier] || [];

      tierObservables[tier] = albumsInTier.length
        ? forkJoin(albumsInTier.map(album => this.getMinimalAlbumDetails(album.id)))
        : of([]);
    });

    // Combine all tiers into one object
    return forkJoin(tierObservables).pipe(
      map(allTiers => ({ tieredAlbums: allTiers }))
    );
  }
}
