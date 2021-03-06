import React from 'react';
import Analyzer from 'Parser/Core/Analyzer';
import SPELLS from 'common/SPELLS/index';
import StatisticBox from 'Interface/Others/StatisticBox';
import SpellIcon from 'common/SpellIcon';
import { formatPercentage } from 'common/format';
import STATISTIC_ORDER from 'Interface/Others/STATISTIC_ORDER';

/**
 * Trailblazer increases your movement speed by 30% whenever you have not attacked for 3 seconds.
 *
 * Example log: https://www.warcraftlogs.com/reports/Pp17Crv6gThLYmdf#fight=8&type=damage-done&source=76
 */
class Trailblazer extends Analyzer {

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.TRAILBLAZER_TALENT.id);
  }

  get percentUptime() {
    //This calculates the uptime over the course of the encounter of Trailblazer
    return this.selectedCombatant.getBuffUptime(SPELLS.TRAILBLAZER_BUFF.id) / this.owner.fightDuration;
  }
  statistic() {
    return (
      <StatisticBox
        position={STATISTIC_ORDER.OPTIONAL(2)}
        icon={<SpellIcon id={SPELLS.TRAILBLAZER_TALENT.id} />}
        value={`${formatPercentage(this.percentUptime)}%`}
        label="Trailblazer Uptime"
      />
    );
  }
}

export default Trailblazer;
