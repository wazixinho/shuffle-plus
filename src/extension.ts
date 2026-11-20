const React = SpotiKit.React;
const { createElement: h, useState } = React;

type ArtistMode = "all" | "album" | "single" | "likedSongArtist" | "topTen";
type BooleanSetting = "artistNameMust" | "enableQueueButton";

interface Settings {
  artistMode: ArtistMode;
  artistNameMust: boolean;
  enableQueueButton: boolean;
}

interface AlbumTrack {
  uri: string;
  artists?: any;
  [key: string]: any;
}

const ARTIST_MODES: Record<ArtistMode, string> = {
  all: "All",
  album: "Albums",
  single: "Singles & EP",
  likedSongArtist: "Artist's Liked Songs",
  topTen: "Top 10 Songs",
};

const ARTIST_OVERVIEW_HASH = "35648a112beb1794e39ab931365f6ae4a8d45e65396d641eeda94e4003d41497";
const ARTIST_DISCOGRAPHY_HASH = "9380995a9d4663cbcb5113fef3c6aabf70ae6d407ba61793fd01e2a1dd6929b0";

const CHECK_PATH =
  '<path d="m13.985 2.383-8.162 10.129-3.4-3.39-1.06 1.06 4.47 4.46 9.22-11.44z"/>';
const SHUFFLE_PATH =
  '<path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z"/><path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 1 1-1.06-1.06L13.109 13H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.937z"/>';
const HEART_PATH =
  '<path d="M15.724 4.22A4.313 4.313 0 0 0 12.192.814a4.269 4.269 0 0 0-3.622 1.13.837.837 0 0 1-1.14 0 4.272 4.272 0 0 0-6.21 5.855l5.916 7.05a1.128 1.128 0 0 0 1.727 0l5.916-7.05a4.228 4.228 0 0 0 .945-3.577z"/>';
const FOLDER_PATH =
  '<path d="M1.75 2A.75.75 0 0 0 1 2.75v10.5c0 .414.336.75.75.75h12.5a.75.75 0 0 0 .75-.75V5.75a.75.75 0 0 0-.75-.75H8.06L6.28 3.22a.75.75 0 0 0-.53-.22H1.75z"/>';
const ENHANCE_PATH =
  '<path d="M8 1 9.6 5.4 14 7l-4.4 1.6L8 13 6.4 8.6 2 7l4.4-1.6L8 1z"/><path d="m13 11.5.6 1.5 1.5.6-1.5.6-.6 1.5-.6-1.5-1.5-.6 1.5-.6.6-1.5z"/>';

const TRACK_TYPES = new Set(["track", "local-track", "local"]);
const SINGLE_URI_TYPES = new Set([
  "playlist",
  "playlist-v2",
  "playlistv2",
  "album",
  "artist",
  "collection",
  "folder",
  "show",
]);

const EXTENSION_CSS = `
.shuffle-plus-dialog {
  display: flex;
  flex-direction: column;
  min-width: min(480px, 80vw);
  color: var(--spice-text, var(--text-base, #fff));
}
.shuffle-plus-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 0;
}
.shuffle-plus-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
}
.shuffle-plus-divider {
  width: 100%;
  height: 1px;
  margin: 4px 0;
  border: 0;
  background-color: var(--spice-button-disabled, var(--essential-subdued, #727272));
  opacity: 0.4;
}
.shuffle-plus-label {
  flex: 1;
}
.shuffle-plus-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: 0;
  border-radius: 50%;
  background-color: rgba(var(--spice-rgb-shadow, 0, 0, 0), 0.7);
  color: var(--spice-text, var(--text-base, #fff));
  cursor: pointer;
}
.shuffle-plus-checkbox.off {
  color: rgba(var(--spice-rgb-text, 255, 255, 255), 0.3);
}
.shuffle-plus-select {
  height: 32px;
  padding: 0 8px;
  border: 0;
  border-radius: 4px;
  color: var(--spice-text, var(--text-base, #fff));
  background-color: rgba(var(--spice-rgb-shadow, 0, 0, 0), 0.7);
}
.shuffle-plus-header-button {
  all: unset !important;
  position: relative !important;
  display: inline-flex !important;
  flex: 0 0 auto !important;
  align-items: center !important;
  align-self: center !important;
  justify-content: center !important;
  box-sizing: border-box !important;
  width: 32px !important;
  height: 32px !important;
  min-width: 32px !important;
  margin: 0 0 0 8px !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 50% !important;
  background: transparent !important;
  color: var(--spice-subtext, var(--text-subdued, #b3b3b3)) !important;
  cursor: pointer !important;
}
.shuffle-plus-header-button:hover:not(:disabled) {
  color: var(--spice-text, var(--text-base, #fff)) !important;
  background-color: rgba(var(--spice-rgb-shadow, 0, 0, 0), 0.25) !important;
}
.shuffle-plus-header-button:disabled {
  opacity: 0.5 !important;
  cursor: default !important;
}
.shuffle-plus-header-button:focus-visible {
  outline: 2px solid var(--spice-text, var(--text-base, #fff)) !important;
  outline-offset: 2px !important;
}
.shuffle-plus-header-button svg {
  display: block !important;
  width: 24px !important;
  height: 24px !important;
}
.shuffle-plus-header-button::after {
  content: "+";
  position: absolute !important;
  top: 0 !important;
  right: -2px !important;
  font-size: 10px !important;
  font-weight: 700 !important;
  line-height: 1 !important;
  pointer-events: none !important;
}
`;

function isArtistMode(value: unknown): value is ArtistMode {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(ARTIST_MODES, value);
}

function svgMarkup(inner: string): string {
  return `<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">${inner}</svg>`;
}

function pickIcon(names: string[], fallback: string): string {
  for (const name of names) {
    try {
      if (SpotiKit.Icons.has(name)) return name;
    } catch (error) {
      console.error(error);
    }
  }
  return fallback;
}

function CheckIcon(): SpotiKit.ReactElement {
  return h("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 16 16",
    fill: "currentColor",
    "aria-hidden": "true",
    dangerouslySetInnerHTML: { __html: CHECK_PATH },
  });
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return String(error);
}

function parseUri(uri: string): SpotiKit.URIObject | null {
  try {
    return SpotiKit.URI.parse(uri);
  } catch (error) {
    console.error(error);
    return null;
  }
}

function currentPath(): string {
  try {
    return SpotiKit.Navigation.path.split("?")[0];
  } catch (error) {
    console.error(error);
    return "";
  }
}

function uriType(uri: string): string | null {
  try {
    const type = SpotiKit.URI.type(uri);
    return typeof type === "string" ? type.toLowerCase().replace(/_/g, "-") : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function spotifyId(uri: string): string | null {
  const parsed = parseUri(uri);
  const id = parsed?._base62Id ?? parsed?.id;
  if (typeof id === "string" && id) return id;
  const parts = uri.split(":");
  return parts.length >= 3 ? parts[parts.length - 1] : null;
}

function shuffle<T>(items: T[]): T[] {
  let counter = items.length;
  if (counter <= 1) return items.filter(Boolean);
  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter -= 1;
    const temp = items[counter];
    items[counter] = items[index];
    items[index] = temp;
  }
  return items.filter(Boolean);
}

function findFolder(rows: any[], uri: string): any | null {
  for (const row of rows) {
    if (!row || row.type !== "folder" || !Array.isArray(row.items)) continue;
    if (row.uri === uri) return row;
    const found = findFolder(row.items, uri);
    if (found) return found;
  }
  return null;
}

function trackHasArtist(track: AlbumTrack, artistName: string): boolean {
  const artists = track.artists?.items ?? track.artists;
  return (
    Array.isArray(artists) &&
    artists.some((artist: any) => (artist?.profile?.name ?? artist?.name) === artistName)
  );
}

function unwrapGraphQL(result: any): any {
  if (result && typeof result === "object" && ("data" in result || "errors" in result)) {
    if (Array.isArray(result.errors) && result.errors.length) {
      throw new Error(String(result.errors[0]?.message ?? result.errors[0]));
    }
    return result.data ?? result;
  }
  return result;
}

export default async function start(ctx: SpotiKit.Context): Promise<void> {
  const store = SpotiKit.Storage.scope("shuffle-plus");
  const savedMode = store.get<string>("artistMode", "all");
  const config: Settings = {
    artistMode: isArtistMode(savedMode) ? savedMode : "all",
    artistNameMust: store.get<boolean>("artistNameMust", false),
    enableQueueButton: store.get<boolean>("enableQueueButton", false),
  };
  const artistFetchTypeCount = { album: 0, single: 0 };

  let playbarButton: SpotiKit.Button | null = null;
  let settingsDialog: { close(): void } | null = null;
  let headerBusy = false;
  let headerFrame = 0;

  ctx.style(EXTENSION_CSS);

  function saveSettings(): void {
    store.set("artistMode", config.artistMode);
    store.set("artistNameMust", config.artistNameMust);
    store.set("enableQueueButton", config.enableQueueButton);
  }

  function CheckBoxField(props: { name: string; field: BooleanSetting }): SpotiKit.ReactElement {
    const [value, setValue] = useState(config[props.field]);
    return h(
      "div",
      { className: "shuffle-plus-row" },
      h("label", { className: "shuffle-plus-label" }, props.name),
      h(
        "button",
        {
          type: "button",
          className: `shuffle-plus-checkbox${value ? "" : " off"}`,
          "aria-label": props.name,
          "aria-pressed": value,
          onClick: () => {
            const next = !value;
            config[props.field] = next;
            setValue(next);
            saveSettings();
            if (props.field === "enableQueueButton") syncQueueButton();
          },
        },
        h(CheckIcon),
      ),
    );
  }

  function DropDownField(props: {
    name: string;
    field: "artistMode";
    options: Record<string, string>;
  }): SpotiKit.ReactElement {
    const [value, setValue] = useState(config.artistMode);
    return h(
      "div",
      { className: "shuffle-plus-row" },
      h("label", { className: "shuffle-plus-label" }, props.name),
      h(
        "select",
        {
          className: "shuffle-plus-select",
          value,
          onChange: (event: any) => {
            const next = String(event?.target?.value ?? "");
            if (!isArtistMode(next)) return;
            config.artistMode = next;
            setValue(next);
            saveSettings();
          },
        },
        Object.entries(props.options).map(([key, label]) =>
          h("option", { key, value: key }, label),
        ),
      ),
    );
  }

  function SettingsPage(): SpotiKit.ReactElement {
    return h(
      "div",
      { className: "shuffle-plus-dialog" },
      h("div", { className: "shuffle-plus-row" }, h("h3", { className: "shuffle-plus-title" }, "Artist Shuffle")),
      h("hr", { className: "shuffle-plus-divider" }),
      h(DropDownField, {
        name: "Shuffle mode Artist Page",
        field: "artistMode",
        options: ARTIST_MODES,
      }),
      h(CheckBoxField, {
        name: "Chosen artist must be included",
        field: "artistNameMust",
      }),
      h(CheckBoxField, {
        name: "Enable Shuffle+ Queue Tracks button in Playbar",
        field: "enableQueueButton",
      }),
    );
  }

  function openSettingsDialog(): void {
    try {
      settingsDialog?.close();
    } catch (error) {
      console.error(error);
    }
    settingsDialog = SpotiKit.Dialog.open({
      title: "Shuffle+",
      size: "large",
      content: h(SettingsPage),
    });
  }

  function targetUris(target: SpotiKit.MenuTarget): string[] {
    return Array.isArray(target.uris) ? target.uris : [];
  }

  function isTrackUri(uri: string): boolean {
    const type = uriType(uri);
    return type !== null && TRACK_TYPES.has(type);
  }

  function canShuffleTarget(target: SpotiKit.MenuTarget): boolean {
    const uris = targetUris(target);
    if (!uris.length) return false;
    if (uris.length > 1) return true;
    const type = uriType(uris[0]);
    return type !== null && SINGLE_URI_TYPES.has(type);
  }

  function canShuffleLiked(target: SpotiKit.MenuTarget): boolean {
    const uris = targetUris(target);
    return uris.length === 1 && currentPath() === "/collection/tracks" && isTrackUri(uris[0]);
  }

  function canShuffleLocal(target: SpotiKit.MenuTarget): boolean {
    const uris = targetUris(target);
    return uris.length === 1 && currentPath() === "/collection/local-files" && isTrackUri(uris[0]);
  }

  const menuEntries: SpotiKit.MenuEntry[] = [
    SpotiKit.ContextMenu.add({
      label: "Play with Shuffle+",
      icon: pickIcon(["shuffle"], svgMarkup(SHUFFLE_PATH)),
      when: canShuffleTarget,
      onSelect: (target) => {
        void shuffleSelection(targetUris(target));
      },
    }),
    SpotiKit.ContextMenu.add({
      label: "Shuffle+ Liked Songs",
      icon: pickIcon(["heart-active", "heart", "heart-filled"], svgMarkup(HEART_PATH)),
      when: canShuffleLiked,
      onSelect: (target) => {
        void shuffleSelection(targetUris(target));
      },
    }),
    SpotiKit.ContextMenu.add({
      label: "Shuffle+ Local Files",
      icon: pickIcon(["playlist-folder", "folder"], svgMarkup(FOLDER_PATH)),
      when: canShuffleLocal,
      onSelect: (target) => {
        void shuffleSelection(targetUris(target));
      },
    }),
  ];

  const profileEntry: SpotiKit.MenuEntry = SpotiKit.ProfileMenu.add({
    label: "Shuffle+",
    icon: pickIcon(["shuffle"], svgMarkup(SHUFFLE_PATH)),
    onSelect: () => openSettingsDialog(),
  });

  function entityUriFromPath(): string | null {
    const match = /^\/(playlist|album)\/([A-Za-z0-9]+)/.exec(currentPath());
    return match ? `spotify:${match[1]}:${match[2]}` : null;
  }

  function findActionBarRow(): HTMLElement | null {
    return (
      document.querySelector<HTMLElement>(".action-bar-row") ??
      document.querySelector<HTMLElement>('[data-testid="action-bar-row"]')
    );
  }

  function findMoreButton(row: HTMLElement): HTMLElement | null {
    const known = row.querySelector<HTMLElement>(
      '[data-testid="more-button"], [data-testid="more-options-button"], [data-testid="context-menu-button"]',
    );
    if (known) return known;
    const buttons = row.querySelectorAll<HTMLElement>("button");
    for (let index = buttons.length - 1; index >= 0; index -= 1) {
      const label = (buttons[index].getAttribute("aria-label") ?? "").toLowerCase();
      if (label.includes("more")) return buttons[index];
    }
    return null;
  }

  async function runHeaderShuffle(button: HTMLButtonElement): Promise<void> {
    if (headerBusy) return;
    const uri = entityUriFromPath();
    if (!uri) return;
    headerBusy = true;
    button.disabled = true;
    try {
      await playRaw(uri);
    } finally {
      headerBusy = false;
      button.disabled = false;
    }
  }

  function createHeaderButton(): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "shuffle-plus-header-button";
    button.dataset.shufflePlusHeader = "";
    button.setAttribute("aria-label", "Play with Shuffle+");
    button.title = "Play with Shuffle+";
    button.innerHTML = svgMarkup(SHUFFLE_PATH);
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      void runHeaderShuffle(button);
    });
    return button;
  }

  function injectHeaderButton(row: HTMLElement): void {
    if (row.querySelector("[data-shuffle-plus-header]")) return;
    const button = createHeaderButton();
    const more = findMoreButton(row);
    if (more && more.parentElement === row) {
      row.insertBefore(button, more);
      return;
    }
    row.append(button);
  }

  function scheduleHeaderSync(): void {
    if (headerFrame) return;
    headerFrame = requestAnimationFrame(() => {
      headerFrame = 0;
      syncHeaderButton();
    });
  }

  function syncHeaderButton(): void {
    const uri = entityUriFromPath();
    const existing = document.querySelectorAll<HTMLElement>("[data-shuffle-plus-header]");
    if (!uri) {
      existing.forEach((element) => element.remove());
      return;
    }
    const row = findActionBarRow();
    if (!row) return;
    existing.forEach((element) => {
      if (!row.contains(element)) element.remove();
    });
    if (!row.querySelector("[data-shuffle-plus-header]")) injectHeaderButton(row);
  }

  function syncQueueButton(): void {
    if (config.enableQueueButton) {
      if (!playbarButton) {
        playbarButton = SpotiKit.Playbar.add({
          label: "Shuffle+ Queue Tracks",
          icon: pickIcon(["enhance", "sparkles", "queue"], svgMarkup(ENHANCE_PATH)),
          onClick: () => {
            void playRaw("queue");
          },
        });
      }
      return;
    }
    if (playbarButton) {
      playbarButton.remove();
      playbarButton = null;
    }
  }

  syncQueueButton();

  const headerObserver = new MutationObserver(scheduleHeaderSync);
  headerObserver.observe(document.body, { childList: true, subtree: true });
  const offHeaderNavigation = SpotiKit.Navigation.on("change", scheduleHeaderSync);
  syncHeaderButton();

  ctx.onStop(() => {
    headerObserver.disconnect();
    offHeaderNavigation();
    if (headerFrame) cancelAnimationFrame(headerFrame);
    document.querySelectorAll("[data-shuffle-plus-header]").forEach((element) => element.remove());

    for (const entry of [...menuEntries, profileEntry]) {
      try {
        entry.remove();
      } catch (error) {
        console.error(error);
      }
    }
    if (playbarButton) {
      try {
        playbarButton.remove();
      } catch (error) {
        console.error(error);
      }
      playbarButton = null;
    }
    try {
      settingsDialog?.close();
    } catch (error) {
      console.error(error);
    }
    settingsDialog = null;
  });

  async function requestGraphQL(
    name: string,
    fallbackHash: string | undefined,
    variables: Record<string, any>,
  ): Promise<any> {
    if (SpotiKit.GraphQL.has(name)) {
      return unwrapGraphQL(await SpotiKit.GraphQL.query<any>(name, variables));
    }
    if (!fallbackHash) throw new Error(`GraphQL query "${name}" isn't available`);
    const result = await SpotiKit.GraphQL.request<any>(
      { name, operation: "query", sha256Hash: fallbackHash },
      variables,
    );
    if (result.errors?.length) {
      throw new Error(String(result.errors[0]?.message ?? result.errors[0]));
    }
    return result.data;
  }

  async function fetchPlaylistTracks(uri: string): Promise<string[]> {
    const playlistUri = uri.startsWith("spotify:playlist:")
      ? uri
      : `spotify:playlist:${spotifyId(uri) ?? uri}`;
    const res = await SpotiKit.Platform?.PlaylistAPI?.getContents?.(playlistUri, { limit: 9999999 });
    const items: any[] = Array.isArray(res?.items) ? res.items : [];
    return items
      .filter((track) => track?.isPlayable && typeof track.uri === "string")
      .map((track) => track.uri);
  }

  async function fetchFolderTracks(rawUri: string): Promise<string[]> {
    const res = await SpotiKit.Platform?.RootlistAPI?.getContents?.();
    const requestFolder = findFolder(Array.isArray(res?.items) ? res.items : [], rawUri);
    if (!requestFolder) throw new Error("Cannot find folder");

    const playlists: string[][] = [];
    async function walk(node: any): Promise<void> {
      const items: any[] = Array.isArray(node?.items) ? node.items : [];
      for (const item of items) {
        if (item?.type === "playlist" && typeof item.uri === "string") {
          playlists.push(await fetchPlaylistTracks(item.uri));
        } else if (item?.type === "folder") {
          await walk(item);
        }
      }
    }

    await walk(requestFolder);
    return playlists.flat();
  }

  function fetchAlbumTracks(uri: string, includeMetadata: true): Promise<AlbumTrack[]>;
  function fetchAlbumTracks(uri: string, includeMetadata?: false): Promise<string[]>;
  async function fetchAlbumTracks(
    uri: string,
    includeMetadata = false,
  ): Promise<(string | AlbumTrack)[]> {
    if (!SpotiKit.GraphQL.has("queryAlbumTracks")) {
      return fetchAlbumTracksFromPlatform(uri, includeMetadata);
    }

    const data = await requestGraphQL("queryAlbumTracks", undefined, {
      uri,
      offset: 0,
      limit: 100,
    });
    const album = data?.albumUnion;
    if (!album) throw new Error("Album not found");
    if (album.playability?.playable === false) throw new Error("Album is not playable");

    const items: any[] = album.tracksV2?.items ?? album.tracks?.items ?? [];
    const tracks = items
      .map((item) => item?.track)
      .filter((track) => track?.playability?.playable && typeof track?.uri === "string");

    return tracks.map((track) => (includeMetadata ? (track as AlbumTrack) : track.uri));
  }

  async function fetchAlbumTracksFromPlatform(
    uri: string,
    includeMetadata: boolean,
  ): Promise<(string | AlbumTrack)[]> {
    const api = SpotiKit.Platform?.AlbumAPI;
    if (typeof api?.getAlbumTracks !== "function") {
      throw new Error("Album tracks aren't available");
    }

    const tracks: (string | AlbumTrack)[] = [];
    const limit = 100;
    let offset = 0;
    while (true) {
      const page = await api.getAlbumTracks(uri, { offset, limit });
      const items: any[] = Array.isArray(page?.items) ? page.items : [];
      for (const item of items) {
        const track: AlbumTrack | undefined = item?.track ?? item;
        if (!track || typeof track.uri !== "string") continue;
        if (track.playability?.playable === false || track.isPlayable === false) continue;
        tracks.push(includeMetadata ? track : track.uri);
      }
      if (items.length < limit) break;
      offset += limit;
    }
    return tracks;
  }

  async function scanForTracksFromAlbums(
    albums: any[],
    artistName: string,
    type: "album" | "single",
  ): Promise<string[]> {
    const allTracks: string[] = [];

    for (const album of albums) {
      if (typeof album?.uri !== "string") continue;

      let albumTracks: AlbumTrack[];
      try {
        albumTracks = await fetchAlbumTracks(album.uri, true);
      } catch (error) {
        console.error(album, error);
        continue;
      }

      artistFetchTypeCount[type] += 1;
      SpotiKit.notify(`${artistFetchTypeCount[type]} / ${albums.length} ${type}s`);

      for (const track of albumTracks) {
        if (typeof track?.uri !== "string") continue;
        if (config.artistNameMust && !trackHasArtist(track, artistName)) continue;
        allTracks.push(track.uri);
      }
    }

    return allTracks;
  }

  async function fetchArtistTracks(rawUri: string): Promise<string[]> {
    artistFetchTypeCount.album = 0;
    artistFetchTypeCount.single = 0;

    const discography = await requestGraphQL("queryArtistDiscographyAll", ARTIST_DISCOGRAPHY_HASH, {
      uri: rawUri,
      offset: 0,
      limit: 100,
    });
    const overview = await requestGraphQL("queryArtistOverview", ARTIST_OVERVIEW_HASH, {
      uri: rawUri,
      locale: SpotiKit.Locale.language,
      includePrerelease: false,
    });

    const artistName = overview?.artistUnion?.profile?.name ?? "";
    const releases: any[] = (discography?.artistUnion?.discography?.all?.items ?? []).flatMap(
      (group: any) => group?.releases?.items ?? [],
    );
    const artistAlbums = releases.filter((release) => release?.type === "ALBUM");
    const artistSingles = releases.filter(
      (release) => release?.type === "SINGLE" || release?.type === "EP",
    );

    if (!artistAlbums.length && !artistSingles.length) throw new Error("Artist has no releases");

    const albumTracks =
      config.artistMode !== "single"
        ? await scanForTracksFromAlbums(artistAlbums, artistName, "album")
        : [];
    const singleTracks =
      config.artistMode !== "album"
        ? await scanForTracksFromAlbums(artistSingles, artistName, "single")
        : [];

    return albumTracks.concat(singleTracks);
  }

  async function fetchArtistLikedTracks(uri: string): Promise<string[]> {
    const id = spotifyId(uri) ?? uri;
    const res = await SpotiKit.Http.get<any>(
      `sp://core-collection/unstable/@/list/tracks/artist/${id}?responseFormat=protobufJson`,
    );
    const items: any[] = Array.isArray(res?.item) ? res.item : [];
    return items
      .filter((entry) => entry?.trackMetadata?.playable && typeof entry.trackMetadata.link === "string")
      .map((entry) => entry.trackMetadata.link);
  }

  async function fetchArtistTopTenTracks(uri: string): Promise<string[]> {
    const data = await requestGraphQL("queryArtistOverview", ARTIST_OVERVIEW_HASH, {
      uri,
      locale: SpotiKit.Locale.language,
      includePrerelease: false,
    });
    const items: any[] = data?.artistUnion?.discography?.topTracks?.items ?? [];
    return items
      .map((item) => item?.track?.uri)
      .filter((trackUri): trackUri is string => typeof trackUri === "string");
  }

  async function fetchLikedTracks(): Promise<string[]> {
    const res = await SpotiKit.Platform?.LibraryAPI?.getTracks?.({ limit: 9999999 });
    const items: any[] = Array.isArray(res?.items) ? res.items : [];
    return items
      .filter((track) => track?.isPlayable && typeof track.uri === "string")
      .map((track) => track.uri);
  }

  async function fetchLocalTracks(): Promise<string[]> {
    const res = await SpotiKit.Platform?.LocalFilesAPI?.getTracks?.();
    const items: any[] = Array.isArray(res) ? res : [];
    return items
      .map((track) => track?.uri)
      .filter((trackUri): trackUri is string => typeof trackUri === "string");
  }

  function fetchQueue(): string[] {
    const uris: string[] = [];
    try {
      for (const entry of SpotiKit.Queue.next) {
        if (entry?.uri) uris.push(entry.uri);
      }
      const current = SpotiKit.Queue.current;
      if (current?.uri) uris.push(current.uri);
    } catch (error) {
      console.error(error);
    }

    if (!uris.length) {
      try {
        const state = SpotiKit.Platform?.PlayerAPI?._queue?._queueState;
        if (state) {
          for (const track of [...(state.nextUp ?? []), ...(state.queued ?? [])]) {
            if (track?.uri) uris.push(track.uri);
          }
          if (state.current?.uri) uris.push(state.current.uri);
        }
      } catch (error) {
        console.error(error);
      }
    }

    return [...new Set(uris)];
  }

  async function fetchCollection(rawUri: string): Promise<string[] | null> {
    const type = uriType(rawUri);
    const path = currentPath();
    const parsed = parseUri(rawUri);
    const category = typeof parsed?.category === "string" ? parsed.category : "";

    if (type === "collection") {
      if (category === "tracks" || path === "/collection/tracks") return fetchLikedTracks();
      if (category === "local-files" || path === "/collection/local-files") return fetchLocalTracks();
      return null;
    }

    if (path === "/collection/tracks") return fetchLikedTracks();
    if (path === "/collection/local-files") return fetchLocalTracks();
    return null;
  }

  async function fetchShowEpisodes(rawUri: string): Promise<string[]> {
    const id = spotifyId(rawUri) ?? rawUri;
    const res = await SpotiKit.Http.get<any>(
      `sp://core-show/v1/shows/${id}?responseFormat=protobufJson`,
    );
    const items: any[] = Array.isArray(res?.items) ? res.items : [];
    return items
      .filter((episode) => episode?.episodePlayState?.isPlayable)
      .map((episode) => episode?.episodeMetadata?.link)
      .filter((episodeUri): episodeUri is string => typeof episodeUri === "string");
  }

  async function fetchForUri(rawUri: string, type: string | null): Promise<string[] | null> {
    switch (type) {
      case "playlist":
      case "playlist-v2":
      case "playlistv2":
        return fetchPlaylistTracks(rawUri);
      case "album":
        return fetchAlbumTracks(rawUri);
      case "artist":
        if (config.artistMode === "likedSongArtist") return fetchArtistLikedTracks(rawUri);
        if (config.artistMode === "topTen") return fetchArtistTopTenTracks(rawUri);
        return fetchArtistTracks(rawUri);
      case "track":
      case "local-track":
      case "local":
      case "collection":
        return fetchCollection(rawUri);
      case "folder":
        return fetchFolderTracks(rawUri);
      case "show":
        return fetchShowEpisodes(rawUri);
      default:
        return null;
    }
  }

  function installQueue(tracks: string[]): boolean {
    try {
      const playerQueue = SpotiKit.Platform?.PlayerAPI?._queue;
      const client = playerQueue?._client;
      const queue = playerQueue?._queue;
      if (typeof client?.setQueue !== "function" || !queue) return false;

      const nextTracks = tracks.map((uri) => ({
        contextTrack: { uri, uid: "", metadata: { is_queued: "false" } },
        removed: [],
        blocked: [],
        provider: "context",
      }));
      client.setQueue({
        nextTracks,
        prevTracks: queue.prevTracks ?? [],
        queueRevision: queue.queueRevision,
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async function playList(list: string[], context: string | null, type: string | null): Promise<void> {
    const tracks = list.filter(Boolean);
    const count = tracks.length;
    const contextTracks = [...tracks, "spotify:delimiter"];

    if (!installQueue(contextTracks)) {
      await SpotiKit.Queue.clear();
      await SpotiKit.Queue.add(tracks);
    }

    if (context) {
      try {
        const sessionId = SpotiKit.Platform?.PlayerAPI?.getState?.()?.sessionId;
        if (sessionId) {
          await SpotiKit.Platform.PlayerAPI.updateContext(sessionId, {
            uri: context,
            url: `context://${context}`,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    await SpotiKit.Player.next();

    if (type === "artist") {
      if (config.artistMode === "topTen") {
        SpotiKit.notify(`Shuffled Top ${count} Songs`);
      } else if (config.artistMode === "likedSongArtist") {
        SpotiKit.notify(`Shuffled ${count} Liked Songs`);
      } else if (config.artistMode === "single") {
        SpotiKit.notify(
          `Shuffled ${artistFetchTypeCount.single} Singles, Total of ${count} Songs`,
        );
      } else if (config.artistMode === "album") {
        SpotiKit.notify(
          `Shuffled ${artistFetchTypeCount.album} Albums, Total of ${count} Songs`,
        );
      } else {
        SpotiKit.notify(
          `Shuffled ${artistFetchTypeCount.album} Albums, ${artistFetchTypeCount.single} Singles, Total of ${count} Songs`,
        );
      }
    } else {
      SpotiKit.notify(`Shuffled ${count} Songs`);
    }

    artistFetchTypeCount.album = 0;
    artistFetchTypeCount.single = 0;
  }

  async function playRaw(input: string | string[]): Promise<void> {
    try {
      let list: string[] | null;
      let context: string | null = null;
      let type: string | null = null;

      if (Array.isArray(input)) {
        list = [...input];
      } else if (input === "queue") {
        list = fetchQueue();
      } else {
        type = uriType(input);
        list = await fetchForUri(input, type);
        if (!list?.length) {
          SpotiKit.notify("Nothing to play", { type: "error" });
          return;
        }
        context = input;
        if (type === "folder" || type === "collection" || type === "local") context = null;
      }

      if (!list?.length) {
        SpotiKit.notify("Nothing to play", { type: "error" });
        return;
      }

      await playList(shuffle(list), context, type);
    } catch (error) {
      SpotiKit.notify(errorMessage(error), { type: "error" });
      console.error(error);
    }
  }

  async function shuffleSelection(uris: string[]): Promise<void> {
    const targets = uris.filter((uri) => typeof uri === "string" && uri.length > 0);
    if (targets.length === 1) {
      await playRaw(targets[0]);
    } else if (targets.length > 1) {
      await playRaw(targets);
    }
  }
}
