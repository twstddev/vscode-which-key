import { Disposable, QuickPick, QuickPickItem, window } from "vscode";

export abstract class BaseMenu<T extends QuickPickItem> implements Disposable {
    protected quickPick: QuickPick<T>;
    protected disposables: Disposable[];
    protected isHiding: boolean;

    public title: string | undefined = undefined;
    public placeholder: string | undefined = undefined;
    public matchOnDetail = false;
    public matchOnDescription = false;
    public value = "";
    public busy = false;
    public items: readonly T[] = [];

    onDidResolve?: () => any;
    onDidReject?: (reason?: any) => any;

    constructor() {
        this.quickPick = window.createQuickPick<T>();
        this.disposables = [
            this.quickPick.onDidAccept(this.onDidAccept, this),
            this.quickPick.onDidHide(this.onDidHide, this),
            this.quickPick.onDidChangeValue(this.onDidChangeValue, this),
        ];
        this.isHiding = false;
    }

    private async onDidAccept(): Promise<void> {
        if (this.quickPick.activeItems.length > 0) {
            const item = this.quickPick.activeItems[0];
            await this.accept(item);
        }
    }

    protected async accept(item: T): Promise<void> {
        try {
            this.quickPick.value = "";
            this.quickPick.placeholder = undefined;
            this.quickPick.title = undefined;
            this.quickPick.items = [];
            await this.handleAcceptance(item);
        } catch (e) {
            this.reject(e);
        }
    }

    protected abstract handleAcceptance(item: T): Thenable<unknown>;

    protected async onDidHide(): Promise<void> {
        if (!this.isHiding) {
            // Dispose correctly when it is not manually hiding
            this.resolve();
        }

        await this.onVisibilityChange(false);
    }

    protected onDidChangeValue(_: string): Thenable<unknown> {
        return Promise.resolve();
    }

    protected onVisibilityChange(_: boolean): Thenable<unknown> {
        return Promise.resolve();
    }

    protected resolve(): void {
        this.dispose();
        if (this.onDidResolve) {
            this.onDidResolve();
        }
    }

    protected reject(e: any): void {
        this.dispose();
        if (this.onDidReject) {
            this.onDidReject(e);
        }
    }

    protected update(): void {
        this.quickPick.title = this.title;
        this.quickPick.placeholder = this.placeholder;
        this.quickPick.matchOnDetail = this.matchOnDetail;
        this.quickPick.matchOnDescription = this.matchOnDescription;
        this.quickPick.value = this.value;
        this.quickPick.busy = this.busy;
        this.quickPick.items = this.items;
    }

    async show(): Promise<void> {
        await this.onVisibilityChange(true);
        this.update();
        this.quickPick.show();
    }

    // Manually hide the menu
    hide(): Promise<void> {
        return new Promise<void>(r => {
            this.isHiding = true;
            const disposable = this.quickPick.onDidHide(() => {
                this.isHiding = false;
                disposable.dispose();
                r();
            });
            this.quickPick.hide();
        });
    }

    dispose(): void {
        for (const d of this.disposables) {
            d.dispose();
        }

        this.quickPick.dispose();
    }
}