export const extensionId = 'vscode-which-key';
export const publisherId = 'VSpaceCode';
export const contributePrefix = 'whichkey';
export enum ConfigKey {
	Delay = "delay",
	SortOrder = "sortOrder",
	Bindings = "bindings",
	Overrides = "bindingOverrides",
}
export enum CommandKey {
	Show = 'show',
	Register = 'register',
	Trigger = 'triggerKey',
	OpenFile = 'openFile',
}

export enum SortOrder {
	None = 'none',
	Alphabetically = 'alphabetically',
	NonNumberFirst = 'nonNumberFirst',
}

export enum ContextKey {
	Active = 'whichkeyActive',
	Visible = 'whichkeyVisible'
}

export const Configs = {
	Delay: `${contributePrefix}.${ConfigKey.Delay}`,
	SortOrder: `${contributePrefix}.${ConfigKey.SortOrder}`,
	Bindings: `${contributePrefix}.${ConfigKey.Bindings}`,
	Overrides: `${contributePrefix}.${ConfigKey.Overrides}`,
};

export const Commands = {
	Show: `${contributePrefix}.${CommandKey.Show}`,
	Register: `${contributePrefix}.${CommandKey.Register}`,
	Trigger: `${contributePrefix}.${CommandKey.Trigger}`,
	OpenFile: `${contributePrefix}.${CommandKey.OpenFile}`,
};
