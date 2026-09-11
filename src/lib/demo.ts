// src/lib/demo.ts
// Mode démo : l'application s'ouvre sans compte, sur une base locale séparée.
// Aucun appel à Supabase : les monstres du visiteur restent dans son navigateur,
// et la base locale du compte réel n'est jamais touchée.

const DEMO_PARAM = 'demo'

/** Lu une seule fois au chargement : l'adresse `/?demo` active le mode démo. */
export const isDemoMode = new URLSearchParams(window.location.search).has(DEMO_PARAM)

/** Créatures officielles ajoutées à la première ouverture de la démo. */
export const DEMO_SEED_IDS = ['scrofar-corrompu', 'haut-troll', 'elfe-automne', 'aranea']

/** Recharge la page en mode démo (la base locale est choisie au chargement). */
export function enterDemo() {
  window.location.assign(`/?${DEMO_PARAM}`)
}

/** Quitte la démo et revient à l'écran de connexion. */
export function exitDemo() {
  window.location.assign('/')
}
