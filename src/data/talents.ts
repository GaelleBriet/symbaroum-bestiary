// src/data/talents.ts

/**
 * Tous les talents officiels de Symbaroum.
 * Source : Livre de base Symbaroum
 */

import type { TalentOrTrait } from '../types/rules';

export const TALENTS: Record<string, TalentOrTrait> = {
  // ─────────────────────────────────────────────────────────────────────────
  // Acrobatie
  // ─────────────────────────────────────────────────────────────────────────

  acrobatie: {
    id: 'acrobatie',
    name: 'Acrobatie',
    description:
      'Le personnage a appris à manœuvrer avec agilité pour échapper au combat rapproché.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        customText:
          'Active: Se déplacer dans une zone de contrôle → Test [Agilité] Vs Attaques Gratuites\n' +
            'Si échec, choisit entre ne pas se déplacer ou subir les attaques gratuites.',
      },
      2: {
        activation: 'free',
        customText:
          'Gratuite: Si à terre → Test [Agilité] pour se relever.\n' +
            'Si échec doit dépenser une action de mouvement',
      },
      3: {
        activation: 'active',
        customText:
          'Active: Utilise ses ennemis comme bouclier, le combat doit inclure plusieurs adversaires\n' +
            '→ Test [Agilité]\n' +
            'Si réussit, le PJ inflige les dégâts qu\'il devait subir sur un ennemi adjacent qui ne peut pas se défendre contre cette attaque.\n' +
            'Si échec, PJ subit les dégâts.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Alchimie
  // ─────────────────────────────────────────────────────────────────────────

  alchimie: {
    id: 'alchimie',
    name: 'Alchimie',
    description:
      'Le personnage est initié aux mystères de l\'alchimie et peut concocter divers élixirs.',
    type: 'talent',
    effects: {
      1: {
        activation: 'special',
        customText: 'Spéciale: Le PJ peut récolter des plantes et minéraux utiles à la fabrication d\'élixirs pendant ses voyages en forêt et explorations.\n' +
            'Le PJ prépare 1 dose d\'élixir novice à la discrétion du MJ.',
      },
      2: {
        activation: 'special',
        customText: 'Spéciale: PJ prépare 1 dose d\'élixir adepte ou 1d4 doses d\'élixir novice.',
      },
      3: {
        activation: 'special',
        customText:
          'Spéciale: PJ prépare 1 dose d\'élixir de maître ou 1d4 doses d\'élixir d\'adeptes ou 1d8 doses d\'élixir novice.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Attribut exceptionnel
  // ─────────────────────────────────────────────────────────────────────────

  attributExceptionnel: {
    id: 'attribut-exceptionnel',
    name: 'Attribut exceptionnel',
    description:
      'Améliore un attribut du personnage grâce à l\'entraînement quotidien.',
    type: 'talent',
    effects: {
      1: {
        activation: 'special',
        customText: 'Un attribut au choix augmente de +1',
      },
      2: {
        activation: 'special',
        customText: 'Cet attribut est désormais augmenté de +2',
      },
      3: {
        activation: 'special',
        customText: 'Cet attribut est désormais augmenté de +3',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Berserker
  // ─────────────────────────────────────────────────────────────────────────

  berserker: {
    id: 'berserker',
    name: 'Berserker',
    description:
      'Le personnage peut entrer en état de rage pour déclencher une frénésie de combat.',
    type: 'talent',
    effects: {
      1: {
        activation: 'free',
        damageDice: '1d6',
        defenseModifier: -5,
        customText:
          'Gratuite: 1 action gratuite pour entrer en folie meurtrière.\n' +
            'Dégâts Cac +1d6\n' +
            'Agilité tombe à 5 pour le calcul de sa Défense.',
      },
      2: {
        activation: 'reactive',
        customText:
          'Réactive: Quand le PJ subit des dégâts qui atteignent ou dépassent son seuil de blessure, il peut Test [Force], s\'il réussit il ne subit pas les effets supplémentaires de cette attaque.',
      },
      3: {
        activation: 'free',
        isReplacementFor: 1,
        damageDice: '1d6',
        customText: 'Gratuite: Ne subit plus de malus pour le calcul de sa défense.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Cavalier
  // ─────────────────────────────────────────────────────────────────────────

  cavalier: {
    id: 'cavalier',
    name: 'Cavalier',
    description:
      'Le personnage peut utiliser une monture en combat de manière efficace.',
    type: 'talent',
    effects: {
      1: {
        activation: 'reactive',
        damageDice: '1d6',
        customText: 'Réactif: Si la monture a avancé avant l\'attaque :\n' +
            'Dégâts Cac +1d6',
      },
      2: {
        activation: 'active',
        customText:
          'Actif: Peut segmenter son mouvement avant et après l\'attaque pour ne pas rester bloqué au Cac.\n' +
            'Ennemi obligé d\'utiliser une réaction ou un mouvement pour attaquer le PJ.',
      },
      3: {
        activation: 'reactive',
        damageDice: '1d10',
        customText: 'Réactif: Si la monture a avancé avant l\'attaque :\n' +
            'Dégâts Cac +1d10.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Conjuration
  // ─────────────────────────────────────────────────────────────────────────

  conjuration: {
    id: 'conjuration',
    name: 'Conjuration',
    description:
      'Le personnage se tourne vers les ténèbres et la Corruption pour obtenir des pouvoirs.',
    type: 'talent',
    effects: {
      1: {
        activation: 'special',
        customText:
          'Spécial: Le conjureur peut réduire la corruption qu\'il reçoit Test [Volonté] si réussi ne subit qu\'un (1) point de corruption.',
      },
      2: {
        activation: 'reactive',
        customText:
          'Réactif: Si le conjureur échoue à son premier test d\'utilisation d\'un pouvoir, il peut faire un second test contre sa corruption totale.\n' +
            'S\'il réussit le pouvoir s\'active et le conjureur subit 1d4 points de corruptions temporaires supplémentaires.',
      },
      3: {
        activation: 'special',
        customText:
          'Spécial: Le conjureur peut choisir d\'affecter l\'ombre de sa cible, plutôt que sa volonté (Volonté - Corruption totale).\n' +
            'Les créatures totalement corrompues sont immunisées à ce pouvoir.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Connaissance des bêtes
  // ─────────────────────────────────────────────────────────────────────────

  connaissanceBetes: {
    id: 'connaissance-betes',
    name: 'Connaissance des bêtes',
    description:
      'Le personnage possède une connaissance accrue du monde animal et des monstres.',
    type: 'talent',
    effects: {
      1: {
        activation: 'free',
        customText:
          'Gratuit: → Test [Astuce]\n' +
            'Si réussit connaît les forces et faiblesses de la créature ainsi que ses stats.',
      },
      2: {
        activation: 'free',
        damageBonus: 1,
        customText:
          'Gratuit: PJ choisit parmi : Abominations, Bêtes, Créatures civilisées, Morts-vivants.\n' +
            'PJ inflige +1 dégâts à ces créatures.\n' +
            'Peut partager ce bonus avec ses alliés s\'il leur indique comment combattre ces créatures.',
      },
      3: {
        activation: 'free',
        customText: 'Gratuit: Le PJ choisit une seconde catégorie de créatures.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Coup en traître
  // ─────────────────────────────────────────────────────────────────────────

  coupEnTraître: {
    id: 'coup-en-traitre',
    name: 'Coup en traître',
    description:
      'Le personnage a appris à exploiter les points faibles de la défense ennemie.',
    type: 'talent',
    effects: {
      1: {
        activation: 'reactive',
        damageDice: '2d4',
        customText:
          'Réactif: Si le PJ a l\'avantage et qu\'il attaque avec une arme courte l\'attaque fait +2d4 dégâts.\n' +
            'Le PJ peut utiliser sa Discrétion à la place de sa Précision. 1 attaque/Tour',
      },
      2: {
        activation: 'reactive',
        damageDice: '3d4',
        customText: 'Réactif: L\'attaque inflige désormais +3d4 dégâts. 1 attaque/Tour',
      },
      3: {
        activation: 'reactive',
        customText: 'Réactif: Coups en Traître ignore l\'armure de la cible.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Dégainement rapide
  // ─────────────────────────────────────────────────────────────────────────

  degainementRapide: {
    id: 'degainement-rapide',
    name: 'Dégainement rapide',
    description:
      'Le personnage peut dégainer son arme rapidement en réaction à une menace.',
    type: 'talent',
    effects: {
      1: {
        activation: 'free',
        customText: 'Gratuit: dégainer arme ou recharger arbalète',
      },
      2: {
        activation: 'free',
        customText: 'Gratuit: changer d\'arme (rengainer + dégainer)',
      },
      3: {
        activation: 'free',
        customText: 'Gratuit: boire un élixir ou administrer élixir à allié',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Domination
  // ─────────────────────────────────────────────────────────────────────────

  domination: {
    id: 'domination',
    name: 'Domination',
    description:
      'Le personnage peut faire plier les esprits faibles par sa seule présence.',
    type: 'talent',
    effects: {
      1: {
        activation: 'passive',
        replaceStat: {
          sourceAction: 'meleeAttack',
          useStat: 'persuasive',
        },
        customText: 'Passif: PJ peut utiliser Persuasion à la place de sa Précision en Combat au Cac.',
      },
      2: {
        activation: 'free',
        customText:
          'Gratuit: → Test [Persuasion &lt;- Volonté]\n' +
            'Si réussi, adversaire attaque autre cible',
      },
      3: {
        activation: 'active',
        customText:
          'Actif: Avant le combat :\n' +
            '→ Test [Persuasion <- Volonté]\n' +
            'Si réussi, adversaire négocie sa fuite.\n' +
            'Si en combat, l\'adversaire ou un de ses alliés doit être blessé avant de pouvoir le forcer à fuir.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Double attaque
  // ─────────────────────────────────────────────────────────────────────────

  doubleAttaque: {
    id: 'double-attaque',
    name: 'Double attaque',
    description:
      'Le personnage a appris à se battre avec deux armes simultanément.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        defenseModifier: 1,
        customText:
          'Actif: Combat à 2 armes : arme à une main (1d8) et arme courte (1d6).\n' +
            'L\'ennemi doit se défendre séparément pour chaque attaque.\n' +
            'Le PJ gagne +1 en Défense au Cac.',
      },
      2: {
        activation: 'active',
        customText: 'Actif: PJ manie désormais deux armes à une main (1d8 et 1d8)',
      },
      3: {
        activation: 'active',
        customText: 'Actif: Dégâts des armes passent à (1d10 et 1d8)',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Empoisonneur
  // ─────────────────────────────────────────────────────────────────────────

  empoisonneur: {
    id: 'empoisonneur',
    name: 'Empoisonneur',
    description:
      'Le personnage est capable d\'utiliser efficacement des armes empoisonnées en combat.',
    type: 'talent',
    effects: {
      1: {
        activation: 'free',
        customText:
          'Gratuit: → Test [Astuce] le PJ applique 1 dose de poison efficace un coup.\n' +
            'La victime est alors empoisonnée jusqu\'à ce que le PJ échoue un Test [Astuce <- Force] (minimum 1 Tour). Les dégâts subis et la durée maximale effective dépendent du poison utilisé.',
      },
      2: {
        activation: 'free',
        customText: 'Gratuit: Toutes les attaques avec cette arme sont considérées comme empoisonnées.',
      },
      3: {
        activation: 'free',
        customText:
          'Gratuit: → Test [Astuce] pour augmenter le niveau du poison d\'un rang.\n' +
            'Si le poison est déjà supérieur, octroie alors une seconde chance de réussir [Astuce <- Force].',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Érudit
  // ─────────────────────────────────────────────────────────────────────────

  erudit: {
    id: 'erudit',
    name: 'Érudit',
    description:
      'Le personnage est éduqué et connaît l\'histoire, les cultures et les objets magiques.',
    type: 'talent',
    effects: {
      1: {
        activation: 'free',
        replaceStat: {
          sourceAction: 'mysticalPowers',
          useStat: 'cunning',
        },
        customText:
          'Gratuit: Test [Astuce], si réussi :\n' +
            '- Deviner les propriétés d\'un objet magique, mais pas l\'activer.\n' +
            '- Lire, comprendre, parler une autre langue humaine. Les phrases simples ne nécessitent pas de Test.\n' +
            'Utilise Astuce à la place de Volonté pour lancer ses pouvoirs mystiques.',
      },
      2: {
        activation: 'free',
        customText:
          'Gratuit: Activer un objet magique → Astuce.\n' +
            'Test [Astuce], si réussi :\n' +
            '+ Langue des Elfes et des Trolls.',
      },
      3: {
        activation: 'free',
        customText:
          'Gratuit: Utiliser un parchemin magique → Astuce.\n' +
            'Résister aux effets mystiques → Astuce.\n' +
            '+ Secrets de Symbaroum et langues anciennes et disparues.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Étrangleur
  // ─────────────────────────────────────────────────────────────────────────

  etrangleur: {
    id: 'etrangleur',
    name: 'Étrangleur',
    description:
      'Le personnage s\'est initié à l\'art de la strangulation et des techniques asphyxiantes.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        damageDice: '1d6',
        customText:
          'Actif: Si le PJ a l\'avantage, attaque au garrot qui inflige 1d6 dégâts/Tour et ignore l\'armure.\n' +
            'Maintien de la strangulation avec un Test [Astuce <- Force], la cible ne peut agir tant que le PJ ne la relâche pas.',
      },
      2: {
        activation: 'active',
        damageDice: '1d4',
        customText:
          'Actif: + Utilisation des Spores Asphyxiantes.\n' +
            'Test [Agilité <- Agilité], 1d4 dégâts pendant 1d4 Tours ignorant l\'armure, la cible peut continuer à agir.',
      },
      3: {
        activation: 'active',
        damageDice: '1d4',
        customText:
          'Actif: Test [Astuce] pour fabriquer des Bombes à Spores, peuvent servir de piège.\n' +
            'Créé une petite AoE, 1d4 dégâts pendant 1d4 Tours ignorant l\'armure.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Feinte
  // ─────────────────────────────────────────────────────────────────────────

  feinte: {
    id: 'feinte',
    name: 'Feinte',
    description:
      'Le personnage peut utiliser des armes courtes ou précises de manière discrète et déroutante.',
    type: 'talent',
    effects: {
      1: {
        activation: 'passive',
        replaceStat: {
          sourceAction: 'meleeAttack',
          useStat: 'discreet',
        },
        customText:
          'Passif: Le PJ utilise Discrétion au lieu de Précision s\'il attaque avec une arme précise ou courte. De plus, il gagne l\'avantage si l\'adversaire n\'est adjacent à aucun de ses alliés.',
      },
      2: {
        activation: 'reactive',
        replaceStat: {
          sourceAction: 'defense',
          useStat: 'discreet',
        },
        customText: 'Réactif: Le PJ peut choisir de se défendre avec sa Discrétion au lieu de son Agilité.',
      },
      3: {
        activation: 'active',
        customText:
          'Actif: Test [Discrétion <- Vigilance] pour surprendre son adversaire au milieu d\'un combat en cours.\n' +
            'Si réussi, gagne une attaque gratuite en plus de son attaque normale contre cet adversaire.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Garde du corps
  // ─────────────────────────────────────────────────────────────────────────

  gardeCorps: {
    id: 'garde-corps',
    name: 'Garde du corps',
    description:
      'Le personnage est entraîné à faire barrage aux coups dirigés contre un allié.',
    type: 'talent',
    effects: {
      1: {
        activation: 'reactive',
        customText:
          'Réactif: Le PJ peut subir les dégâts destinés à un de ses alliés, il ne peut pas se défendre contre ses attaques qui le touchent automatiquement.',
      },
      2: {
        activation: 'reactive',
        customText: 'Réactif: Le PJ peut désormais se défendre contre toutes les attaques déviées.',
      },
      3: {
        activation: 'reactive',
        customText:
          'Réactif: Le PJ gagne une attaque gratuite pour chaque adversaire qui effectue une attaque au Cac contre l\'allié qu\'il protège.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Guerrier né
  // ─────────────────────────────────────────────────────────────────────────

  guerrierNe: {
    id: 'guerrier-ne',
    name: 'Guerrier né',
    description:
      'Le personnage est un adversaire dangereux même sans arme grâce à son entraînement martiale.',
    type: 'talent',
    effects: {
      1: {
        activation: 'passive',
        damageDice: '1d6',
        customText:
          'Passif: Les attaques à mains nues du PJ infligent 1d6 dégâts.\n' +
            'Si c\'est une créature avec le trait Monstrueux, les dégâts augmentent en fonction de ce nouveau trait.',
      },
      2: {
        activation: 'active',
        customText: 'Actif: Le PJ peut désormais infliger une double attaque sur une même cible (deux jets d\'attaques distincts).',
      },
      3: {
        activation: 'passive',
        damageDice: '1d6',
        customText: 'Passif: Le PJ vise les points faibles.\n' +
            'Chaque attaque inflige 1d6 dégâts supplémentaires.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Homme d'armes
  // ─────────────────────────────────────────────────────────────────────────

  hommeArmes: {
    id: 'homme-armes',
    name: 'Homme d\'armes',
    description:
      'Le personnage est entraîné à porter une armure et à combattre efficacement dedans.',
    type: 'talent',
    effects: {
      1: {
        activation: 'passive',
        customText:
          'Passif: Augmente la protection des armures :\n' +
            'Armure Légère : 1d4 → 1d6\n' +
            'Armure Moyenne : 1d6 → 1d8\n' +
            'Armure Lourde : 1d8 → 1d10',
      },
      2: {
        activation: 'passive',
        customText: 'Passif: Les armures n\'ont plus d\'effets négatifs sur l\'Agilité du PJ ni sur sa Défense.\n' +
            'Seuls les pouvoirs mystiques sont encore impactés.',
      },
      3: {
        activation: 'passive',
        customText:
          'Passif: PJ Test [Agilité] pour contre les Talents et équipements qui permettent aux ennemis de réduire ou d\'ignorer l\'armure.\n' +
            'Les pouvoirs mystiques ne sont pas impactés.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Inébranlable
  // ─────────────────────────────────────────────────────────────────────────

  inebranlab: {
    id: 'inebranlab',
    name: 'Inébranlable',
    description:
      'L\'esprit du personnage est impénétrable et lui permet de résister aux influences néfastes.',
    type: 'talent',
    effects: {
      1: {
        activation: 'reactive',
        customText:
          'Réactif: PJ peut effectuer un 2ème Test de Force ou Volonté s\'il est affecté par des effets physiques : pièges, poisons, alchimie.\n' +
            'Ainsi que certains pouvoirs mystiques de feu et d\'acide.',
      },
      2: {
        activation: 'reactive',
        customText:
          'Réactif: PJ peut effectuer un 2ème Test pour se débarrasser des pouvoirs qui affectent sa Volonté ou ses sens.',
      },
      3: {
        activation: 'reactive',
        customText:
          'Réactif: Si le PJ est victime d\'une attaque mentale (ou modifiée par la Volonté) qui échoue, il inflige en retour 1d6 dégâts qui ignorent la protection de l\'armure.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Lancer puissant
  // ─────────────────────────────────────────────────────────────────────────

  lancerPuissant: {
    id: 'lancer-puissant',
    name: 'Lancer puissant',
    description:
      'Le personnage peut lancer des armes de jet avec beaucoup plus de puissance.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        damageDice: '1d8',
        customText: 'Actif: Les dégâts des armes de lancées passent à 1d8.',
      },
      2: {
        activation: 'active',
        customText:
          'Actif: Le PJ peut effectuer deux lancers en une seule action. On effectue les Tests séparément sur la, ou les deux cibles.\n' +
            'Le PJ peut aussi lancer une arme de Cac, les dégâts correspondent à ceux de l\'arme augmentés des Talents du PJ.',
      },
      3: {
        activation: 'active',
        customText: 'Actif: Le PJ peut effectuer un triple lancé, contre une ou plusieurs cibles.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Magie
  // ─────────────────────────────────────────────────────────────────────────

  magie: {
    id: 'magie',
    name: 'Magie',
    description:
      'Le personnage est initié aux mystères du feu et à la maîtrise de l\'esprit sur la matière.',
    type: 'talent',
    effects: {
      1: {
        activation: 'special',
        customText:
          'Spéciale: Le PJ ne subit plus de corruption permanente en apprenant des pouvoirs mystiques de novices de sa tradition de magie, ni lorsqu’il en pratique les rituels.  \n' +
            'Il subit toujours la corruption temporaire inhérente à l’utilisation de ces pouvoirs.',
      },
      2: {
        activation: 'special',
        customText:
          'Spéciale: + pouvoirs mystiques d’adeptes.\n' +
            'Il ne subit plus qu’un (1) point de corruption temporaire inhérente à l’utilisation de ces pouvoirs et rituels.',
      },
      3: {
        activation: 'special',
        customText:
          'Spéciale: + pouvoirs mystiques de maîtres.  \n' +
            'Le PJ peut effectuer un 2ème jet en cas d’échec s’il tente de créer un enchaînement magique.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Maîtrise du bouclier
  // ─────────────────────────────────────────────────────────────────────────

  maitriseBouclier: {
    id: 'maitrise-bouclier',
    name: 'Maîtrise du bouclier',
    description:
      'Le personnage a été entraîné à optimiser son bouclier en offensive et défensive.',
    type: 'talent',
    effects: {
      1: {
        activation: 'passive',
        defenseModifier: 1,
        customText:
          'Passif: Les dégâts des armes tenues en main directrice augmentent d\'un rang :\n' +
            'Arme à une main : 1d8 → 1d10\n' +
            'Arme légère : 1d6 → 1d8\n' +
            'De plus, l\'utilisation du bouclier donne +2 en Défense au lieu de +1.',
      },
      2: {
        activation: 'reactive',
        damageDice: '1d4',
        customText:
          'Réactif: Chaque attaque réussi du PJ est suivi d\'un Coup de Bouclier, si réussie 1d4 dégâts + Test [Force <- Force] adversaire renversé au sol.',
      },
      3: {
        activation: 'reactive',
        damageDice: '1d8',
        customText: 'Réactif: Les dégâts du Coup de Bouclier passent à 1d8.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Medicus
  // ─────────────────────────────────────────────────────────────────────────

  medicus: {
    id: 'medicus',
    name: 'Medicus',
    description:
      'Le personnage maîtrise l\'art de la guérison et des soins médicaux.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        customText:
          'Actif: Test [Astuce] soigne un patient de 1d4 point d\'endurance, ou 1d6 si remède à base de plantes. 1/Jour',
      },
      2: {
        activation: 'active',
        customText:
          'Actif: Test [Astuce] soigne un patient de 1d6 point d\'endurance, ou 1d8 si remède à base de plantes. 1/Jour',
      },
      3: {
        activation: 'active',
        customText:
          'Actif: Test [Astuce] soigne un patient de 1d8 point d\'endurance, ou 1d10 si remède à base de plantes.\n' +
            'Si échec du Test, soigne tout de même 1d4 - 1d6. 1/Jour',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Meneur né
  // ─────────────────────────────────────────────────────────────────────────

  meneurNe: {
    id: 'meneur-ne',
    name: 'Meneur né',
    description:
      'Le personnage est un meneur charismatique que les autres suivront.',
    type: 'talent',
    effects: {
      1: {
        activation: 'passive',
        replaceStat: {
          sourceAction: 'willTest',
          useStat: 'persuasive',
        },
        customText: 'Passif: PJ peut utiliser sa Persuasion à la place de sa Volonté. Cela exclut le calcul de la corruption.',
      },
      2: {
        activation: 'active',
        customText:
          'Actif: PJ peut désigner un ennemi ou un objet comme cible principale.\n' +
            'Tous les alliés lui infligent 1d4 dégâts supplémentaires.\n' +
            'Changer de cible nécessite une action active.',
      },
      3: {
        activation: 'active',
        replaceStat: {
          sourceAction: 'willTest',
          useStat: 'persuasive',
        },
        customText:
          'Actif: PJ adresse un discours enflammé à ses alliés, ils peuvent utiliser sa Persuasion à la place de leur Volonté pendant toute cette Scène.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Poigne de fer
  // ─────────────────────────────────────────────────────────────────────────

  poigneFer: {
    id: 'poigne-fer',
    name: 'Poigne de fer',
    description:
      'Le personnage utilise toute la puissance de sa force en combat rapproché.',
    type: 'talent',
    effects: {
      1: {
        activation: 'passive',
        replaceStat: {
          sourceAction: 'meleeAttack',
          useStat: 'strong',
        },
        customText: 'Passif: Peut utiliser sa Force à la place de sa Précision en Combat Cac.',
      },
      2: {
        activation: 'passive',
        damageDice: '1d4',
        replaceStat: {
          sourceAction: 'meleeAttack',
          useStat: 'strong',
        },
        customText: 'Passif: Les attaques Cac infligent 1d4 dégâts supplémentaires.',
      },
      3: {
        activation: 'active',
        damageDice: '1d8',
        replaceStat: {
          sourceAction: 'meleeAttack',
          useStat: 'strong',
        },
        customText:
          'Actif: Une fois par Tour le PJ inflige 1d8 dégâts supplémentaires sur une attaque Cac au lieu d\'1d4.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Pouvoir mystique
  // ─────────────────────────────────────────────────────────────────────────

  pouvoirMystique: {
    id: 'pouvoir-mystique',
    name: 'Pouvoir mystique',
    description:
      'Le personnage a accès à des Pouvoirs mystiques d\'une tradition ou autodidacte.',
    type: 'talent',
    effects: {
      1: {
        activation: 'special',
        customText:
          'Spéciale: Le PJ apprend le niveau novice de ce pouvoir. Il gagne 1 point de corruption permanente et 1d4 points de corruption temporaires à chaque utilisation de ce pouvoir. Des Talents peuvent réduire ce gain de corruption.',
      },
      2: {
        activation: 'special',
        customText:
          'Spéciale: Le PJ apprend le niveau adepte de ce pouvoir. Il gagne la même corruption qui peut être réduite par des Talents.',
      },
      3: {
        activation: 'special',
        customText:
          'Spéciale: Le PJ apprend le niveau maître de ce pouvoir. Il gagne la même corruption qui peut être réduite par des Talents.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Puissance à deux mains
  // ─────────────────────────────────────────────────────────────────────────

  puissanceDeuxMains: {
    id: 'puissance-deux-mains',
    name: 'Puissance à deux mains',
    description:
      'Le personnage brandit les armes lourdes à deux mains avec une grande efficacité.',
    type: 'talent',
    effects: {
      1: {
        activation: 'passive',
        damageDice: '1d12',
        customText: 'Passif: Les dégâts infligés par les armes lourdes passent à 1d12',
      },
      2: {
        activation: 'reactive',
        customText: 'Réactif: Si l\'attaque échoue, bénéficie d\'une seconde attaque immédiate à 1d8 dégâts.',
      },
      3: {
        activation: 'active',
        customText:
          'Actif: Chaque coups réduit l\'armure de la cible de 1 et de 2 points si l\'arme possède la qualité éventreur.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Récupération
  // ─────────────────────────────────────────────────────────────────────────

  recuperation: {
    id: 'recuperation',
    name: 'Récupération',
    description:
      'Le personnage peut puiser dans ses réserves d\'énergie pour régénérer son corps.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        customText: 'Actif: PJ récupère 1d4 points d\'Endurance.\n' +
            '1/Jour',
      },
      2: {
        activation: 'active',
        customText: 'Actif: PJ récupère 1d6 points d\'Endurance.\n' +
            '1/Jour',
      },
      3: {
        activation: 'active',
        customText: 'Actif: PJ récupère 1d8 points d\'Endurance.\n' +
            '1/Jour',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Ritualiste
  // ─────────────────────────────────────────────────────────────────────────

  ritualiste: {
    id: 'ritualiste',
    name: 'Ritualiste',
    description:
      'Le personnage a appris à canaliser ses pouvoirs mystiques à travers des rituels.',
    type: 'talent',
    effects: {
      1: {
        activation: 'special',
        customText:
          'Spéciale: Le PJ dépense 5 PX et apprend un (1) rituel. Il doit avoir accès au rituel pour l\'apprendre et le mémoriser.\n' +
            'Il gagne 1 point de corruption permanente à l\'apprentissage et 1d4 points de corruption temporaires à chaque utilisation.\n' +
            'Des Talents peuvent réduire ce gain de corruption.\n' +
            'Le nombre de rituels appris donne le niveau du ritualiste.\n' +
            '(pas de niveau novice / adepte / maitre)',
      },
      2: {
        activation: 'special',
        customText: 'Spéciale: (nombre rituels = niveau)',
      },
      3: {
        activation: 'special',
        customText: 'Spéciale: (nombre rituels = niveau)',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Sixième sens
  // ─────────────────────────────────────────────────────────────────────────

  sixiemeSens: {
    id: 'sixieme-sens',
    name: 'Sixième sens',
    description:
      'Le personnage peut se fier à ses autres sens au-delà de la vue.',
    type: 'talent',
    effects: {
      1: {
        activation: 'passive',
        replaceStat: {
          sourceAction: 'rangedAttack',
          useStat: 'vigilant',
        },
        customText:
          'Passif: Le PJ peut utiliser sa Vigilance à la place de sa Précision lorsqu\'il attaque avec une arme à distance.',
      },
      2: {
        activation: 'passive',
        replaceStat: {
          sourceAction: 'initiative',
          useStat: 'vigilant',
        },
        customText:
          'Passif: Le PJ peut utiliser sa Vigilance au lieu de l\'Agilité pour calculer son Initiative et sa Défense.',
      },
      3: {
        activation: 'passive',
        customText: 'Passif: Le PJ peut se déplacer et combattre sans entrave lorsqu\'il est aveuglé ou dans le noir.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Sorcellerie
  // ─────────────────────────────────────────────────────────────────────────

  sorcellerie: {
    id: 'sorcellerie',
    name: 'Sorcellerie',
    description:
      'Le personnage pratique la tradition de la Sorcellerie issue des esprits sauvages.',
    type: 'talent',
    effects: {
      1: {
        activation: 'special',
        customText:
          'Spéciale: Le PJ ne subit plus de corruption permanente en apprenant des pouvoirs mystiques de novices de sa tradition, ni lorsqu\'il en pratique les rituels. Il subit toujours la corruption temporaire inhérente à l\'utilisation de ces pouvoirs.',
      },
      2: {
        activation: 'special',
        customText:
          'Spéciale: + pouvoirs mystiques d\'adeptes.\n' +
            'Il ne subit plus qu\'un (1) point de corruption temporaire inhérente à l\'utilisation de ces pouvoirs et rituels.',
      },
      3: {
        activation: 'special',
        customText: 'Spéciale: + pouvoirs mystiques de maîtres.\n' +
            'Les Bêtes n\'attaquent plus le PJ à moins d\'être provoquées.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Tacticien
  // ─────────────────────────────────────────────────────────────────────────

  tacticien: {
    id: 'tacticien',
    name: 'Tacticien',
    description:
      'Le personnage a été initié à la doctrine martiale basée sur théories et calculs.',
    type: 'talent',
    effects: {
      1: {
        activation: 'passive',
        replaceStat: {
          sourceAction: 'initiative',
          useStat: 'cunning',
        },
        customText: 'Passif: Le PJ peut utiliser son Astuce à la place de son Agilité pour le calcul de son Initiative.',
      },
      2: {
        activation: 'passive',
        replaceStat: {
          sourceAction: 'defense',
          useStat: 'cunning',
        },
        customText: 'Passif: Le PJ peut utiliser son Astuce à la place de son Agilité pour le calcul de sa Défense.',
      },
      3: {
        activation: 'passive',
        replaceStat: {
          sourceAction: 'meleeAttack',
          useStat: 'cunning',
        },
        customText: 'Passif: Le PJ peut utiliser son Astuce à la place de sa Précision lorsqu\'il attaque avec une arme (hors arme lourde).',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Théurgie
  // ─────────────────────────────────────────────────────────────────────────

  theurgie: {
    id: 'theurgie',
    name: 'Théurgie',
    description:
      'Le personnage pratique la Théurgie, l\'enseignement mystique de l\'Église de Prios.',
    type: 'talent',
    effects: {
      1: {
        activation: 'special',
        customText:
          'Spéciale: Le PJ ne subit plus de corruption permanente en apprenant des pouvoirs mystiques de novices de sa tradition, ni lorsqu\'il en pratique les rituels. Il subit toujours la corruption temporaire inhérente à l\'utilisation de ces pouvoirs.',
      },
      2: {
        activation: 'special',
        customText:
          'Spéciale:+ pouvoirs mystiques d\'adeptes.\n' +
            'Il ne subit plus qu\'un (1) point de corruption temporaire inhérente à l\'utilisation de ces pouvoirs et rituels.  \n',
      },
      3: {
        activation: 'special',
        customText:
          'Spéciale: + pouvoirs mystiques de maîtres.\n' +
            'Le PJ soigne 1 supplémentaire avec ses pouvoirs et inflige 1 supplémentaire aux Abominations et Morts-vivants.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Tireur d'élite
  // ─────────────────────────────────────────────────────────────────────────

  tireurElite: {
    id: 'tireur-elite',
    name: 'Tireur d\'élite',
    description:
      'Le personnage peut infliger de sérieux dégâts avec un arc ou une arbalète.',
    type: 'talent',
    effects: {
      1: {
        activation: 'passive',
        damageDice: '1d10',
        customText:
          'Passif: Les dégâts des armes à distance augmentent d\'un rang :\n' +
            'Arc : 1d8 → 1d10\n' +
            'Arbalète 1d10 → 1d12',
      },
      2: {
        activation: 'active',
        customText:
          'Actif: Effet paralysant des attaques\n' +
            'Test [Précision <- Force]/Tour, si réussi la cible ne peut pas se déplacer.',
      },
      3: {
        activation: 'active',
        customText:
          'Actif: Les tirs ignorent totalement le score de protection de l\'armure de la cible et le Trait Armure Naturelle.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Vision de l'ombre
  // ─────────────────────────────────────────────────────────────────────────

  visionOmbre: {
    id: 'vision-ombre',
    name: 'Vision de l\'ombre',
    description:
      'Le personnage peut observer les conflits profonds du monde à travers les Ombres.',
    type: 'talent',
    effects: {
      1: {
        activation: 'free',
        customText:
          'Gratuit: Discerner l\'ombre dominante de la cible (lieu, créature, objet)\n' +
            'Test [Vigilance <- Discrétion]. PJ subit 1 corruption temporaire/tentative.',
      },
      2: {
        activation: 'free',
        customText:
          'Gratuit: Révèle l\'ombre et le niveau de corruption de la cible.\n' +
            '1d4 corruption temporaire/tentative',
      },
      3: {
        activation: 'free',
        customText:
          'Gratuit: Révèle l\'ombre et le niveau de corruption de toutes les cibles en vues. Perçoit les traces laissées par les créatures et objets dans la zone ciblée. Une créature corrompue et connue peut être traquée de la sorte.\n' +
            '1d6 corruption temporaire/tentative.',
      },
    },
  },
};
