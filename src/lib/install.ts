import {
  asset,
  INSTALL_SCRIPT,
  INSTALLER,
  type PlatformId,
  type ReleaseInfo,
  ARCHIVE,
  BINARY,
} from './release'

/**
 * The commands the site hands out have to be the ones that actually work
 * today, not the ones the README wishes were true: `install.sh` reads
 * `releases/latest/download/manifest.json` on the stable channel, so while
 * the newest complete build is the rolling `dev` one, the one-liner has to
 * name that channel explicitly. `recommended` in lib/release.ts decides
 * which case we're in; this module only spells it out.
 */

/** `curl … | sh` for macOS and Linux. */
export function installCommand(info: ReleaseInfo): string {
  const url = asset(info, INSTALL_SCRIPT).url
  const channel = info.channel === 'dev' ? ' -s -- --channel dev' : ''
  return `curl -fsSL ${url} | sh${channel}`
}

/** Same script, minus the pipe — for people who read before they run. */
export function inspectCommand(info: ReleaseInfo): string {
  return `curl -fsSL ${asset(info, INSTALL_SCRIPT).url} -o install.sh`
}

export function uninstallCommand(info: ReleaseInfo): string {
  return `curl -fsSL ${asset(info, INSTALL_SCRIPT).url} | sh -s -- --uninstall`
}

/** PowerShell one-liner that fetches the installer and runs it. */
export function windowsCommand(info: ReleaseInfo): string {
  const url = asset(info, INSTALLER).url
  const path = `"$env:TEMP\\${INSTALLER}"`
  return `iwr ${url} -OutFile ${path}; & ${path}`
}

export function verifyCommand(name: string, sha: string): string {
  return name.endsWith('.exe') || name.endsWith('.zip')
    ? `Get-FileHash .\\${name} -Algorithm SHA256   # expect ${sha.slice(0, 16)}…`
    : `shasum -a 256 ${name}   # expect ${sha.slice(0, 16)}…`
}

export const SOURCE_COMMAND = 'cargo install --git https://github.com/Aver005/pooprusteek'

export function binaryAsset(info: ReleaseInfo, platform: PlatformId) {
  return asset(info, BINARY[platform])
}

export function archiveAsset(info: ReleaseInfo, platform: PlatformId) {
  return asset(info, ARCHIVE[platform])
}

export function installerAsset(info: ReleaseInfo) {
  return asset(info, INSTALLER)
}
