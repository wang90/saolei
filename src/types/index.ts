export  interface Coordinates {
    row: number;
    col: number;
}
export interface Block {
    active: boolean;
    error: boolean;
    touched: boolean;
    readonly value: number;
}
export interface Initialvalue {
    ROWS: number;
    COLS: number;
    COUNT: number;
}

export interface TabItem {
    active:boolean;
    name: string;
    type: string;
}