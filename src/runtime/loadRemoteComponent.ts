import { findRemote, loadManifest, publicAsset, RemoteComponentRecord } from './registry';
import { evaluateComponentBundle, RemoteComponent } from './sandbox';
import { SHARED_DEPS } from './sharedDeps';

const componentCache = new Map<string, Promise<RemoteComponent>>();

export async function loadRemoteComponent(record: RemoteComponentRecord): Promise<RemoteComponent> {
  const key = `${record.name}@${record.version}`;
  let pending = componentCache.get(key);
  if (!pending) {
    pending = fetch(publicAsset(record.entry))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`component bundle ${record.name} ${response.status}`);
        }
        return response.text();
      })
      .then((code) => evaluateComponentBundle(code, SHARED_DEPS))
      .catch((error) => {
        componentCache.delete(key);
        throw error;
      });
    componentCache.set(key, pending);
  }
  return pending;
}

export async function loadRemoteStaticData(compCode: string): Promise<unknown[] | undefined> {
  const record = await findRemote(compCode);
  if (!record) return undefined;
  const manifest = await loadManifest(record);
  return manifest.staticData || [];
}

export async function loadRemoteCompConfig(compCode: string, version: string) {
  const record = await findRemote(compCode, version);
  if (!record) return undefined;
  const manifest = await loadManifest(record);
  return manifest.compConfig;
}
