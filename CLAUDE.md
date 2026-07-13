# CLAUDE.md — Symbaroum Bestiary Manager

> App de gestion de bestiaire et calculateur de stats dynamiques pour le JdR Symbaroum. Auteur : Gaëlle | Rôle : PM & Dev Solo Stack : Vue 3 (Vite) + Pinia + Dexie.js (IndexedDB) + Tailwind CSS

## 🎯 Contexte du projet

Aider le MJ de Symbaroum à gérer l'improvisation et les combats en calculant automatiquement les "Stats Effectives" (modifiées par les Traits/Talents) qui sont complexes à gérer de tête.

**Utilisateur cible** : Paul (MJ), usage principal sur tablette. **Objectif MVP** : Création de monstres à la volée + calcul auto Défense/Armure/Dégâts + Stockage local persistant.

## 1. Mode Plan — Toujours planifier avant d'agir

- Entrer en **plan mode** pour toute tâche non triviale.
- Valider le plan avec l'utilisateur avant de coder.
- **Priorité Métier** : Le calcul des stats Symbaroum doit être exact selon les règles du livre de base.
- Expliquer le **POURQUOI** des choix techniques.

## 2. Stratégie de Données (Local-First)

- **Source de vérité** : IndexedDB via **Dexie.js**.
- **Performance** : L'UI doit répondre en < 100ms.
- **Persistence** : Les données survivent au rafraîchissement et à la fermeture du navigateur.

## 3. Boucle d'Auto-Amélioration

- Mettre à jour `tasks/lessons.md` après chaque correction majeure.
- Documenter les spécificités des règles de Symbaroum rencontrées.

## 4. Gestion des Tâches

1. **Planifier** dans `tasks/todo.md`.
2. **Implémenter** par petits incréments testables.
3. **Démontrer** le calcul des stats effectives pour valider la logique.

## 📐 Conventions de Code

- **Langage** : TypeScript strict.
- **Architecture** : Vue 3 Composition API (`<script setup>`).
- **Store** : Pinia pour l'état réactif.
- **Logique Métier** : Isoler les calculs dans des utils/mechanics.ts ou computed Pinia.
- **Style** : Tailwind CSS (Mobile-first pour tablette).
- **Langue** : Code en anglais, commentaires et interface en français.

## 🏗️ Architecture du projet

- `src/types/` : Interfaces TypeScript (rules.ts, monster.ts)
- `src/data/` : Données officielles statiques
- `src/database/` : Configuration Dexie (db.ts)
- `src/composables/` : Logique de persistence avec Dexie
- `src/stores/` : État global Pinia
- `src/logic/` : Formules pures (mechanics.ts)
- `src/components/` : Composants atomiques
- `tasks/` : Suivi du projet (todo.md, lessons.md)

## État Actuel (Sprint 1 - En cours)

### ✅ FAIT
- Formulaire création/édition/suppression de monstres
- Choix de Claude Code:
    - Traits/talents: select multi + bouton "Ajouter" (badges supprimables)
    - Équipement: dropdown armes/armures (lists existantes) + bouton "Ajouter"
    - Sauvegarde: Bouton "Sauvegarder" (pas auto-save)
- Bug DataCloneError: FIXÉ (JSON.parse/stringify avant sauvegarde Dexie)
- Persistance Dexie: ✅ fonctionne

### ❌ SPRINT 1 RESTANT (POST-FORMULAIRE)
- Sprint 2: Recherche/Filtrage
- Sprint 3: Export/Import JSON
- Sprint 4: UI Mobile responsive