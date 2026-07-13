# Lessons Learned — Symbaroum Bestiary Manager

## Règles Symbaroum

### Calcul de la Défense
- Défense = Agilité (stat `quick`) par défaut
- Trait Vigoureux I : Défense = Agilité - 2
- Trait Vigoureux II : Défense = Agilité - 3
- Trait Vigoureux III : Défense = Agilité - 4
- `defenseBonus` dans Monster = bonus fixe additionnel (ex: bouclier +1)

### Calcul de l'Endurance
- Endurance stockée directement dans Monster.endurance
- Seuil de blessure (painResistance) = Endurance / 2 (arrondi supérieur)

### Niveaux des talents/traits
- 1 = Novice, 2 = Adepte, 3 = Maître
- Correspond aux niveaux dans TalentEffect.effects[1|2|3]

### defenseModifier des traits Special (Vigoureux, etc.)
- Chaque rang définit la valeur TOTALE de la pénalité (ex : rang 1 = -2, rang 2 = -3)
- Il ne faut PAS les additionner : rang 2 de Vigoureux doit donner -3, pas -2 + -3 = -5
- Fix : pour activation `special`, on n'applique `defenseModifier` qu'au rang le plus élevé
- Fix étendu aux traits `passive` avec `defenseModifier` : même règle que `special`, on prend uniquement le rang le plus élevé

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