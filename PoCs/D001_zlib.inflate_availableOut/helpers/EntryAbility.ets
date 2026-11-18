import UIAbility from '@ohos.app.ability.UIAbility';
import Want from '@ohos.app.ability.Want';
import window from '@ohos.window';
import { launch } from './launch';
export default class EntryAbility extends UIAbility {
  private initialWant: Want = {};
  onCreate(want: Want) { this.initialWant = want; }
  async onWindowStageCreate(stage: window.WindowStage) {
    await stage.loadContent('pages/Index');
    await launch(this.context, stage, this.initialWant);
  }
}
