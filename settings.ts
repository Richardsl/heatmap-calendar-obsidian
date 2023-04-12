import HeatmapCalendar from "main"
import { App, PluginSettingTab, setIcon, Setting, } from "obsidian"

export default class HeatmapCalendarSettingsTab extends PluginSettingTab {
	plugin: HeatmapCalendar

	constructor(app: App, plugin: HeatmapCalendar) {
		super(app, plugin)
		this.plugin = plugin
	}

	private async addColorMap(color: { key: string, value: string }) {
		const isValid = { key: true, value: true, }

		if (!color.key) isValid.key = false

		const validatedArray = this.validateColorInput(color.value)

		if (!validatedArray) isValid.value = false

		if (isValid.key && isValid.value) {
			this.plugin.settings.colors[color.key] = validatedArray as string[]

			await this.plugin.saveSettings()

			this.display()
		}

		return isValid
	}

	private async deleteColorMap(key: keyof typeof this.plugin.settings.colors) {
		delete this.plugin.settings.colors[key]

		await this.plugin.saveSettings()

		this.display()
	}

	private displayColorSettings() {
		const { containerEl, } = this

		containerEl.createEl("h3", { text: "Colors", })
		this.displayColorHelp(containerEl)

		for (const [key, colors,] of Object.entries(this.plugin.settings.colors)) {
			const colorEntryContainer = containerEl.createDiv({
				cls: "heatmap-calendar-settings-colors__container",
			})

			const colorDataContainer = colorEntryContainer.createDiv({
				cls: "heatmap-calendar-settings-colors__data-container",
			})

			colorDataContainer.createEl("h4", { text: key, })

			const colorRow = colorDataContainer.createDiv({ cls: "heatmap-calendar-settings-colors__row", })

			const colorsContainer = colorRow.createDiv({ cls: "heatmap-calendar-settings-colors__color-container", })

			for (const color of colors) {
				colorsContainer.createEl("div", {
					cls: "heatmap-calendar-settings-colors__color-box",
					attr: {
						style: `background-color: ${color}`,
					},
				})

				colorsContainer.createEl("pre", {
					cls: "heatmap-calendar-settings-colors__color-name",
					text: color,
				})
			}

			if (key !== "default") {
				const deleteColorButton = colorEntryContainer.createEl("button", {
					cls: "mod-warning heatmap-calendar-settings-colors__delete",
				})

				setIcon(deleteColorButton, "trash")

				deleteColorButton.addEventListener("click", () => this.deleteColorMap(key))
			}
		}

		this.displayColorInput(containerEl)
	}

	private displayColorInput(parent: HTMLElement) {
		const inputContainer = parent.createDiv({ cls: "heatmap-calendar-settings-colors__new-color-input-container", })

		const colorNameInput = inputContainer.createEl("input", {
			cls: "heatmap-calendar-settings-colors__new-color-input-name",
			attr: { placeholder: "Color name", type: "text", },
		})

		const colorValueInput = inputContainer.createEl("input", {
			cls: "heatmap-calendar-settings-colors__new-color-input-value",
			attr: { placeholder: "Colors array", type: "text", },
		})

		const addColorButton = inputContainer.createEl("button", {
			cls: "mod-cta heatmap-calendar-settings-colors__new-color-button",
		})

		setIcon(addColorButton, "plus")

		addColorButton.addEventListener("click", async () => {
			const isValid = await this.addColorMap({
				key: colorNameInput.value,
				value: colorValueInput.value,
			})

			this.reportInputValidity(colorNameInput, isValid.key, "Please input a name for your color")
			this.reportInputValidity(colorValueInput, isValid.value, "Color is not a valid JSON array of colors")
		})
	}

	private displayColorHelp(parent: HTMLElement) {
		parent.createEl("p", {
			text: "Add lists of colors which will be globally available on your heatmaps.",
		})
		parent.createEl("p", {
			text: "You can use those colors by referencing their name in your heatmap render settings.",
		})
	}

	private reportInputValidity(input: HTMLInputElement, isValid: boolean, msg: string) {
		if (!isValid) {
			input.classList.add("has-error")
			input.setCustomValidity(msg)
		} else input.setCustomValidity("")

		input.reportValidity()
	}

	private validateColorInput(value: string) {
		const colorRegex = /^(#[0-9a-f]{3,6}|rgba?\(\s*\d+%?\s*,\s*\d+%?\s*,\s*\d+%?\s*(,\s*\d+(\.\d+)?%?)?\s*\))$/i;

		try {
			const data: string[] = JSON.parse(value)

			if (!Array.isArray(data)) return false

			return data.every(color => colorRegex.test(color)) ? data : false
		} catch (e) {
			return false
		}
	}

	display() {
		const { containerEl, } = this

		containerEl.empty()

		containerEl.createEl("h2", { text: "Heatmap Calendar Settings", })

		this.displayColorSettings()

		console.log( "settings", this.plugin.settings )
	}
}
