import React from 'react';
import StatisticBox, { STATISTIC_ORDER } from 'Interface/Others/StatisticBox';
import { formatPercentage } from 'common/format';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';
import ItemLink from 'common/ItemLink';

import SPELLS from 'common/SPELLS';
import ITEMS from 'common/ITEMS';
import Analyzer from 'Parser/Core/Analyzer';
import Combatants from 'Parser/Core/Modules/Combatants';

class Lifebloom extends Analyzer {
  static dependencies = {
    combatants: Combatants,
  };

  hasDta;

  constructor(...args) {
    super(...args);
    this.hasDta = this.selectedCombatant.hasWaist(ITEMS.THE_DARK_TITANS_ADVICE.id);
  }

  get uptime() {
    return Object.keys(this.combatants.players)
      .map(key => this.combatants.players[key])
      .reduce((uptime, player) =>
        uptime + player.getBuffUptime(SPELLS.LIFEBLOOM_HOT_HEAL.id), 0);
  }

  get uptimePercent() {
    return this.uptime / this.owner.fightDuration;
  }

  // "The Dark Titan's Advice" legendary buffs Lifebloom, making high uptime more important
  get suggestionThresholds() {
    if (this.hasDta) {
      return {
        actual: this.uptimePercent,
        isLessThan: {
          minor: 0.90,
          average: 0.80,
          major: 0.70,
        },
        style: 'percentage',
      };
    } else {
      return {
        actual: this.uptimePercent,
        isLessThan: {
          minor: 0.80,
          average: 0.60,
          major: 0.40,
        },
        style: 'percentage',
      };
    }
  }

  suggestions(when) {
    when(this.suggestionThresholds)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest(<React.Fragment>Your <SpellLink id={SPELLS.LIFEBLOOM_HOT_HEAL.id} /> uptime can be improved. {this.hasDta ? <React.Fragment>High uptime is particularly important for taking advantage of your equipped <ItemLink id={ITEMS.THE_DARK_TITANS_ADVICE.id} /></React.Fragment> : ''}</React.Fragment>)
          .icon(SPELLS.LIFEBLOOM_HOT_HEAL.icon)
          .actual(`${formatPercentage(this.uptimePercent)}% uptime`)
          .recommended(`>${Math.round(formatPercentage(recommended))}% is recommended`);
      });
  }

  statistic() {
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.LIFEBLOOM_HOT_HEAL.id} />}
        value={`${formatPercentage(this.uptimePercent)} %`}
        label="Lifebloom Uptime"
      />
    );
  }
  statisticOrder = STATISTIC_ORDER.CORE(10);

}

export default Lifebloom;
