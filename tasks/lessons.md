# Lessons Learned — Symbaroum Bestiary Manager

## Règles Symbaroum

### Calcul de la Défense (révisé 2026-08-03 — corrige les notes précédentes)
- Défense = stat effective (`quick`/Agilité par défaut, ou la stat de remplacement si un
  talent passif type Tacticien II est actif — `replaceStat` sourceAction `'defense'`)
  + modificateur de traits type Robuste/Vigoureux (rang le plus élevé UNIQUEMENT, cf. section
  "Rangs I/II/III" ci-dessous). `monster.defenseBonus` n'est PLUS additionné.
- `defenseBonus` **n'est pas** un bonus fixe à additionner (ex bouclier) — c'était une erreur
  de compréhension initiale. C'est une valeur dérivée = `10 - Défense`, qui représente le
  bonus/malus d'attaque des JOUEURS contre la créature (même famille que le "bonus efficient"
  des attributs). Elle est maintenant recalculée à la volée (`playerModifiers.attackModifier`
  dans `mechanics.ts`) et affichée dans la case Défense de `MonsterDetail.vue`, plutôt que lue
  depuis le champ `defenseBonus` stocké (qui n'est plus utilisé par le moteur de calcul — les
  valeurs historiques dans `monsters.ts` ne sont pas fiables, cf. section "Bug bonus efficient"
  plus bas ; le champ reste dans le type/formulaire pour l'instant, à nettoyer plus tard).
- Trait Vigoureux I/II/III : Défense = Agilité - 2/-3/-4
- Trait Robuste I/II/III : Défense = Agilité - 2/-3/-4 (même mécanique que Vigoureux)
- Le tableau Attributs (colonne "Bonus") affiche `10 - stat effective` pour CHAQUE attribut —
  y compris Agilité — mais SANS les modificateurs de Robuste/Vigoureux : ces derniers ne
  s'appliquent qu'au calcul de la case Défense, jamais à la stat Agilité générale.

### Bug "bonus efficient" stocké dans `statModifiers` (trouvé + corrigé 2026-08-03)
- Les 35 monstres de `monsters.ts` avaient `statModifiers[stat] = 10 - baseStats[stat]` pour
  les 8 attributs, sans exception (vérifié par script, 0 écart). C'est la formule du "bonus
  efficient" (10 - stat) stockée par erreur dans le mauvais champ, puis ré-additionnée aux
  stats de base dans `calculateEffectiveStats` → l'effective stat de TOUT attribut, sur TOUT
  monstre, retombait exactement à 10 avant application des talents.
- `statModifiers` doit valoir 0 par défaut (`ZERO_MODS` dans `MonsterForm.vue`) ; ne sert qu'à
  de rares ajustements narratifs manuels. Remis à 0 sur les 35 monstres.
- Leçon : si un champ censé être "presque toujours 0" a une valeur non-nulle sur 100% des
  entrées ET que cette valeur suit une formule déterministe suspecte, chercher une confusion
  entre "donnée d'entrée" et "valeur dérivée/affichage" avant de blâmer autre chose.

### Dé de l'arme naturelle / attaque à mains nues
- Règle implicite du livre (non explicite mais déductible du texte du trait Arme Naturelle) :
  les attaques à mains nues/armes naturelles infligent 1d4 de base, qui évolue en 1d6 (rang I)
  puis 1d8 (rang II) puis 1d10 (rang III) grâce au trait Arme Naturelle.
- Les armes "naturelles" d'un monstre (Défenses, Griffes, Morsure, Crocs, Bec...) n'existent
  PAS dans le catalogue `src/data/equipment.ts` (normal, ce sont des armes propres à chaque
  créature). Le champ brut `damage: N` stocké sur `MonsterWeapon` pour ces armes n'est PAS un
  nombre de faces de dé — ne jamais le traiter comme tel (`1d${w.damage}`). Utiliser
  `naturalWeaponSides` calculé dans `mechanics.ts` (0→1d4, 1→1d6, 2→1d8, 3→1d10 selon le rang
  du trait Arme Naturelle du monstre), via `resolveWeaponSides()` dans `damageCalculator.ts`.
- Erratum (21 sept. 2026) : le chiffre "Dégâts 11,5" du Scrofar Corrompu documenté plus bas
  (section CORRECTIFS de `tasks/todo.md`, Bug 5) était basé sur un calcul manuel utilisant
  1d8 (rang II), alors que la fiche officielle du Scrofar Corrompu indique bien Arme Naturelle
  **(III)** — donc 1d10, comme le calcule déjà correctement le code. Le vrai total est
  **12,5** (1d10 Défenses [5,5] + 1d8 Robuste III [4,5] + 1d4 Poigne de fer II [2,5]). C'est la
  doc qui était fausse, pas le code ni la donnée `level: 3`.

### Calcul de l'Endurance
- Endurance stockée directement dans Monster.endurance
- Seuil de blessure (painResistance) = Endurance / 2 (arrondi supérieur)

### Niveaux des talents/traits
- 1 = Novice, 2 = Adepte, 3 = Maître
- Correspond aux niveaux dans TalentEffect.effects[1|2|3]

### Rangs I/II/III "valeur totale par rang" → utiliser `isReplacementFor` (révisé 2026-08-03)
- Beaucoup de traits à rangs I/II/III (Vigoureux, Robuste, Armure Naturelle, Arme Naturelle...)
  décrivent à CHAQUE rang la valeur TOTALE à ce rang (ex : Robuste III = [Agilité - 4]), pas un
  delta à cumuler avec les rangs inférieurs. Il ne faut donc PAS additionner `defenseModifier`/
  `armorBonus`/`damageBonus`/`damageDice` des rangs 1..N : seul le rang le plus élevé compte.
- Le mécanisme correct (déjà présent dans le type `TalentEffect`) est `isReplacementFor` : le
  rang N doit déclarer `isReplacementFor: N-1` pour signaler qu'il remplace le(s) rang(s)
  précédent(s). `calculateEffectiveStats` (section "replacedRanks") calcule l'ensemble des
  rangs remplacés et les EXCLUT de la boucle d'accumulation passive, pour tous les champs
  (pas seulement `defenseModifier` comme dans une version précédente du code — c'était un fix
  trop étroit, ex. Armure Naturelle II cumulait encore 2+3 avant ce correctif).
- ⚠️ Ne pas généraliser aveuglément : certains talents ont des rangs qui accordent des effets
  RÉELLEMENT distincts qui doivent se cumuler (ex. Guerrier Né I change le dé des mains nues à
  1d6, Guerrier Né III ajoute +1d6 de dégâts supplémentaires à CHAQUE attaque — deux effets
  différents, pas le même stat réécrite plus fort). Ajouter `isReplacementFor` seulement quand
  le texte de règle confirme que le rang supérieur remplace le(s) précédent(s).

### replaceStat
- Certains talents remplacent la stat utilisée pour une action
- Ex: Poigne de Fer I → utilise `strong` au lieu de `accurate` pour les attaques CAC
- Le moteur doit tenir compte de ces remplacements dans calculateEffectiveStats

## Décisions Techniques

### Dexie.js
- Seule la table `monsters` est persistée (les données officielles sont statiques dans /data)
- Les talents/traits dans Monster.talents[] et Monster.traits[] ne stockent que id + level (FK logique)

### Architecture
- La logique de calcul est PURE dans src/logic/mechanics.ts (pas d'effets de bord)
- Le store Pinia orchestre : chargement Dexie → calcul mechanics → état réactif UI

## Données de Test

### IDs d'équipement dans les monstres de test
- Utiliser UNIQUEMENT des IDs existants dans `src/data/equipment.ts`
- Un ID inventé (ex: `griffes-troll`) → arme introuvable → invisible sur la fiche
- Les armes naturelles (griffes, morsures) n'existent PAS dans equipment.ts ; utiliser `griffe-de-combat`, `poing`, etc.
- Vérifier dans WEAPONS/ARMORS que l'ID existe avant de créer un monstre de test
- Le `damage` et `qualityIds` doivent correspondre à l'arme réelle dans equipment.ts

## Catalogue officiel & UX (Sprint 2)

### Pattern ajout monstre prédéfini
- `groupedPresets` computed : Object.entries groupés par `race`, triés `localeCompare('fr')`
- Avant `store.addMonster()` : destructurer pour enlever `id` et `createdAt` du preset (sinon conflit Dexie)
- `@change` sur le `<select>` déclenche `addPresetMonster()` directement (pas de bouton séparé)
- Remettre `selectedPreset.value = ''` après ajout pour réinitialiser le dropdown

### Pattern feedback inline court
```ts
const addedFeedback = ref(false)
addedFeedback.value = true
setTimeout(() => { addedFeedback.value = false }, 2000)
```
→ `v-if="addedFeedback"` sur un `<span>` stylé (pas de toast externe nécessaire)

### Barre de contrôle 2 lignes
- `space-y-2` sur le conteneur parent
- Ligne 1 (flex) : `<input flex-1>` + `<select w-44>`
- Ligne 2 (flex) : `<button shrink-0>` + `<select flex-1>` + `<span shrink-0>` (feedback)

## Formulaire CRUD (Sprint 1)

### Structure MonsterForm.vue
- Props: mode ('create'|'edit'), initialData?: Monster
- Emits: save(monster), cancel()
- Validation: name + race requis, stats 5-15

### Choix d'implémentation
1. Traits/Talents: dropdowns avec bouton "Ajouter"
   → badges supprimables (pas multi-select pur)
2. Équipement: dropdowns (listes existantes equipment.ts)
   → pas de champs textes libres
3. Sauvegarde: JSON.parse(JSON.stringify(formData)) avant Dexie
   → évite DataCloneError (Proxies Vue)