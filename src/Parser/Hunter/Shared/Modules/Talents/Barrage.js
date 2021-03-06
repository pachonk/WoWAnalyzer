import React from 'react';

import Analyzer from 'Parser/Core/Analyzer';

import SPELLS from 'common/SPELLS';
import SpellLink from "common/SpellLink";
import ItemDamageDone from 'Interface/Others/ItemDamageDone';

/**
 * Rapidly fires a spray of shots for 3 sec, dealing an average of (80% * 10) Physical damage to all enemies in front of you.
 * Usable while moving.
 *
 * Example log: https://www.warcraftlogs.com/reports/mzZMhjAFVadHLYBT#fight=7&type=damage-done&source=22
 */
class Barrage extends Analyzer {
  damage = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.BARRAGE_TALENT.id);
  }

  on_byPlayer_damage(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.BARRAGE_DAMAGE.id) {
      return;
    }
    this.damage += event.amount + (event.absorbed || 0);
  }

  subStatistic() {
    return (
      <div className="flex">
        <div className="flex-main">
          <SpellLink id={SPELLS.BARRAGE_TALENT.id} />
        </div>
        <div className="flex-sub text-right">
          <ItemDamageDone amount={this.damage} />
        </div>
      </div>
    );
  }

}

export default Barrage;
