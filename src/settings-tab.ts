import { PluginSettingTab, Setting } from "obsidian";
import type { SettingDefinitionItem } from "obsidian";
import type HeadingScrollerPlugin from "./main";
import { ScrollerSide } from "./types";

const POSITION = {
  name: "Scroller position",
  desc: "Place the heading rail on the left or right edge of the note.",
};
const SIDES: Record<ScrollerSide, string> = { left: "Left", right: "Right" };

export class HeadingScrollerSettingTab extends PluginSettingTab {
  constructor(private readonly plugin: HeadingScrollerPlugin) {
    super(plugin.app, plugin);
  }

  /** Obsidian 1.13 and later render the tab from these definitions. */
  public getSettingDefinitions(): SettingDefinitionItem[] {
    return [
      {
        ...POSITION,
        control: { type: "dropdown", key: "side", options: SIDES },
      },
    ];
  }

  public getControlValue(): unknown {
    return this.plugin.settings.side;
  }

  public async setControlValue(_key: string, value: unknown): Promise<void> {
    if (value !== "left" && value !== "right") return;
    this.plugin.settings.side = value;
    await this.plugin.saveSettings();
  }

  /** Earlier Obsidian versions call display() instead. */
  public display(): void {
    this.containerEl.empty();
    new Setting(this.containerEl)
      .setName(POSITION.name)
      .setDesc(POSITION.desc)
      .addDropdown((dropdown) =>
        dropdown
          .addOptions(SIDES)
          .setValue(this.plugin.settings.side)
          .onChange((value) => this.setControlValue("side", value)),
      );
  }
}
