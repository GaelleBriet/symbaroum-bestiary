# Symbaroum Bestiary Manager — Todo

### SPRINT 1: Formulaire & CRUD — ✅ TERMINÉ

- [x] Formulaire créer/éditer/supprimer monstres
- [x] Boutons Éditer + Supprimer affichés
- [x] Traits/talents ajoutables via select + bouton
- [x] Équipement: dropdowns armes/armures
- [x] Bug DataCloneError fixé
- [x] Persistance Dexie validée

### SPRINT 2: Recherche & Filtrage — ✅ TERMINÉ

- [x] Barre de recherche par nom/race
- [x] Filtre par résistance
- [x] Dropdown monstres prédéfinis groupés par race (35 créatures officielles)
- [x] Suppression boutons de test — remplacés par le catalogue officiel
- [x] Feedback "Monstre ajouté !" inline après sélection prédéfini

### SPRINT 3: Intégration Bestiaire Officiel — ✅ TERMINÉ

- [x] TÂCHE 1 — Supprimer les monstres de test
Supprimer le bloc boutons de test dans MonsterList.vue (+ Troll, + Garde, + Archer, + Berserk)
Supprimer dans le store: generateTestTroll, generateTestHommeArmes, generateTestTireurElite, generateTestBerserker
- [x] TÂCHE 2 — Réorganiser la barre de contrôle
Nouvelle disposition en deux lignes:
LIGNE 1: [input recherche ............] [select résistance v]
LIGNE 2: [+ Créer un monstre]  [Sélectionner un monstre prédéfini v]
- [x] TÂCHE 3 — Dropdown bestiaire officiel
Importer MONSTERS depuis src/data/monsters.ts
Dropdown groupé par race (Troll, Elfe, Abomination, Arachnide...)
- 
Au choix → store.addMonster() avec isCustom: false
Remettre le select à vide après ajout
Feedback bref "Monstre ajouté!" (toast ou message inline)

  
### SPRINT 4: Supabase — Persistence Cloud — ✅ CODE TERMINÉ (test manuel restant)

Raison: Dexie stocke dans le navigateur. Vider le cache = tous les monstres perdus.
Supabase = comptes MJ, données sauvegardées en cloud, accessibles depuis n'importe quel appareil.

- [x] `npm install @supabase/supabase-js`
- [x] `src/lib/supabase.ts` — client initialisé (`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`)
- [x] `src/stores/authStore.ts` — session, login/logout, `onAuthStateChange`
- [x] `src/components/LoginForm.vue` — email/password, pas d'inscription publique
- [x] `src/App.vue` — gate (chargement → login → app), session persistante au refresh
- [x] `src/components/AuthStatusBar.vue` — badge "Mode hors ligne" + bouton déconnexion (dans les 2 headers)
- [x] `src/logic/supabaseSync.ts` — fetch/upsert/delete, uniquement monstres `isCustom: true`
- [x] `monsterStore.ts` — `hydrateFromCloud` au login + sync fire-and-forget sur add/update/delete
- [x] Fallback offline : si hydratation échoue, Dexie sert de cache, badge affiché
- [x] Monstres officiels (`isCustom: false`) jamais envoyés à Supabase

**Vérifié** : build TypeScript sans nouvelle erreur, tous les modules servis sans erreur par Vite, projet Supabase joignable (`/auth/v1/health` → 200, RLS actif → 401 sans session).
**Non vérifié** (pas de navigateur disponible dans cet environnement de dev) : login réel avec le compte de Paul, rendu visuel, cycle CRUD live dans l'UI. À tester manuellement avant de clore définitivement le sprint.

### CORRECTIFS — Bugs remontés par Paul sur la fiche Scrofar — ✅ CODE TERMINÉ (vérif visuelle restante)

Cause racine trouvée : `statModifiers` corrompu sur les 35 monstres (= `10 - baseStats`, cf. `tasks/lessons.md`), moteur de calcul mélangeant Défense/Agilité, rangs I/II/III cumulés au lieu de ne garder que le rang max, armes naturelles mal dérivées. Détail des causes et des formules dans `tasks/lessons.md`.

- [x] Bug 1 — Bonus efficient des attributs non calculé (affichait la stat brute, pas `10 - stat`)
- [x] Bug 2 — Bonus efficient Agilité modifié par Robuste/Vigoureux (isolé dans le calcul de Défense uniquement)
- [x] Bug 3 — ATT JOUEUR = `10 - Défense` (pas `10 - Agilité`)
- [x] Bug 4 — Défense fausse (Scrofar : 13 Agi - 4 Robuste III = 9) ; `defenseBonus` n'est plus additionné, recalculé comme `10 - Défense` et affiché en second nombre dans la case Défense ("+1 ATT joueurs")
- [x] Bug 5 — Dégâts : moyenne statistique (pas le max), dés de base des Défenses corrigés (1d10 Défenses [Arme Naturelle III] + 1d8 Robuste III + 1d4 Poigne de fer II = 12,5 — corrigé le 21 sept. 2026, cf. erratum ci-dessous)
- [x] Bug 6 — "Équipement" renommé "Armes"
- [x] Bug 7 — Dé de l'arme naturelle dérivé du rang du trait Arme Naturelle (1d4→1d6→1d8→1d10), plus lu depuis le champ brut `damage`
- [x] Amélioration 1 — Catégorie de la créature (race) agrandie sous le nom
- [x] Amélioration 2 — Seuil de blessure agrandi sous Endurance
- [x] Bonus trouvé en creusant (non demandé mais même famille de bug) : Absorption incluait pas le bonus d'Armure Naturelle, jamais affiché ; rangs I/II/III d'Armure Naturelle cumulés au lieu du rang max

**Vérifié** : `vue-tsc --noEmit` sans erreur ; logique validée en exécutant `calculateEffectiveStats`/`calculateTotalDamage` directement sur les données réelles de Scrofar et Kanaran — tous les résultats correspondent exactement aux calculs manuels de Paul (Défense 9/+1, Défense Kanaran 14/-4, Dégâts 12,5).
**Non vérifié** : rendu visuel dans le navigateur — bloqué par l'auth Supabase réelle (compte unique de Paul), pas de credentials disponibles dans cet environnement. À vérifier visuellement par Paul/toi avant de considérer le sprint clos.

**Erratum (21 sept. 2026)** : le chiffre "Dégâts 11,5" écrit ci-dessus lors de la clôture initiale
de ce sprint était faux — calculé à la main avec 1d8 (comme si Arme Naturelle était au rang II),
alors que la fiche officielle du Scrofar Corrompu indique bien Arme Naturelle **(III)**. Le code
et la donnée (`level: 3` dans `monsters.ts`) étaient corrects depuis le début ; seul ce chiffre
"vérifié à la main" était erroné, jamais recroisé avec la fiche officielle. Vrai total : 12,5.
Trouvé lors d'une revue qualité/sécurité complète de `main`, confirmé avec la fiche officielle.
Voir aussi l'erratum dans `tasks/lessons.md`.

**Suivi / dette identifiée (pas fait, à trier)** :
- Champ `defenseBonus` devenu inutilisé dans le calcul (remplacé par une valeur dérivée) — encore présent dans `Monster`/`MonsterForm.vue`/les données. À nettoyer (retirer du formulaire ?) si vous validez qu'il ne sert plus à rien.
- Autres talents à rangs potentiellement cumulatifs à auditer avec la même grille que Robuste/Armure Naturelle/Arme Naturelle (ex. Poigne de Fer III qui devrait sans doute remplacer le II, pas s'additionner).
- Armes non cataloguées sur le reste du bestiaire (ex. `epee-rouille` du Dragoul) : retombent maintenant sur le dé "mains nues" par défaut (1d4 sauf Arme Naturelle) faute de correspondance dans `equipment.ts` — correct pour les créatures aux griffes/crocs, mais pas idéal pour une "vraie" arme manufacturée mal identifiée. À vérifier monstre par monstre si besoin.

### MODE DÉMO — ✅ CODE TERMINÉ (11 sept. 2026)

Raison : l'application en ligne s'ouvre sur un écran de connexion, un visiteur (client,
recruteur, page d'étude de cas du portfolio) ne voit rien de l'outil. Un compte de test
public aurait exposé des identifiants modifiables par n'importe qui.

- [x] `src/lib/demo.ts` — `isDemoMode` lu depuis l'URL (`/?demo`), `enterDemo()` / `exitDemo()`
- [x] `db.ts` — base Dexie séparée en démo (`SymbaroumBestiaryDemo`)
- [x] `authStore` — en démo, aucune session lue (`userId` null → aucune synchro Supabase)
- [x] `monsterStore.seedDemoIfEmpty()` — Scrofar Corrompu, Haut Troll, Elfe d'Automne, Aranéa à la première ouverture
- [x] `LoginForm` — bouton « Découvrir sans compte » + mention « rien n'est enregistré en ligne »
- [x] `AuthStatusBar` — badge « Démo », bouton « Quitter la démo »
- [x] `.env.example` + README (démo, lancement local)

**Vérifié** : `vue-tsc` + build OK ; parcours testé dans Chromium sur le build (connexion → démo →
4 créatures → ajout d'un prédéfini → fiche → rechargement conservé → quitter la démo) ;
0 requête vers Supabase, 0 erreur console, seule la base `SymbaroumBestiaryDemo` créée.
**Non vérifié** : connexion réelle avec le compte du MJ après ce changement (pas d'identifiants
dans cet environnement) — à tester une fois avant de merger.

