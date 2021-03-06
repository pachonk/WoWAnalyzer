import ITEMS from 'common/ITEMS';
import SPELLS from 'common/SPELLS';
import { formatNumber } from 'common/format';
import Analyzer from 'Parser/Core/Analyzer';
import SpellUsable from 'Parser/Core/Modules/SpellUsable';

const COMBUST_REDUCTION_MS = 9000;

class PyrotexIgnitionCloth extends Analyzer {
  static dependencies = {
    spellUsable: SpellUsable,
  };

  cooldownReduction = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasHands(ITEMS.PYROTEX_IGNITION_CLOTH.id);
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.PHOENIX_FLAMES_TALENT.id) {
      return;
    }
    if (this.spellUsable.isOnCooldown(SPELLS.COMBUSTION.id)) {
      this.cooldownReduction += this.spellUsable.reduceCooldown(SPELLS.COMBUSTION.id, COMBUST_REDUCTION_MS);
    }
  }

  item() {
    const reduction = this.cooldownReduction / 1000;
    return {
      item: ITEMS.PYROTEX_IGNITION_CLOTH,
      result: `Combustion Cooldown Reduced by ${formatNumber(reduction)} seconds`,
    };
  }
}

export default PyrotexIgnitionCloth;
