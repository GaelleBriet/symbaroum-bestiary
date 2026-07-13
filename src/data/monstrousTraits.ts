// src/data/monstrousTraits.ts

/**
 * Tous les traits monstrueux de Symbaroum.
 * Source : Livre de base Symbaroum, traits des monstres
 *
 * Ces traits ne possèdent que des niveaux (I, II, III).
 * Ils modifient les statistiques des créatures.
 */

import type { TalentOrTrait } from '../types/rules';

export const MONSTROUS_TRAITS: Record<string, TalentOrTrait> = {
  // ─────────────────────────────────────────────────────────────────────────
  // Ailes
  // ─────────────────────────────────────────────────────────────────────────

  ailes: {
    id: 'ailes',
    name: 'Ailes',
    description:
      'La créature est pourvue d\'ailes et a développé la capacité à voler.',
    type: 'trait',
    effects: {
      1: {
        activation: 'passive',
        customText:
          'Passif: peut voler durant Action mouvement -> évite Attaques gratuites survolant ennemi',
      },
      2: {
        activation: 'passive',
        customText:
          'Passif: peut planer -> de maintenir au même endroit dans les airs, hors de portée attaques CAC. ' +
          'Planer ne compte pas comme une action',
      },
      3: {
        activation: 'passive',
        customText:
          'Passif: attaques en piqué : utilise une partie de ses mouvements avant une attaque et le reste ensuite. ' +
          'Ne se retrouve pas bloquée au sol au milieu de la mêlée, possibilité d\'effectuer des attaques cac',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Apparition Corporelle
  // ─────────────────────────────────────────────────────────────────────────

  apparitionCorporelle: {
    id: 'apparition-corporelle',
    name: 'Apparition Corporelle',
    description:
      'La créature a dompté sa forme éthérée et peut se manifester physiquement.',
    type: 'trait',
    effects: {
      1: {
        activation: 'free',
        customText:
          'Gratuit: L’esprit peut se manifester physiquement pendant un tour, et, par conséquent, agir comme s’il possédait un corps physique. ' +
            'Si les Actions de mouvement d’un tour sont suffisantes pour traverser une étendue d’eau, l’esprit peut le faire. ' +
            'L’esprit peut utiliser ses attaques à mains nues ou ses armes naturelles pendant le tour, ' +
            'mais il subit tous les types de dégâts qui peuvent être infligés à des créatures de chair et de sang.',
      },
      2: {
        activation: 'free',
        customText:
          'Gratuit: L’esprit peut se manifester équipé des armes et de l’armure qu’il possédait au moment de sa mort, et peut les utiliser en combat. ' +
            'L’esprit conserve sa forme physique aussi longtemps qu’il le souhaite, mais ne peut pas changer de forme au milieu d’un tour — ' +
            'si l’esprit a commencé son tour sous sa forme physique, ' +
            'il doit jouer l’intégralité du tour sous cette forme. ' +
            'S’il le souhaite, l’esprit peut apparaître sous sa forme physique pendant toute la durée d’une scène,\n' +
            'afin, par exemple, de traverser une étendue d’eau. ' +
            'Si l’esprit choisit ou est contraint de revenir à sa forme spectrale alors qu’il traverse une étendue d’eau, il est renvoyé sur la terre ferme.',
      },
      3: {
        activation: 'special',
        customText:
          'Spéciale: L’esprit possède la maîtrise totale de son Apparition corporelle et peut entreprendre n’importe quelle action d’action physique souhaitée ' +
            'tout en restant immatériel dans tous les autres domaines. ' +
            'Il peut effectuer des attaques physiques, et se défendre comme un esprit. ' +
            'L’esprit ne peut être blessé d’aucune autre manière que celle(s) spécifiée(s) dans la description du niveau de son Trait Forme éthérée. ' +
            'S’il le souhaite, l’esprit peut se déplacer librement sous forme physique pendant une longue traversée sur un bateau, par exemple. ' +
            'Si l’esprit choisit ou est contraint de revenir à sa forme spectrale alors qu’il traverse une étendue d’eau, il est renvoyé sur la terre ferme.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Arme Naturelle
  // ─────────────────────────────────────────────────────────────────────────

  armeNaturelle: {
    id: 'arme-naturelle',
    name: 'Arme Naturelle',
    description:
      'La créature est pourvue d\'une arme innée comme des griffes ou des dents.',
    type: 'trait',
    effects: {
      1: {
        activation: 'passive',
        damageDice: '1d4',
        customText: 'Passif: La créature est pourvue d’une arme naturelle qui inflige 1d6 dégâts au lieu de 1d4 points pour ' +
            'les attaques désarmées normales.',
      },
      2: {
        activation: 'passive',
        damageDice: '1d4',
        customText: 'Passif: L’attaque naturelle de la créature inflige 1d8 points de dégâts.',
      },
      3: {
        activation: 'passive',
        damageDice: '1d4',
        customText:
          'Passif: L’attaque naturelle de la créature inflige 1d10 points de dégâts. ' +
            'L’arme naturelle est désormais considérée comme une arme Longue, ce qui permet à la créature d’effectuer une ' +
            'Attaque gratuite au début d’un combat face à des ennemis munis d’armes plus courtes.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Armure Naturelle
  // ─────────────────────────────────────────────────────────────────────────

  armureNaturelle: {
    id: 'armure-naturelle',
    name: 'Armure Naturelle',
    description:
      'La créature est dotée d\'une peau épaisse ou d\'écailles protégeant naturellement.',
    type: 'trait',
    effects: {
      1: {
        activation: 'passive',
        armorBonus: 2,
        customText: 'Passif: armure naturelle 2',
      },
      2: {
        activation: 'passive',
        armorBonus: 3,
        customText: 'Passif: armure naturelle 3',
      },
      3: {
        activation: 'passive',
        armorBonus: 4,
        customText: 'Passif: armure naturelle 4',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Attaque Acide
  // ─────────────────────────────────────────────────────────────────────────

  attaqueAcide: {
    id: 'attaque-acide',
    name: 'Attaque Acide',
    description:
      'L\'attaque à mains nues de la créature provoque des dégâts d\'acide corrosifs.',
    type: 'trait',
    effects: {
      1: {
        activation: 'reactive',
        customText:
          'Réactif: acide faible, 1d6 dégâts/tour 3 tours acide doit pénétrer armure infliger dégâts se débarrasser ' +
            'Action Test Astuce. Requiert Trait Sang acide au même niveau\n' +
            'ou à un niveau supérieur',
      },
      2: {
        activation: 'reactive',
        customText:
          'Réactif: acide modéré, 1d8 dégâts/tour 4 tours se débarrasser Action Test Astuce. ' +
            'Requiert Trait Sang acide au même niveau ou à un niveau supérieur',
      },
      3: {
        activation: 'reactive',
        customText:
          'Réactif: acide puissant, 1d10 dégâts/tour 5 tours se débarrasser Action Test Astuce. ' +
            'Requiert Trait Sang acide au même niveau ou à un niveau supérieur',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Attaque Corruptrice
  // ─────────────────────────────────────────────────────────────────────────

  attaqueCorruptrice: {
    id: 'attaque-corruptrice',
    name: 'Attaque Corruptrice',
    description:
      'La créature peut répandre la Corruption par ses griffes et armes naturelles.',
    type: 'trait',
    effects: {
      1: {
        activation: 'passive',
        customText:
          'Passif: l\'attaque suinte la Corruption et contamine ceux qu\'elle blesse grâce à ses attaques. ' +
            'Victime subit 1 point dégât + 1d4 Corruption temporaire',
      },
      2: {
        activation: 'passive',
        customText:
          'Passif: victime subit 1 point dégât + 1d6 Corruption temporaire',
      },
      3: {
        activation: 'passive',
        customText:
          'Passif: victime subit 1 point dégât + 1d8 Corruption temporaire',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Dégâts Alternatifs
  // ─────────────────────────────────────────────────────────────────────────

  degatsAlternatifs: {
    id: 'degats-alternatifs',
    name: 'Dégâts Alternatifs',
    description:
      'L\'attaque vise un Attribut au lieu de l\'Endurance (Force/Volonté).',
    type: 'trait',
    effects: {
      1: {
        activation: 'passive',
        customText:
          'Passif: arme naturelle inflige 3 dégâts alternatifs qui ignorent la protection. Attribut atteint 0 âme victime dévorée meurt',
      },
      2: {
        activation: 'passive',
        customText:
          'Passif: arme naturelle inflige 4 dégâts alternatifs qui ignorent la protection',
      },
      3: {
        activation: 'passive',
        customText:
          'Passif: arme naturelle inflige 5 dégâts alternatifs qui ignorent la protection',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Envoûtement
  // ─────────────────────────────────────────────────────────────────────────

  envoûtement: {
    id: 'envoûtement',
    name: 'Envoûtement',
    description:
      'La créature peut hypnotiser ses victimes les rendre incapables d\'agir.',
    type: 'trait',
    effects: {
      1: {
        activation: 'active',
        customText:
          'Actif: Le regard perçant de la créature contraint sa victime à réussir un test de [Volonté← Volonté] ' +
            'si elle ne veut pas perdre une Action à rester immobile et impuissante.',
      },
      2: {
        activation: 'active',
        customText:
          'Actif: Le chant envoûtant ou le timbre hypnotique de la créature contraint toutes ses victimes\n' +
            'à réussir un test de [Volonté ← Volonté] ou sinon elle perd une Action à rester sans rien faire.',
      },
      3: {
        activation: 'active',
        customText:
          'Actif: Similaire à II, mais les victimes sont envoûtées jusqu’à ce qu’elles réussissent un test de [Volonté ← Volonté]. ' +
            'L’envoûtement est rompu si la victime est blessée d’une quelconque manière',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Forme Éthérée
  // ─────────────────────────────────────────────────────────────────────────

  formeEtheree: {
    id: 'forme-etheree',
    name: 'Forme Éthérée',
    description:
      'La créature est un esprit immatériel ne peut causer dégâts physiques. La Forme éthérée donne accès aux Traits monstrueux\n' +
        'Dégâts alternatifs, Apparition corporelle et Terrifiant.',
    type: 'trait',
    effects: {
      1: {
        activation: 'passive',
        customText:
          'Passif: La créature peut passer à travers les obstacles sans difficulté, mais ne peut pas traverser une étendue\n' +
            'd’eau, même par le biais d’un pont, d’un bateau ou par les airs. ' +
            'L’esprit ne subit que la moitié des dégâts infligés par des armes. ' +
            'Les effets alchimiques appliqués sur des armes et les pouvoirs mystiques lui infligent la totalité\n' +
            'des dégâts. Les armes magiques lui infligent également\n' +
            'la totalité des dégâts.',
      },
      2: {
        activation: 'passive',
        customText:
          'Passif: L’esprit ne subit que la moitié des dégâts infli-\n' +
            'gés par les armes, les attaques alchimiques/mystiques\n' +
            'ainsi que les armes magiques.',
      },
      3: {
        activation: 'passive',
        customText:
          'Passif: Seuls les Pouvoirs mystiques et les armes\n' +
            'magiques peuvent nuire à l’esprit, en lui infligeant seule-\n' +
            'ment la moitié des dégâts',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Froid d\'Outre-Tombe
  // ─────────────────────────────────────────────────────────────────────────

  froidOutreTombe: {
    id: 'froid-outre-tombe',
    name: 'Froid d\'Outre-Tombe',
    description:
      'La créature répand froid glacial créant aura autour elle.',
    type: 'trait',
    effects: {
      1: {
        activation: 'free',
        customText:
          'Gratuit: La créature répand le froid paralysant de satombe, les personnages joueurs se trouvant à portée immédiate' +
            ' de la créature sont paralysés à moins de réussir un test de Volonté. Un test est effectué à chaque tour, et\n' +
            's’il réussit, le personnage peut agir normalement. Une fois qu’un personnage a résisté au Froid d’outre-tombe, il\n' +
            'ne peut plus en subir les effets à nouveau jusqu’à la fin de la scène.',
      },
      2: {
        activation: 'free',
        customText:
          'Gratuit: Similaire à I, à la différence près que le froid\n' +
            'inflige 1d4 points de dégâts par tour à tous ceux qui en sont\n' +
            'affectés, en ignorant la protection.',
      },
      3: {
        activation: 'free',
        customText:
          'Gratuit: Similaire à II, mais le froid affecte\n' +
            'désormais les personnages qui échouent à un test\n' +
            '[Volonté ← Volonté].\n',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Mort-Vivant
  // ─────────────────────────────────────────────────────────────────────────

  mortVivant: {
    id: 'mort-vivant',
    name: 'Mort-Vivant',
    description:
      'La créature est esprit piégé cadavre contrôle corps qui se décompose.',
    type: 'trait',
    effects: {
      1: {
        activation: 'passive',
        customText:
          'Passif: Le mort-vivant n’est pas affecté par le poison ou\n' +
            'les maladies, mais subit les dégâts normaux infligés par\n' +
            'les attaques et effets physiques. Rappelons que la Résis-\n' +
            'tance à la douleur n’est pas utilisée (la douleur et l’état\n' +
            'de choc n’ont pas d’effet sur un mort-vivant). La créature\n' +
            'ne guérit pas naturellement et n’est pas affectée par les\n' +
            'élixirs de soins alchimiques. Elle doit, à la place de cela, ingérer de la viande crue (vivante ou morte récemment)\n' +
            'ou boire du sang afin de se soigner, chaque point d’En-\n' +
            'durance consommé par la créature la soigne de 1d4 points\n' +
            'd’Endurance',
      },
      2: {
        activation: 'passive',
        customText:
          'Passif: Le mort-vivant ne subit que la moitié des dégâts\n' +
            'infligés par les attaques et effets physiques, tels que les\n' +
            'armes ou les dégâts élémentaires. Les Pouvoirs mystiques\n' +
            'qui ignorent la protection infligent des dégâts normalement.',
      },
      3: {
        activation: 'passive',
        customText:
          'Passif: Le mort-vivant ne subit également plus que la\n' +
            'moitié des dégâts causés par les effets alchimiques et\n' +
            'les Pouvoirs mystiques, mais subit les dégâts des armes\n' +
            'magiques et des effets sacrés en totalité.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Nuée
  // ─────────────────────────────────────────────────────────────────────────

  nuée: {
    id: 'nuée',
    name: 'Nuée',
    description:
      'La créature est multitude collective esprit disséminé travers nuée corps.',
    type: 'trait',
    effects: {
      1: {
        activation: 'special',
        customText:
          'Spéciale: La nuée ne subit que la moitié des dégâts de n’im-\n' +
            'porte quelle attaque. Si la nuée est blessée et qu’elle perd\n' +
            'plus de la moitié de son Endurance, l’instinct de survie des\n' +
            'parties individuelles de la nuée prend le dessus et tous ces\n' +
            'instincts contraignent la nuée à fuir. Une attaque mentale\n' +
            '(face à laquelle la nuée se défend avec sa Volonté) affecte\n' +
            'l’intégralité de la nuée.',
      },
      2: {
        activation: 'special',
        customText:
          'Spéciale: La nuée ne subit que la moitié des dégâts de\n' +
            'n’importe quelle attaque. Si la nuée est touchée par un\n' +
            'coup qui lui inflige des dégâts supérieurs à sa Résistance à\n' +
            'la douleur, l’instinct de survie des parties individuelles de\n' +
            'la nuée prend le dessus et tous ces instincts contraignent\n' +
            'la nuée à fuir. La nuée dispose également de deux jets pour\n' +
            'tenter de résister aux attaques mentales (face auxquelles\n' +
            'la nuée se défend avec sa Volonté).',
      },
      3: {
        activation: 'special',
        customText:
          'Spéciale: L’esprit de cette multitude collective contrôle\n' +
            'la nuée, qui ne subit donc plus que le quart des dégâts\n' +
            'qui lui sont infligés par n’importe quelle attaque. La\n' +
            'cohésion au sein de la nuée est totale et elle n’a plus de\n' +
            'raison de fuir à moins que la pensée collective n’aille en\n' +
            'ce sens. La nuée dispose également de deux jets pour\n' +
            'tenter de résister aux attaques mentales (face aux-\n' +
            'quelles la nuée se défend avec sa Volonté).',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Projection de Venin
  // ─────────────────────────────────────────────────────────────────────────

  projectionVenin: {
    id: 'projection-venin',
    name: 'Projection de Venin',
    description:
      'La créature peut projeter venin ennemis comme attaque distance.',
    type: 'trait',
    effects: {
      1: {
        activation: 'passive',
        customText:
          'Passif: Le poison (venin) est faible et inflige 1d4 points de\n' +
            'dégâts par tour pendant 2 tours.',
      },
      2: {
        activation: 'passive',
        customText:
          'Passif: Le poison (venin) est modéré et inflige 1d6 points\n' +
            'de dégâts par tour pendant 3 tours.',
      },
      3: {
        activation: 'passive',
        customText:
          'Passif: Le poison (venin) est puissant et inflige 1d8 points\n' +
            'de dégâts par tour pendant 4 tours',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Régénération
  // ─────────────────────────────────────────────────────────────────────────

  regeneration: {
    id: 'regeneration',
    name: 'Régénération',
    description:
      'La créature guérit spontanément possède point faible type dégâts ne peut pas guérir.',
    type: 'trait',
    effects: {
      1: {
        activation: 'passive',
        customText:
          'Passif: La créature régénère 1d4 pts d’Endurance par tour.  La créature possède un point\n' +
            'faible, un type de dégâts spécifique qu’elle ne peut pas guérir\n' +
            'spontanément (mais qui, bien entendu, peuvent être soignés\n' +
            'par d’autres moyens actifs). La créature doit choisir un point\n' +
            'faible en lien avec un type de dégâts qu’elle ne peut pas soigner\n' +
            'spontanément. Le choix s’effectue parmi : armes magiques,\n' +
            'énergies élémentaires (feu ou acide) et dégâts sacrés ou impies.',
      },
      2: {
        activation: 'passive',
        customText:
          'Passif: La créature régénère 1d6 pts d’Endurance par tour.',
      },
      3: {
        activation: 'passive',
        customText:
          'Passif: La créature régénère 1d8 pts d’Endurance par tour.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Robuste
  // ─────────────────────────────────────────────────────────────────────────

  robuste: {
    id: 'robuste',
    name: 'Robuste',
    description:
      'La créature est plus massive résistante que normale porte armures légères modifiées.',
    type: 'trait',
    effects: {
      1: {
        activation: 'passive',
        defenseModifier: -2,
        damageBonus: 2,
        customText:
          'Passif:  La créature ignore 1d4 points de dégâts à chaque\n' +
            'coup, en plus de l’armure qu’elle porte. Une fois par tour, la\n' +
            'créature inflige 1d4 points de dégâts supplémentaires grâce\n' +
            'à une de ses attaques au corps à corps. La Défense de la\n' +
            'créature est calculée sur la base de [Agilité - 2].',
      },
      2: {
        activation: 'passive',
        defenseModifier: -3,
        damageBonus: 3,
        customText:
          'Passif:  La créature ignore 1d6 points de dégâts à chaque\n' +
            'coup, en plus de l’armure qu’elle porte. Une fois par tour, la\n' +
            'créature inflige 1d6 points de dégâts supplémentaires grâce\n' +
            'à une de ses attaques au corps à corps. La Défense de la\n' +
            'créature est calculée sur la base de [Agilité - 3].',
      },
      3: {
        activation: 'passive',
        defenseModifier: -4,
        damageBonus: 4,
        customText:
          'Passif:  La créature ignore 1d8 points de dégâts à chaque\n' +
            'coup, en plus de l’armure qu’elle porte. Une fois par tour, la\n' +
            'créature inflige 1d8 points de dégâts supplémentaires grâce\n' +
            'à une de ses attaques au corps à corps. La Défense de la\n' +
            'créature est calculée sur la base de [Agilité - 4].',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Sang Acide
  // ─────────────────────────────────────────────────────────────────────────

  sangAcide: {
    id: 'sang-acide',
    name: 'Sang Acide',
    description:
      'Le sang de la créature est corrosif se répand attaquée combat CAC.',
    type: 'trait',
    effects: {
      1: {
        activation: 'reactive',
        customText:
          'Réactif: Le sang acide est faible et inflige 1d6 points de\n' +
            'dégâts sur une durée de 3 tours. Quiconque\n' +
            'touche la créature en combat au corps à corps et parvient à\n' +
            'lui infliger des dégâts doit réussir un test de Défense ou subir\n' +
            'les effets du sang acide. Se débarrasser de l’acide répandu\n' +
            'sur le corps ou l’armure implique l’utilisation d’une Action\n' +
            'et nécessite la réussite d’un test d’Astuce (le rincer avec de\n' +
            'l’eau, de la terre ou une substance équivalente)',
      },
      2: {
        activation: 'reactive',
        customText:
          'Réactif: Le sang acide est modéré et inflige 1d8 points de\n' +
            'dégâts sur une durée de 4 tours.',
      },
      3: {
        activation: 'reactive',
        customText:
          'Réactif: Le sang acide est puissant et inflige 1d10 points de\n' +
            'dégâts sur une durée de 5 tours',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Terrifiant
  // ─────────────────────────────────────────────────────────────────────────

  terrifiant: {
    id: 'terrifiant',
    name: 'Terrifiant',
    description:
      'La créature peut inspirer terreur victimes créant panique.',
    type: 'trait',
    effects: {
      1: {
        activation: 'active',
        customText:
          'Actif:  Le regard perçant de la créature contraint une\n' +
            'seule victime à réussir un test de [Volonté ← Volonté], ou à\n' +
            'dépenser automatiquement ses deux Actions pour recu-\n' +
            'ler. Si la victime ne peut pas reculer, elle doit se défendre par désespoir, mais ne pourra pas se résoudre à attaquer.\n' +
            'La victime peut effectuer un test à chaque tour pour ten-\n' +
            'ter de se libérer de cette peur.',
      },
      2: {
        activation: 'active',
        customText:
          'Actif: Le hurlement terrifiant de la créature contraint\n' +
            'tous ceux qui se trouvent près d’elle à réussir un test\n' +
            'de [Volonté ← Volonté], ou à dépenser automatique-\n' +
            'ment leurs deux Actions pour reculer. Si les victimes ne\n' +
            'peuvent pas reculer, elles se défendront par désespoir,\n' +
            'mais ne pourront pas se résoudre à attaquer. Les victimes\n' +
            'peuvent effectuer un test à chaque tour pour tenter de se\n' +
            'libérer de cette peur.r',
      },
      3: {
        activation: 'free',
        customText:
          'Gratuit: Similaire à II, mais les victimes ne peuvent\n' +
            'pas se défendre contre les attaques. Elles fuient si c’est\n' +
            'possible et se cachent dans un coin si cela ne l’est pas. Les\n' +
            'victimes peuvent effectuer un test à chaque tour afin de\n' +
            'tenter de se libérer de cette peur paralysante.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Toile
  // ─────────────────────────────────────────────────────────────────────────

  toile: {
    id: 'toile',
    name: 'Toile',
    description:
      'La créature peut tisser toiles solides capturer ses proies passivement activement.',
    type: 'trait',
    effects: {
      1: {
        activation: 'passive',
        customText:
          'Passif: Les fils de la toile contraignent tous ceux qui\n' +
            'passent au travers à réussir un test de [Agilité ← Astuce]\n' +
            'ou à rester bloqués. Se libérer de la toile nécessite la\n' +
            'réussite d’un test de [Force ← Astuce], avec une seule\n' +
            'tentative par tour permise. Une créature capturée ne peut\n' +
            'pas bouger et doit effectuer deux jets lorsqu’elle tente\n' +
            'd’accomplir une Action quelconque — la tentative échoue\n' +
            'si l’un de ces jets n’est pas réussi.',
      },
      2: {
        activation: 'active',
        customText:
          'Actif: En plus des toiles passives (celles du niveau I), la\n' +
            'créature peut à présent utiliser une Action afin de pro-\n' +
            'jeter une toile en direction d’un ennemi. La victime peut\n' +
            'éviter l’attaque en réussissant un test de [Agilité ← Préci-\n' +
            'sion]. Une créature capturée doit réussir un test de [Force\n' +
            '← Astuce] afin de se libérer, avec une seule tentative par\n' +
            'tour permise. Une créature capturée ne peut pas bouger\n' +
            'et doit effectuer deux jets lorsqu’elle tente d’accomplir\n' +
            'une Action quelconque — la tentative échoue si l’un de\n' +
            'ces jets n’est pas réussi.',
      },
      3: {
        activation: 'active',
        customText:
          'Actif: La toile est presque vivante et obéit à son créa-\n' +
            'teur : elle possède la capacité passive de capturer des\n' +
            'créatures (niveau I), mais elle peut également attaquer à\n' +
            'l’aide d’un maximum de trois projections par tour possé-\n' +
            'dant les mêmes effets que le niveau II.',
      },
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Venimeux
  // ─────────────────────────────────────────────────────────────────────────

  venimeux: {
    id: 'venimeux',
    name: 'Venimeux',
    description:
      'L\'attaque à mains nues ou arme naturelle de la créature est venimeuse.',
    type: 'trait',
    effects: {
      1: {
        activation: 'passive',
        customText:
          'Passif: Le poison (venin) est faible et inflige 1d4 points de\n' +
            'dégâts par tour pendant 2 tours. Chaque attaque qui touche un adversaire\n' +
            'l’empoisonnera également. L’effet du poison persiste jusqu’à\n' +
            'ce que quelqu’un administre un antidote sur la blessure et\n' +
            'réussisse un test d’Astuce.',
      },
      2: {
        activation: 'passive',
        customText:
          'Passif: Le poison (venin) est modéré et inflige 1d6 points\n' +
            'de dégâts par tour pendant 3 tours.',
      },
      3: {
        activation: 'passive',
        customText:
          'Passif: Le poison (venin) est puissant et inflige 1d8 points\n' +
            'de dégâts par tour pendant 4 tours.',
      },
    },
  },
};
