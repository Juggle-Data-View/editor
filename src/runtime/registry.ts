export interface RemoteComponentRecord {
  name: string;
  version: string;
  title: string;
  category: string;
  group: string;
  entry: string;
  manifest: string;
  shared?: string[];
}

export interface RemoteManifest {
  name: string;
  version: string;
  title: string;
  main: string;
  shared?: string[];
  staticData?: unknown[];
  compConfig: {
    version: string;
    tab?: { config?: boolean; dataset?: boolean };
    template: Record<string, unknown>;
    forms?: unknown;
  };
}

interface RegistryFile {
  components: RemoteComponentRecord[];
}

let registryPromise: Promise<RemoteComponentRecord[]> | null = null;
const manifestCache = new Map<string, Promise<RemoteManifest>>();

export function publicAsset(path: string): string {
  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}

export function loadRegistry(): Promise<RemoteComponentRecord[]> {
  if (!registryPromise) {
    registryPromise = fetch(publicAsset('/components/registry.json'))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`component registry ${response.status}`);
        }
        return response.json() as Promise<RegistryFile>;
      })
      .then((file) => file.components || [])
      .catch((error) => {
        registryPromise = null;
        throw error;
      });
  }
  return registryPromise;
}

export async function findRemote(name: string, version?: string): Promise<RemoteComponentRecord | undefined> {
  const list = await loadRegistry();
  return list.find((item) => item.name === name && (!version || item.version === version));
}

export function loadManifest(record: RemoteComponentRecord): Promise<RemoteManifest> {
  const key = `${record.name}@${record.version}`;
  let pending = manifestCache.get(key);
  if (!pending) {
    pending = fetch(publicAsset(record.manifest))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`component manifest ${record.name} ${response.status}`);
        }
        return response.json() as Promise<RemoteManifest>;
      })
      .catch((error) => {
        manifestCache.delete(key);
        throw error;
      });
    manifestCache.set(key, pending);
  }
  return pending;
}
