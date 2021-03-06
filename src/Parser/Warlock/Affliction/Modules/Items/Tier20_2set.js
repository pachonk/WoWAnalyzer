import React from 'react';

import Analyzer from 'Parser/Core/Analyzer';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';
import { formatNumber } from 'common/format';

import { UNSTABLE_AFFLICTION_DEBUFF_IDS } from '../../Constants';
import SoulShardTracker from '../SoulShards/SoulShardTracker';

const TICKS_PER_UA = 4;

class Tier20_2set extends Analyzer {
  static dependencies = {
    soulShardTracker: SoulShardTracker,
  };

  _totalTicks = 0;
  totalUAdamage = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasBuff(SPELLS.WARLOCK_AFFLI_T20_2P_BONUS.id);
  }

  on_byPlayer_damage(event) {
    if (UNSTABLE_AFFLICTION_DEBUFF_IDS.includes(event.ability.guid)) {
      this._totalTicks += 1;
      this.totalUAdamage += event.amount + (event.absorbed || 0);
    }
  }

  item() {
    // if we haven't cast any UAs, _totalTicks would be 0 and we would get an exception
    // but with denominator 1 in this case, if this.totalUAdamage = 0, then dividing by 1 still gives correct result of average damage = 0
    const avgDamage = this.totalUAdamage / (this._totalTicks > 0 ? this._totalTicks : 1);
    const shardsGained = this.soulShardTracker.getGeneratedBySpell(SPELLS.WARLOCK_AFFLI_T20_2P_SHARD_GEN.id);
    const estimatedUAdamage = shardsGained * TICKS_PER_UA * avgDamage;
    return {
      id: `spell-${SPELLS.WARLOCK_AFFLI_T20_2P_BONUS.id}`,
      icon: <SpellIcon id={SPELLS.WARLOCK_AFFLI_T20_2P_BONUS.id} />,
      title: <SpellLink id={SPELLS.WARLOCK_AFFLI_T20_2P_BONUS.id} icon={false} />,
      result: (
        <dfn data-tip={`${formatNumber(estimatedUAdamage)} damage - ${this.owner.formatItemDamageDone(estimatedUAdamage)} <br />This result is estimated by multiplying number of Soul Shards gained from this item by the average Unstable Affliction damage for the whole fight.`}>
          {shardsGained} Soul Shards gained
        </dfn>
      ),
    };
  }
}
export default Tier20_2set;
