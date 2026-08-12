export function exportLocalStorageState(): string {
  const data: Record<string, string> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        data[key] = value;
      }
    }
  }

  return JSON.stringify(data, null, 2);
}

export function downloadJsonExport(filename?: string): void {
  const json = exportLocalStorageState();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download =
    filename ?? `networth-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function importLocalStorageState(json: string): void {
  let parsed: unknown;

  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('Invalid JSON file.');
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Backup file must be a JSON object of storage keys and values.');
  }

  const entries = Object.entries(parsed as Record<string, unknown>);

  if (entries.length === 0) {
    throw new Error('Backup file is empty.');
  }

  for (const [key, value] of entries) {
    if (typeof key !== 'string' || typeof value !== 'string') {
      throw new Error('Each backup entry must be a string key with a string value.');
    }
    localStorage.setItem(key, value);
  }
}

export function readJsonFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Could not read the selected file.'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read the selected file.'));
    reader.readAsText(file);
  });
}
