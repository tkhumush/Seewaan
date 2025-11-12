import { LRUCache } from 'lru-cache'
import { isValidPubkey } from './pubkey'

type TVerifyNip05Result = {
  isVerified: boolean
  nip05Name: string
  nip05Domain: string
}

const verifyNip05ResultCache = new LRUCache<string, TVerifyNip05Result>({
  max: 1000,
  fetchMethod: (key) => {
    const { nip05, pubkey } = JSON.parse(key)
    return _verifyNip05(nip05, pubkey)
  }
})

async function _verifyNip05(nip05: string, pubkey: string): Promise<TVerifyNip05Result> {
  const [nip05Name, nip05Domain] = nip05?.split('@') || [undefined, undefined]
  const result = { isVerified: false, nip05Name, nip05Domain }
  if (!nip05Name || !nip05Domain || !pubkey) return result

  try {
    const res = await fetch(getWellKnownNip05Url(nip05Domain, nip05Name))
    const json = await res.json()
    if (json.names?.[nip05Name] === pubkey) {
      return { ...result, isVerified: true }
    }
  } catch {
    // ignore
  }
  return result
}

export async function verifyNip05(nip05: string, pubkey: string): Promise<TVerifyNip05Result> {
  const result = await verifyNip05ResultCache.fetch(JSON.stringify({ nip05, pubkey }))
  if (result) {
    return result
  }
  const [nip05Name, nip05Domain] = nip05?.split('@') || [undefined, undefined]
  return { isVerified: false, nip05Name, nip05Domain }
}

export function getWellKnownNip05Url(domain: string, name?: string): string {
  const url = new URL('/.well-known/nostr.json', `https://${domain}`)
  if (name) {
    url.searchParams.set('name', name)
  }
  return url.toString()
}

/**
 * Fetch all public keys from a domain's .well-known/nostr.json file
 *
 * Note: Some domains (like primal.net) only respond to name-specific queries
 * (e.g., /.well-known/nostr.json?name=alice) and don't provide the full user list.
 * This function fetches WITHOUT a name parameter to get the complete directory.
 * Domains that require name-based queries will return empty arrays.
 *
 * @param domain - The domain to fetch from (e.g., "nostr.build")
 * @returns Array of public keys, or empty array if domain doesn't provide full list
 */
export async function fetchPubkeysFromDomain(domain: string): Promise<string[]> {
  try {
    // Validate domain before fetching
    if (!domain || domain.includes('/') || domain.includes('?')) {
      return []
    }

    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    try {
      const res = await fetch(getWellKnownNip05Url(domain), {
        mode: 'cors',
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!res.ok) {
        return []
      }

      const json = await res.json()
      const pubkeySet = new Set<string>()
      const pubkeys = Object.values(json.names || {}).filter((pubkey) => {
        if (typeof pubkey !== 'string' || !isValidPubkey(pubkey)) {
          return false
        }
        if (pubkeySet.has(pubkey)) {
          return false
        }
        pubkeySet.add(pubkey)
        return true
      }) as string[]

      // Filter out query-only domains: If we get only 1 user,
      // this domain likely only supports name-based queries and shouldn't
      // be considered a community with a full directory
      // Note: We allow 2+ users to support small but legitimate communities
      if (pubkeys.length === 1) {
        console.log(
          `[fetchPubkeysFromDomain] Domain ${domain} returned only 1 user - likely query-only, not a full directory`
        )
        return []
      }

      console.log(`[fetchPubkeysFromDomain] Domain ${domain} returned ${pubkeys.length} users`)
      return pubkeys
    } finally {
      clearTimeout(timeoutId)
    }
  } catch (error) {
    // CORS errors and timeouts are expected for domains without proper headers
    // Silently fail - this is expected behavior
    return []
  }
}
