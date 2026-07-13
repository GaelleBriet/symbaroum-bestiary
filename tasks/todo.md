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

  
### SPRINT 4: Supabase — Persistence Cloud

Raison: Dexie stocke dans le navigateur. Vider le cache = tous les monstres perdus.
Supabase = comptes MJ, données sauvegardées en cloud, accessibles depuis n'importe quel appareil.

-  (compte par MJ)
- Sync monsters table → Supabase
- Migration Dexie → Supabase



