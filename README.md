# Symbaroum Bestiary Manager

Outil de gestion de bestiaire et calculateur de statistiques pour le jeu de rôle *Symbaroum*, pensé pour l'usage réel d'un maître de jeu en pleine partie.

## Contexte

En jeu de rôle, calculer les statistiques effectives d'un monstre (une fois modifiées par ses traits et talents) demande de croiser plusieurs tableaux de règles à la volée, en pleine improvisation. Ce projet est né d'un besoin concret : un maître de jeu qui avait besoin d'un outil rapide et fiable, utilisable sur tablette en pleine partie, sans dépendre d'une connexion internet stable.

## Fonctionnalités

- Création et édition de monstres à la volée
- Catalogue des 35 créatures officielles du bestiaire de base, groupées par race
- Calcul automatique des statistiques effectives (Défense, Armure, Dégâts) à partir des traits et talents appliqués
- Recherche et filtrage par nom, race, résistance
- Stockage local, fonctionne hors-ligne
- Mode démo sans compte : [symbaroum-bestiary.vercel.app/?demo](https://symbaroum-bestiary.vercel.app/?demo)

## Stack technique

- **Frontend** : Vue 3 (Composition API) + TypeScript
- **État applicatif** : Pinia
- **Persistance locale** : Dexie.js (IndexedDB)
- **Synchronisation cloud / auth** : Supabase
- **Style** : Tailwind CSS

## Démarche produit

Projet mené en solo, du cadrage fonctionnel au développement. 
Le périmètre (utilisateur cible, objectif MVP, priorités) a été défini et documenté avant le premier développement. 
Les évolutions ont ensuite été guidées par les retours d'usage réels du maître de jeu utilisateur, notamment plusieurs correctifs de calcul identifiés directement en cours de partie.

## Statut

Projet actif, en développement continu, utilisé en conditions réelles de jeu.

## Captures d'écran

<img width="1280" height="640" alt="symbaroum" src="https://github.com/user-attachments/assets/63239071-96c1-4368-97aa-cd3a43cc0712" />
<img width="1285" height="794" alt="symbaroum2" src="https://github.com/user-attachments/assets/2ba3a40c-04ae-4df6-85bb-4660f0dd046b" />



## Mode démo

L'adresse `/?demo` (ou le bouton « Découvrir sans compte » de l'écran de connexion) ouvre
l'application sans compte, avec quatre créatures officielles déjà chargées. La démo utilise
une base locale séparée (`SymbaroumBestiaryDemo`) et n'appelle jamais Supabase : ce que le
visiteur crée reste dans son navigateur, et les données du compte réel ne sont jamais touchées.

## Installation locale

```bash
npm install
cp .env.example .env.local   # puis renseigner les deux valeurs Supabase
npm run dev
```

Le mode démo fonctionne même sans valeurs Supabase valides : il ne les utilise pas.
