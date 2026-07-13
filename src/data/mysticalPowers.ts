// src/data/mysticalPowers.ts

/**
 * Tous les pouvoirs mystiques de Symbaroum.
 * Source : Livre de base Symbaroum, chapitre Pouvoirs mystiques
 */

import type { TalentOrTrait } from '../types/rules';

export const MYSTICAL_POWERS: Record<string, TalentOrTrait> = {
  // ─────────────────────────────────────────────────────────────────────────
  // Anathème
  // ─────────────────────────────────────────────────────────────────────────

  anatheme: {
    id: 'anatheme',
    name: 'Anathème',
    description:
      'Le Mystique a étudié l\'art de contrer la magie et peut dissiper les effets des autres pouvoirs.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        customText: 'Actif: Test [Volonté<-Volonté] le PJ peut dissiper les effets d’un pouvoir sur une créature ou lui-même. C’est la Volonté du mystique qui a lancé le sort qui est utilisé comme résistance lors du test.',
      },
      2: {
        activation: 'active',
        customText: 'Actif: Le PJ peut dissiper les effets sur plusieurs cibles à l’aide d’un enchaînement, le test est effectué sur une cible à la fois.',
      },
      3: {
        activation: 'active',
        customText:
          'Actif: Le PJ peut dissiper toutes sortes d’effets mystiques, y compris les créatures et effets invoqués, en réussissant un test de Volonté.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Aura Impie
  // ─────────────────────────────────────────────────────────────────────────

  auraImpie: {
    id: 'aura-impie',
    name: 'Aura Impie',
    description:
      'Le Mystique s\'entoure d\'une aura d\'énergie impie qui blesse les créatures vivantes.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        damageDice: '1d4',
        customText: 'Actif : Test [Volonté]/Tour, le PJ s’entoure d’une aura impie infligeant 1d4 dégâts qui ignorent l’armure aux bêtes et aux créatures intelligentes à 1 mouvement de portée. Le pouvoir reste actif jusqu’à un échec au Test [Volonté] où que le PJ perde sa concentration',
      },
      2: {
        activation: 'active',
        customText: 'Actif: Le PJ peut désormais exclure ses alliés de l’effet.',
      },
      3: {
        activation: 'active',
        damageDice: '1d6',
        customText:
          'Actif: Les dégâts passent à 1d6, l’aura peut désormais soigner les abominations et les morts-vivants alliés de 1d4 Endurance au début de leur Tour.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Aura Sacrée
  // ─────────────────────────────────────────────────────────────────────────

  auraSacree: {
    id: 'aura-sacree',
    name: 'Aura Sacrée',
    description:
      'Le Mystique crée une aura de sainteté nocive pour abominations et morts-vivants.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        damageDice: '1d4',
        customText:
          'Actif : Test [Volonté]/Tour, le PJ s’entoure d’une sainte aura infligeant 1d4 dégâts qui ignorent l’armure aux abominations et aux morts-vivants à 1 mouvement de portée.  \n' +
            'Le PJ peut en exclure certaines  de l’effet (alliés).\n' +
            'Le pouvoir reste actif jusqu’à un échec au Test [Volonté] où que le PJ perde sa concentration',
      },
      2: {
        activation: 'active',
        healingDice: '1d4',
        customText: 'Actif: L’aura soigne les bêtes et créatures intelligentes alliées de 1d4 Endurance/Tour à portée d’allonge.',
      },
      3: {
        activation: 'active',
        damageDice: '1d6',
        customText: 'Actif: Les dégâts et les soins passent à 1d6.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Blessure Partagée
  // ─────────────────────────────────────────────────────────────────────────

  blessurePartagee: {
    id: 'blessure-partagee',
    name: 'Blessure Partagée',
    description:
      'Le Mystique répartit les dégâts entre ses alliés, ses ennemis et lui-même.',
    type: 'talent',
    effects: {
      1: {
        activation: 'free',
        customText:
          'Gratuit: Test [Volonté] le PJ peut attirer les esprits mortifiants d’une autre créature. La cible est soignée d’1d8 Endurance alors que le PJ subit une quantité égale de dégâts.',
      },
      2: {
        activation: 'free',
        customText:
          'Gratuit: Le PJ redirige les poisons et saignements sur lui et ne subit que la moitié des dégâts reçus (arrondi au supérieur).  ',
      },
      3: {
        activation: 'active',
        customText:
          'Actif: Les soins augmentent à 1d10 Endurance, le PJ subit la moitié en dégâts et redirige la moitié restante sur une cible en vue à 2 mouvements de lui. La cible ne peut pas se défendre contre cette attaque et son armure est ignorée.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Bouclier Sanctifié
  // ─────────────────────────────────────────────────────────────────────────

  bouclierSanctifie: {
    id: 'bouclier-sanctifie',
    name: 'Bouclier Sanctifié',
    description:
      'Par sa foi et sa volonté, le Mystique brandit un bouclier saint invisible contre les attaques.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        armorBonus: 0,
        damageDice: '1d4',
        customText:
          'Actif : Test [Volonté] le PJ s’entoure d’une lueur chaude qui lui procure 1d4 points de protection supplémentaires.  \n' +
            'Les abominations et morts-vivants qui attaque le PJ subissent 1d4 points de dégâts ignorant l’armure quand ils l’attaquent au Cac, 1/Tour.',
      },
      2: {
        activation: 'active',
        customText: 'Actif : 1 allié en vue et jusqu’à 2 mouvements de distance peut bénéficier de cet effet.',
      },
      3: {
        activation: 'active',
        damageDice: '1d6',
        customText: 'Actif: La protection et les dégâts passent à 1d6.\n' +
            '2 alliés peuvent bénéficier de cet effet.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Cascade de Soufre
  // ─────────────────────────────────────────────────────────────────────────

  cascadeSoufre: {
    id: 'cascade-soufre',
    name: 'Cascade de Soufre',
    description:
      'Le Mystique invoque l\'esprit destructeur du feu et réduit ses ennemis en cendres.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        damageDice: '2d6',
        customText:
          'Actif : Test [Volonté < Agilité] le PJ inflige 2d6 dégâts à une cible. Si le test rate les dégâts sont alors d\'1d6.',
      },
      2: {
        activation: 'active',
        damageDice: '1d8',
        customText:
          'Actif:  Le PJ déclenche un enchaînement de Cascades. Il continue de frapper une cible différente jusqu\'à ce qu\'il rate son Test [Volonté <- Agilité].',
      },
      3: {
        activation: 'active',
        customText:
          'Actif: L\'enchaînement s\'arrête désormais au 2ème échec au Test [Volonté <- Agilité].\n' +
            'De plus les cibles prennent feu et doivent utiliser leur mouvement pour éteindre les flammes.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Confusion
  // ─────────────────────────────────────────────────────────────────────────

  confusion: {
    id: 'confusion',
    name: 'Confusion',
    description:
      'Le Mystique contraint un ennemi à se perdre dans son propre esprit et désoriente.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        customText:
          'Actif : Le PJ peut désorienter une cible grâce à un Test [Volonté &lt;- Volonté] en cas de réussite, le PJ lance 1d6/Tour à moins que le PJ rate son test ou qu\'il perde sa concentration\n' +
            '  \n' +
            '1-2 : Cible hébété et immobile\n' +
            '  \n' +
            '3-4 : attaque son allié le plus proche\n' +
            '  \n' +
            '5-6: attaque son ennemi le plus proche',
      },
      2: {
        activation: 'active',
        customText:
          'Actif: Le PJ n\'a plus besoin d\'utiliser sa concentration pour maintenir l\'effet. Il doit toujours réussir son Test [Volonté &lt;- Volonté] à chaque tours.',
      },
      3: {
        activation: 'active',
        customText: 'Actif: Le PJ peut enchaîner les Confusions sur plusieurs cibles.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Enchevêtrement
  // ─────────────────────────────────────────────────────────────────────────

  enchevêtrement: {
    id: 'enchevêtrement',
    name: 'Enchevêtrement',
    description:
      'Le Mystique manipule les processus perpétuels de la nature et entrave les ennemis.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        customText: 'Actif : Test [Volonté<-Force] le PJ entrave 1 ennemi qui ne peut plus se déplacer, mais qui peut toujours utiliser ses armes à distance et ses pouvoirs.\n' +
            'La cible est entravée jusqu’à un échec du Test [Volonté<-Force]. ',
      },
      2: {
        activation: 'active',
        customText: 'Actif: Le PJ peut enchaîner les Enchevêtrements.',
      },
      3: {
        activation: 'active',
        damageDice: '1d4',
        customText:
          'Actif: Les ennemis enchevêtrés subissent 1d4 dégâts qui ignorent l’armure par tour.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Étreinte de la Nature
  // ─────────────────────────────────────────────────────────────────────────

  etreintNature: {
    id: 'etreinte-nature',
    name: 'Étreinte de la Nature',
    description:
      'Le Mystique s\'enfonce dans la terre et évite les attaques ennemies.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        customText:
          'Actif : Le PJ peut s’enfoncer dans le sol s’il réussit un Test [Volonté]/Tour. Il est alors invulnérable mais ne peut pas effectuer d’action. Dès qu’il rate son test il remonte à la surface.',
      },
      2: {
        activation: 'active',
        customText:
          'Actif: Le PJ peut utiliser ses pouvoirs mystiques sur lui même dans le sol, et n’a plus besoin de test pour s’y maintenir. ',
      },
      3: {
        activation: 'active',
        customText:
          'Actif: Le PJ peut se déplacer dans le sol, voir ses alliés et utiliser ses pouvoirs mystiques sur eux. ',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Forme Révélée
  // ─────────────────────────────────────────────────────────────────────────

  formeRevele: {
    id: 'forme-revele',
    name: 'Forme Révélée',
    description:
      'Le Mystique force ce qui l\'entoure à révéler sa vraie nature.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        customText:
          'Actif : → Test [Volonté &lt;- Volonté]\n' +
            'Pour révéler et faire disparaître les illusions et permettre au PJ de voir au travers les transformations à proximité.',
      },
      2: {
        activation: 'active',
        customText:
          'Actif: Le PJ peut contraindre un enchaînement de créatures à révéler leur forme réelle.\n' +
            'Rien n\'empêche les créatures de se transformer à nouveau.',
      },
      3: {
        activation: 'active',
        customText:
          'Actif: Le PJ peut contraindre à garder leur forme originelle en réussissant un Test [Volonté &lt;- Volont',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Frappe du Revenant
  // ─────────────────────────────────────────────────────────────────────────

  frappeRevenant: {
    id: 'frappe-revenant',
    name: 'Frappe du Revenant',
    description:
      'L\'arme du Mystique irradie d\'énergies maléfiques et élève les morts en dragouls.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        damageDice: '1d4',
        customText:
          'Actif: L’arme de mêlée du PJ irradie d’énergie impie qui inflige 1d4 dégâts additionnels, ou 1d6 si la cible est une bête ou une créature intelligente. \n' +
            'L’effet perdure jusqu\'à la fin du combat.',
      },
      2: {
        activation: 'active',
        customText:
          'Actif: Les créatures vivantes vaincues par ce sort se relèvent sous la forme de Dragouls alliés au PJ, elles peuvent agir au prochain tour et restent en jeu jusqu’à la fin de la scène.',
      },
      3: {
        activation: 'free',
        damageDice: '1d4',
        customText:
          'Gratuit: L’arme de mêlée inflige désormais +1d4 dégâts additionnels et +1d8 si la cible est une bête ou une créature intelligente.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Imperceptible
  // ─────────────────────────────────────────────────────────────────────────

  imperceptible: {
    id: 'imperceptible',
    name: 'Imperceptible',
    description:
      'Le Mystique demeure indécelable en détournant subtilement l\'attention de son ennemi.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        customText:
          'Actif : Test [Volonté <- Volonté], le PJ disparaît aux yeux de la cible et le reste jusqu\'à ce qu\'il attaque la cible ou subisse des dégâts.',
      },
      2: {
        activation: 'active',
        customText:
          'Actif : Test [Volonté] pour disparaître aux yeux de tous, le PJ réapparaît s\'il attaque ou subit des dégâts.',
      },
      3: {
        activation: 'active',
        customText: 'Actif: Le PJ peut faire bénéficier un allié des effets de ce pouvoir.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Imposition des Mains
  // ─────────────────────────────────────────────────────────────────────────

  impositionMains: {
    id: 'imposition-mains',
    name: 'Imposition des Mains',
    description:
      'Le Mystique maîtrise les forces de la vie et peut soigner les blessures.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        customText: 'Actif : Test [Volonté], le PJ peut soigner une cible, ou lui-même de 1d8 points d’Endurance.',
      },
      2: {
        activation: 'active',
        customText: 'Actif: Imposition des Mains peut guérir les poisons et les saignements.',
      },
      3: {
        activation: 'active',
        customText:
          'Actif: Le PJ peut soigner et guérir les saignements et poison d’une cible à distance (à 2 mouvements).  \n' +
            'Les soins augmentent à 1d10, et 1d12 si la cible est au contact.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Lévitation
  // ─────────────────────────────────────────────────────────────────────────

  levitation: {
    id: 'levitation',
    name: 'Lévitation',
    description:
      'Le Mystique peut léviter grâce à la seule force de son esprit.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        customText:
          'Actif: Test [Volonté] pour léviter hors de portée d\'attaque des armes Cac. Le PJ peut se déplacer d\'une enjambé par tour. Si le PJ perd sa concentration, il tombe au sol et subit 1d6 dégâts qui ignorent l\'armure.',
      },
      2: {
        activation: 'active',
        customText:
          'Actif: Test [Volonté <- Force] le PJ peut faire léviter un allié selon les mêmes conditions.',
      },
      3: {
        activation: 'active',
        customText:
          'Actif: Le PJ peut enchaîner les lévitations pour ses alliés.\n' +
            'S\'il perd la concentration, ils chutent tous lentement et ne subissent pas de dégâts.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Malédiction
  // ─────────────────────────────────────────────────────────────────────────

  malediction: {
    id: 'malediction',
    name: 'Malédiction',
    description:
      'Le Mystique maîtrise l\'art du Mauvais Œil et maudit un ennemi.',
    type: 'talent',
    effects: {
      1: {
        activation: 'free',
        customText:
          'Gratuit: 1/Tour le PJ inflige à 1 cible d’avoir une 2ème chance  d’échouer n’importe quel test contre lui.\n' +
            'L’effet perdure jusqu’à l’échec d’un Test[Volonté].',
      },
      2: {
        activation: 'free',
        customText:
          'Gratuit: La Malédiction agit sur tous les tests quelqu’en soit les cibles.\n' +
            'L’effet perdure…',
      },
      3: {
        activation: 'active',
        damageDice: '1d4',
        customText:
          'Actif: L’ennemi subit 1d4 dégâts ignorant l’armure  pour toutes les actions qu’il tente.\n' +
            'L’effet perdure…',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Marteau à Sorcière
  // ─────────────────────────────────────────────────────────────────────────

  marteauSorciere: {
    id: 'marteau-sorciere',
    name: 'Marteau à Sorcière',
    description:
      'Le Mystique enveloppe son arme de flammes punitives et sacrées.',
    type: 'talent',
    effects: {
      1: {
        activation: 'free',
        damageDice: '1d4',
        customText:
          'Gratuit:L’arme de mêlée du PJ s’embrase d’une flamme sainte qui inflige 1d4 dégâts additionnels et 1d6 aux abominations et morts-vivants.  \n' +
            'L’effet perdure jusqu\'à la fin du combat.',
      },
      2: {
        activation: 'free',
        customText: 'Gratuit: L’arme de mêlée inflige désormais 1d4 additionnels et 1d8 aux abominations et morts-vivants.',
      },
      3: {
        activation: 'free',
        customText: 'Gratuit: L’arme de mêlée inflige désormais 1d4 additionnels et 1d10 aux abominations et morts-vivants.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Métamorphose
  // ─────────────────────────────────────────────────────────────────────────

  metamorphose: {
    id: 'metamorphose',
    name: 'Métamorphose',
    description:
      'Le Mystique peut prendre une forme animale en appréhendant l\'essence de la nature.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        customText:
          'Actif: PJ imite une créature 1/Scène\n' +
            '→ Test [Volonté]\n' +
            'Résistance de l\'illusion\n' +
            'Test [Discrétion &lt;- Vigilanc',
      },
      2: {
        activation: 'active',
        customText:
          'Actif: PJ imite un individu spécifique 1/Scène\n' +
            '→ Test [Volonté]\n' +
            'En combat : Test [Volonté]/Round\n' +
            'Attaques sur le PJ ont 50% de chance de toucher l\'original. À chaque dégâts reçus PJ doit réussir Test [Volonté <- Dégâts]',
      },
      3: {
        activation: 'active',
        customText:
          'Actif: Résistance uniquement si discussion\n' +
            'Test [Discrétion <- Vigilance]\n' +
            'Peut tromper les proches de la cible avec 2 Tests [Discrétion <- Vigilance]\n' +
            'À distance puis lors d\'une discussion.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Mur de Flammes
  // ─────────────────────────────────────────────────────────────────────────

  murFlammes: {
    id: 'mur-flammes',
    name: 'Mur de Flammes',
    description:
      'Le Mystique invoque le feu sous forme de mur ou de dôme.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        damageDice: '2d6',
        customText:
          'Actif: Test [Volonté]/Tour le PJ érige un grand mur de feu, quiconque le traverse subit 2d6 dégâts. À l\'extérieur ou dans de grands halls on peut le contourner au prix de 2 mouvements ou voler par dessus pour le prix d\'1.\n' +
            'Les objets destructibles comme les flèches ne peuvent pas le traverser.\n' +
            'L\'effet perdure jusqu\'à l\'échec du test.',
      },
      2: {
        activation: 'active',
        customText:
          'Actif: Le mur se courbe pour former un cercle autour du PJ, de ses alliés et de tous les ennemis engagés au Cac.\n' +
            'L\'effet perdure jusqu\'à l\'échec du test.',
      },
      3: {
        activation: 'active',
        customText:
          'Actif: Le mur se courbe et se tord pour former un dôme au-dessus du PJ, de ses alliés et de tous les ennemis engagés au Cac.\n' +
            'L\'effet perdure jusqu\'à l\'échec du test.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Pluie de Flèches
  // ─────────────────────────────────────────────────────────────────────────

  pluieFlèches: {
    id: 'pluie-fleches',
    name: 'Pluie de Flèches',
    description:
      'Le Mystique demande aux vents de soulever et envoyer des flèches vers ses ennemis.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        damageDice: '1d8',
        customText:
          'Actif: Le PJ enchante une poignée de flèches (5) grâce à un Test [Volonté], les flèches volètent autour du PJ pour le reste de la Scène et peuvent être tirées pour une action gratuite 1/tour infligeant 1d8 dégâts. Les effets spéciaux de la flèche se rajoutent à ses dégâts.',
      },
      2: {
        activation: 'active',
        damageDice: '1d10',
        customText:
          'Actif: Chaque flèche inflige 1d10 dégâts. En utilisant une action active le PJ peut en lancer 2 sur 1 ou 2 cibles différentes, mais ne peut plus tirer celle de l’action gratuite.',
      },
      3: {
        activation: 'active',
        damageDice: '1d12',
        customText:
          'Actif: Chaque flèche inflige 1d12 dégâts. En utilisant une action active le PJ peut en lancer 3 sur 1, 2 ou 3 cibles différentes.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Profusion de Larves
  // ─────────────────────────────────────────────────────────────────────────

  profusionLarves: {
    id: 'profusion-larves',
    name: 'Profusion de Larves',
    description:
      'Le Mystique infeste le corps d\'un ennemi de larves qui le dévorent de l\'intérieur.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        damageDice: '1d4',
        customText:
          'Actif: ->Test [Volonté<-Force] le PJ invoque des larves à l’intérieur du corps de son ennemi qui commencent à le dévorer.\n' +
            'La cible subit 1d4 dégâts/Tour ignorant l’armure. L’effet continue jusqu’à ce que le PJ rate son test ou perde sa concentration',
      },
      2: {
        activation: 'active',
        damageDice: '1d6',
        customText: 'Actif: Les dégâts augmentent d’un rang avec 1d6 dégâts/Tour.',
      },
      3: {
        activation: 'active',
        customText:
          'Actif: Le pouvoir ne nécessite plus de concentration, le PJ doit toujours réussir son test \n' +
            '[Volonté<-Force]/Tour pour maintenir l’effet.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Psychokinésie
  // ─────────────────────────────────────────────────────────────────────────

  psychokinesie: {
    id: 'psychokinésie',
    name: 'Psychokinésie',
    description:
      'Le Mystique peut déplacer et projeter des objets et des ennemis par la seule force de son esprit.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        damageDice: '2d4',
        customText:
          'Actif: Le PJ peut utiliser les objets qui l\'entourent afin de les projeter sur ses ennemis ou de bloquer les attaques en sa direction.\n' +
            'Active → Test [Volonté <- Force] pour infliger 2d4 dégâts à 1 cible.\n' +
            'Réactive → Test [Volonté <- Précision] pour bloquer les attaques physiques.\n' +
            'Réactive → Test [Volonté <- Volonté] pour bloquer les projectiles mystiques.',
      },
      2: {
        activation: 'active',
        customText:
          'Actif: Le PJ peut soulever et projeter un ennemi.\n' +
            '→ Test [Volonté <- Force] l\'ennemi est projeté à 2 mouvements et subit 2d4 dégâts. L\'ennemi doit réussir un Test d\'Agilité pour ne pas être jeté au sol.',
      },
      3: {
        activation: 'active',
        damageDice: '2d6',
        customText:
          'Actif: Le PJ peut déclencher un enchaînement de projection d\'ennemis, les dégâts sont désormais de 2d6.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Réalité Altérée
  // ─────────────────────────────────────────────────────────────────────────

  realiteAlteree: {
    id: 'realite-alteree',
    name: 'Réalité Altérée',
    description:
      'Le Mystique se sert de l\'écart entre le monde réel et perçu pour modifier la réalité.',
    type: 'talent',
    effects: {
      1: {
        activation: 'reactive',
        customText:
          'Réactif: Test [Volonté] pour modifier la réalité, sur un succès le PJ peut relancer un test de Défense qui a échoué. 1/Tour',
      },
      2: {
        activation: 'reactive',
        customText:
          'Réactif: Test [Volonté] pour modifier la réalité, sur un succès le PJ peut relancer n\'importe quel test qui a échoué. 1/Tour',
      },
      3: {
        activation: 'reactive',
        customText:
          'Réactif: Test [Volonté] pour modifier la réalité, sur un succès le PJ peut faire relancer à un allié n\'importe quel test qu\'il a échoué. 1/Tour',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Soumission
  // ─────────────────────────────────────────────────────────────────────────

  soumission: {
    id: 'soumission',
    name: 'Soumission',
    description:
      'Le Mystique maîtrise le libre arbitre et contrôle la volonté d\'autres créatures.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        customText:
          'Actif: Le PJ peut prendre partiellement le contrôle d’une créature.  \n' +
            '->Test[Volonté<-Volonté]/Tour.  \n' +
            'La créature contrôlée peut effectuer 1 action par tour et ne peut pas utiliser ses talents ni pouvoirs. \n' +
            'Le PJ doit dépenser une action active pour maintenir le pouvoir.\n' +
            'De plus l’effet perdure jusqu’à ce que le PJ perde sa concentration ou rate son test.',
      },
      2: {
        activation: 'active',
        customText:
          'Actif: Le PJ n’a plus besoin de se concentrer pour maintenir l’effet.  \n' +
            'Il doit par contre toujours dépenser d’action active et réussir son\n' +
            '->Test[Volonté<-Volonté]/Tour.',
      },
      3: {
        activation: 'active',
        customText:
          'Actif: La créature contrôlée peut désormais utiliser ses actions habituelles ainsi que ses réactions à chaque tour.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Transformation Dégénérative
  // ─────────────────────────────────────────────────────────────────────────

  transformationDegenerative: {
    id: 'transformation-degenerative',
    name: 'Transformation Dégénérative',
    description:
      'Le Mystique transforme ses ennemis en formes de vie plus faibles.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        customText:
          'Actif: ->Test[Volonté<-Volonté]/Tour le PJ peut transformer sa cible en un animal inoffensif (mammifère ou reptile), la cible conserve ses statistiques d’origine ainsi que ses traits ou talents.  \n' +
            'L’effet perdure jusqu’à ce que le PJ perde sa concentration ou rate son test.',
      },
      2: {
        activation: 'active',
        customText:
          'Actif: Le PJ n’a plus besoin de se concentrer pour maintenir l’effet.  \n' +
            'Il doit par contre toujours dépenser d’action active et réussir son\n' +
            '->Test[Volonté<-Volonté]/Tour.',
      },
      3: {
        activation: 'active',
        customText:
          'Actif: Le PJ peut déclencher un enchaînement de Transformation Dégénérative, s’il parvient à transformer une cible, il peut en transformer une autre et ainsi de suite.\n' +
            'La Transformation Dégénérative perdure jusqu’à ce que le PJ rate son\n' +
            '->Test[Volonté<-Volonté]/Tour.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Verre Ardent de Prios
  // ─────────────────────────────────────────────────────────────────────────

  verreArdentPrios: {
    id: 'verre-ardent-prios',
    name: 'Verre Ardent de Prios',
    description:
      'Le Mystique canalise la lumière de son âme en un rayon brûlant destructeur.',
    type: 'talent',
    effects: {
      1: {
        activation: 'active',
        damageDice: '2d4',
        customText:
          'Actif: Test [Volonté] le PJ guide la lumière sacrée de Prios sur 1 cible qui subit 2d4 dégâts ou 2d6 s’il s’agit d’une abomination ou d’un mort-vivant.',
      },
      2: {
        activation: 'active',
        damageDice: '2d6',
        customText:
          'Actif: Test [Volonté] le PJ peut propager la lumière sacré à tous les ennemis à proximité. Les dégâts augmentent d’un rang avec 2d6 ou 2d8 selon les cibles.',
      },
      3: {
        activation: 'active',
        customText:
          'Actif: ->Test [Volonté<-Volonté] les cibles peuvent être étourdies pour 1 Tour.',
      },
    },
  },
};
